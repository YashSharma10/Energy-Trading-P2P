import { motion } from 'framer-motion';
import { Factory, TrendingUp, Flame, Building2 } from 'lucide-react';

const stagger = {
  animate: { transition: { staggerChildren: 0.15 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

function GrowthChart() {
  const bars = [35, 45, 50, 62, 70, 78, 85, 92];
  return (
    <div className="bar-chart" style={{ height: 100 }}>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="bar"
          style={{ background: `linear-gradient(180deg, #fbbf24, #f59e0b)` }}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
        />
      ))}
    </div>
  );
}

export default function Slide02_Story() {
  return (
    <div className="slide" style={{ background: '#0a0a12' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <div className="pollution-overlay" />

      <motion.div
        className="slide-content"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeUp} className="slide-label">
          Chapter 1 — The Story Begins
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          Meet <span className="text-gradient-green">ABC Manufacturing Ltd.</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle">
          A profitable, growing industrial company — but heavily dependent on traditional processes and fossil fuels.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-48">
          <div className="grid-3">
            {/* Factory Card */}
            <motion.div
              className="glass-card"
              whileHover={{ y: -4, borderColor: 'rgba(251, 191, 36, 0.3)' }}
            >
              <div className="icon-circle icon-circle-amber">
                <Factory size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>
                Industrial Scale
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                3 manufacturing plants, 500+ employees, producing 24/7 with heavy machinery
              </p>
            </motion.div>

            {/* Growth Card */}
            <motion.div
              className="glass-card"
              whileHover={{ y: -4, borderColor: 'rgba(251, 191, 36, 0.3)' }}
            >
              <div className="icon-circle icon-circle-green">
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>
                Rapid Growth
              </h3>
              <GrowthChart />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
                Revenue growth YoY — up 240%
              </p>
            </motion.div>

            {/* Emissions Card */}
            <motion.div
              className="glass-card"
              whileHover={{ y: -4, borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <div className="icon-circle icon-circle-red">
                <Flame size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>
                Heavy Emissions
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                12,000+ tons CO₂ annually — and rising with every expansion
              </p>
              <motion.div
                style={{
                  marginTop: 12,
                  padding: '8px 14px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  color: 'var(--red-400)',
                  fontFamily: 'var(--font-mono)',
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚠ Emissions exceeding safe limits
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom context */}
        <motion.div
          variants={fadeUp}
          className="mt-32 center-text"
          style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}
        >
          {[
            { icon: Building2, label: 'HQ: Mumbai, India' },
            { icon: Factory, label: 'Sector: Heavy Manufacturing' },
            { icon: TrendingUp, label: 'Valued at ₹500 Cr' },
          ].map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}
            >
              <Icon size={16} />
              {label}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
