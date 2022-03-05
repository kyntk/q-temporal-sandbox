import { Temporal, Intl } from '@js-temporal/polyfill'
import { useRef, useState } from 'react'
import { chunk } from './chunk'
import './App.css'

const weeks = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

interface Day {
  day: number
  date: Temporal.PlainDate
  dayOfWeek: number
}

interface HTMLInputElementWithShowPicker extends HTMLInputElement {
  showPicker(): void
}

const getDaysInThisMonth = (targetMonth: Temporal.PlainDate): Day[] => {
  const days: Day[] = []
  for (let i = 0; i < targetMonth.daysInMonth; i++) {
    const day = i + 1
    const date = Temporal.PlainDate.from({
      year: targetMonth.year,
      month: targetMonth.month,
      day,
    })
    days[i] = {
      day,
      date,
      dayOfWeek: date.dayOfWeek,
    }
  }
  return days
}

const getPreviousDays = (firstDayOfThisMonth: Day): Day[] => {
  const days = firstDayOfThisMonth.dayOfWeek
  if (days === 7) return []
  const previousDays: Day[] = []
  for (let i = 0; i < days; i++) {
    const date = firstDayOfThisMonth.date.subtract({ days: i + 1 })
    previousDays[i] = {
      day: date.day,
      date,
      dayOfWeek: date.dayOfWeek,
    }
  }
  return previousDays.sort((_) => -1)
}

const getFollowingDays = (endDayOfThisMonth: Day): Day[] => {
  const days =
    endDayOfThisMonth.dayOfWeek === 7 ? 6 : 7 - endDayOfThisMonth.dayOfWeek - 1 // Week starts from Sunday(7)
  const followingDays: Day[] = []
  for (let i = 0; i < days; i++) {
    const date = endDayOfThisMonth.date.add({ days: i + 1 })
    followingDays[i] = {
      day: date.day,
      date,
      dayOfWeek: date.dayOfWeek,
    }
  }
  return followingDays
}

export default function App() {
  const now = Temporal.Now
  const [targetMonth, setTargetMonth] = useState(now.plainDateISO())

  const daysInThisMonth = getDaysInThisMonth(
    Temporal.PlainDate.from({
      year: targetMonth.year,
      month: targetMonth.month,
      day: targetMonth.day,
    })
  )
  const previousDays = getPreviousDays(daysInThisMonth[0])
  const followingDays = getFollowingDays(daysInThisMonth.slice(-1)[0])

  const calendar = chunk<Day[]>(
    [...previousDays, ...daysInThisMonth, ...followingDays],
    7
  )

  const getDayStyle = (date: Day['date']) => {
    const stylingClassName = ['day']
    if (!Temporal.PlainDate.compare(date, now.plainDateISO())) {
      stylingClassName.push('today')
    }

    if (
      Temporal.PlainDate.compare(date, daysInThisMonth[0].date) < 0 ||
      Temporal.PlainDate.compare(date, daysInThisMonth.slice(-1)[0].date) > 0
    ) {
      stylingClassName.push('otherMonth')
    }

    return stylingClassName.join(' ')
  }

  const monthDateFormater = new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'numeric',
  })
  const inputRef = useRef<HTMLInputElementWithShowPicker>(null)

  return (
    <>
      <h1>Month: {targetMonth.toPlainYearMonth().toString()}</h1>
      <button onClick={() => inputRef?.current?.showPicker()}>
        select month
      </button>
      <input
        type='month'
        ref={inputRef}
        onChange={(e) => {
          const [year, month] = e.target.value
            .split('-')
            .map((val) => Number(val))
          setTargetMonth(Temporal.PlainDate.from({ year, month, day: 1 }))
        }}
      />
      <button
        type='button'
        onClick={() => {
          setTargetMonth(targetMonth.subtract({ months: 1 }))
        }}
      >
        &lt; previous month
      </button>
      <button
        type='button'
        onClick={() => {
          setTargetMonth(targetMonth.add({ months: 1 }))
        }}
      >
        following month &gt;
      </button>
      <button
        type='button'
        onClick={() => {
          setTargetMonth(now.plainDateISO())
        }}
      >
        current month
      </button>
      <div className='calendar'>
        <div className='week'>
          {weeks.map((day) => (
            <div className='date' key={day}>
              {day}
            </div>
          ))}
        </div>
        {calendar.map((week, i) => (
          <div className='week' key={i}>
            {week.map((day) => (
              <div className={getDayStyle(day.date)} key={day.date.toString()}>
                {day.day === 1 ? monthDateFormater.format(day.date) : day.day}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
