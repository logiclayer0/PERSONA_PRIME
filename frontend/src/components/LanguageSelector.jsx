import { useState } from 'react'

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German']

export default function LanguageSelector() {
  const [lang, setLang] = useState('English')

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      className="input-field input-field-sm"
      style={{ width: 'auto' }}
    >
      {LANGUAGES.map((l) => (
        <option key={l} value={l}>{l}</option>
      ))}
    </select>
  )
}