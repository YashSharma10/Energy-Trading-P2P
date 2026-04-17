import { motion } from 'framer-motion';
import { BarChart3, ShoppingCart, Bot, Users, Activity, TrendingDown, Zap } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.12 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function DashboardMockup() {
  const emissionBars = [85, 78, 70, 65, 55, 48, 40, 35, 28, 22, 18, 15];
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  
  return (
    <motion.div
      className="dashboard-mockup"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="dashboard-header">
        <div className="dashboard-dot" style={{ background: '#ef4444' }} />
        <div className="dashboard-dot" style={{ background: '#fbbf24' }} />
        <div className="dashboard-dot" style={{ background: '#22c55e' }} />
        <span style={{ marginLeft: 12, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          carbonease.io/dashboard
        </span>
      </div>
      <div className="dashboard-body">
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Total Emissions', value: '12,450 t', icon: Activity, color: '#f87171', trend: '↓ 40%' },
            { label: 'Credits Owned', value: '8,200', icon: Zap, color: '#22c55e', trend: '↑ 120%' },
            { label: 'Compliance', value: '96%', icon: TrendingDown, color: '#22c55e', trend: '✓ On Track' },
          ].map(({ label, value, icon: Icon, color, trend }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.15 }}
              style={{
                flex: 1,
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {label}
                </span>
                <Icon size={14} color={color} />
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {value}
              </div>
              <div style={{ fontSize: '0.65rem', color, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                {trend}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div style={{
          padding: 16,
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10,
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Emission Reduction Trend
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
            {emissionBars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.08 }}
                style={{
                  flex: 1,
                  background: i < 5
                    ? `linear-gradient(180deg, #f87171, #ef444444)`
                    : i < 9
                    ? `linear-gradient(180deg, #fbbf24, #f59e0b44)`
                    : `linear-gradient(180deg, #22c55e, #16a34a44)`,
                  borderRadius: '3px 3px 0 0',
                  position: 'relative',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            {months.map((m, i) => (
              <div key={i} style={{ flex: 1, fontSize: '0.55rem', color: 'var(--text-muted)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const platformFeatures = [
  {
    icon: BarChart3,
    title: 'Dashboard',
    desc: 'Real-time emission tracking with interactive charts and compliance metrics',
    color: '#60a5fa',
  },
  {
    icon: ShoppingCart,
    title: 'Marketplace',
    desc: 'Buy & sell verified carbon credits with transparent pricing',
    color: '#22c55e',
  },
  {
    icon: Bot,
    title: 'AI Chatbot',
    desc: 'Get personalized insights, recommendations, and sustainability strategies',
    color: '#c084fc',
  },
  {
    icon: Users,
    title: 'Role Access',
    desc: 'Admin, Producer & Consumer roles with tailored dashboards',
    color: '#fbbf24',
  },
];

export default function Slide08_Walkthrough() {
  return (
    <div className="slide" style={{ background: '#080f0c' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <div className="solution-overlay" />

      <motion.div
        className="slide-content"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeUp} className="slide-label">
          Platform Walkthrough
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title md">
          A Platform Built for <span className="text-gradient-green">Action</span>
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24, marginTop: 36 }}>
          {/* Dashboard mockup */}
          <DashboardMockup />

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {platformFeatures.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + i * 0.2 }}
                whileHover={{
                  x: 4,
                  background: 'rgba(255,255,255,0.04)',
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '16px 18px',
                  borderRadius: 12,
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(255,255,255,0.01)',
                  cursor: 'default',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>
                    {title}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
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
