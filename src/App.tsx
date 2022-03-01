import { Temporal } from '@js-temporal/polyfill'

function App() {
  const now = Temporal.Now
  return (
    <>
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
    </>
  )
}
export default App
