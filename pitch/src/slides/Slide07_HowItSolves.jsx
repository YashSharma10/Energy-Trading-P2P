import { motion } from 'framer-motion';
import { Factory, ArrowRight, ShieldCheck, BarChart3, CreditCard, Leaf } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.15 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const flowSteps = [
  { icon: Factory, label: 'Calculate\nEmissions', color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
  { icon: BarChart3, label: 'Analyze on\nCarbonEase', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  { icon: CreditCard, label: 'Buy Carbon\nCredits', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  { icon: ShieldCheck, label: 'Achieve\nCompliance', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
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
          Chapter 6 — The Transformation
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          How ABC <span className="text-gradient-green">Survived</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle center-text mx-auto">
          From non-compliance to full regulatory compliance — without shutting down a single factory.
        </motion.p>

        {/* Flow diagram */}
        <motion.div
          variants={fadeUp}
          className="mt-48"
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
              transition={{ delay: 0.8 + i * 0.3, duration: 0.6 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.05 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  padding: '24px 28px',
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${color}30`,
                  borderRadius: 16,
                  minWidth: 140,
                  cursor: 'default',
                }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={24} color={color} />
                </div>
                <span style={{
                  fontSize: '0.85rem',
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
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                }}>
                  Step {i + 1}
                </span>
              </motion.div>

              {i < flowSteps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 1.2 + i * 0.3, duration: 0.4 }}
                  style={{ padding: '0 8px' }}
                >
                  <ArrowRight size={20} color="var(--green-400)" style={{ opacity: 0.5 }} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Result summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mt-48"
          style={{
            display: 'flex',
            gap: 40,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '12K', unit: 'tons', label: 'CO₂ Offset', color: '#22c55e' },
            { value: '100%', unit: '', label: 'Compliance', color: '#22c55e' },
            { value: '₹0', unit: '', label: 'Penalty Paid', color: '#fbbf24' },
            { value: '0', unit: '', label: 'Jobs Lost', color: '#22c55e' },
          ].map(({ value, unit, label, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.4 + i * 0.15 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 900,
                color,
              }}>
                {value}
                <span style={{ fontSize: '0.9rem', fontWeight: 500, marginLeft: 2 }}>{unit}</span>
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginTop: 4,
                fontFamily: 'var(--font-mono)',
              }}>
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Leaf decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 2 }}
          style={{
            position: 'absolute',
            bottom: 60,
            right: 60,
          }}
        >
          <Leaf size={80} color="#22c55e" />
        </motion.div>
      </motion.div>
    </div>
  );
}
