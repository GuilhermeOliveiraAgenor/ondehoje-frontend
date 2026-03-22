'use client'

import { Row } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Lineaction } from '../types/lineaction'

interface DataTableActionsCellProps<TData> {
  row: Row<TData>
  actions: Lineaction<TData>[]
}

export function DataTableActionsCell<TData>({
  row,
  actions,
}: DataTableActionsCellProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full border border-gray-300 bg-white p-2">
        <Ellipsis className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col items-center gap-1 rounded-lg! py-0!">
        {actions.map((item) => {
          const {
            label,
            icon: Icon,
            color,
            onClick,
            component: Component,
            componentProps,
          } = item
          const key = `${row.id}-${label}`

          // Se houver um componente customizado, renderiza-o
          if (Component) {
            return (
              <Component
                key={key}
                lineaction={item}
                row={row}
                {...componentProps}
              />
            )
          }

          // Senão, renderiza um item padrão
          return (
            <DropdownMenuItem
              key={key}
              className={`bg-${color ?? 'gray'}-100`}
              onClick={() => onClick?.(row)}
              disabled={item.disabled}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              <span>{label}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
