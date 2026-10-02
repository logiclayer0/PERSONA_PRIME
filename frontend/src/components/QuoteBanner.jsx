import { useEffect, useState } from 'react'
import { QUOTES } from '../data/quotes'

export default function QuoteBanner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="quote-banner">
      <p className="quote-text">"{QUOTES[index]}"</p>
    </div>
  )
}