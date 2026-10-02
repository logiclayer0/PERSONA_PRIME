export default function RobotAvatar({ tutor, isSpeaking, size = 'large' }) {
  if (!tutor) return null

  const isSmall = size === 'small'
  const scale = isSmall ? 0.6 : 1

  const color = tutor.color
  const colorSoft = tutor.colorSoft
  const isVladimir = tutor.id === 'vladimir'
  const isAurora = tutor.id === 'aurora'

  return (
    <div className={`robot-wrap robot-${tutor.id} ${isSpeaking ? 'robot-talking' : 'robot-idle'}`}>
      <svg
        viewBox="0 0 200 260"
        width={isSmall ? 60 : '100%'}
        height={isSmall ? 78 : '100%'}
        style={{ maxHeight: '100%' }}
      >
        <defs>
          <radialGradient id={`glow-${tutor.id}`}>
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`body-${tutor.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={colorSoft} stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <ellipse cx="100" cy="240" rx="60" ry="8" fill={`url(#glow-${tutor.id})`} />

        <g className="robot-antenna">
          <line x1="100" y1="30" x2="100" y2="55" stroke={colorSoft} strokeWidth="2.5" />
          {isAurora ? (
            <polygon
              points="100,18 106,26 100,34 94,26"
              fill={color}
              className="robot-antenna-tip"
            />
          ) : (
            <circle cx="100" cy="26" r={isVladimir ? 5 : 6} fill={color} className="robot-antenna-tip" />
          )}
        </g>

        <g className="robot-head">
          {isVladimir ? (
            <rect x="55" y="55" width="90" height="80" rx="12" fill={`url(#body-${tutor.id})`} stroke={colorSoft} strokeWidth="2" />
          ) : (
            <ellipse cx="100" cy="95" rx="48" ry="42" fill={`url(#body-${tutor.id})`} stroke={colorSoft} strokeWidth="2" />
          )}

          <g className="robot-eyes">
            <ellipse className="robot-eye robot-eye-left" cx="82" cy="92" rx="6" ry="7" fill={color} />
            <ellipse className="robot-eye robot-eye-right" cx="118" cy="92" rx="6" ry="7" fill={color} />
          </g>

          <g className="robot-mouth">
            {isVladimir ? (
              <rect className="robot-mouth-shape" x="88" y="112" width="24" height="3" rx="1.5" fill={color} />
            ) : (
              <path
                className="robot-mouth-shape"
                d="M 88 112 Q 100 118 112 112"
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}
          </g>

          {isSeraphina(tutor.id) && (
            <>
              <ellipse cx="55" cy="95" rx="5" ry="12" fill={colorSoft} opacity="0.6" />
              <ellipse cx="145" cy="95" rx="5" ry="12" fill={colorSoft} opacity="0.6" />
            </>
          )}
        </g>

        <g className="robot-body">
          {isVladimir ? (
            <rect x="60" y="145" width="80" height="70" rx="10" fill={`url(#body-${tutor.id})`} stroke={colorSoft} strokeWidth="2" />
          ) : (
            <rect x="62" y="145" width="76" height="68" rx="16" fill={`url(#body-${tutor.id})`} stroke={colorSoft} strokeWidth="2" />
          )}

          <g className="robot-badge">
            <rect x="88" y="168" width="24" height="24" rx="6" fill={color} opacity="0.15" />
            <rect x="88" y="168" width="24" height="24" rx="6" fill="none" stroke={color} strokeWidth="1.5" />
            <circle cx="100" cy="180" r="3" fill={color} className="robot-badge-dot" />
          </g>

          <g className="robot-arms">
            <rect x="42" y="155" width="12" height="45" rx="6" fill={`url(#body-${tutor.id})`} stroke={colorSoft} strokeWidth="1.5" className="robot-arm robot-arm-left" />
            <rect x="146" y="155" width="12" height="45" rx="6" fill={`url(#body-${tutor.id})`} stroke={colorSoft} strokeWidth="1.5" className="robot-arm robot-arm-right" />
          </g>
        </g>

        <g className="robot-legs">
          <rect x="76" y="213" width="16" height="22" rx="4" fill={`url(#body-${tutor.id})`} stroke={colorSoft} strokeWidth="1.5" />
          <rect x="108" y="213" width="16" height="22" rx="4" fill={`url(#body-${tutor.id})`} stroke={colorSoft} strokeWidth="1.5" />
        </g>
      </svg>

      {isSpeaking && (
        <div className="robot-speaking-indicator">
          <span className="robot-dot" />
          <span className="robot-dot" />
          <span className="robot-dot" />
        </div>
      )}
    </div>
  )
}

function isSeraphina(id) {
  return id === 'seraphina'
}