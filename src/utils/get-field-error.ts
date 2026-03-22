import type { FormState } from '@/hooks/use-form-state'

export function getFieldError(
  errors: FormState['errors'],
  field: string,
): string | null {
  return errors?.properties?.[field]?.errors?.[0] ?? null
}
