import { Row } from '@tanstack/react-table'

interface Lineaction<TData = any> {
  label: string
  icon?: React.ElementType
  color?: string
  onClick?: (row: Row<TData>) => void
  component?: React.ElementType
  componentProps?: Record<string, any>
  disabled?: boolean
}

export type { Lineaction }
