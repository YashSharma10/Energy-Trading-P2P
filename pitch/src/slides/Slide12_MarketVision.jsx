import { motion } from 'framer-motion';
import { Building2, Landmark, Globe, ArrowUpRight, Target } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.15 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const markets = [
  {
    icon: Building2,
    title: 'Enterprises',
    desc: 'Large-scale manufacturers, energy producers, and industrial conglomerates managing compliance and offset obligations.',
    size: '$50B+',
    color: '#22c55e',
  },
  {
    icon: Landmark,
    title: 'Governments',
    desc: 'Regulatory bodies, environmental agencies, and carbon tax frameworks seeking digital enforcement tools.',
    size: '$30B+',
    color: '#3b82f6',
  },
  {
    icon: Globe,
    title: 'Global Carbon Markets',
    desc: 'International emission trading systems, voluntary carbon markets, and cross-border credit exchanges.',
    size: '$980B',
    color: '#a855f7',
  },
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
          Market Vision
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          A <span className="text-gradient-green">Trillion-Dollar</span> Opportunity
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle center-text mx-auto">
          The global carbon credit market is projected to reach $980B by 2030. CarbonEase is positioned to capture this growth.
        </motion.p>

        {/* Market size visual */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-32"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 24,
            height: 140,
          }}
        >
          {[
            { label: '2020', value: 30, color: '#333' },
            { label: '2022', value: 45, color: '#444' },
            { label: '2024', value: 65, color: '#555' },
            { label: '2026', value: 80, color: '#22c55e66' },
            { label: '2028', value: 110, color: '#22c55e99' },
            { label: '2030', value: 140, color: '#22c55e' },
          ].map(({ label, value, color }, i) => (
            <motion.div
              key={i}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: value }}
                transition={{ duration: 1, delay: 0.9 + i * 0.15 }}
                style={{
                  width: 50,
                  background: color,
                  borderRadius: '6px 6px 0 0',
                  position: 'relative',
                }}
              >
                {i === 5 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 }}
                    style={{
                      position: 'absolute',
                      top: -28,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: '#22c55e',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    $980B
                  </motion.div>
                )}
              </motion.div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Market segments */}
        <motion.div
          variants={fadeUp}
          className="mt-48 grid-3"
          style={{ maxWidth: 1000, width: '100%' }}
        >
          {markets.map(({ icon: Icon, title, desc, size, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + i * 0.2 }}
              whileHover={{ y: -6 }}
              style={{
                padding: 28,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 16,
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${color}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={22} color={color} />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}>
                  {size}
                  <ArrowUpRight size={16} />
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10 }}>
                {title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
