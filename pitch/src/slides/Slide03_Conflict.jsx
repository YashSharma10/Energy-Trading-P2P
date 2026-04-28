import { motion } from 'framer-motion';
import { AlertTriangle, Clock, FileWarning, IndianRupee, Mail } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.12 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function GovernmentNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      style={{
        maxWidth: 560,
        margin: '0 auto',
        background: 'rgba(239, 68, 68, 0.04)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 16,
        padding: 32,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scanline effect */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)',
        }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FileWarning size={20} color="#f87171" />
        </motion.div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--red-400)', letterSpacing: 2, textTransform: 'uppercase' }}>
            Government of India — MoEFCC
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: 2 }}>
            Official Compliance Notice
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 1, background: 'rgba(239, 68, 68, 0.15)', marginBottom: 16 }} />
      
      {/* Notice text */}
      <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        <p style={{ marginBottom: 12 }}>
          <strong style={{ color: '#f87171' }}>TO:</strong> Ease Manufacturing Pvt. Ltd.
        </p>
        <p style={{ marginBottom: 12 }}>
          Your facility has been found in <strong style={{ color: '#f87171' }}>violation of carbon emission standards</strong> under the Environment Protection Act.
        </p>
        <motion.p
          style={{
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.08)',
            borderRadius: 8,
            borderLeft: '3px solid #ef4444',
            fontWeight: 600,
            color: '#fca5a5',
            fontSize: '0.95rem',
          }}
          animate={{ borderLeftColor: ['#ef4444', '#fca5a5', '#ef4444'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          "Reduce carbon emissions by 40% within 6 months — or face penalties up to ₹50 Crore."
        </motion.p>
      </div>

      {/* Stamp */}
      <motion.div
        initial={{ opacity: 0, rotate: -15, scale: 0 }}
        animate={{ opacity: 0.3, rotate: -12, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5, type: 'spring' }}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 80,
          height: 80,
          border: '3px solid #ef4444',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          color: '#ef4444',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}
      >
        URGENT
      </motion.div>
    </motion.div>
  );
}

export default function Slide03_Conflict() {
  return (
    <div className="slide" style={{ background: '#0c0810' }}>
      <div className="bg-noise" />
      
      {/* Red warning ambient */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(239, 68, 68, 0.06), transparent 70%)',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <motion.div
        className="slide-content center-text"
        variants={stagger}
        initial="initial"
        animate="animate"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div variants={fadeUp} className="badge badge-red mb-24">
          <AlertTriangle size={14} /> BREAKING NEWS
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          The Government Strikes <span className="text-gradient-red">Back</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle center-text mx-auto">
          The conflict notice arrives — threatening the very existence of Ease Manufacturing.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-48" style={{ width: '100%' }}>
          <GovernmentNotice />
        </motion.div>

        {/* Urgency indicators */}
        <motion.div
          variants={fadeUp}
          className="mt-32"
          style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {[
            { icon: Clock, label: '6 Months Deadline', color: '#f87171' },
            { icon: IndianRupee, label: '₹50 Cr Penalty', color: '#fbbf24' },
            { icon: Mail, label: 'Final Warning', color: '#f87171' },
          ].map(({ icon: Icon, label, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 + i * 0.2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${color}33`,
                borderRadius: 100,
                fontSize: '0.85rem',
                color,
                fontWeight: 500,
              }}
            >
              <Icon size={16} />
              {label}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
