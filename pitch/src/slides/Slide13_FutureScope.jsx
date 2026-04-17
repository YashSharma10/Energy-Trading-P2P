import { motion } from 'framer-motion';
import { Link2, Radio, BarChart2, Smartphone, Rocket } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.15 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const futureItems = [
  {
    icon: Link2,
    title: 'Blockchain Integration',
    desc: 'Transparent, immutable credit trading using smart contracts — ensuring trust and auditability.',
    color: '#a855f7',
    phase: 'Phase 1',
  },
  {
    icon: Radio,
    title: 'Real-time Carbon APIs',
    desc: 'Live emission data feeds for IoT-connected factories, enabling automated offset purchases.',
    color: '#3b82f6',
    phase: 'Phase 2',
  },
  {
    icon: BarChart2,
    title: 'ESG Integrations',
    desc: 'Connect with ESG reporting frameworks and investor dashboards for comprehensive sustainability metrics.',
    color: '#22c55e',
    phase: 'Phase 3',
  },
  {
    icon: Smartphone,
    title: 'Mobile Application',
    desc: 'Trade credits, track emissions, and get AI insights on the go with native iOS & Android apps.',
    color: '#f59e0b',
    phase: 'Phase 4',
  },
];

export default function Slide13_FutureScope() {
  return (
    <div className="slide" style={{ background: '#080c12' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 30% 40%, rgba(168,85,247,0.05), transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(34,197,94,0.04), transparent 50%)',
        }}
      />

      <motion.div
        className="slide-content center-text"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div variants={fadeUp} className="badge badge-green mb-24">
          <Rocket size={14} /> ROADMAP
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          The <span className="text-gradient-green">Future</span> is Green
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle center-text mx-auto">
          CarbonEase is just getting started. Here's what's on the horizon.
        </motion.p>

        {/* Timeline */}
        <motion.div
          variants={fadeUp}
          className="mt-48"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            maxWidth: 700,
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            style={{
              position: 'absolute',
              left: 23,
              top: 0,
              bottom: 0,
              width: 2,
              background: 'linear-gradient(180deg, rgba(34,197,94,0.3), rgba(168,85,247,0.3))',
              transformOrigin: 'top',
            }}
          />

          {futureItems.map(({ icon: Icon, title, desc, color, phase }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.25 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                padding: '20px 0',
                position: 'relative',
              }}
            >
              {/* Timeline dot */}
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 0 0 ${color}00`,
                    `0 0 0 8px ${color}20`,
                    `0 0 0 0 ${color}00`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  zIndex: 2,
                }}
              >
                <Icon size={20} color={color} />
              </motion.div>

              {/* Content */}
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}>
                  {phase}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
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
