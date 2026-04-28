import { motion } from 'framer-motion';
import { Factory, TrendingUp, Flame, Building2, MapPin, IndianRupee, AlertTriangle } from 'lucide-react';

const stagger = {
  animate: { transition: { staggerChildren: 0.15 } },
};
const fadeUp = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};
const fadeUpCards = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

function GrowthChart() {
  const bars = [35, 45, 50, 62, 70, 78, 85, 92];
  return (
    <div className="bar-chart" style={{ height: 60, gap: 6, padding: 0 }}>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="bar"
          style={{ background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)', borderRadius: '4px 4px 0 0' }}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
        />
      ))}
    </div>
  );
}

export default function Slide02_Story() {
  return (
    <div className="slide" style={{ background: '#0a0a0f', padding: '60px 80px', alignItems: 'center' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      
      {/* Industrial ambient glow */}
      <div className="bg-gradient-glow" style={{ opacity: 0.2, background: 'radial-gradient(circle at 70% 50%, rgba(245, 158, 11, 0.15), transparent 60%)' }} />

      <motion.div
        className="slide-content"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'center', maxWidth: 1300 }}
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {/* Left Column: Story Intro */}
        <motion.div variants={stagger}>
          <motion.div variants={fadeUp} className="badge mb-24" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            The Story Begins
          </motion.div>

          <motion.h2 variants={fadeUp} className="slide-title" style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: 24 }}>
            Meet <br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24, #ea580c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Ease Manufacturing Pvt. Ltd.
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} className="slide-subtitle" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: 40, marginTop: 0 }}>
            A highly profitable, growing industrial powerhouse — but bound by traditional processes and heavily dependent on fossil fuels.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: MapPin, label: 'HQ: Gurugram, India' },
              { icon: Building2, label: 'Sector: Heavy Manufacturing' },
              { icon: IndianRupee, label: 'Valued at ₹500 Cr' },
            ].map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  color: 'var(--text-primary)',
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  background: 'rgba(255,255,255,0.02)',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ color: '#94a3b8' }}>
                  <Icon size={20} />
                </div>
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column: Bento Grid of Data */}
        <motion.div variants={stagger} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          
          {/* Top Left: Industrial Scale */}
          <motion.div
            variants={fadeUpCards}
            className="glass-card"
            style={{ padding: '32px', background: 'rgba(255,255,255,0.02)' }}
            whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <div className="icon-circle" style={{ background: 'rgba(148, 163, 184, 0.1)', color: '#cbd5e1', width: 48, height: 48, marginBottom: 20 }}>
              <Factory size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: 12 }}>
              Industrial Scale
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              3 manufacturing plants, 500+ employees, producing 24/7 with heavy machinery.
            </p>
          </motion.div>

          {/* Top Right: Rapid Growth */}
          <motion.div
            variants={fadeUpCards}
            className="glass-card"
            style={{ padding: '32px', background: 'rgba(255,255,255,0.02)' }}
            whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.3)', boxShadow: '0 0 30px rgba(59, 130, 246, 0.15)' }}
          >
            <div className="icon-circle" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', width: 48, height: 48, marginBottom: 20 }}>
              <TrendingUp size={24} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: 4 }}>
                  Rapid Growth
                </h3>
                <p style={{ color: '#60a5fa', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                  Revenue YoY +240%
                </p>
              </div>
            </div>
            <GrowthChart />
          </motion.div>

          {/* Bottom Full: Heavy Emissions */}
          <motion.div
            variants={fadeUpCards}
            className="glass-card"
            style={{ gridColumn: '1 / -1', padding: '32px 40px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(153, 27, 27, 0.1) 100%)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
            whileHover={{ y: -5, borderColor: 'rgba(239, 68, 68, 0.4)', boxShadow: '0 0 40px rgba(239, 68, 68, 0.15)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div className="icon-circle icon-circle-red" style={{ width: 64, height: 64, flexShrink: 0, margin: 0 }}>
                <Flame size={32} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 8, color: '#f87171' }}>
                  The Hidden Cost: Heavy Emissions
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.5 }}>
                  12,000+ tons CO₂ generated annually. As the company scales, their carbon footprint is growing exponentially, threatening compliance and future viability.
                </p>
              </div>
              <motion.div
                style={{
                  padding: '12px 24px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  borderRadius: 12,
                  color: '#ef4444',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  flexShrink: 0
                }}
                animate={{ 
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 15px rgba(239, 68, 68, 0.2)',
                    '0 0 35px rgba(239, 68, 68, 0.6)',
                    '0 0 15px rgba(239, 68, 68, 0.2)'
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <AlertTriangle size={20} /> CRITICAL LEVELS
              </motion.div>
            </div>
          </motion.div>

        </motion.div>
      </motion.div>
    </div>
  );
}
