export default function SettingsModal({ open, onClose }) {
  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Settings</h3>
        <div className="modal-body">
          <div>
            <label className="modal-label">Display Name</label>
            <input className="input-field" />
          </div>
          <div>
            <label className="modal-label">Language</label>
            <select className="input-field">
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>
        </div>
        <button onClick={onClose} className="btn-primary w-full mt-6">
          Save
        </button>
      </div>
    </div>
  )
}