import { motion } from 'framer-motion';
import { Server, Users, Globe, ArrowUpRight, TrendingUp } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.15 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

// Infrastructure pricing tiers from poster
const tiers = [
  { users: '100 Users',  cost: '₹3,000 – ₹8,000',  driver: 'Gemini Testing', aiCost: '₹0.02 – ₹0.05' },
  { users: '1K Users',   cost: '₹1,000 – ₹7,000',  driver: 'Predictions',    aiCost: '₹0.02 – ₹0.05' },
  { users: '10K Users',  cost: '₹60K – ₹1.8L',     driver: 'Predictions',    aiCost: '₹0.02 – ₹0.05' },
  { users: '100K Users', cost: '₹3.5L – ₹9L',      driver: 'Enterprise Security', aiCost: '₹0.02 – ₹0.05' },
];

export default function Slide12_MarketVision() {
  return (
    <div className="slide" style={{ background: '#080c10' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 60%, rgba(34,197,94,0.05), transparent 60%)',
        }}
      />

      <motion.div
        className="slide-content center-text"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div variants={fadeUp} className="slide-label">
          Global Carbon Market on the Rise
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          A{' '}
          <span className="text-gradient-green">$50B+</span>{' '}
          Market by 2030
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle center-text mx-auto">
          The global carbon credit market is projected to reach $50B+ by 2030 — Source: World Bank.
          CarbonEase is built to scale with it.
        </motion.p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          maxWidth: 960,
          width: '100%',
          marginTop: 32,
        }}>
          {/* Market growth chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              padding: 24,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 16,
            }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 16,
            }}>
              Market Growth (USD)
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 10,
              height: 120,
            }}>
              {[
                { label: '2020', value: 22, color: '#333' },
                { label: '2022', value: 38, color: '#444' },
                { label: '2024', value: 55, color: '#22c55e55' },
                { label: '2026', value: 72, color: '#22c55e88' },
                { label: '2028', value: 88, color: '#22c55eaa' },
                { label: '2030', value: 100, color: '#22c55e' },
              ].map(({ label, value, color }, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.8 + i * 0.12 }}
                    style={{
                      width: '100%',
                      background: color,
                      borderRadius: '4px 4px 0 0',
                      position: 'relative',
                    }}
                  >
                    {i === 5 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        style={{
                          position: 'absolute',
                          top: -22,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          color: '#22c55e',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        $50B+
                      </motion.div>
                    )}
                  </motion.div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Infrastructure pricing table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              padding: 24,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 16,
            }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 16,
            }}>
              Infrastructure Pricing (INR)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr 1fr 0.8fr',
                gap: 8,
                padding: '6px 10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                <span>Milestone</span>
                <span>Monthly Cost</span>
                <span>Key Driver</span>
                <span>AI/Query</span>
              </div>
              {tiers.map(({ users, cost, driver, aiCost }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.12 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.2fr 1fr 0.8fr',
                    gap: 8,
                    padding: '10px 10px',
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: '#22c55e',
                  }}>
                    {users}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {cost}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {driver}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {aiCost}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
