/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, CircleX, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { SiteHeader } from '@/components/nav/site-header'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { env } from '@/env'
import { useFormState } from '@/hooks/use-form-state'
import { cn } from '@/lib/utils'
import { Address } from '@/modules/address/types/address'
import { DocumentType } from '@/modules/company/types/document-type'
import { getFieldError } from '@/utils/get-field-error'
import { maskCNPJ, maskPhone } from '@/utils/masks'
import { normalizeIds } from '@/utils/normalize-ids'

import { createCompanyAction } from './actions'

interface CompanyFormProps {
  addresses: Address[]
  documentTypes: DocumentType[]
}

export interface InformationItem {
  id: string
  type: 'e-mail' | 'phone-number' | string
  name: string
  email?: string
  phoneNumber?: string
}

export interface Document {
  name: string
  type: string
  archive: File | null
  expirationDate: Date
}

export function CompanyForm({ addresses, documentTypes }: CompanyFormProps) {
  const router = useRouter()

  const now = new Date()

  const [addressId, setAddressId] = useState('')
  const [informations, setInformations] = useState<InformationItem[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [images, setImages] = useState<FileList | null>(null)

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
        id: crypto.randomUUID(),
        type: 'e-mail',
        name: '',
        email: '',
        phoneNumber: '',
      },
    ])
  }

  function removeInformation(index: number) {
    setInformations(informations.filter((_, i) => i !== index))
  }

  function updateDocument(index: number, field: keyof Document, value: any) {
    const newDocument = [...documents]
    const item = newDocument[index]
    item[field] = value

    setDocuments(newDocument)
  }

  function addDocument() {
    setDocuments([
      ...documents,
      { name: '', type: '', archive: null, expirationDate: new Date() },
    ])
  }

  function removeDocument(index: number) {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  const formAction = createCompanyAction

  const [{ errors, success }, handleSubmit, isPending] =
    useFormState(formAction)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

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

        newClean.forEach((id: string) => {
          formData.append('imagesIds', id)
        })
      }
    } catch (error) {
      console.error('Erro ao enviar imagens:', error)
    }

    try {
      type DocumentField = 'type' | 'name' | 'archive' | 'expirationDate'
      type DocumentFormData = {
        type?: string
        name?: string
        archive?: File
        expirationDate?: Date
      }

      const documentsMap: Record<string, DocumentFormData> = {}

      for (const [key, value] of formData.entries()) {
        const match = key.match(/^documents\[(\d+)\]\[(\w+)\]$/)
        if (match) {
          const [, index, field] = match
          if (!documentsMap[index]) documentsMap[index] = {}

          if (['type', 'name', 'archive', 'expirationDate'].includes(field)) {
            documentsMap[index][field as DocumentField] = value as any
          }
        }
      }

      const documents = Object.values(documentsMap)

      const payload = documents.map((doc) => ({
        documentTypeId: doc.type ?? '',
        name: doc.name ?? '',
        expiresAt: doc.expirationDate ?? null,
      }))

      const uploadFormData = new FormData()
      uploadFormData.append('documents', JSON.stringify(payload))

      documents.forEach((doc) => {
        if (doc.archive instanceof File) {
          uploadFormData.append('files', doc.archive)
        }
      })

      const uploadResponse = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/uploads/documents`,
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
          body: uploadFormData,
        },
      )

      if (!uploadResponse.ok) {
        throw new Error('Falha ao enviar os documentos')
      }

      const uploadData = await uploadResponse.json()
      uploadData.documentsIds.forEach((id: string) => {
        formData.append('documentsIds', id)
      })
    } catch (error) {
      console.error('Erro ao enviar os documentos:', error)
    }

    await handleSubmit(formData)
  }

  useEffect(() => {
    if (!success) return
    router.push('/company')
  }, [router, success])

  return (
    <div className="grid space-y-4">
      <SiteHeader title="Gerenciamento da empresa" />

      <form onSubmit={onSubmit} className="grid space-y-4 p-4">
        <div className="grid gap-2">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <Label htmlFor="addressId">Endereço da empresa</Label>
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
          <Label htmlFor="name">Nome da empresa</Label>
          <Input
            id="name"
            name="name"
            placeholder="Nome da empresa"
            autoComplete="off"
          />

          {getFieldError(errors, 'name') && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getFieldError(errors, 'name')}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="socialName">Nome social da empresa</Label>
          <Input
            id="socialName"
            name="socialName"
            placeholder="Nome social da empresa"
            autoComplete="off"
          />

          {getFieldError(errors, 'socialName') && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getFieldError(errors, 'socialName')}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="document">CNPJ</Label>
          <Input
            id="document"
            name="document"
            placeholder="Preencha o CNPJ da empresa"
            autoComplete="off"
            maxLength={18}
            onChange={(e) => {
              const masked = maskCNPJ(e.target.value)
              e.target.value = masked
            }}
          />

          {getFieldError(errors, 'document') && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getFieldError(errors, 'document')}
            </p>
          )}
        </div>

        <div className="grid gap-4 rounded-md border p-4">
          <h3 className="text-base font-medium">Contatos</h3>
          <input
            type="hidden"
            name="informations"
            value={JSON.stringify(informations)}
          />

          {informations.map((info, index) => {
            const type = info.type

            return (
              <div
                key={info.id}
                className="grid grid-cols-[1fr_auto] items-start gap-4"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-center gap-4 2xl:flex-row">
                    <div className="flex w-full flex-col gap-2">
                      <Label htmlFor={`info-name-${index}`}>
                        Nome do contato
                      </Label>
                      <Input
                        id={`info-name-${index}`}
                        name={`informations[${index}][name]`}
                        placeholder="Nome do contato"
                        autoComplete="off"
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
                        Tipo do contato
                      </Label>
                      <Select
                        value={type}
                        onValueChange={(value) =>
                          updateInformation(index, 'type', value)
                        }
                      >
                        <SelectTrigger
                          id={`info-type-${index}`}
                          className="w-full"
                        >
                          <SelectValue placeholder="Selecione o tipo do contato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="e-mail">E-mail</SelectItem>
                          <SelectItem value="phone-number">Celular</SelectItem>
                        </SelectContent>
                      </Select>
                      <input
                        type="hidden"
                        name={`informations[${index}][type]`}
                        value={info.type}
                      />
                    </div>
                  </div>

                  <div>
                    {type === 'phone-number' ? (
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`info-phone-${index}`}>Celular</Label>
                        <Input
                          id={`info-phone-${index}`}
                          name={`informations[${index}][phoneNumber]`}
                          placeholder="Número de telefone"
                          maxLength={15}
                          autoComplete="off"
                          value={info.phoneNumber || ''}
                          onChange={(e) => {
                            const masked = maskPhone(e.target.value)
                            updateInformation(index, 'phoneNumber', masked)
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`info-email-${index}`}>E-mail</Label>
                        <Input
                          id={`info-email-${index}`}
                          name={`informations[${index}][email]`}
                          placeholder="E-mail"
                          autoComplete="off"
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
                  className="mt-6"
                  onClick={() => removeInformation(index)}
                >
                  <CircleX className="size-4" />
                </Button>
              </div>
            )
          })}

          <Button type="button" variant="outline" onClick={addInformation}>
            Adicionar informação
          </Button>
        </div>

        <div className="grid gap-4 rounded-md border p-4">
          <h3 className="text-base font-medium">Documentos</h3>

          {documents.map((doc, index) => {
            return (
              <div
                key={index}
                className="grid grid-cols-[10fr_0.5fr] items-center gap-4"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-center gap-4 2xl:flex-row">
                    <div className="flex w-full flex-col gap-2">
                      <Label htmlFor={`doc-type-${index}`}>
                        Tipo do documento
                      </Label>
                      <Select
                        value={doc.type}
                        onValueChange={(value) =>
                          updateDocument(index, 'type', value)
                        }
                      >
                        <SelectTrigger id={`doc-type-${index}`}>
                          <SelectValue placeholder="Selecione o tipo do documento" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {documentTypes.map((option) => (
                            <SelectItem
                              key={option.id}
                              value={String(option.id)}
                              className="w-full truncate"
                            >
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input
                        type="hidden"
                        name={`documents[${index}][type]`}
                        value={doc.type}
                      />
                    </div>

                    <div className="flex w-full flex-col gap-2">
                      <Label htmlFor={`doc-name-${index}`}>Documento</Label>
                      <Input
                        id={`doc-name-${index}`}
                        name={`documents[${index}][name]`}
                        placeholder="Nome do documento"
                        autoComplete="off"
                        value={doc.name}
                        onChange={(e) =>
                          updateDocument(index, 'name', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div
                    className={`flex flex-col gap-4 2xl:flex-row ${!doc.archive && 'items-center'}`}
                  >
                    <div className="flex w-full flex-col gap-2">
                      <Label htmlFor={`doc-archive-${index}`}>Arquivo</Label>
                      <input
                        id={`doc-archive-${index}`}
                        type="file"
                        name={`documents[${index}][archive]`}
                        className={cn(
                          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                        )}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            updateDocument(index, 'archive', e.target.files[0])
                          }
                        }}
                      />

                      {doc.archive && (
                        <p className="text-muted-foreground text-sm">
                          Selecionado: {doc.archive.name}
                        </p>
                      )}
                    </div>

                    <div className="flex w-full flex-col gap-2">
                      <Label htmlFor={`doc-date-${index}`}>
                        Data de expiração
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full text-left font-normal',
                              !doc.expirationDate && 'text-muted-foreground',
                            )}
                          >
                            {doc.expirationDate ? (
                              format(doc.expirationDate, 'dd LLL, y', {
                                locale: ptBR,
                              })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={doc.expirationDate}
                            onSelect={(date) => {
                              if (date) {
                                updateDocument(index, 'expirationDate', date)
                              }
                            }}
                            disabled={(date) =>
                              date < now || date < new Date('1900-01-01')
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <input
                        type="hidden"
                        name={`documents[${index}][expirationDate]`}
                        value={doc.expirationDate.toISOString()}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  type="button"
                  size="icon"
                  className="h-full"
                  onClick={() => removeDocument(index)}
                >
                  <CircleX />
                </Button>
              </div>
            )
          })}

          <Button type="button" variant="outline" onClick={addDocument}>
            Adicionar documento
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
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Salvar empresa'
          )}
        </Button>
      </form>
    </div>
  )
}
