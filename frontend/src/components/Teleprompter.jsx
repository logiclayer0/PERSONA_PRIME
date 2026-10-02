export default function Teleprompter({ text }) {
  if (!text) return null
  return (
    <div className="teleprompter">
      {text}
    </div>
  )
}