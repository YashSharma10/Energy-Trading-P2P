import { motion } from 'framer-motion';
import { TrendingUp, Globe, Leaf, ArrowUpRight } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.12 } } };
const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// How much money is being traded in carbon credit markets globally (USD Billion)
// Source: Grand View Research 2025 / Ecosystem Marketplace
const chartData = [
  { year: '2019', value: 0.3,  projected: false },
  { year: '2020', value: 0.5,  projected: false },
  { year: '2021', value: 2.0,  projected: false },
  { year: '2022', value: 1.8,  projected: false }, // market dip — real data
  { year: '2023', value: 2.5,  projected: false },
  { year: '2024', value: 4.0,  projected: false },
  { year: '2025', value: 6.5,  projected: true  },
  { year: '2030', value: 24.0, projected: true  },
];
const MAX = 24;

// Key numbers — plain English, sourced, all from same category (voluntary carbon market)
const keyNumbers = [
  {
    value: '$4 Billion',
    label: 'Traded in carbon credits globally in 2024',
    sub: 'Grand View Research, 2025',
    color: '#22c55e',
    icon: Globe,
  },
  {
    value: '$24 Billion',
    label: 'Expected by 2030 — growing 6× in 6 years',
    sub: 'Grand View Research, 2025',
    color: '#3b82f6',
    icon: TrendingUp,
  },
  {
    value: '1,300+',
    label: 'Carbon offset projects registered in India',
    sub: 'Invest India · India is 2nd largest globally',
    color: '#f59e0b',
    icon: Leaf,
  },
  {
    value: '2026',
    label: "India's mandatory carbon trading law kicks in",
    sub: "Govt. of India CCTS — 9 industrial sectors",
    color: '#a855f7',
    icon: ArrowUpRight,
  },
];

// India facts — no jargon
const indiaFacts = [
  { label: '1,300+ carbon projects in India', sub: 'India is 2nd largest globally — Invest India' },
  { label: "India's carbon trading law goes live in 2026", sub: 'Carbon Credit Trading Scheme (CCTS) — Govt. of India' },
  { label: 'India pledged to cut pollution intensity by 45% by 2030', sub: 'UN Paris Agreement commitment' },
  { label: "India's goal: Zero net emissions by 2070", sub: 'COP26 pledge — Govt. of India' },
];

export default function Slide12_MarketVision() {
  return (
    <div className="slide" style={{ background: '#080c10', padding: '44px 60px' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <motion.div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 70% 30%, rgba(34,197,94,0.06), transparent 55%)',
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
          The Opportunity
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg" style={{ marginBottom: 6 }}>
          Carbon trading is a{' '}
          <span className="text-gradient-green">massive, fast-growing market</span>
        </motion.h2>

        <motion.p variants={fadeUp} style={{
          fontSize: '0.92rem', color: 'var(--text-secondary)',
          marginBottom: 24, maxWidth: 640,
        }}>
          Companies worldwide are paying to offset their carbon emissions.
          This market is growing <strong style={{ color: '#22c55e' }}>6× in 6 years</strong> — and India is one of the fastest-growing players.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, alignItems: 'start' }}>

          {/* ── LEFT: Bar chart ── */}
          <motion.div
            variants={fadeUp}
            style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 16,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: '0.82rem', fontWeight: 700,
                color: 'var(--text-primary)', marginBottom: 4,
              }}>
                How much money flows through carbon credit markets each year
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                In US Dollars · Grey = actual · Green = forecast
              </div>
            </div>

            {/* Chart area */}
            <div style={{
              position: 'relative',
              paddingLeft: 44,
              paddingBottom: 28,
            }}>
              {/* Y-axis gridlines + labels */}
              {[0, 6, 12, 18, 24].map((v) => (
                <div
                  key={v}
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 28 + (v / MAX) * 160,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    pointerEvents: 'none',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem',
                    color: 'var(--text-muted)',
                    width: 36,
                    textAlign: 'right',
                    flexShrink: 0,
                  }}>
                    {v === 0 ? '' : `$${v}B`}
                  </span>
                  <div style={{
                    flex: 1,
                    height: 1,
                    background: v === 0
                      ? 'rgba(255,255,255,0.12)'
                      : 'rgba(255,255,255,0.04)',
                  }} />
                </div>
              ))}

              {/* Bars */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 10,
                height: 160,
                position: 'relative',
                zIndex: 1,
              }}>
                {chartData.map(({ year, value, projected }, i) => {
                  const heightPx = (value / MAX) * 160;
                  const isLast = i === chartData.length - 1;
                  return (
                    <div
                      key={year}
                      style={{
                        flex: isLast ? 1.3 : 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0,
                        height: '100%',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {/* Dollar label above bar */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: isLast ? '0.68rem' : '0.55rem',
                          color: projected ? '#4ade80' : 'rgba(255,255,255,0.5)',
                          fontWeight: isLast ? 800 : 400,
                          marginBottom: 4,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {value >= 1 ? `$${value}B` : `$${value * 1000}M`}
                      </motion.div>

                      {/* Bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: heightPx }}
                        transition={{ duration: 0.7, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          width: '100%',
                          borderRadius: '5px 5px 0 0',
                          background: projected
                            ? isLast
                              ? 'linear-gradient(180deg, #4ade80 0%, #16a34a 100%)'
                              : 'rgba(34,197,94,0.4)'
                            : i === 3
                              ? 'rgba(239,68,68,0.35)'   // 2022 dip — red tint
                              : 'rgba(255,255,255,0.14)',
                          border: projected
                            ? '1px solid rgba(34,197,94,0.4)'
                            : i === 3
                              ? '1px solid rgba(239,68,68,0.3)'
                              : '1px solid rgba(255,255,255,0.08)',
                          flexShrink: 0,
                        }}
                      />

                      {/* Year label */}
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6rem',
                        color: projected ? 'rgba(74,222,128,0.8)' : 'var(--text-muted)',
                        marginTop: 6,
                        fontWeight: isLast ? 700 : 400,
                      }}>
                        {year}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2022 dip note */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '0.6rem', color: 'rgba(239,68,68,0.6)',
              fontFamily: 'var(--font-mono)', marginTop: 4,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(239,68,68,0.35)', flexShrink: 0 }} />
              2022 dip: market correction after quality concerns — recovered strongly
            </div>

            <div style={{
              marginTop: 6,
              fontSize: '0.58rem', color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              Source: Grand View Research 2025 · Ecosystem Marketplace
            </div>
          </motion.div>

          {/* ── RIGHT: Key numbers + India facts ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* 4 number cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {keyNumbers.map(({ value, label, sub, color, icon: Icon }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.12 }}
                  whileHover={{ y: -3 }}
                  style={{
                    padding: '13px 12px',
                    background: `${color}08`,
                    border: `1px solid ${color}22`,
                    borderRadius: 12,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 900,
                      fontSize: '1.05rem', color, lineHeight: 1.1,
                    }}>
                      {value}
                    </div>
                    <Icon size={13} color={color} style={{ opacity: 0.5, flexShrink: 0 }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3, lineHeight: 1.3 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '0.57rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {sub}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* India facts */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              style={{
                padding: '16px 16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
              }}>
                <div style={{ width: 20, height: 1, background: 'rgba(34,197,94,0.4)' }} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                  letterSpacing: 2, textTransform: 'uppercase',
                  color: 'rgba(74,222,128,0.8)', fontWeight: 600,
                }}>
                  Why India? Why Now?
                </span>
                <div style={{ flex: 1, height: 1, background: 'rgba(34,197,94,0.4)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {indiaFacts.map(({ label, sub }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}
                  >
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: '#22c55e', flexShrink: 0, marginTop: 5,
                    }} />
                    <div>
                      <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {label}
                      </div>
                      <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>
                        {sub}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
