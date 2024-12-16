'use client'

import { useEffect, useState, useRef } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SelectGroup } from '@radix-ui/react-select'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { PopoverClose } from '@radix-ui/react-popover'
import { useLibrarySpot } from '@/contexts/LibrarySpotContext'

dayjs.extend(utc)
dayjs.extend(timezone)

const generateTimeOptions = () => {
  const options = []
  for (let hour = 7; hour <= 22; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 22 && minute === 0) break
      const time = dayjs().tz('America/New_York').hour(hour).minute(minute)
      options.push({
        value: time.format('HH:mm:ss'),
        label: time.format('h:mm A'),
      })
    }
  }
  return options
}

const getDateRange = () => {
  const today = dayjs().tz('America/New_York').startOf('day')
  const maxDate = today.add(7, 'day').toDate()
  return {
    today,
    maxDate,
  }
}

const formatDateTime = (date: Date, time: string) => {
  return dayjs(date).tz('America/New_York').format('YYYY-MM-DD') + ' ' + time
}

const timeOptions = generateTimeOptions()

function LibraryRoomCalendar({ onComplete }: { onComplete: () => void }) {
  const { dateTime, setDateTime } = useLibrarySpot()

  const [date, setDate] = useState<Date | undefined>(
    dateTime ? new Date(dateTime) : new Date()
  )
  const [time, setTime] = useState<string | undefined>(
    dateTime ? dayjs(dateTime).format('HH:mm:ss') : undefined
  )
  const isInitialRender = useRef(true)

  const { today, maxDate } = getDateRange()

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    if (date && time) {
      setDateTime(formatDateTime(date, time))
      onComplete()
    }
  }, [date, time, setDateTime, onComplete])

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate && time) {
      setDateTime(formatDateTime(newDate, time))
      onComplete()
    }
  }

  const handleTimeSelect = (newTime: string) => {
    setTime(newTime)
    if (date && newTime) {
      setDateTime(formatDateTime(date, newTime))
      onComplete()
    }
  }

  return (
    <>
      <Calendar
        fromDate={today.toDate()}
        toDate={maxDate}
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-md border shadow"
      />
      {!dateTime && (
        <Select onValueChange={handleTimeSelect} value={time}>
          <div className="flex justify-center p-4">
            <SelectTrigger className="justify-center w-2/3 bg-primary text-secondary">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
          </div>
          <SelectContent className="overflow-y-auto max-h-[9rem]">
            <SelectGroup>
              {timeOptions.map((option) => (
                <SelectItem key={option.label} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </>
  )
}

export default function LibraryRoomCalendarPopover() {
  const { dateTime, setDateTime } = useLibrarySpot()
  const [open, setOpen] = useState(false)

  const handleComplete = () => {
    setOpen(false)
  }

  const handleTimeChange = (newTime: string) => {
    if (dateTime) {
      const newDateTime = dayjs(dateTime).format('YYYY-MM-DD') + ' ' + newTime
      setDateTime(newDateTime)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {dateTime ? (
        <>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {dayjs(dateTime).format('MMM D, YYYY')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="pt-0 pb-0 px-0 flex flex-col justify-center">
              <div className="flex justify-end">
                <PopoverClose className="absolute right-[5px] top-[5px] inline-flex size-[25px] cursor-default items-center justify-center outline-none hover:bg-muted focus:outline-none">
                  <X className="h-4 w-4" />
                </PopoverClose>
              </div>
              <LibraryRoomCalendar onComplete={handleComplete} />
            </PopoverContent>
          </Popover>
          <Select
            onValueChange={handleTimeChange}
            value={dayjs(dateTime).format('HH:mm:ss')}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="overflow-y-auto max-h-[9rem]">
              <SelectGroup>
                {timeOptions.map((option) => (
                  <SelectItem key={option.label} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button className="w-full mb-2 flex items-center justify-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Check available rooms</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="pt-0 pb-0 px-0 flex flex-col justify-center">
            <div className="flex justify-end">
              <PopoverClose className="absolute right-[5px] top-[5px] inline-flex size-[25px] cursor-default items-center justify-center outline-none hover:bg-muted focus:outline-none">
                <X className="h-4 w-4" />
              </PopoverClose>
            </div>
            <LibraryRoomCalendar onComplete={handleComplete} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
