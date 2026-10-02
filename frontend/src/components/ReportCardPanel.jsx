export default function ReportCardPanel({ report }) {
  if (!report) return null

  return (
    <div className="bg-prime-card border border-prime-border rounded-xl p-6 space-y-4">
      <h3 className="text-prime-accent font-bold text-lg uppercase tracking-widest">Session Report</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-black/50 p-3 rounded">
          <p className="text-prime-muted text-xs">Final Status</p>
          <p className="text-white font-bold">{report.final_status}</p>
        </div>
        <div className="bg-black/50 p-3 rounded">
          <p className="text-prime-muted text-xs">Posture</p>
          <p className="text-white font-bold">{report.posture_status}</p>
        </div>
        <div className="bg-black/50 p-3 rounded">
          <p className="text-prime-muted text-xs">Eye Contact</p>
          <p className="text-white font-bold">{report.eye_contact_status}</p>
        </div>
        <div className="bg-black/50 p-3 rounded">
          <p className="text-prime-muted text-xs">Speech</p>
          <p className="text-white font-bold">{report.speech_status}</p>
        </div>
      </div>
    </div>
  )
}