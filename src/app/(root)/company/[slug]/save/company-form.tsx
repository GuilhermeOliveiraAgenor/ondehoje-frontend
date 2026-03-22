'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, CircleX, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { SiteHeader } from '@/components/nav/site-header'
import { DataTableColumnHeader } from '@/components/table/components/header'
import { DataTable } from '@/components/table/data-table'
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
import { Textarea } from '@/components/ui/textarea'
import { env } from '@/env'
import { useFormState } from '@/hooks/use-form-state'
import { cn } from '@/lib/utils'
import { Address } from '@/modules/address/types/address'
import { CompanyDetails } from '@/modules/company/types/company-details'
import { DocumentType } from '@/modules/company/types/document-type'
import { documentColumns } from '@/modules/document/constants/columns'
import { Document } from '@/modules/document/types/document'
import { DocumentForm } from '@/modules/document/types/document-form'
import { Image as ImageProps } from '@/modules/image/types/image'
import { InformationForm } from '@/modules/information/types/information-form'
import { getFieldError } from '@/utils/get-field-error'
import { maskPhone } from '@/utils/masks'
import { normalizeIds } from '@/utils/normalize-ids'

import { editCompanyAction } from './actions'

interface CompanyFormProps {
  company: CompanyDetails
  addresses: Address[]
  documentTypes: DocumentType[]
}

export function CompanyForm({
  company,
  addresses,
  documentTypes,
}: CompanyFormProps) {
  const router = useRouter()

  const now = new Date()

  const [addressId, setAddressId] = useState(company.address.id)
  const [name, setName] = useState(company.name)
  const [socialName, setSocialName] = useState(company.socialName)
  const [cnpj, setCNPJ] = useState(company.document)
  const [informations, setInformations] = useState<InformationForm[]>(
    company.informations.map((info) => ({
      ...info,
      type: info.email
        ? 'e-mail'
        : info.phoneNumber
          ? 'phone-number'
          : 'description',
    })),
  )
  const [documents, setDocuments] = useState<DocumentForm[]>([])
  const [currentDocuments, setCurrentDocuments] = useState<Document[]>(
    company.documents,
  )
  const [documentsIds, setDocumentsIds] = useState<string[]>(
    company.documents.map((document) => document.id),
  )

  const [images, setImages] = useState<FileList | null>(null)
  const [currentImageUrls, setCurrentImageUrls] = useState<ImageProps[]>(
    company.images,
  )
  const [imagesIds, setImagesIds] = useState<string[]>(
    company.images.map((img) => img.id),
  )

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

  function updateDocument(
    index: number,
    field: keyof DocumentForm,
    value: string | File | Date,
  ) {
    setDocuments((prev) => {
      const clone = [...prev]
      const item = { ...clone[index], [field]: value }

      if (field === 'documentTypeId') {
        const docType = documentTypes.find((dt) => dt.id === value)

        if (docType) {
          item.name = docType.name
        }
      }

      clone[index] = item
      return clone
    })
  }

  function addDocument() {
    setDocuments([
      ...documents,
      {
        name: '',
        documentTypeId: '',
      },
    ])
  }

  function removeDocument(index: number) {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  function removeFromCurrentDocuments(id: string) {
    setCurrentDocuments((prev) => prev.filter((document) => document.id !== id))
    setDocumentsIds((prev) => prev.filter((documentId) => documentId !== id))
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

  const formAction = editCompanyAction

  const [{ errors, success, message }, handleSubmit, isPending] =
    useFormState(formAction)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const currentImages = normalizeIds(imagesIds)
    let finalImages: string[] = [...currentImages]

    const currentDocuments = normalizeIds(documentsIds)
    let finalDocuments: string[] = [...currentDocuments]

    if (imagesIds.length === 0 && (!images || images.length === 0)) {
      toast.error('Você deve adicionar ao menos uma imagem.', {
        duration: 8000,
      })
      return
    }

    if (documentsIds.length === 0 && (!documents || documents.length === 0)) {
      toast.error('Você deve adicionar ao menos um documento.', {
        duration: 8000,
      })
      return
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

        finalImages = [...new Set([...currentImages, ...newClean])]
      }
    } catch (error) {
      console.error('[EDIT_COMPANY_FORM_ERROR_SENDING_IMAGES]', error)
    }

    try {
      if (documents.length > 0) {
        const documentsFormData = new FormData()

        const payload = documents.map((document) => ({
          documentTypeId: document.documentTypeId,
          name: document.name,
          description: document.description,
          expiresAt: document.expiresAt ?? null,
        }))

        documentsFormData.append('documents', JSON.stringify(payload))

        documents.forEach((document) => {
          if (document.file instanceof File) {
            documentsFormData.append('files', document.file)
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
            body: documentsFormData,
          },
        )

        if (!uploadResponse.ok) {
          throw new Error('Falha ao enviar os documentos')
        }

        const uploadData = await uploadResponse.json()

        const newClean = normalizeIds(uploadData.documentsIds)

        finalDocuments = [...new Set([...currentDocuments, ...newClean])]
      }
    } catch (error) {
      console.error('[EDIT_COMPANY_FORM_ERROR_SENDING_DOCUMENTS]', error)
    }

    formData.set('imagesIds', JSON.stringify(finalImages))
    formData.set('documentsIds', JSON.stringify(finalDocuments))

    await handleSubmit(formData)
  }

  useEffect(() => {
    if (success === false && message) {
      toast.error('Erro ao salvar empresa', {
        description: message,
      })
    } else {
      if (success === true) {
        toast.success(message, {
          duration: 8000,
        })

        router.push('settings')
      }
    }
  }, [success, message, router])

  return (
    <div className="grid space-y-4">
      <SiteHeader title="Gerenciamento da empresa" />

      <form onSubmit={onSubmit} className="grid space-y-4 p-4">
        <input type="hidden" name="id" value={company.id} />

        <div className="grid gap-2">
          <Label htmlFor="addressId">Endereço da empresa</Label>

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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={socialName}
            onChange={(e) => setSocialName(e.target.value)}
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
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            name="cnpj"
            value={cnpj}
            onChange={(e) => setCNPJ(e.target.value)}
            placeholder="Preencha o CNPJ da empresa"
            autoComplete="off"
          />

          {getFieldError(errors, 'cnpj') && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getFieldError(errors, 'cnpj')}
            </p>
          )}
        </div>

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
          <h3 className="text-base font-medium">Documentos</h3>

          <div className="grid gap-2">
            <Label>Atuais documentos</Label>
            <DataTable
              columns={[
                ...documentColumns,
                {
                  accessorKey: 'id',
                  header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Opções" />
                  ),
                  cell: ({ row }) => {
                    const id = row.original.id

                    return (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() => removeFromCurrentDocuments(id)}
                      >
                        <CircleX className="size-4" />
                      </Button>
                    )
                  },
                },
              ]}
              data={currentDocuments}
              lineActions={[]}
              showPagination={false}
            />
          </div>

          <div className="grid gap-2 space-y-4">
            <Label className="text-base">Novos documentos</Label>

            {documents.map((doc, index) => {
              return (
                <div
                  key={index}
                  className="grid grid-cols-[10fr_0.5fr] items-center gap-4"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-4 2xl:flex-row">
                      <div className="flex w-full flex-col gap-2">
                        <Label>Tipo do documento</Label>
                        <Select
                          value={doc.documentTypeId}
                          onValueChange={(value) => {
                            updateDocument(index, 'documentTypeId', value)
                          }}
                        >
                          <SelectTrigger className="w-full">
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
                      </div>

                      <div className="flex w-full flex-col gap-2">
                        <Label>Documento</Label>
                        <Input
                          placeholder="Nome do documento"
                          autoComplete="off"
                          value={doc.name}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-2">
                      <Label>Descrição</Label>
                      <Input
                        placeholder="Descrição do documento"
                        autoComplete="off"
                        value={doc.description || ''}
                        onChange={(e) =>
                          updateDocument(index, 'description', e.target.value)
                        }
                      />
                    </div>

                    <div
                      className={`flex flex-col gap-4 2xl:flex-row ${!doc.file && 'items-center'}`}
                    >
                      <div className="flex w-full flex-col gap-2">
                        <Label>Arquivo</Label>
                        <input
                          type="file"
                          className={cn(
                            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                          )}
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              updateDocument(index, 'file', e.target.files[0])
                            }
                          }}
                        />

                        {doc.file && (
                          <p className="text-muted-foreground text-sm">
                            Selecionado: {doc.file.name}
                          </p>
                        )}
                      </div>

                      <div className="flex w-full flex-col gap-2">
                        <Label>Data de expiração</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full text-left font-normal',
                                !doc.expiresAt && 'text-muted-foreground',
                              )}
                            >
                              {doc.expiresAt ? (
                                format(doc.expiresAt, 'dd LLL, y', {
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
                              selected={doc.expiresAt}
                              onSelect={(date) => {
                                if (date) {
                                  updateDocument(index, 'expiresAt', date)
                                }
                              }}
                              disabled={(date) =>
                                date < now || date < new Date('1900-01-01')
                              }
                            />
                          </PopoverContent>
                        </Popover>
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
