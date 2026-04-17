import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, Lightbulb, Sparkles, Zap } from 'lucide-react';

const stagger = { animate: { transition: { staggerChildren: 0.15 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const aiFeatures = [
  {
    icon: Target,
    title: 'Optimal Credit Purchases',
    desc: 'AI analyzes market trends and your emission profile to recommend the most cost-effective credits to buy.',
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
  },
  {
    icon: TrendingUp,
    title: 'Emission Trend Analysis',
    desc: 'Predictive analytics identify emission spikes before they happen, enabling proactive adjustments.',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
  {
    icon: Lightbulb,
    title: 'Sustainability Strategies',
    desc: 'Personalized roadmaps for long-term emission reduction based on your industry and scale.',
    gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
  },
];

function AIVisualization() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      style={{
        position: 'relative',
        width: 200,
        height: 200,
        margin: '0 auto',
      }}
    >
      {/* Central brain */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.2), rgba(34,197,94,0.05))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(34,197,94,0.3)',
        }}
      >
        <Brain size={32} color="#22c55e" />
      </motion.div>

      {/* Orbiting elements */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: ['#22c55e', '#3b82f6', '#a855f7', '#fbbf24', '#22c55e', '#60a5fa'][i],
            marginLeft: -4,
            marginTop: -4,
          }}
          animate={{
            x: Math.cos((i * Math.PI * 2) / 6 + Date.now() / 1000) * 85,
            y: Math.sin((i * Math.PI * 2) / 6 + Date.now() / 1000) * 85,
            rotate: 360,
          }}
          transition={{
            rotate: { duration: 8 + i * 2, repeat: Infinity, ease: 'linear' },
            x: { duration: 8 + i * 2, repeat: Infinity, ease: 'linear' },
            y: { duration: 8 + i * 2, repeat: Infinity, ease: 'linear' },
          }}
        />
      ))}

      {/* Pulse rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={`ring-${i}`}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 60 + i * 40,
            height: 60 + i * 40,
            borderRadius: '50%',
            border: '1px solid rgba(34,197,94,0.08)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </motion.div>
  );
}

export default function Slide09_AIPower() {
  return (
    <div className="slide" style={{ background: '#080c12' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(34,197,94,0.06), transparent 60%)',
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
          <Sparkles size={14} /> ARTIFICIAL INTELLIGENCE
        </motion.div>

        <motion.h2 variants={fadeUp} className="slide-title lg">
          Powered by <span className="text-gradient-green">AI</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="slide-subtitle center-text mx-auto">
          Not just a marketplace — an intelligent advisor that learns, predicts, and optimizes.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-32">
          <AIVisualization />
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-32 grid-3"
          style={{ maxWidth: 1000, width: '100%' }}
        >
          {aiFeatures.map(({ icon: Icon, title, desc, gradient }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.2 }}
              whileHover={{ y: -6 }}
              style={{
                textAlign: 'left',
                padding: 28,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 16,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top gradient line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: gradient,
              }} />
              
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Icon size={22} color="#fff" />
              </div>
              
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 10 }}>
                {title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
