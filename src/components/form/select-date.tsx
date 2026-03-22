'use client'

import { format, isBefore, setHours, setMinutes } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { CalendarIcon, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { cn } from '@/lib/utils'

interface SelectDateProps {
  data?: { startDate: Date; endDate: Date }
  onDateChange: (startDate: Date, endDate: Date) => void
}

export function SelectDate({ data, onDateChange }: SelectDateProps) {
  const [startDate, setStartDate] = useState<Date>(
    data?.startDate instanceof Date ? data.startDate : new Date(),
  )

  const [endDate, setEndDate] = useState<Date>(
    data?.endDate instanceof Date ? data.endDate : new Date(),
  )

  const handleStartDateChange = (newStartDate: Date) => {
    setStartDate(newStartDate)

    if (isBefore(endDate, newStartDate)) {
      const correctedEndDate = new Date(newStartDate)
      correctedEndDate.setHours(newStartDate.getHours() + 1)
      setEndDate(correctedEndDate)
    }
  }

  const handleEndDateChange = (newEndDate: Date) => {
    setEndDate(newEndDate)

    if (isBefore(newEndDate, startDate)) {
      const correctedStartDate = new Date(newEndDate)
      correctedStartDate.setHours(newEndDate.getHours() - 1)
      setStartDate(correctedStartDate)
    }
  }

  // Update form values when dates change
  useEffect(() => {
    onDateChange(startDate, endDate)
  }, [startDate, endDate, onDateChange])

  // Time options for select
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Start Date Picker */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Data de início</Label>
          <Popover modal>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? (
                  format(startDate, 'dd LLL, y', {
                    locale: ptBR,
                  })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  if (date) {
                    const newDate = new Date(date)
                    newDate.setHours(
                      startDate.getHours(),
                      startDate.getMinutes(),
                      0,
                      0,
                    )
                    handleStartDateChange(newDate)
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Start Time */}
        <div className="space-y-2">
          <Label>Hora de início</Label>
          <div className="flex space-x-2">
            <Select
              value={startDate.getHours().toString()}
              onValueChange={(value) => {
                const hour = parseInt(value)
                const newDate = setHours(startDate, hour)
                handleStartDateChange(newDate)
              }}
            >
              <SelectTrigger className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent className="h-[200px]">
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={startDate.getMinutes().toString()}
              onValueChange={(value) => {
                const newDate = setMinutes(startDate, parseInt(value, 10))
                handleStartDateChange(newDate)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent className="h-[200px]">
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute.toString()}>
                    {minute.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-muted-foreground text-xs">
            Hora escolhida: {format(startDate, 'HH:mm')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* End Date Picker */}
        <div className="space-y-2">
          <Label htmlFor="endDate">Data de término</Label>
          <Popover modal>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? (
                  format(endDate, 'dd LLL, y', {
                    locale: ptBR,
                  })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  if (date) {
                    const newDate = new Date(date)
                    newDate.setHours(
                      endDate.getHours(),
                      endDate.getMinutes(),
                      0,
                      0,
                    )
                    handleEndDateChange(newDate)
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Time */}
        <div className="space-y-2">
          <Label>Hora de término</Label>
          <div className="flex space-x-2">
            <Select
              value={endDate.getHours().toString()}
              onValueChange={(value) => {
                const hour = parseInt(value, 10)
                const newDate = setHours(endDate, hour)
                handleEndDateChange(newDate)
              }}
            >
              <SelectTrigger className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent className="h-[200px]">
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={endDate.getMinutes().toString()}
              onValueChange={(value) => {
                const newDate = setMinutes(endDate, parseInt(value, 10))
                handleEndDateChange(newDate)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent className="h-[200px]">
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute.toString()}>
                    {minute.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-muted-foreground text-xs">
            Hora escolhida: {format(endDate, 'HH:mm')}
          </div>
        </div>
      </div>
    </div>
  )
}
