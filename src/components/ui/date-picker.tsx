'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type CalendarDatePicker = React.HtmlHTMLAttributes<HTMLDivElement> & {
  onSelect: (date: Date | undefined) => void
  selected?: Date
  placeholder?: string
}

export function CalendarDatePicker({ className, onSelect, selected, placeholder }: CalendarDatePicker) {
  const [date, setDate] = React.useState<Date | undefined>(selected)

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    if (onSelect) onSelect(date)
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn('justify-start text-left font-normal', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              date.toLocaleDateString('id', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: '2-digit',
              })
            ) : (
              <span>{placeholder ? placeholder : 'Pilih Tanggal'}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar initialFocus mode="single" defaultMonth={date} selected={date} onSelect={handleDateChange} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
