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
import { useFormState } from '@/hooks/use-form-state'
import { getFieldError } from '@/utils/get-field-error'

import { Advertisement } from '../types/advertisement'
import { approveAdvertisementAction } from './actions'

type ApproveAdvertisementDialogProps = {
  advertisement: Advertisement
}

export function ApproveAdvertisementDialog({
  advertisement,
}: ApproveAdvertisementDialogProps) {
  const router = useRouter()

  const formAction = approveAdvertisementAction

  const [{ errors, success, message }, handleSubmit, isPending] =
    useFormState(formAction)

  useEffect(() => {
    if (success === false && message) {
      toast.error('Erro ao aprovar anúncio', {
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
          <DialogTitle>Aprovar anúncio</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja aprovar este anúncio?
          </DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            Aprovar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
