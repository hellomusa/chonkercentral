"use client"

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectGroup } from "@radix-ui/react-select"
import { X } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { PopoverClose } from "@radix-ui/react-popover"
import { LibrarySpotContext } from "./library-spot"

dayjs.extend(utc)
dayjs.extend(timezone)

const generateTimeOptions = () => {
  const options = []
  for (let hour = 7; hour <= 22; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 22 && minute === 0) break
      const time = dayjs().tz("America/New_York").hour(hour).minute(minute)
      options.push({
        value: time.format("HH:mm:ss"),
        label: time.format("h:mm A")
      })
    }
  }
  return options
}

const getDateRange = () => {
  const today = dayjs().tz("America/New_York").startOf('day')
  const maxDate = today.add(7, 'day').toDate()
  return {
    today, maxDate
  }
}

const formatDateTime = (date: Date, time: string) => {
  return dayjs(date).tz("America/New_York").format("YYYY-MM-DD") + " " + time;
}

const timeOptions = generateTimeOptions()

function LibraryRoomCalendar() {
  const { dateTime, setDateTime } = useContext(LibrarySpotContext)

  const [date, setDate] = useState<Date | undefined>(new Date(dateTime))
  const [time, setTime] = useState<string | undefined>()

  const { today, maxDate } = getDateRange();

  useEffect(() => {
    if (date && time) setDateTime(formatDateTime(date, time))
  }, [date, time])

  return (
    <>
      <Calendar
        fromDate={today.toDate()}
        toDate={maxDate}
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
      />
      <Select onValueChange={setTime} value={time}>
      <div className="flex justify-center p-4">
        <SelectTrigger className="justify-center w-2/3 bg-primary text-secondary">
          <SelectValue placeholder="Select time"/>
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
    </>
  )
}

export default function LibraryRoomCalendarPopover() {
  const { dateTime } = useContext(LibrarySpotContext)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>{dateTime ? dateTime : "Check availability"}</Button>
      </PopoverTrigger>
      <PopoverContent className="pt-0 pb-0 px-0 flex flex-col justify-center">
        <div className="flex justify-end">
           <PopoverClose className="absolute right-[5px] top-[5px] inline-flex size-[25px] cursor-default items-center justify-center outline-none hover:bg-muted focus:outline-none">
            <X className="h-4 w-4" />
          </PopoverClose>
        </div>
        <LibraryRoomCalendar />
      </PopoverContent>
    </Popover>
  )
}