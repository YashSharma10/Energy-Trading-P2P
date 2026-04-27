import { motion } from 'framer-motion';
import { Factory, ArrowRight, ShieldCheck, BarChart3, CreditCard, CheckCircle, X, AlertTriangle } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.15 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const comparison = [
  { label: 'Manual', ceLabel: 'Automated' },
  { label: 'No-AI', ceLabel: 'AI Powered' },
  { label: 'Complex', ceLabel: 'User-Friendly' },
  { label: 'Fragmented', ceLabel: 'Integrated' },
];

const flowSteps = [
  { icon: Factory,     label: 'Emission\nReduction', color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
  { icon: ShieldCheck, label: 'Verification',  color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  { icon: CreditCard,  label: 'Credits\nGenerated',             color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  { icon: BarChart3,   label: 'Trading on\nCarbonEase',         color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  { icon: CheckCircle, label: 'Impact &\nReporting',            color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
];

const problems = [
  "Rising Global Carbon Emissions",
  "Net-Zero Difficult to Achieve",
  "Complex Carbon Credit Systems",
  "Lack of Transparency & Analytics"
];

export default function Slide07_HowItSolves() {
  return (
    <div className="slide" style={{ background: '#080f0c', padding: '40px 60px' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <div className="solution-overlay" />

      <motion.div
        className="slide-content center-text"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 1200 }}
      >
        <motion.div variants={fadeUp} className="badge badge-red mb-16">
          <AlertTriangle size={14} style={{ marginRight: 6 }} /> MARKET PROBLEM & MISSION
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title md" style={{ fontSize: '2.5rem' }}>
          Enabling Net-Zero Through <span className="text-gradient-green">Smart Carbon Markets</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle center-text mx-auto" style={{ marginTop: 12, marginBottom: 40, maxWidth: 800 }}>
          Four systemic failures block the world from reaching net-zero. We resolve them through a transparent, automated carbon credit lifecycle.
        </motion.p>

        {/* Systemic Failures (Compact) */}
        <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
           {problems.map((prob, i) => (
             <div key={i} style={{ padding: '10px 16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 8, fontSize: '0.85rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: 8 }}>
               <X size={14} /> {prob}
             </div>
           ))}
        </motion.div>

        <motion.div variants={fadeUp} className="badge badge-green mb-16">
          <CheckCircle size={14} style={{ marginRight: 6 }} /> Gap & Innovation: Carbon Credit Lifecycle
        </motion.div>

        {/* Flow diagram */}
        <motion.div
          variants={fadeUp}
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
              transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.05 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${color}30`,
                  borderRadius: 14,
                  minWidth: 120,
                  cursor: 'default',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={color} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                  {label}
                </span>
              </motion.div>

              {i < flowSteps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.8 + i * 0.15 }}
                  style={{ padding: '0 8px' }}
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
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          {comparison.map(({ label, ceLabel }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 100, fontSize: '0.8rem',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                {label}
              </span>
              <ArrowRight size={12} color="var(--green-400)" />
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#4ade80', fontWeight: 600 }}>
                {ceLabel}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
