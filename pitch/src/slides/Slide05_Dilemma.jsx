import { motion } from 'framer-motion';
import { XCircle, AlertOctagon, Skull } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.2 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const options = [
  {
    icon: XCircle,
    title: 'Shut Down Operations',
    description: 'Close factories to reduce emissions. But 500+ employees lose jobs. Revenue drops to zero. Company dies.',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.06)',
    borderColor: 'rgba(239,68,68,0.2)',
  },
  {
    icon: AlertOctagon,
    title: 'Pay Heavy Penalties',
    description: '₹50 Crore in fines — wiping out years of profit. Still doesn\'t solve the core emission problem.',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.06)',
    borderColor: 'rgba(245,158,11,0.2)',
  },
  {
    icon: Skull,
    title: 'Risk Reputation Damage',
    description: 'Public naming & shaming. Investors pull out. Clients switch to competitors. Brand is destroyed.',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.06)',
    borderColor: 'rgba(239,68,68,0.2)',
  },
];

export default function Slide05_Dilemma() {
  return (
    <div className="slide" style={{ background: '#0a0810' }}>
      <div className="bg-noise" />
      
      {/* Tense ambient */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 80%, rgba(239,68,68,0.05), transparent 60%)',
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <motion.div
        className="slide-content center-text"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div variants={fadeUp} className="slide-label">
          The Dilemma
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          Every option leads to{' '}
          <span className="text-gradient-red">destruction</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle center-text mx-auto">
          Ease Manufacturing is trapped. Every traditional path leads to failure.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-48"
          style={{
            display: 'flex',
            gap: 24,
            maxWidth: 1000,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {options.map(({ icon: Icon, title, description, color, bgColor, borderColor }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.6 + i * 0.25 }}
              whileHover={{ y: -6, scale: 1.02 }}
              style={{
                flex: '1 1 280px',
                maxWidth: 320,
                background: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: 16,
                padding: 28,
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* X overlay */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.06, scale: 1 }}
                transition={{ delay: 1.5 + i * 0.2, duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '8rem',
                  fontWeight: 900,
                  color,
                  lineHeight: 1,
                  fontFamily: 'var(--font-display)',
                }}
              >
                ✕
              </motion.div>

              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Icon size={22} color={color} />
              </div>

              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                {title}
                <span style={{ color, fontSize: '1.2rem' }}>✕</span>
              </h3>

              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.88rem',
                lineHeight: 1.7,
              }}>
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tension line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-48"
        >
          <motion.div
            style={{
              padding: '16px 36px',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: 12,
              background: 'rgba(251, 191, 36, 0.1)',
            }}
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 15px rgba(251, 191, 36, 0.15)',
                '0 0 35px rgba(251, 191, 36, 0.45)',
                '0 0 15px rgba(251, 191, 36, 0.15)'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-secondary)',
            }}>
              Is there <span style={{ color: '#fbbf24' }}>another way?</span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
