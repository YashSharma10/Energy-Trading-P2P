import { motion } from 'framer-motion';
import { Server, Database, Shield, Search, Code2, Layers, Lock, Cpu } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const techStack = [
  { icon: Code2, name: 'React.js', category: 'Frontend', color: '#61dafb' },
  { icon: Server, name: 'Node.js', category: 'Backend', color: '#68a063' },
  { icon: Server, name: 'Express.js', category: 'API Layer', color: '#f5f5f5' },
  { icon: Database, name: 'MongoDB', category: 'Database', color: '#4db33d' },
  { icon: Layers, name: 'Microservices', category: 'Architecture', color: '#a855f7' },
  { icon: Search, name: 'ELK Stack', category: 'Logging', color: '#f7b93e' },
  { icon: Lock, name: 'JWT Auth', category: 'Security', color: '#ef4444' },
  { icon: Cpu, name: 'AI/ML Engine', category: 'Intelligence', color: '#22c55e' },
];

function ArchitectureDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      style={{
        maxWidth: 700,
        margin: '0 auto',
        padding: 24,
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
        position: 'relative',
      }}
    >
      {/* Layers */}
      {[
        { label: 'Client Layer', items: ['React.js', 'Responsive UI', 'Framer Motion'], color: '#61dafb', y: 0 },
        { label: 'API Gateway', items: ['Express.js', 'JWT Auth', 'Rate Limiting'], color: '#f5f5f5', y: 1 },
        { label: 'Service Layer', items: ['User Service', 'Trading Service', 'AI Service'], color: '#a855f7', y: 2 },
        { label: 'Data Layer', items: ['MongoDB', 'Redis Cache', 'ELK Logs'], color: '#4db33d', y: 3 },
      ].map(({ label, items, color, y }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 + y * 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: y < 3 ? 12 : 0,
            padding: '12px 16px',
            background: `${color}08`,
            border: `1px solid ${color}20`,
            borderRadius: 10,
          }}
        >
          <div style={{
            minWidth: 110,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 600,
            color,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}>
            {label}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {items.map((item) => (
              <span
                key={item}
                style={{
                  padding: '4px 10px',
                  background: `${color}10`,
                  borderRadius: 6,
                  fontSize: '0.73rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Connection lines between layers */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`conn-${i}`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.5 + i * 0.15 }}
          style={{
            position: 'absolute',
            left: 75,
            top: 44 + i * 62,
            width: 2,
            height: 12,
            background: 'rgba(255,255,255,0.08)',
            transformOrigin: 'top',
          }}
        />
      ))}
    </motion.div>
  );
}

export default function Slide10_TechStack() {
  return (
    <div className="slide" style={{ background: '#0a0a12' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />

      <motion.div
        className="slide-content center-text"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div variants={fadeUp} className="slide-label">
          Under the Hood
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          Built with <span className="text-gradient-green">Precision</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle center-text mx-auto">
          Enterprise-grade architecture designed for scale, security, and performance.
        </motion.p>

        {/* Tech stack grid */}
        <motion.div
          variants={fadeUp}
          className="mt-32 grid-4"
          style={{ maxWidth: 900, width: '100%' }}
        >
          {techStack.map(({ icon: Icon, name, category, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.05 }}
              style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'default',
              }}
            >
              <Icon size={22} color={color} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {name}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {category}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Architecture diagram */}
        <motion.div variants={fadeUp} className="mt-32" style={{ width: '100%' }}>
          <ArchitectureDiagram />
        </motion.div>
      </motion.div>
    </div>
  );
}
