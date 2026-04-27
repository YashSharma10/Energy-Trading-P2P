import { motion } from 'framer-motion';
import { Flame, Leaf, ArrowRight } from 'lucide-react';

export default function Slide01_Hook() {
  return (
    <div className="slide" style={{ background: '#0a0a0f', padding: '40px 60px' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      
      {/* Dynamic abstract glow */}
      <motion.div
        style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 60%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <div className="slide-content center-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="badge badge-amber mb-24"
        >
          <Flame size={14} style={{ marginRight: 6 }} /> A Story of Survival
        </motion.div>

        <motion.h1
          className="slide-title xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ letterSpacing: '-2px', lineHeight: 1.1, maxWidth: '900px' }}
        >
          What happens when{' '}
          <br />
          <span className="text-gradient-green">
            sustainability
          </span>{' '}
          becomes{' '}
          <span style={{ color: '#f1f5f9' }}>urgent?</span>
        </motion.h1>

        <motion.p
          className="slide-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ textAlign: 'center', margin: '24px auto 0', fontSize: '1.4rem' }}
        >
          A real-world problem. A billion-dollar opportunity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          style={{ marginTop: 60, display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'center' }}
        >
           {/* Minimal floating elements to replace the heavy factory SVG */}
           <motion.div 
             className="glass-card glass-card-red flex-center" 
             style={{ width: 140, height: 140, borderRadius: '50%', padding: 0 }}
             whileHover={{ scale: 1.05 }}
           >
             <Flame size={48} className="text-red" />
           </motion.div>
           
           <div className="flex-center" style={{ width: 100 }}>
             <motion.div 
               style={{ width: '100%', height: 2, background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.5), rgba(34, 197, 94, 0.5))', position: 'relative' }}
               initial={{ scaleX: 0, opacity: 0 }}
               animate={{ scaleX: 1, opacity: 1 }}
               transition={{ duration: 1, delay: 1.2 }}
             >
                <motion.div
                  style={{ position: 'absolute', right: -10, top: -11, color: 'var(--green-400)' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 2 }}
                >
                  <ArrowRight size={24} />
                </motion.div>
             </motion.div>
           </div>

           <motion.div 
             className="glass-card flex-center" 
             style={{ width: 140, height: 140, borderRadius: '50%', padding: 0, borderColor: 'rgba(34, 197, 94, 0.3)', background: 'rgba(34, 197, 94, 0.08)', boxShadow: 'var(--shadow-glow-green)' }}
             whileHover={{ scale: 1.05 }}
           >
             <Leaf size={48} className="text-accent" />
           </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
