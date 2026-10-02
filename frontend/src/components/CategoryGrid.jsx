import { CATEGORIES } from '../data/categories'

export default function CategoryGrid({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {CATEGORIES.map((cat) => {
        const active = selected === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`p-5 rounded-xl border text-left h-28 transition-all duration-200 ${
              active
                ? 'border-prime-accent bg-purple-950/40 shadow-md shadow-purple-900/30'
                : 'border-prime-border bg-prime-card hover:border-prime-accent/40'
            }`}
          >
            <div className="text-2xl">{cat.icon}</div>
            <div className={`text-xs font-bold mt-3 ${active ? 'text-white' : 'text-prime-muted'}`}>
              {cat.label}
            </div>
          </button>
        )
      })}
    </div>
  )
}