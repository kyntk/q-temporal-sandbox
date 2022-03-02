import { Temporal } from '@js-temporal/polyfill'
import { chunk } from './chunk'

const weeks = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]

interface Day {
  day: number
  date: Temporal.PlainDate
  dayOfWeek: number
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
  console.log('endDayOfThisMonth', endDayOfThisMonth)
  const followingDays: Day[] = []
  for (let i = 0; i < days; i++) {
    console.log('loop')
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
  const targetMonth = now.plainDateISO().add({ months: 1 })
  // .subtract({ months: 1 })
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

  return (
    <>
      <h1>Target Month: {targetMonth.toLocaleString()}</h1>
      <h2>Current DateTime Information</h2>
      <div>
        <span>DateTime:</span>
        <span>{now.plainDateTimeISO().toLocaleString()}</span>
      </div>
      <div>
        <span>Date:</span>
        <span>{now.plainDateISO().toLocaleString()}</span>
      </div>
      <div>
        <span>Time:</span>
        <span>{now.plainTimeISO().toLocaleString()}</span>
      </div>
      <div style={calendarStyle}>
        <div style={weekStyle}>
          {weeks.map((day) => (
            <div style={dateStyle} key={day}>
              {day}
            </div>
          ))}
        </div>
        {calendar.map((week, i) => (
          <div style={weekStyle} key={i}>
            {week.map((day) => (
              <div style={dayStyle} key={day.date.toString()}>
                {day.day === 1
                  ? day.date.toPlainMonthDay().toString()
                  : day.day}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

const borderColor = '#dadce0 1px solid'
const calendarStyle = { width: '100%', border: borderColor, marginTop: '24px' }
const weekStyle = {
  display: 'flex',
  borderBottom: borderColor,
  width: '100%',
}
const dateStyle = {
  width: '100%',
  'text-align': 'center',
  lineHeight: '24px',
  borderRight: borderColor,
}
const dayStyle = {
  width: '100%',
  'text-align': 'center',
  lineHeight: '96px',
  borderRight: borderColor,
}
