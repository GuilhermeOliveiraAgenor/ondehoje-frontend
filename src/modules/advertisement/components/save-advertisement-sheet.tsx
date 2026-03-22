/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Lineaction } from '@/components/table/types/lineaction'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useFormState } from '@/hooks/use-form-state'
import { cn } from '@/lib/utils'
import { EventDetails } from '@/modules/event/types/event-details'
import { Parameter } from '@/modules/parameter/types/parameter'

import { Advertisement } from '../types/advertisement'
import {
  calculateAdvertisementCost,
  calculateDaysDifference,
} from '../utils/advertisement-calculator'
import { createAdvertisementAction } from './actions'

export function SaveAdvertisementSheet({
  events,
  price,
  discount,
  percentage,
  lineaction,
}: {
  events: EventDetails[]
  price: Parameter
  discount: Parameter
  percentage: Parameter
  lineaction?: Lineaction
  row?: Row<Advertisement>
}) {
  const [open, setOpen] = useState(false)

  const { icon: Icon } = lineaction || {}
  // const { original: advertisement } = row || { original: undefined }

  const now = new Date()
  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)

  const [advertise, setAdvertise] = useState<string>('')
  const [eventSlug, setEventSlug] = useState('')
  const [expirationDate, setExpirationDate] = useState<Date>(new Date())

  const baseDailyPrice = Number(price.value)
  const discountThresholdDays = Number(discount.value)
  const discountPercentage = Number(percentage.value)

  const calculation = useMemo(() => {
    const days = calculateDaysDifference(expirationDate)
    return calculateAdvertisementCost(days, {
      baseDailyPrice,
      discountThresholdDays,
      discountPercentage,
    })
  }, [
    expirationDate,
    baseDailyPrice,
    discountThresholdDays,
    discountPercentage,
  ])

  const formattedTotal = calculation.total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const formattedSubtotal = calculation.subtotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const formattedDiscount = calculation.discountAmount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const formAction = createAdvertisementAction

  const [{ message, success }, handleSubmit, isPending] =
    useFormState(formAction)

  useEffect(() => {
    if (success === false && message) {
      toast.error('Erro ao criar anúncio.', {
        description: message,
      })
    } else {
      if (success === true) {
        toast.success('Anúncio criado com sucesso.', {
          description:
            'Aguarde aprovação de um dos nossos moderadores para realizar o pagamento.',
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
      <SheetTrigger className="flex w-full items-center justify-center gap-2 py-1.5 text-sm">
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
      <SheetContent className="min-h-screen w-full overflow-y-auto p-6 md:max-w-1/2">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <SheetHeader className="p-0">
            <SheetTitle>Salvar anúncio</SheetTitle>
            <Badge variant="warning">
              Selecione apenas um evento ou anuncie sua própria empresa!
            </Badge>
          </SheetHeader>

          <div className="space-y-2">
            <Label htmlFor="advertise-select">Anunciar sua empresa?</Label>
            <Select
              name="advertise"
              onValueChange={setAdvertise}
              value={advertise}
              disabled={isPending}
            >
              <SelectTrigger id="advertise-select" className="w-full">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes" className="w-full truncate">
                  Sim
                </SelectItem>
                <SelectItem value="no" className="w-full truncate">
                  Não
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {advertise === 'no' && (
            <div className="space-y-2">
              <Label htmlFor="event-select">
                Escolha o evento que você quer anunciar
              </Label>
              <Select
                name="eventSlug"
                onValueChange={setEventSlug}
                value={eventSlug}
                disabled={isPending}
              >
                <SelectTrigger id="event-select" className="w-full">
                  <SelectValue placeholder="Selecione um evento" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((option) => (
                    <SelectItem
                      key={option.slug}
                      value={String(option.slug)}
                      className="w-full truncate"
                    >
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex w-full flex-col space-y-2">
            <Label htmlFor="expiration-date-button">Data de expiração</Label>
            <Popover modal>
              <PopoverTrigger asChild>
                <Button
                  id="expiration-date-button"
                  type="button"
                  variant={'outline'}
                  className={cn(
                    'w-full text-left font-normal',
                    !expirationDate && 'text-muted-foreground',
                  )}
                  disabled={isPending}
                >
                  {expirationDate ? (
                    format(expirationDate, 'dd LLL, y', {
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
                  required
                  mode="single"
                  selected={expirationDate}
                  onSelect={setExpirationDate}
                  disabled={(date) =>
                    date < yesterday || date < new Date('1900-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {expirationDate && (
              <>
                <input
                  type="hidden"
                  name="expirationDate"
                  value={expirationDate.toISOString()}
                />
                <input type="hidden" name="days" value={calculation.days} />
              </>
            )}
          </div>

          <Card className="bg-card/0 w-full">
            <CardHeader>
              <CardTitle>Cálculo de Custo do Anúncio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Preço Diário</p>
                  <p className="text-lg font-semibold">
                    R$ {baseDailyPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Dias de Atividade
                  </p>
                  <p className="text-lg font-semibold">
                    {calculation.days} dias
                  </p>
                </div>
              </div>

              <div className="border-border border-t pt-4">
                <div className="mb-2 flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Subtotal
                  </span>
                  <span className="font-medium">{formattedSubtotal}</span>
                </div>

                {calculation.discountApplied && (
                  <div className="mb-2 flex justify-between text-green-600">
                    <span className="text-sm">
                      Desconto ({discountPercentage}%)
                    </span>
                    <span className="font-medium">-{formattedDiscount}</span>
                  </div>
                )}

                {!calculation.discountApplied && (
                  <p className="text-muted-foreground mb-2 text-xs">
                    Desconto será aplicado a partir de {discountThresholdDays}{' '}
                    dias
                  </p>
                )}
              </div>

              <div className="border-border border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-primary text-xl font-bold">
                    {formattedTotal}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <SheetFooter className="justify-end p-0 sm:flex-row">
            <Button type="submit">
              {isPending ? 'Salvando...' : 'Salvar anúncio'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
