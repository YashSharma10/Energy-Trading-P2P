import { motion } from 'framer-motion';
import { Percent, Crown, Code2, ShoppingBag, Cpu } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const revenueStreams = [
  {
    icon: Percent,
    title: 'Transaction Fee',
    rate: '1–3%',
    desc: 'Small fee on every successful credit trade — aligned incentives, scales with volume.',
    color: '#22c55e',
  },
  {
    icon: Crown,
    title: 'Subscription Plans',
    rate: 'SaaS',
    desc: 'Premium analytics, advanced tools, and priority support for organisations.',
    color: '#a855f7',
  },
  {
    icon: Code2,
    title: 'Enterprise API',
    rate: 'B2B',
    desc: 'Powerful APIs and data services for large-scale integration and automation.',
    color: '#3b82f6',
  },
  {
    icon: ShoppingBag,
    title: 'Eco-Shop Commission',
    rate: 'Commission',
    desc: 'Earn on every sale of verified sustainable products in the Eco-Shop.',
    color: '#fbbf24',
  },
];

const scalingTiers = [
  { scale: '100–1K Users',   cost: '₹1,000–₹8,000/mo',    perUser: '₹8–₹10',  capability: 'MVP + Gemini testing & predictive modelling', color: '#22c55e' },
  { scale: '10K–50K Users',  cost: '₹20,000–₹80,000/mo',  perUser: '₹1.5–₹4', capability: 'Production scale, enterprise-grade security, advanced analytics', color: '#3b82f6' },
  { scale: '50K–100K Users', cost: '₹80,000–₹2,00,000+/mo',perUser: '<₹2',     capability: 'Enterprise ready, high availability, massive scale support', color: '#a855f7' },
];


export default function Slide12b_BusinessModel() {
  return (
    <div className="slide" style={{ background: '#080c10', padding: '44px 60px' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <motion.div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 70%, rgba(34,197,94,0.05), transparent 55%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        className="slide-content"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ maxWidth: 1200 }}
      >
        <motion.div variants={fadeUp} className="slide-label">
          Sustainable Business Model
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg" style={{ marginBottom: 6 }}>
          We Build <span className="text-gradient-green">Value.</span> We Drive <span className="text-gradient-green">Impact.</span>
        </motion.h2>

        <motion.p variants={fadeUp} style={{
          fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 560,
        }}>
          Multiple revenue streams. AI cost efficiency of <strong style={{ color: '#22c55e' }}>₹0.02–₹0.05 per query</strong>.
          Cloud-native. Scalable. Secure.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* LEFT TOP — Revenue streams */}
          <motion.div variants={fadeUp} style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
              Revenue Streams
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {revenueStreams.map(({ icon: Icon, title, rate, desc, color }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ y: -3 }}
                  style={{
                    padding: '14px 12px',
                    background: `${color}08`,
                    border: `1px solid ${color}20`,
                    borderRadius: 12,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: `${color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={14} color={color} />
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                      color, fontWeight: 700, letterSpacing: 1,
                    }}>
                      {rate}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {title}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT TOP — Scaling tiers */}
          <motion.div variants={fadeUp} style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
              Infrastructure Scaling (INR)
            </div>

            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 0.5fr',
              gap: 8, padding: '6px 10px',
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1,
              borderBottom: '1px solid var(--border-subtle)', marginBottom: 6,
            }}>
              <span>Scale</span>
              <span>Monthly Cost</span>
              <span>Per User</span>
            </div>

            {scalingTiers.map(({ scale, cost, perUser, capability, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 0.5fr',
                  gap: 8, padding: '10px 10px',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderRadius: 8, marginBottom: 2, alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', color }}>
                    {scale}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.3 }}>
                    {capability}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {cost}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                  color, fontWeight: 700,
                }}>
                  {perUser}
                </div>
              </motion.div>
            ))}

            {/* AI cost badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              style={{
                marginTop: 12, padding: '10px 14px',
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <Cpu size={16} color="#22c55e" />
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', color: '#22c55e' }}>
                  ₹0.02–₹0.05
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                  AI cost per query — optimised via batching, caching &amp; smart routing
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* BOTTOM — Tagline only */}
          <motion.div
            variants={fadeUp}
            style={{
              gridColumn: 'span 2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '22px 32px',
              background: 'rgba(34,197,94,0.04)',
              border: '1px solid rgba(34,197,94,0.15)',
              borderRadius: 14,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
                lineHeight: 1.3,
                marginBottom: 10,
              }}>
                <span style={{ color: 'var(--text-primary)' }}>"Not just a platform — </span>
                <span style={{
                  background: 'var(--gradient-green)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  an infrastructure for a greener tomorrow."
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
              }}>
                {['Secure', 'Scalable', 'Future-Ready'].map((tag, i) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + i * 0.1 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'rgba(74,222,128,0.8)',
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
                    {tag}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
