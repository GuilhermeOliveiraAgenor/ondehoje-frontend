import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover'
import { Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Lineaction } from '@/components/table/types/lineaction'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { useFormState } from '@/hooks/use-form-state'
import { EventDetails } from '@/modules/event/types/event-details'
import { getFieldError } from '@/utils/get-field-error'

import { Coupon } from '../types/coupon'
import { createCouponAction, editCouponAction } from './actions'

export function SaveCouponSheet({
  lineaction,
  row,
  events,
}: {
  lineaction?: Lineaction
  row?: Row<Coupon>
  events: EventDetails[]
}) {
  const [open, setOpen] = useState(false)

  const { icon: Icon } = lineaction || {}
  const { original: coupon } = row || { original: undefined }

  const [eventId, setEventId] = useState(coupon?.event.id ?? '')
  const [name, setName] = useState(coupon?.name ?? '')
  const [description, setDescription] = useState(coupon?.description ?? '')
  const [expiresAt, setExpiresAt] = useState<Date>(
    coupon ? new Date(coupon.expiresAt) : new Date(),
  )

  const formAction = coupon ? editCouponAction : createCouponAction

  const [{ errors, success, message }, handleSubmit, isPending] =
    useFormState(formAction)

  useEffect(() => {
    if (success === false && message) {
      toast.error('Erro ao salvar cupom', {
        description: message,
      })
    } else {
      if (success === true) {
        toast.success('Cupom salvo com sucesso', {
          duration: 8000,
        })
      }
    }
  }, [success, message])

  useEffect(() => {
    if (!success) return
    setOpen(false)
  }, [success])

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
      <SheetContent className="min-h-screen w-full gap-4 p-6 md:max-w-1/2">
        <div className="-mx-4">
          <SheetHeader>
            <SheetTitle>Salvar Cupom</SheetTitle>
          </SheetHeader>
        </div>
        <form className="gap-4" action={handleSubmit}>
          <input type="hidden" id="id" name="id" value={coupon?.id} />
          <div className="grid gap-2 py-7">
            <Label htmlFor="event">Evento</Label>
            <Select value={eventId} onValueChange={setEventId}>
              <SelectTrigger
                id="eventId"
                disabled={isPending}
                className="w-full py-2 text-xs sm:py-2.5 sm:text-sm"
              >
                <SelectValue placeholder="Selecione o evento" />
              </SelectTrigger>
              <SelectContent>
                {events.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError(errors, 'eventId') && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {getFieldError(errors, 'eventId')}
              </p>
            )}
            <input type="hidden" name="eventId" value={eventId} />
          </div>
          <div className="grid gap-2 py-7">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              disabled={isPending}
              name="name"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
            {getFieldError(errors, 'name') && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {getFieldError(errors, 'name')}
              </p>
            )}
          </div>
          <div className="grid gap-2 py-7">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              disabled={isPending}
              name="description"
              placeholder="Descrição do cupom"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="off"
            />
            {getFieldError(errors, 'description') && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {getFieldError(errors, 'description')}
              </p>
            )}
          </div>
          <div className="grid gap-2 py-7">
            <Label>Expira em</Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled={isPending}
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiresAt ? (
                    format(expiresAt, 'dd/MM/yyyy', { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto rounded-xl bg-white p-2 shadow-lg"
                side="bottom"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={expiresAt}
                  onSelect={(date) => {
                    setExpiresAt(date)
                  }}
                  required={true}
                  initialFocus
                  className="rounded-lg p-2"
                />
              </PopoverContent>
            </Popover>

            {getFieldError(errors, 'expiresAt') && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {getFieldError(errors, 'expiresAt')}
              </p>
            )}
            <input
              type="hidden"
              name="expiresAt"
              value={expiresAt ? expiresAt.toISOString() : ''}
            />
          </div>
          <div className="py-5">
            <SheetFooter>
              <Button type="submit" disabled={isPending}>
                Salvar
              </Button>
            </SheetFooter>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
