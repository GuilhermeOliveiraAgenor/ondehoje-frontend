import { Row } from '@tanstack/react-table'
import { AlertTriangle, CircleX, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { SelectDate } from '@/components/form/select-date'
import { Lineaction } from '@/components/table/types/lineaction'
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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { env } from '@/env'
import { useFormState } from '@/hooks/use-form-state'
import { cn } from '@/lib/utils'
import { Address } from '@/modules/address/types/address'
import { Category } from '@/modules/category/types/category'
import { Image as ImageProps } from '@/modules/image/types/image'
import { InformationForm } from '@/modules/information/types/information-form'
import { getFieldError } from '@/utils/get-field-error'
import { maskPhone } from '@/utils/masks'
import { normalizeIds } from '@/utils/normalize-ids'

import { EventDetails } from '../types/event-details'
import { editEventAction } from './actions'

export function EditEventSheet({
  addresses,
  categories,
  lineaction,
  row,
}: {
  addresses: Address[]
  categories: Category[]
  lineaction: Lineaction
  row: Row<EventDetails>
}) {
  const [open, setOpen] = useState(false)

  const { icon: Icon } = lineaction || {}
  const { original: event } = row
  console.log({ event })

  const [addressId, setAddressId] = useState(event.address.id)
  const [categoryId, setCategoryId] = useState(event.category.id)
  const [name, setName] = useState(event.name)
  const [description, setDescription] = useState(event.description)
  const [startDate, setStartDate] = useState<Date>(new Date(event.startDate))
  const [endDate, setEndDate] = useState<Date>(new Date(event.endDate))
  const [informations, setInformations] = useState<InformationForm[]>(
    event.informations.map((info) => ({
      ...info,
      type: info.email
        ? 'e-mail'
        : info.phoneNumber
          ? 'phone-number'
          : 'description',
    })),
  )
  const [images, setImages] = useState<FileList | null>(null)
  const [showImageWarning, setShowImageWarning] = useState(false)
  const [currentImageUrls, setCurrentImageUrls] = useState<ImageProps[]>(
    event.images,
  )
  const [imagesIds, setImagesIds] = useState<string[]>(
    event.images.map((img) => img.id),
  )

  function handleSelectDate(startDate: Date, endDate: Date) {
    setStartDate(startDate)
    setEndDate(endDate)
  }

  function updateInformation(
    index: number,
    field: keyof InformationForm,
    value: string,
  ) {
    setInformations((prev) => {
      const clone = [...prev]
      const item = { ...clone[index], [field]: value }

      // Se mudou o type, limpa campos irrelevantes
      if (field === 'type') {
        if (value === 'e-mail') {
          item.phoneNumber = ''
          item.description = ''
        }
        if (value === 'phone-number') {
          item.email = ''
          item.description = ''
        }
        if (value === 'description') {
          item.email = ''
          item.phoneNumber = ''
        }
      }

      clone[index] = item
      return clone
    })
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

  function removeFromCurrentImages(id: string) {
    setCurrentImageUrls((prev) => prev.filter((img) => img.id !== id))
    setImagesIds((prev) => prev.filter((imgId) => imgId !== id))
  }

  const formAction = editEventAction

  const [{ errors, success, message }, handleSubmit, isPending] =
    useFormState(formAction)

  async function onSubmit(currentEvent: React.FormEvent<HTMLFormElement>) {
    currentEvent.preventDefault()

    const currentClean = normalizeIds(imagesIds)
    let finalImages: string[] = [...currentClean]

    if (imagesIds.length === 0 && (!images || images.length === 0)) {
      setShowImageWarning(true)
      return
    } else {
      setShowImageWarning(false)
    }

    try {
      if (images && images.length > 0) {
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

        const newClean = normalizeIds(uploadData.imagesIds)

        finalImages = [...new Set([...currentClean, ...newClean])]
      }
    } catch (error) {
      console.error('Erro ao enviar imagens:', error)
    }

    const formData = new FormData()

    formData.append('id', event.id)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('addressId', addressId)
    formData.append('categoryId', categoryId)
    formData.append('startDate', startDate.toISOString())
    formData.append('endDate', endDate.toISOString())

    // Adicione os campos complexos (JSON)
    formData.append('informations', JSON.stringify(informations))
    formData.append('imagesIds', JSON.stringify(finalImages))

    formData.set('imagesIds', JSON.stringify(finalImages))

    await handleSubmit(formData)
  }

  useEffect(() => {
    if (success === false && message) {
      toast.error('Erro ao editar evento.', {
        description: message,
      })
    } else {
      if (success === true) {
        toast.success('Evento salvo com sucesso.', {
          description:
            'Caso você tenha um anúncio desse evento, será feito uma nova avaliação do conteúdo.',
          duration: 8000,
        })
      }
    }
  }, [success, message])

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger className="flex w-full items-center justify-center gap-2 px-2 py-1.5 text-sm">
        {Icon ? (
          <Icon
            style={{
              width: 16,
              height: 16,
            }}
          />
        ) : undefined}
        {lineaction?.label}
      </SheetTrigger>
      <SheetContent className="grid min-h-screen w-full gap-4 overflow-y-auto p-6 md:max-w-1/2">
        <SheetHeader>
          <SheetTitle>Editar evento</SheetTitle>
        </SheetHeader>

        <form onSubmit={onSubmit} className="grid space-y-2">
          <input type="hidden" name="id" value={event.id} />

          <div className="grid gap-2">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <Label htmlFor="addressId">Endereço do evento</Label>
            </div>
            <Select value={addressId} onValueChange={setAddressId}>
              <SelectTrigger
                id="addressId"
                disabled={isPending}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              startDate,
              endDate,
            }}
            onDateChange={handleSelectDate}
          />
          <input
            type="hidden"
            name="startDate"
            disabled={isPending}
            value={startDate.toISOString()}
          />
          <input
            type="hidden"
            name="endDate"
            disabled={isPending}
            value={endDate.toISOString()}
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
                          <SelectTrigger
                            disabled={isPending}
                            className="w-full"
                          >
                            <SelectValue placeholder="Selecione o tipo da informação" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="description">
                              Detalhes
                            </SelectItem>
                            <SelectItem value="e-mail">E-mail</SelectItem>
                            <SelectItem value="phone-number">
                              Celular
                            </SelectItem>
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
                            autoComplete="off"
                            value={info.description || ''}
                            onChange={(e) =>
                              updateInformation(
                                index,
                                'description',
                                e.target.value,
                              )
                            }
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

            <div className="grid gap-2">
              <Label>Imagens atuais</Label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
                {currentImageUrls.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image.url || '/placeholder.svg'}
                      width={100}
                      height={100}
                      alt={`Preview ${index + 1}`}
                      className="h-32 w-full rounded-md border object-cover"
                    />
                    <button
                      className="absolute top-0 right-0 rounded-bl-lg bg-red-500 p-1"
                      onClick={() => removeFromCurrentImages(image.id)}
                      type="button"
                    >
                      <X size={20} color="#fff" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {previews.length > 0 && (
              <div className="grid gap-2">
                <Label>Novas imagens</Label>

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
              </div>
            )}

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

          <SheetFooter className="p-0">
            <Button type="submit" disabled={isPending}>
              Salvar evento
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
