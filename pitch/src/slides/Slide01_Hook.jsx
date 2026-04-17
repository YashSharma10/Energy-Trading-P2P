import { motion } from 'framer-motion';

const smokeVariants = {
  animate: (i) => ({
    y: [0, -60 - i * 20, -120 - i * 20],
    x: [0, (i % 2 === 0 ? 15 : -15), (i % 2 === 0 ? 30 : -30)],
    scaleX: [1, 1.3, 1.8],
    opacity: [0.5, 0.25, 0],
    transition: {
      duration: 3 + i * 0.5,
      repeat: Infinity,
      ease: 'easeOut',
      delay: i * 0.8,
    },
  }),
};

function FactorySVG() {
  return (
    <svg viewBox="0 0 800 400" style={{ width: '100%', maxWidth: 550, margin: '0 auto', display: 'block' }}>
      {/* Sky gradient */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#16161f" />
        </linearGradient>
        <linearGradient id="smokeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#666" stopOpacity="0" />
          <stop offset="100%" stopColor="#444" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      
      {/* Background buildings */}
      <rect x="50" y="180" width="80" height="220" rx="2" fill="#1e1e2d" />
      <rect x="55" y="190" width="15" height="10" rx="1" fill="#2a2a3a" opacity="0.5" />
      <rect x="75" y="190" width="15" height="10" rx="1" fill="#2a2a3a" opacity="0.3" />
      <rect x="55" y="210" width="15" height="10" rx="1" fill="#2a2a3a" opacity="0.4" />
      <rect x="75" y="210" width="15" height="10" rx="1" fill="#2a2a3a" opacity="0.6" />
      
      <rect x="150" y="150" width="60" height="250" rx="2" fill="#222233" />
      <rect x="680" y="200" width="70" height="200" rx="2" fill="#1e1e2d" />
      
      {/* Main factory building */}
      <rect x="250" y="220" width="300" height="180" rx="4" fill="#252538" stroke="#333" strokeWidth="1" />
      
      {/* Factory windows */}
      {[0, 1, 2, 3].map(i => (
        <rect key={`w1-${i}`} x={270 + i * 70} y="240" width="40" height="25" rx="2" fill="#fbbf2422" stroke="#fbbf2433" strokeWidth="0.5" />
      ))}
      {[0, 1, 2, 3].map(i => (
        <rect key={`w2-${i}`} x={270 + i * 70} y="280" width="40" height="25" rx="2" fill="#fbbf2411" stroke="#fbbf2422" strokeWidth="0.5" />
      ))}
      
      {/* Factory door */}
      <rect x="370" y="340" width="60" height="60" rx="3" fill="#1a1a28" stroke="#333" strokeWidth="1" />
      
      {/* Chimneys */}
      <rect x="290" y="140" width="30" height="80" rx="2" fill="#333348" stroke="#444" strokeWidth="0.5" />
      <rect x="370" y="120" width="35" height="100" rx="2" fill="#333348" stroke="#444" strokeWidth="0.5" />
      <rect x="460" y="150" width="28" height="70" rx="2" fill="#333348" stroke="#444" strokeWidth="0.5" />
      
      {/* Smoke particles - animated via framer */}
      {[0, 1, 2].map(i => (
        <motion.circle
          key={`smoke1-${i}`}
          cx="305"
          cy="140"
          r={8 + i * 4}
          fill="#55555566"
          custom={i}
          variants={smokeVariants}
          animate="animate"
        />
      ))}
      {[0, 1, 2].map(i => (
        <motion.circle
          key={`smoke2-${i}`}
          cx="387"
          cy="120"
          r={10 + i * 5}
          fill="#55555566"
          custom={i + 1}
          variants={smokeVariants}
          animate="animate"
        />
      ))}
      {[0, 1, 2].map(i => (
        <motion.circle
          key={`smoke3-${i}`}
          cx="474"
          cy="150"
          r={7 + i * 3}
          fill="#55555566"
          custom={i + 2}
          variants={smokeVariants}
          animate="animate"
        />
      ))}
      
      {/* Ground */}
      <rect x="0" y="398" width="800" height="2" fill="#333" />
      
      {/* Pollution haze */}
      <motion.rect
        x="0" y="100" width="800" height="80"
        fill="url(#smokeGrad)"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </svg>
  );
}

export default function Slide01_Hook() {
  return (
    <div className="slide" style={{ background: '#080810', padding: '40px 60px' }}>
      <div className="pollution-overlay" />
      <div className="bg-noise" />
      
      {/* Floating pollution particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
            background: `rgba(${150 + Math.random() * 100}, ${80 + Math.random() * 60}, ${40 + Math.random() * 40}, 0.3)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            x: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
      
      <div className="slide-content center-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="slide-label"
        >
          ● A Story of Survival
        </motion.div>

        <motion.h1
          className="slide-title xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          What happens when{' '}
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #ef4444, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            sustainability
          </span>{' '}
          becomes <br />
          <span style={{ color: '#f1f5f9' }}>urgent?</span>
        </motion.h1>

        <motion.p
          className="slide-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{ textAlign: 'center', margin: '10px auto 0' }}
        >
          A real-world problem. A billion-dollar opportunity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.5 }}
          style={{ marginTop: 20, width: '100%' }}
        >
          <FactorySVG />
        </motion.div>
      </div>
    </div>
  );
}
