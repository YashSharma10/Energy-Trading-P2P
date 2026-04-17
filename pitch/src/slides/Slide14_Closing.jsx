import { motion } from 'framer-motion';
import { Leaf, Heart } from 'lucide-react';

export default function Slide14_Closing() {
  return (
    <div className="slide" style={{ background: '#060e0a' }}>
      <div className="bg-noise" />
      
      {/* Rich green ambient */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 30% 50%, rgba(34, 197, 94, 0.08), transparent 50%),
            radial-gradient(ellipse at 70% 50%, rgba(34, 197, 94, 0.06), transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(34, 197, 94, 0.04), transparent 40%)
          `,
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Floating particles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            width: 2 + Math.random() * 5,
            height: 2 + Math.random() * 5,
            background: `rgba(34, 197, 94, ${0.05 + Math.random() * 0.15})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50 - Math.random() * 50, 0],
            x: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      <div className="slide-content center-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Leaf icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 100 }}
        >
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
          }}>
            <Leaf size={36} color="#22c55e" />
          </div>
        </motion.div>

        {/* Main quote */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
            fontWeight: 300,
            lineHeight: 1.3,
            maxWidth: 800,
            color: 'var(--text-secondary)',
          }}
        >
          "Saving the planet{' '}
          <motion.span
            style={{
              fontWeight: 800,
              background: 'var(--gradient-green)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            shouldn't stop
          </motion.span>{' '}
          progress."
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            width: 80,
            height: 3,
            background: 'var(--gradient-green)',
            borderRadius: 2,
            margin: '32px auto',
          }}
        />

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          <span className="text-gradient-green">CarbonEase</span> makes sustainability achievable.
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            marginTop: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
          }}
        >
          Built with <Heart size={16} color="#ef4444" fill="#ef4444" /> for a sustainable future
        </motion.p>
      </div>
    </div>
  );
}
