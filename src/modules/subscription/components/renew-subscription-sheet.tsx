'use client'

import { Row } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Lineaction } from '@/components/table/types/lineaction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useFormState } from '@/hooks/use-form-state'
import type { Parameter } from '@/modules/parameter/types/parameter'

import { Subscription } from '../types/subscription'
import { renewSubscriptionAction } from './actions'

export function RenewSubscriptionSheet({
  price,
  lineaction,
  row,
}: {
  price: Parameter
  lineaction: Lineaction
  row: Row<Subscription>
}) {
  const [open, setOpen] = useState(false)

  const { icon: Icon } = lineaction || {}
  const { original: subscription } = row

  const now = new Date()
  const date = new Date()
  date.setDate(date.getDate() + 30)

  const formAction = renewSubscriptionAction

  const [{ success, message }, handleSubmit, isPending] =
    useFormState(formAction)

  useEffect(() => {
    if (success === false && message) {
      toast.error('Erro ao renovar assinatura.', {
        description: message,
      })
    } else {
      if (success === true) {
        toast.success('Assinatura pendente de pagamento.', {
          description:
            'Verifique o pagamento na listagem para concluir a renovação.',
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
          <SheetTitle>Renovar Assinatura</SheetTitle>
        </SheetHeader>

        <form action={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Inicío da Assinatura</Label>
            <Input disabled value={now.toLocaleDateString()} />
          </div>

          <div className="grid gap-2">
            <Label>Término da renovação da assinatura</Label>
            <Input disabled value={date.toLocaleDateString()} />
          </div>

          <div className="space-y-2">
            <Label>
              Você está prestes a renovar sua assinatura por{' '}
              <strong>R$ {price.value}</strong> mensais.
            </Label>
            <Label>
              Ao renovar, você continuará tendo acesso a todos os benefícios do
              plano escolhido.
            </Label>
            <Label>Deseja prosseguir com a renovação?</Label>
          </div>

          <SheetFooter>
            <input type="hidden" name="id" value={subscription.id} />
            <Button type="submit" disabled={isPending}>
              Renovar assinatura
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
