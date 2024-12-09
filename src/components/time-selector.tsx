import { Button } from "@/components/ui/button";
import { CalendarDays, Clock } from "lucide-react";
import { Separator } from "./ui/separator";

interface TimeSelectorProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function TimeSelector({ value, onChange }: TimeSelectorProps) {
  // Convert to Eastern Time
  const toEasternTime = (date: Date) => {
    return new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  };

  // Format time to 12-hour format with AM/PM
  const formatTime = (date: Date) => {
    const easternDate = toEasternTime(date);
    let hours = easternDate.getHours();
    const minutes = easternDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${hours}:${minutesStr} ${ampm} ET`;
  };

  // Format date to readable format
  const formatDate = (date: Date) => {
    const easternNow = toEasternTime(new Date());
    easternNow.setHours(0, 0, 0, 0);
    
    const easternTomorrow = new Date(easternNow);
    easternTomorrow.setDate(easternNow.getDate() + 1);
    
    const easternDate = toEasternTime(date);
    easternDate.setHours(0, 0, 0, 0);
    
    if (easternDate.getTime() === easternNow.getTime()) return 'Today';
    if (easternDate.getTime() === easternTomorrow.getTime()) return 'Tomorrow';
    
    return easternDate.toLocaleDateString('en-US', { 
      timeZone: 'America/New_York',
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Generate next 7 days including today in Eastern Time
  const generateDates = () => {
    const dates = [];
    const easternNow = toEasternTime(new Date());
    easternNow.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(easternNow);
      date.setDate(easternNow.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Generate time slots from 7:30 AM to 10:00 PM Eastern Time
  const generateTimeSlots = () => {
    const slots = [];
    const easternDate = toEasternTime(value);
    
    for (let hour = 7; hour <= 21; hour++) {
      for (let minute of [30, 0]) {
        if (hour === 7 && minute === 0) continue;
        if (hour === 21 && minute === 30) continue;

        const slotTime = new Date(easternDate);
        slotTime.setHours(hour, minute, 0, 0);
        slots.push(slotTime);
      }
    }
    return slots;
  };

  const dates = generateDates();
  const timeSlots = generateTimeSlots();
  
  const selectedDate = toEasternTime(value);
  selectedDate.setHours(0, 0, 0, 0);
  
  const easternValue = toEasternTime(value);
  const selectedTime = easternValue.getHours() * 60 + easternValue.getMinutes();

  return (
    <div className="space-y-4">
      <div className="px-2 space-y-2">
        <div className="text-sm font-medium flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Select Date (ET)
        </div>
        <div className="flex flex-wrap gap-2">
          {dates.map((date, index) => {
            const isSelected = date.getTime() === selectedDate.getTime();
            
            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newDate = new Date(value);
                  const easternDate = toEasternTime(date);
                  newDate.setFullYear(
                    easternDate.getFullYear(), 
                    easternDate.getMonth(), 
                    easternDate.getDate()
                  );
                  onChange(newDate);
                }}
                className="text-xs"
              >
                {formatDate(date)}
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="px-2 space-y-2">
        <div className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Select Time (ET)
        </div>
        <div className="flex flex-wrap gap-2">
          {timeSlots.map((slot, index) => {
            const easternSlot = toEasternTime(slot);
            const slotMinutes = easternSlot.getHours() * 60 + easternSlot.getMinutes();
            const isSelected = selectedTime === slotMinutes;
            
            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onChange(slot)}
                className="text-xs"
              >
                {formatTime(slot)}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}