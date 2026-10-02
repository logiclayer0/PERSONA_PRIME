export default function StreakCalendar({ streak = 0 }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const today = new Date().getDay()
  const todayIndex = today === 0 ? 6 : today - 1

  return (
    <div className="streak-calendar">
      {days.map((day, i) => {
        const isPast = i <= todayIndex && streak > 0 && (todayIndex - i) < streak
        const isToday = i === todayIndex
        return (
          <div key={day} className="streak-day-wrap">
            <div className={`streak-day ${isPast ? 'streak-day-active' : ''} ${isToday ? 'streak-day-today' : ''}`}>
              {isPast ? '🔥' : ''}
            </div>
            <span className="streak-day-label">{day}</span>
          </div>
        )
      })}
    </div>
  )
}