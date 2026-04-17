import { motion } from 'framer-motion';
import { Leaf, Mail, FolderGit2, Link, Globe, Code2, ExternalLink } from 'lucide-react';

export default function Slide15_ThankYou() {
  return (
    <div className="slide" style={{ background: '#060e0a' }}>
      <div className="bg-grid" />
      <div className="bg-noise" />
      
      {/* Ambient */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.06), transparent 60%)',
        }}
      />

      {/* Background leaves */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.04,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          <Leaf size={20 + Math.random() * 30} color="#22c55e" />
        </motion.div>
      ))}

      <div className="slide-content center-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Thank you text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            fontWeight: 900,
            background: 'var(--gradient-green)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8,
          }}
        >
          Thank You
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            marginBottom: 48,
          }}
        >
          Let's build a sustainable future together.
        </motion.p>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8, type: 'spring' }}
          style={{
            maxWidth: 480,
            width: '100%',
            padding: 40,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top gradient */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'var(--gradient-green)',
          }} />

          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'var(--gradient-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '2rem',
              fontWeight: 900,
              color: '#fff',
              fontFamily: 'var(--font-display)',
            }}
          >
            YS
          </motion.div>

          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 800,
              marginBottom: 4,
            }}
          >
            Yash Sharma
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            style={{
              color: 'var(--green-400)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              marginBottom: 4,
            }}
          >
            Full Stack Developer
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              marginBottom: 24,
            }}
          >
            <Code2 size={14} />
            MERN Stack • AI/ML • Cloud
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5 }}
            style={{
              width: '100%',
              height: 1,
              background: 'var(--border-subtle)',
              marginBottom: 24,
            }}
          />

          {/* Contact links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: Mail, label: 'Email', href: '#' },
              { icon: FolderGit2, label: 'GitHub', href: '#' },
              { icon: Link, label: 'LinkedIn', href: '#' },
              { icon: Globe, label: 'Portfolio', href: '#' },
            ].map(({ icon: Icon, label, href }, i) => (
              <motion.a
                key={i}
                href={href}
                whileHover={{ y: -2, background: 'rgba(34,197,94,0.1)' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                <Icon size={14} />
                {label}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* CarbonEase branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            marginTop: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
          }}
        >
          <Leaf size={16} color="#22c55e" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--green-400)' }}>
            CarbonEase
          </span>
          <span>— AI-Powered Carbon Credit Trading</span>
        </motion.div>
      </div>
    </div>
  );
}
