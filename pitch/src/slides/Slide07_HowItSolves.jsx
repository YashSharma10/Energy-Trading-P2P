import { motion } from 'framer-motion';
import { Factory, ArrowRight, ShieldCheck, BarChart3, CreditCard, CheckCircle, X } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.15 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Gap & Innovation comparison from poster
const comparison = [
  { label: 'Manual', existing: true, carbonease: false, ceLabel: 'Automated' },
  { label: 'No-AI', existing: true, carbonease: false, ceLabel: 'AI Powered' },
  { label: 'Complex', existing: true, carbonease: false, ceLabel: 'User-Friendly' },
  { label: 'Fragmented', existing: true, carbonease: false, ceLabel: 'Integrated' },
];

const flowSteps = [
  { icon: Factory,     label: 'Emission\nReduction Projects', color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
  { icon: ShieldCheck, label: 'Verification\n& Certification',  color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  { icon: CreditCard,  label: 'Credits\nGenerated',             color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  { icon: BarChart3,   label: 'Trading on\nCarbonEase',         color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  { icon: CheckCircle, label: 'Impact &\nReporting',            color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
];

export default function Slide07_HowItSolves() {
  return (
    <div className="slide" style={{ background: '#080f0c' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <div className="solution-overlay" />

      <motion.div
        className="slide-content center-text"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div variants={fadeUp} className="slide-label">
          Gap &amp; Innovation
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          Carbon Credit <span className="text-gradient-green">Lifecycle</span>
        </motion.h2>

        {/* Flow diagram */}
        <motion.div
          variants={fadeUp}
          className="mt-32"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            flexWrap: 'wrap',
          }}
        >
          {flowSteps.map(({ icon: Icon, label, color, bg }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.25, duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.05 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  padding: '20px 22px',
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${color}30`,
                  borderRadius: 14,
                  minWidth: 120,
                  cursor: 'default',
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={22} color={color} />
                </div>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.4,
                }}>
                  {label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  color: 'var(--text-muted)',
                }}>
                  Step {i + 1}
                </span>
              </motion.div>

              {i < flowSteps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 1 + i * 0.25 }}
                  style={{ padding: '0 6px' }}
                >
                  <ArrowRight size={18} color="var(--green-400)" style={{ opacity: 0.5 }} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Gap & Innovation table */}
        <motion.div
          variants={fadeUp}
          className="mt-32"
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {comparison.map(({ label, ceLabel }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 + i * 0.12 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 100,
                fontSize: '0.82rem',
              }}
            >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                color: 'var(--text-muted)',
                textDecoration: 'line-through',
              }}>
                <X size={12} color="#ef4444" />
                {label}
              </span>
              <ArrowRight size={12} color="var(--green-400)" />
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                color: '#4ade80',
                fontWeight: 600,
              }}>
                <CheckCircle size={12} color="#22c55e" />
                {ceLabel}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
