import React, { useCallback, useState } from "react";
import useOuterClick from "../../lib/hooks/use_outer_click";
import { MONTH_FULL_NAME_LIST, WEEK_LIST } from "../../constants/config";
import { timestampToString } from "../../lib/common";
import { FiCalendar } from "react-icons/fi";
import { BiChevronRight, BiChevronLeft } from "react-icons/bi";

type Dates = {
  date: number;
  time: number;
  disable: boolean;
};
interface IPopulateDatesParams {
  daysInMonth: Dates[];
  selectedTime: number;
  selectedYear: number;
  selectedMonth: number;
  selectDate: (date: Dates) => void;
}

interface IDatePickerProps {
  date: number;
  minDate?: number;
  maxDate?: number;
  setDate: (date: number) => void;
}

const formatGridStyle = "grid grid-cols-7 gap-3";

/* Info:(20230530 - Julian) Safari 只接受 YYYY/MM/DD 格式的日期 */
const PopulateDates = ({
  daysInMonth,
  selectedTime,
  selectedYear,
  selectedMonth,
  selectDate,
}: IPopulateDatesParams) => {
  const formatDaysInMonth = daysInMonth.map((el: Dates, index) => {
    const date = el
      ? new Date(`${selectedYear}/${selectedMonth}/${el.date}`)
      : null;
    const isSelected =
      el?.date && date?.getTime() === selectedTime * 1000 ? true : false;

    const formatDate =
      el?.date !== undefined
        ? el.date < 10
          ? `0${el.date}`
          : `${el.date}`
        : " ";

    const dateClickHandler = () => {
      if (el?.date && !el?.disable) selectDate(el);
    };

    return (
      <div
        key={index}
        className={`whitespace-nowrap text-sm rounded-full text-center hover:cursor-pointer ${
          isSelected ? "bg-primaryGreen text-white2" : ""
        } ${el?.disable ? "text-coolGray" : "hover:bg-gray2"}`}
        onClick={dateClickHandler}
      >
        {formatDate}
      </div>
    );
  });

  return <div className={formatGridStyle}>{formatDaysInMonth}</div>;
};

const DatePicker = ({ date, minDate, maxDate, setDate }: IDatePickerProps) => {
  const [selectedMonth, setSelectedMonth] = useState(
    +timestampToString(date).month
  );
  const [selectedYear, setSelectedYear] = useState(
    +timestampToString(date).year
  );
  const { targetRef, componentVisible, setComponentVisible } =
    useOuterClick<HTMLDivElement>(false);

  const displayWeek = WEEK_LIST.map((v) => {
    return <div key={v}>{v}</div>;
  });

  // Info: (20230601 - Julian) 取得該月份第一天是星期幾
  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(`${year}/${month}/01`).getDay();
  };

  const daysInMonth = (year: number, month: number) => {
    const day =
      month === 0
        ? firstDayOfMonth(year - 1, 10)
        : firstDayOfMonth(year, month);
    const dateLength = new Date(year, month, 0).getDate();
    let dates: Dates[] = [];
    for (let i = 0; i < dateLength; i++) {
      const dateTime = new Date(`${year}/${month}/${i + 1}`).getTime() / 1000;

      const isEarlyThanMinDate = minDate ? dateTime < minDate : false;
      const isLaterThanMaxDate = maxDate ? dateTime > maxDate : false;

      const date: Dates = {
        date: i + 1,
        time: dateTime,
        disable: isEarlyThanMinDate || isLaterThanMaxDate,
      };
      dates.push(date);
    }
    dates = Array(...Array(day)).concat(dates);
    return dates;
  };

  const goToNextMonth = useCallback(() => {
    let month = selectedMonth;
    let year = selectedYear;
    month++;
    // Info: (20231024 - Julian) 過了 12 月就到下一年，月份設為 1
    if (month > 12) {
      month = 1;
      year++;
    }
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [selectedMonth, selectedYear]);

  const goToPrevMonth = useCallback(() => {
    let month = selectedMonth;
    let year = selectedYear;
    month--;
    // Info: (20231024 - Julian) 1 月往前一個月就到上一年，月份設為 12
    if (month < 1) {
      month = 12;
      year--;
    }
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [selectedMonth, selectedYear]);

  const selectDate = useCallback(
    (el: Dates) => {
      setDate(el.time);
      setComponentVisible(false);
    },
    [minDate, maxDate, selectedMonth, selectedYear, date]
  );

  const openDateHandler = () => setComponentVisible(!componentVisible);

  return (
    <div
      className={`relative flex bg-white h-48px flex-col shadow-lg items-start justify-center hover:cursor-pointer`}
    >
      <button
        className="inline-flex w-165px items-center justify-between px-4 py-3"
        onClick={openDateHandler}
      >
        <div className="mr-4 whitespace-nowrap text-base text-gray">
          {timestampToString(date).date}
        </div>
        <FiCalendar size={24} />
      </button>

      <div
        ref={targetRef}
        className={`absolute top-48px right-0 z-10 flex h-auto w-300px flex-col bg-white p-3 ${
          componentVisible ? "visible opacity-100" : "invisible opacity-0"
        } transition-all duration-200 ease-in-out shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div className="text-xl">{`${
            MONTH_FULL_NAME_LIST[selectedMonth - 1]
          } ${selectedYear}`}</div>
          <div className="flex space-x-2">
            <BiChevronLeft size={24} onClick={goToPrevMonth} />
            <BiChevronRight size={24} onClick={goToNextMonth} />
          </div>
        </div>
        <div className={`my-4 ${formatGridStyle} text-center text-xs`}>
          {displayWeek}
        </div>

        <PopulateDates
          daysInMonth={daysInMonth(selectedYear, selectedMonth)}
          selectedTime={date}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectDate={selectDate}
        />
      </div>
    </div>
  );
};

export default DatePicker;
