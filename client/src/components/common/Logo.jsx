import React from "react";

const Logo = ({ className = "" }) => (
  <svg 
    width="400" 
    height="80" 
    viewBox="0 0 400 80" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7CD957" />
        <stop offset="100%" stopColor="#4EAF37" />
      </linearGradient>
    </defs>

    <g transform="translate(10, 15)">
      {/* Premium leaf base */}
      <path 
        d="M 25 0 L 46 0 C 48.2 0 50 1.8 50 4 L 50 25 C 50 38.8 38.8 50 25 50 L 4 50 C 1.8 50 0 48.2 0 46 L 0 25 C 0 11.2 11.2 0 25 0 Z" 
        fill="url(#logoGrad)" 
      />
      {/* Thunderbolt cutout */}
      <path 
        d="M27 9 L11 28 H25 L23 41 L39 22 H25 L27 9 Z" 
        fill="#ffffff" 
      />
    </g>

    <text 
      x="75" 
      y="52" 
      fontFamily="'Outfit', 'Inter', 'Manrope', system-ui, sans-serif" 
      fontSize="36" 
      letterSpacing="-0.5px"
    >
      <tspan className="fill-foreground font-extrabold">Carbon</tspan>
      <tspan className="fill-brandMainColor font-medium">Ease</tspan>
    </text>
  </svg>
);

export default Logo;
