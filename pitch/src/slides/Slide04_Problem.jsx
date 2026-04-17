import { motion } from 'framer-motion';
import { Clock, Banknote, Wrench, X } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.15 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Slide04_Problem() {
  return (
    <div className="slide" style={{ background: '#0b0911' }}>
      <div className="bg-noise" />
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(239, 68, 68, 0.04), transparent 70%)',
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
          Chapter 3 — The Real Problem
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          They <span className="text-gradient-red">cannot</span> change overnight
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle center-text mx-auto">
          Sustainability is necessary — but the transition is expensive, slow, and operationally devastating.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-48 grid-2" style={{ maxWidth: 800, margin: '48px auto 0' }}>
          {/* Time constraint */}
          <motion.div
            className="glass-card-red"
            whileHover={{ y: -4 }}
            style={{ textAlign: 'left' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}>
              <div className="icon-circle icon-circle-red">
                <Clock size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fca5a5' }}>
                  Time Constraint
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  6 months is not enough
                </p>
              </div>
            </div>
            
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              <p>Replacing heavy machinery, redesigning processes, and building green infrastructure takes <strong style={{ color: '#f87171' }}>years, not months</strong>.</p>
            </div>

            <motion.div
              style={{
                marginTop: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {['Planning', 'Procurement', 'Installation', 'Testing'].map((step, i) => (
                <div
                  key={i}
                  style={{
                    padding: '4px 10px',
                    background: 'rgba(239,68,68,0.08)',
                    borderRadius: 6,
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <X size={10} color="#ef4444" />
                  {step}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Financial constraint */}
          <motion.div
            className="glass-card-red"
            whileHover={{ y: -4 }}
            style={{ textAlign: 'left' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
            }}>
              <div className="icon-circle icon-circle-amber">
                <Banknote size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fcd34d' }}>
                  Financial Constraint
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Budget already stretched
                </p>
              </div>
            </div>

            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              <p>Green technology investment requires <strong style={{ color: '#fbbf24' }}>₹200+ Crore</strong> — capital they simply don't have available right now.</p>
            </div>

            <div style={{ marginTop: 16 }}>
              {/* Cost bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                <span>Available Budget</span>
                <span style={{ color: '#fbbf24' }}>₹30 Cr / ₹200 Cr needed</span>
              </div>
              <div style={{
                height: 6,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 3,
                overflow: 'hidden',
              }}>
                <motion.div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                    borderRadius: 3,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: '15%' }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Central message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-48"
          style={{
            padding: '20px 40px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            maxWidth: 600,
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: 'center',
          }}>
            <Wrench size={20} color="var(--text-muted)" />
            <p style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-secondary)',
            }}>
              "Sustainability is necessary, but transition is{' '}
              <span style={{ color: '#f87171' }}>expensive</span> and{' '}
              <span style={{ color: '#fbbf24' }}>slow</span>."
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
