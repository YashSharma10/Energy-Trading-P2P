import { motion } from 'framer-motion';
import { IndianRupee, ShoppingCart, Leaf, Bot, Users } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.12 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const platformFeatures = [
  {
    icon: IndianRupee,
    title: 'Producer Dashboard',
    desc: '₹3,032 earned · 6 active listings · 194 credits sold · 10 transactions',
    color: '#22c55e',
  },
  {
    icon: ShoppingCart,
    title: 'Carbon Credit Marketplace',
    desc: 'Buy & sell verified credits — Solar, Methane Capture, Blue Carbon & more',
    color: '#3b82f6',
  },
  {
    icon: Leaf,
    title: 'Eco-Shop',
    desc: 'Curated marketplace for sustainable products alongside credit trading',
    color: '#4ade80',
  },
  {
    icon: Bot,
    title: 'AI Chatbot',
    desc: 'Personalised sustainability strategies and 24/7 intelligent support',
    color: '#c084fc',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    desc: 'Tailored dashboards for Admin, Producer & Consumer roles',
    color: '#fbbf24',
  },
];

function MacWindow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative' }}
    >
      {/* Ambient green bloom behind the window */}
      <div style={{
        position: 'absolute',
        inset: -40,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.06) 50%, transparent 75%)',
        filter: 'blur(24px)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* Glowing border ring */}
      <div style={{
        position: 'absolute',
        inset: -1,
        borderRadius: 17,
        background: 'linear-gradient(135deg, rgba(34,197,94,0.7) 0%, rgba(74,222,128,0.3) 40%, rgba(34,197,94,0.1) 70%, rgba(96,165,250,0.3) 100%)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Window shell */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: `
          0 0 0 1px rgba(34,197,94,0.15),
          0 2px 0 rgba(255,255,255,0.08) inset,
          0 40px 100px rgba(0,0,0,0.75),
          0 12px 40px rgba(0,0,0,0.5),
          0 0 60px rgba(34,197,94,0.08)
        `,
      }}>

        {/* ── Title bar — glassy green ── */}
        <div style={{
          height: 44,
          background: 'linear-gradient(180deg, rgba(20,40,28,0.95) 0%, rgba(12,28,18,0.98) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(34,197,94,0.18)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          position: 'relative',
          gap: 0,
        }}>

          {/* Subtle top highlight */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.4), rgba(74,222,128,0.6), rgba(34,197,94,0.4), transparent)',
          }} />

          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', zIndex: 1 }}>
            {[
              { color: '#ff5f57', glow: '#ff5f57' },
              { color: '#febc2e', glow: '#febc2e' },
              { color: '#28c840', glow: '#28c840' },
            ].map(({ color, glow }, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2 }}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 35%, ${color}ff, ${color}aa)`,
                  boxShadow: `0 0 6px ${glow}88, 0 0 0 0.5px rgba(0,0,0,0.3)`,
                  cursor: 'default',
                }}
              />
            ))}
          </div>

          {/* URL bar — centered, glassy */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '5px 16px',
            background: 'rgba(34,197,94,0.07)',
            backdropFilter: 'blur(10px)',
            borderRadius: 8,
            border: '1px solid rgba(34,197,94,0.2)',
            minWidth: 220,
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(34,197,94,0.06) inset',
          }}>
            {/* Green lock */}
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <rect x="1.5" y="5" width="7" height="6.5" rx="1.5" fill="rgba(34,197,94,0.6)" />
              <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="rgba(34,197,94,0.6)" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'rgba(74,222,128,0.9)',
              letterSpacing: 0.4,
              userSelect: 'none',
              fontWeight: 500,
            }}>
              carbonease.io
            </span>
          </div>

          {/* Right side dots (window controls placeholder) */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 5, opacity: 0.3 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(34,197,94,0.6)' }} />
            ))}
          </div>
        </div>

        {/* ── Screenshot ── */}
        <div style={{ position: 'relative', lineHeight: 0 }}>
          <img
            src="/pitch/dashboard.jpg"
            alt="CarbonEase Producer Dashboard"
            style={{
              width: '100%',
              display: 'block',
              objectFit: 'cover',
              objectPosition: 'top center',
              maxHeight: 380,
            }}
          />
          {/* Bottom fade */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 80,
            background: 'linear-gradient(to top, rgba(8,15,12,1) 0%, rgba(8,15,12,0.4) 60%, transparent 100%)',
            pointerEvents: 'none',
          }} />
          {/* Green scanline shimmer */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '100%',
              background: 'linear-gradient(180deg, transparent 0%, rgba(34,197,94,0.03) 50%, transparent 100%)',
              pointerEvents: 'none',
            }}
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
          />
        </div>
      </div>

      {/* Floor reflection */}
      <div style={{
        position: 'absolute',
        bottom: -28,
        left: '5%',
        right: '5%',
        height: 28,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.15), transparent 70%)',
        filter: 'blur(8px)',
        pointerEvents: 'none',
      }} />
    </motion.div>
  );
}

export default function Slide08_Walkthrough() {
  return (
    <div className="slide" style={{ background: '#080f0c', padding: '44px 60px' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <div className="solution-overlay" />

      <motion.div
        className="slide-content"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ maxWidth: 1280 }}
      >
        <motion.div variants={fadeUp} className="slide-label">
          Platform Walkthrough
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title md" style={{ marginBottom: 28 }}>
          A Platform Built for <span className="text-gradient-green">Action</span>
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: 32,
          alignItems: 'start',
        }}>
          {/* Mac-style window with real screenshot */}
          <MacWindow />

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {platformFeatures.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.14 }}
                whileHover={{ x: 5, background: 'rgba(255,255,255,0.04)' }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 13,
                  padding: '13px 15px',
                  borderRadius: 12,
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(255,255,255,0.015)',
                  cursor: 'default',
                  transition: 'all 0.22s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Left accent */}
                <div style={{
                  position: 'absolute',
                  left: 0, top: 0, bottom: 0,
                  width: 2,
                  background: `linear-gradient(180deg, ${color}, transparent)`,
                  borderRadius: '2px 0 0 2px',
                }} />

                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: `${color}15`,
                  border: `1px solid ${color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={16} color={color} />
                </div>

                <div>
                  <h4 style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    marginBottom: 3,
                    color: 'var(--text-primary)',
                  }}>
                    {title}
                  </h4>
                  <p style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}>
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
