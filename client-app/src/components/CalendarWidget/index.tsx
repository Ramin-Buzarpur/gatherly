import { useState } from 'react';
import { useStore } from '../../stores/rootStore';
import { observer } from 'mobx-react-lite';

const CalendarWidget = observer(() => {
  const { eventStore } = useStore();
  const { selectedDate, setDate } = eventStore;

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { day: number; currentMonth: boolean }[] = [];

  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, currentMonth: false });
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleDayClick = (day: number, currentMonth: boolean) => {
    if (!currentMonth) return;
    const month = String(viewMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${viewYear}-${month}-${dayStr}`;
    if (selectedDate === dateStr) {
      setDate(null);
    } else {
      setDate(dateStr);
    }
  };

  const isSelected = (day: number, currentMonth: boolean) => {
    if (!currentMonth || !selectedDate) return false;
    const month = String(viewMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return selectedDate === `${viewYear}-${month}-${dayStr}`;
  };

  const isToday = (day: number, currentMonth: boolean) => {
    if (!currentMonth) return false;
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  return (
    <div className="bg-[#FFFFFF] rounded-[16px] p-6 h-full flex flex-col justify-between">

      <div className="flex justify-between items-center px-2 mb-4">
        <button
          onClick={prevMonth}
          className="text-[#F59E0B] font-normal text-[20px] hover:opacity-70 transition-opacity"
        >
          &lt;
        </button>
        <div className="bg-[#14B8A6] text-[#FFFFFF] px-6 py-1 rounded-md text-[18px] font-normal">
          {monthNames[viewMonth]} {viewYear}
        </div>
        <button
          onClick={nextMonth}
          className="text-[#F59E0B] font-normal text-[20px] hover:opacity-70 transition-opacity"
        >
          &gt;
        </button>
      </div>

      <div className="border-t border-gray-100 mb-3" />

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {daysOfWeek.map(day => (
          <div key={day} className="text-[12px] text-[#6B7280] font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-x-1 gap-y-1 text-center flex-1 content-evenly">
        {cells.map((cell, idx) => (
          <div
            key={idx}
            onClick={() => handleDayClick(cell.day, cell.currentMonth)}
            className={`
              text-[13px] font-normal w-8 h-8 mx-auto flex items-center justify-center rounded-full transition-colors
              ${!cell.currentMonth
                ? 'text-gray-300 cursor-default'
                : isSelected(cell.day, cell.currentMonth)
                  ? 'bg-[#14B8A6] text-white cursor-pointer'
                  : isToday(cell.day, cell.currentMonth)
                    ? 'bg-[#F59E0B] text-white cursor-pointer'
                    : 'text-[#1F2937] cursor-pointer hover:bg-teal-50'
              }
            `}
          >
            {cell.day}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="flex items-center justify-between px-1 mt-2">
          <span className="text-[12px] text-[#14B8A6]">
            From: {selectedDate}
          </span>
          <button
            onClick={() => setDate(null)}
            className="text-[12px] text-red-400 hover:text-red-600 transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
});

export default CalendarWidget;