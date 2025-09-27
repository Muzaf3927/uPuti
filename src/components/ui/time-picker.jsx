import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "./button";

const TimePicker = ({ value = "12:00", onChange, className = "" }) => {
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      setHours(h || 12);
      // Округляем минуты до ближайшего интервала 5 минут
      const roundedMinutes = Math.round((m || 0) / 5) * 5;
      setMinutes(roundedMinutes);
    }
  }, [value]);

  const handleHourChange = (newHour) => {
    const hour = Math.max(0, Math.min(23, newHour));
    setHours(hour);
    // Округляем минуты до ближайшего интервала 5 минут
    const roundedMinutes = Math.round(minutes / 5) * 5;
    setMinutes(roundedMinutes);
    const timeString = `${hour.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`;
    onChange?.(timeString);
  };

  const handleMinuteChange = (newMinute) => {
    // Округляем до ближайшего интервала 5 минут
    const minute = Math.round(newMinute / 5) * 5;
    const clampedMinute = Math.max(0, Math.min(55, minute));
    setMinutes(clampedMinute);
    const timeString = `${hours.toString().padStart(2, '0')}:${clampedMinute.toString().padStart(2, '0')}`;
    onChange?.(timeString);
  };

  const formatTime = () => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10, 15, ..., 55

  return (
    <div className={`relative ${className}`}>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between h-9 px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{formatTime()}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-md shadow-lg">
          <div className="flex">
            {/* Часы */}
            <div className="flex-1 border-r">
              <div className="text-center py-2 text-sm font-medium text-gray-500 border-b">
                Часы
              </div>
              <div className="max-h-48 overflow-y-auto">
                {hourOptions.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    className={`w-full py-2 text-sm hover:bg-gray-100 ${
                      hour === hours ? 'bg-green-100 text-green-700' : ''
                    }`}
                    onClick={() => handleHourChange(hour)}
                  >
                    {hour.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Минуты */}
            <div className="flex-1">
              <div className="text-center py-2 text-sm font-medium text-gray-500 border-b">
                Минуты
              </div>
              <div className="max-h-48 overflow-y-auto">
                {minuteOptions.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    className={`w-full py-2 text-sm hover:bg-gray-100 ${
                      minute === minutes ? 'bg-green-100 text-green-700' : ''
                    }`}
                    onClick={() => handleMinuteChange(minute)}
                  >
                    {minute.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Закрыть при клике вне компонента */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default TimePicker;

