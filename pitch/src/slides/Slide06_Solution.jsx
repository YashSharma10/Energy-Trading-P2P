import { motion } from 'framer-motion';
import { Bot, ShoppingCart, Users, BarChart3, Smartphone, Leaf, Activity } from 'lucide-react';

// Inline CarbonEase logo — same as main site
function CarbonEaseLogo({ width = 220 }) {
  return (
    <svg
      width={width}
      height={width * 0.2}
      viewBox="0 0 400 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ceLogoGrad06" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7CD957" />
          <stop offset="100%" stopColor="#4EAF37" />
        </linearGradient>
      </defs>
      <g transform="translate(10, 15)">
        <path
          d="M 25 0 L 46 0 C 48.2 0 50 1.8 50 4 L 50 25 C 50 38.8 38.8 50 25 50 L 4 50 C 1.8 50 0 48.2 0 46 L 0 25 C 0 11.2 11.2 0 25 0 Z"
          fill="url(#ceLogoGrad06)"
        />
        <path d="M27 9 L11 28 H25 L23 41 L39 22 H25 L27 9 Z" fill="#ffffff" />
      </g>
      <text
        x="75"
        y="52"
        fontFamily="'Outfit', 'Inter', system-ui, sans-serif"
        fontSize="36"
        letterSpacing="-0.5px"
      >
        <tspan fill="#f1f5f9" fontWeight="800">Carbon</tspan>
        <tspan fill="#4ade80" fontWeight="500">Ease</tspan>
      </text>
    </svg>
  );
}

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const features = [
  {
    icon: Bot,
    number: '1',
    title: 'AI-Powered Marketplace',
    desc: 'Intelligent matching, recommendations & 24/7 support',
    color: '#22c55e',
  },
  {
    icon: ShoppingCart,
    number: '2',
    title: 'Buy, Sell & Manage Credits',
    desc: 'End-to-end lifecycle handling for carbon credits',
    color: '#3b82f6',
  },
  {
    icon: Users,
    number: '3',
    title: 'Role-Based Access',
    desc: 'Tailored dashboards for buyers & sellers',
    color: '#a855f7',
  },
  {
    icon: BarChart3,
    number: '4',
    title: 'Algorithmic Pricing',
    desc: 'Fair, data-driven pricing models',
    color: '#fbbf24',
  },
  {
    icon: Smartphone,
    number: '5',
    title: 'Intuitive UI',
    desc: 'Clean, user-friendly experience',
    color: '#60a5fa',
  },
  {
    icon: Leaf,
    number: '6',
    title: 'Eco-Shop',
    desc: 'Curated marketplace for sustainable products',
    color: '#4ade80',
  },
  {
    icon: Activity,
    number: '7',
    title: 'End-to-End Impact',
    desc: 'Track, measure & maximise your climate impact',
    color: '#22c55e',
  },
];

export default function Slide06_Solution() {
  return (
    <div className="slide" style={{ background: '#080f0c' }}>
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(34, 197, 94, 0.08), transparent 65%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      <div className="bg-grid" />
      <div className="bg-noise" />

      <motion.div
        className="slide-content center-text"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* CarbonEase logo */}
        <motion.div variants={fadeUp} style={{ marginBottom: 16 }}>
          <CarbonEaseLogo width={210} />
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          AI-Driven{' '}
          <span className="text-gradient-green">Carbon Credit Marketplace</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle center-text mx-auto">
          One platform. Seven powerful capabilities. Zero compromise on sustainability.
        </motion.p>

        {/* 7-feature grid */}
        <motion.div
          variants={fadeUp}
          className="mt-32"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14,
            maxWidth: 960,
            width: '100%',
          }}
        >
          {features.map(({ icon: Icon, number, title, desc, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -5, borderColor: `${color}44` }}
              style={{
                padding: '18px 16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 14,
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
                // span last item across 2 cols if odd
                ...(i === 6 ? { gridColumn: 'span 2', maxWidth: '100%' } : {}),
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 2,
                background: color,
                opacity: 0.6,
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} color={color} />
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  color,
                  letterSpacing: 2,
                }}>
                  {number.padStart(2, '0')}
                </span>
              </div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 5, color: 'var(--text-primary)' }}>
                {title}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.5 }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
