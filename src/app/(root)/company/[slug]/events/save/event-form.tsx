'use client'

import { AlertTriangle, CircleX, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { SelectDate } from '@/components/form/select-date'
import { SiteHeader } from '@/components/nav/site-header'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { env } from '@/env'
import { useFormState } from '@/hooks/use-form-state'
import { cn } from '@/lib/utils'
import { Address } from '@/modules/address/types/address'
import { Category } from '@/modules/category/types/category'
import { getFieldError } from '@/utils/get-field-error'
import { maskPhone } from '@/utils/masks'
import { normalizeIds } from '@/utils/normalize-ids'

import { createEventAction } from './actions'

export interface InformationItem {
  type: 'description' | 'e-mail' | 'phone-number' | string
  name: string
  description: string
  email?: string
  phoneNumber?: string
}

type EventFormProps = {
  addresses: Address[]
  categories: Category[]
}

export function EventForm({ addresses, categories }: EventFormProps) {
  const router = useRouter()

  const [addressId, setAddressId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [informations, setInformations] = useState<InformationItem[]>([])
  const [images, setImages] = useState<FileList | null>(null)
  const [showImageWarning, setShowImageWarning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function handleSelectDate(startDate: Date, endDate: Date) {
    setStartDate(startDate)
    setEndDate(endDate)
  }

  function updateInformation(
    index: number,
    field: keyof InformationItem,
    value: string,
  ) {
    const newInformation = [...informations]
    const item = newInformation[index]
    item[field] = value

    // Limpa o campo oposto ao trocar o tipo
    if (field === 'type') {
      if (value === 'e-mail') {
        item.phoneNumber = ''
      } else if (value === 'phone-number') {
        item.email = ''
      }
    }

    setInformations(newInformation)
  }

  function addInformation() {
    setInformations([
      ...informations,
      {
        type: 'description',
        name: '',
        description: '',
        email: '',
        phoneNumber: '',
      },
    ])
  }

  function removeInformation(index: number) {
    setInformations(informations.filter((_, i) => i !== index))
  }

  const previews = useMemo(() => {
    if (!images || images.length === 0) {
      return []
    }

    const fileArray = Array.from(images)
    return fileArray.map((file) => URL.createObjectURL(file))
  }, [images])

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previews])

  const formAction = createEventAction

  const [{ errors, success, message }, handleSubmit, isPending] =
    useFormState(formAction)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    setIsLoading(true)
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    console.log('Informaçoes do form:', Object.fromEntries(formData))

    if (!images) {
      setShowImageWarning(true)
      setIsLoading(false)
      return
    } else {
      setShowImageWarning(false)
    }

    try {
      const imagesFormData = new FormData()
      Array.from(images).forEach((file) => {
        imagesFormData.append('files', file)
      })

      const uploadResponse = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/uploads/images`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${
              document.cookie
                .split('; ')
                .find((row) => row.startsWith('ondehoje_token='))
                ?.split('=')[1] || ''
            }`,
          },
          body: imagesFormData,
        },
      )

      if (!uploadResponse.ok) {
        throw new Error('Falha ao enviar as imagens')
      }

      const uploadData = await uploadResponse.json()
      console.log('Upload data:', uploadData)

      const newClean = normalizeIds(uploadData.imagesIds)

      newClean.forEach((id: string) => {
        formData.append('imagesIds', id)
      })
    } catch (error) {
      setIsLoading(false)
      console.error('Erro ao enviar imagens:', error)
    }

    await handleSubmit(formData)
    setIsLoading(false)
  }

  useEffect(() => {
    if (success === false && message) {
      toast.error('Erro ao cadastrar evento', {
        description: message,
      })
    } else {
      if (success === true) {
        toast.success(message, {
          duration: 8000,
        })

        router.back()
      }
    }
  }, [success, message, router])

  return (
    <div className="grid space-y-4">
      <SiteHeader title="Gerenciamento de eventos" />

      <form onSubmit={onSubmit} className="grid space-y-4 p-4">
        <div className="grid gap-2">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <Label htmlFor="addressId">Endereço do evento</Label>
            <Link href="/address" className="text-sm">
              Não possui um endereço cadastrado?{' '}
              <span className="text-primary border-primary border-b">
                Criar endereço
              </span>
            </Link>
          </div>
          <Select value={addressId} onValueChange={setAddressId}>
            <SelectTrigger
              id="addressId"
              className="w-full py-2 text-xs sm:py-2.5 sm:text-sm"
            >
              <SelectValue placeholder="Selecione o endereço cadastrado" />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.street}, {option.neighborhood} - {option.city}/
                  {option.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="addressId" value={addressId} />

          {getFieldError(errors, 'addressId') && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getFieldError(errors, 'addressId')}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="categoryId">Categoria do evento</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger
              id="categoryId"
              disabled={isPending}
              className="w-full py-2 text-xs sm:py-2.5 sm:text-sm"
            >
              <SelectValue placeholder="Selecione o endereço cadastrado" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="categoryId" value={categoryId} />

          {getFieldError(errors, 'categoryId') && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getFieldError(errors, 'categoryId')}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">Nome do evento</Label>
          <Input
            id="name"
            name="name"
            disabled={isPending}
            placeholder="Nome do evento"
            autoComplete="off"
          />

          {getFieldError(errors, 'name') && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getFieldError(errors, 'name')}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Descrição do evento</Label>
          <Textarea
            id="description"
            name="description"
            disabled={isPending}
            placeholder="Descrição do evento"
            autoComplete="off"
          />

          {getFieldError(errors, 'description') && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getFieldError(errors, 'description')}
            </p>
          )}
        </div>

        <SelectDate
          data={{
            startDate: new Date(),
            endDate: new Date(),
          }}
          onDateChange={handleSelectDate}
        />
        <input
          type="hidden"
          name="startDate"
          disabled={isPending}
          value={startDate ? startDate.toISOString() : ''}
        />
        <input
          type="hidden"
          name="endDate"
          disabled={isPending}
          value={endDate ? endDate.toISOString() : ''}
        />

        <div className="grid gap-4 rounded-md border p-4">
          <h3 className="text-base font-medium">Informações</h3>

          <input
            type="hidden"
            name="informations"
            value={JSON.stringify(informations)}
          />

          {informations.map((info, index) => {
            const type = info.type

            return (
              <div
                key={index}
                className="grid grid-cols-[1fr_auto] items-start gap-4"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-center gap-4 2xl:flex-row">
                    <div className="flex w-full flex-col gap-2">
                      <Label>Nome</Label>
                      <Input
                        placeholder="Ex: Contato, Informações, etc."
                        autoComplete="off"
                        disabled={isPending}
                        value={info.name}
                        onChange={(e) =>
                          updateInformation(index, 'name', e.target.value)
                        }
                      />

                      {getFieldError(errors, `informations.${index}.name`) && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">
                          {getFieldError(errors, `informations.${index}.name`)}
                        </p>
                      )}
                    </div>

                    <div className="flex w-full flex-col gap-2">
                      <Label htmlFor={`info-type-${index}`}>
                        Tipo da informação
                      </Label>
                      <Select
                        value={type}
                        onValueChange={(value) =>
                          updateInformation(index, 'type', value)
                        }
                      >
                        <SelectTrigger disabled={isPending} className="w-full">
                          <SelectValue placeholder="Selecione o tipo da informação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="description">Detalhes</SelectItem>
                          <SelectItem value="e-mail">E-mail</SelectItem>
                          <SelectItem value="phone-number">Celular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    {type === 'description' && (
                      <div className="flex flex-col gap-2">
                        <Label>Descrição</Label>
                        <Textarea
                          placeholder="Ex: Horário de funcionamento, instruções, etc."
                          disabled={isPending}
                          onChange={(e) =>
                            updateInformation(
                              index,
                              'description',
                              e.target.value,
                            )
                          }
                          autoComplete="off"
                        />
                      </div>
                    )}

                    {type === 'phone-number' && (
                      <div className="flex flex-col gap-2">
                        <Label>Celular</Label>
                        <Input
                          placeholder="Número de telefone"
                          maxLength={15}
                          autoComplete="off"
                          disabled={isPending}
                          value={info.phoneNumber || ''}
                          onChange={(e) => {
                            const masked = maskPhone(e.target.value)
                            updateInformation(index, 'phoneNumber', masked)
                          }}
                        />
                      </div>
                    )}

                    {type === 'e-mail' && (
                      <div className="flex flex-col gap-2">
                        <Label>E-mail</Label>
                        <Input
                          placeholder="E-mail"
                          autoComplete="off"
                          disabled={isPending}
                          value={info.email || ''}
                          onChange={(e) =>
                            updateInformation(index, 'email', e.target.value)
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="destructive"
                  type="button"
                  size="icon"
                  disabled={isPending}
                  className="h-full"
                  onClick={() => removeInformation(index)}
                >
                  <CircleX className="size-4" />
                </Button>
              </div>
            )
          })}

          <Button
            type="button"
            variant="link"
            disabled={isPending}
            className="border-primary border"
            onClick={addInformation}
          >
            Adicionar mais informações
          </Button>
        </div>

        <div className="grid gap-4 rounded-md border p-4">
          <h3 className="text-base font-medium">Imagens</h3>

          <div className="flex flex-col gap-2">
            <Label htmlFor="images">Imagens</Label>
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              disabled={isPending}
              name="images"
              className={cn(
                'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              )}
              onChange={(e) => setImages(e.target.files)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
            {previews.map((src, i) => (
              <div key={i} className="flex flex-col items-center">
                <Image
                  src={src || '/placeholder.svg'}
                  width={100}
                  height={100}
                  alt={`Preview ${i + 1}`}
                  className="h-32 w-full rounded-md border object-cover"
                />
              </div>
            ))}
          </div>

          {showImageWarning && (
            <Alert variant="warning">
              <AlertTriangle className="size-4" />
              <AlertTitle>Observação!</AlertTitle>
              <AlertDescription>
                <p>Você deve enviar imagens</p>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending || isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Salvar evento'
          )}
        </Button>
      </form>
    </div>
  )
}
