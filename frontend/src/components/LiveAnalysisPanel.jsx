export default function LiveAnalysisPanel({ vision, audio }) {
  const gestureLabels = {
    idle: "Idle",
    fist: "Fist",
    open_palm: "Open Palm",
    pointing: "Pointing",
    peace: "Peace",
    thumbs_up: "Thumbs Up",
    three: "3 Fingers",
    four: "4 Fingers",
    other: "Other"
  }

  return (
    <div className="live-panel">
      <h4 className="live-panel-title">Live Analysis</h4>

      {vision && (
        <>
          <div className="live-metric">
            <span className="live-metric-label">Posture</span>
            <span className="live-metric-value">{vision.posture}</span>
          </div>
          <div className="live-metric">
            <span className="live-metric-label">Eye Contact</span>
            <span className="live-metric-value">{vision.eye_contact}</span>
          </div>
          <div className="live-metric">
            <span className="live-metric-label">Focus</span>
            <span className="live-metric-value">{vision.focus}</span>
          </div>
          <div className="live-metric">
            <span className="live-metric-label">Hands</span>
            <span className="live-metric-value">{vision.hand_count || 0}</span>
          </div>
          <div className="live-metric">
            <span className="live-metric-label">Gesture</span>
            <span className="live-metric-value">
              {gestureLabels[vision.gesture] || vision.gesture || "Idle"}
            </span>
          </div>
          {vision.nervous && (
            <div className="live-metric live-metric-warn">
              <span className="live-metric-label">Nervous Movement</span>
              <span className="live-metric-value">Detected</span>
            </div>
          )}
        </>
      )}

      {audio && (
        <>
          <div className="live-metric">
            <span className="live-metric-label">Speech</span>
            <span className="live-metric-value">{audio.speech_performance}</span>
          </div>
          <div className="live-metric">
            <span className="live-metric-label">WPM</span>
            <span className="live-metric-value">{audio.wpm}</span>
          </div>
          <div className="live-metric">
            <span className="live-metric-label">Fillers</span>
            <span className="live-metric-value">{audio.total_fillers_detected}</span>
          </div>
        </>
      )}

      {!vision && !audio && (
        <p className="live-empty">Waiting for data...</p>
      )}
    </div>
  )
}