import { FormEvent, useState, useTransition } from 'react'
import { requestFormReset } from 'react-dom'

interface NestedErrors {
  errors: string[]
  properties?: {
    [key: string]: {
      errors: string[]
      items?: { errors: string[] }[]
    }
  }
}

export interface FormState {
  success: boolean
  message: string | null
  errors: NestedErrors | null
}

export function useFormState(
  action: (data: FormData) => Promise<FormState>,
  onSuccess?: () => Promise<void> | void,
  initialState?: FormState,
) {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormState] = useState(
    initialState ?? { success: false, message: null, errors: null },
  )

  async function handleSubmit(input: FormEvent<HTMLFormElement> | FormData) {
    let formData: FormData
    let form: HTMLFormElement | null = null

    // Detecta o tipo do argumento
    if (input instanceof FormData) {
      formData = input
    } else {
      input.preventDefault()
      form = input.currentTarget
      formData = new FormData(form)
    }

    startTransition(async () => {
      const state = await action(formData)

      if (state.success && onSuccess && form) {
        await onSuccess()
        requestFormReset(form)
      }

      setFormState(state)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
