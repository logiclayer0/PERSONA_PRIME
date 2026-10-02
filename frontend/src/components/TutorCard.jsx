export default function TutorCard({ tutor, isSelected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`tutor-card ${isSelected ? 'tutor-card-selected' : ''}`}
    >
      <div className="tutor-img-wrap">
        <img src={tutor.image} alt={tutor.name} className="tutor-img" />
      </div>
      <div className="tutor-body">
        <h3 className="tutor-name">{tutor.name}</h3>
        <p className="tutor-role">{tutor.role}</p>
        <p className="tutor-desc">{tutor.desc}</p>
        <button className={`tutor-btn ${isSelected ? 'tutor-btn-selected' : ''}`}>
          {isSelected ? 'SELECTED' : 'SELECT TUTOR'}
        </button>
      </div>
    </div>
  )
}