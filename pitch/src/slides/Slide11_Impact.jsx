import { motion } from 'framer-motion';
import { Building2, ShieldCheck, TreePine, Zap, Check } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.15 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const impacts = [
  {
    icon: Building2,
    title: 'Businesses Stay Operational',
    desc: 'Companies continue production while offsetting emissions — zero shutdowns, zero job losses.',
    color: '#22c55e',
    stat: '100%',
    statLabel: 'Uptime',
  },
  {
    icon: ShieldCheck,
    title: 'Government Compliance',
    desc: 'Meet regulatory requirements on time through verified carbon credit purchases.',
    color: '#3b82f6',
    stat: '40%',
    statLabel: 'Reduction Achieved',
  },
  {
    icon: TreePine,
    title: 'Environment Benefits',
    desc: 'Every credit purchased funds real green projects — reforestation, renewable energy, carbon capture.',
    color: '#22c55e',
    stat: '12K',
    statLabel: 'Tons CO₂ Offset',
  },
  {
    icon: Zap,
    title: 'Faster Transition',
    desc: 'Carbon credits buy time for companies to gradually adopt sustainable practices.',
    color: '#fbbf24',
    stat: '6x',
    statLabel: 'Faster Compliance',
  },
];

export default function Slide11_Impact() {
  return (
    <div className="slide" style={{ background: '#080f0c' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <div className="solution-overlay" />

      {/* Floating leaves */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${10 + Math.random() * 80}%`,
            top: `${Math.random() * 100}%`,
            fontSize: '1.2rem',
            opacity: 0.08,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          🍃
        </motion.div>
      ))}

      <motion.div
        className="slide-content center-text"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div variants={fadeUp} className="slide-label">
          The Impact
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          Everyone <span className="text-gradient-green">Wins</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle center-text mx-auto">
          CarbonEase creates value for businesses, governments, and the planet.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-48 grid-2"
          style={{ maxWidth: 900, width: '100%' }}
        >
          {impacts.map(({ icon: Icon, title, desc, color, stat, statLabel }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.2 }}
              whileHover={{ y: -4 }}
              style={{
                display: 'flex',
                gap: 20,
                padding: 24,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 16,
                textAlign: 'left',
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${color}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <Icon size={22} color={color} />
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color,
                }}>
                  {stat}
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {statLabel}
                </div>
              </div>
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Check size={16} color="#22c55e" />
                  {title}
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  lineHeight: 1.7,
                }}>
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
