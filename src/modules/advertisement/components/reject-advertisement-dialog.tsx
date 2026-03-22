'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFormState } from '@/hooks/use-form-state'
import { getFieldError } from '@/utils/get-field-error'

import { Advertisement } from '../types/advertisement'
import { rejectAdvertisementAction } from './actions'

type RejectAdvertisementDialogProps = {
  advertisement: Advertisement
}

export function RejectAdvertisementDialog({
  advertisement,
}: RejectAdvertisementDialogProps) {
  const router = useRouter()

  const formAction = rejectAdvertisementAction

  const [{ errors, success, message }, handleSubmit, isPending] =
    useFormState(formAction)

  useEffect(() => {
    if (success === false && message) {
      toast.error('Erro ao rejeitar anúncio', {
        description: message,
      })
    } else {
      if (success === true) {
        toast.success(message, {
          duration: 8000,
        })

        router.refresh()
      }
    }
  }, [success, message, router])

  useEffect(() => {
    if (!success) return
    router.back()
  }, [router, success])

  return (
    <DialogContent className="sm:max-w-[425px]">
      <form action={handleSubmit} className="grid gap-4">
        <DialogHeader>
          <DialogTitle>Rejeitar anúncio</DialogTitle>
          <DialogDescription>
            Informe o motivo da rejeição do anúncio
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <input
            type="hidden"
            name="advertisementId"
            disabled={isPending}
            value={advertisement.id}
          />
          {getFieldError(errors, 'advertisementId') && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getFieldError(errors, 'advertisementId')}
            </p>
          )}

          <Label>Motivo do rejeito</Label>
          <Textarea
            name="rejectedReason"
            placeholder="Digite o seu motivo:"
            autoComplete="off"
            disabled={isPending}
          />
          {getFieldError(errors, 'rejectedReason') && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {getFieldError(errors, 'rejectedReason')}
            </p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending} variant="destructive">
            Rejeitar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
