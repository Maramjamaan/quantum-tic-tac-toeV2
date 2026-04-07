import React, { useEffect, useRef, useState } from 'react';

const RX = 190;
const RY = 65;
const CX = 250;
const CY = 250;

const rotatePoint = (x, y, angleDeg) => {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + x * Math.cos(rad) - y * Math.sin(rad),
    y: CY + x * Math.sin(rad) + y * Math.cos(rad),
  };
};

const QuantumLogo = ({ size = 200 }) => {
  const [angles, setAngles] = useState({ a1: 0, a2: 0, a3: 0 });
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = (timestamp - startRef.current) / 1000;

      setAngles({
        a1: elapsed * (2 * Math.PI) / 3,
        a2: elapsed * (2 * Math.PI) / 4.5,
        a3: elapsed * (2 * Math.PI) / 6,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Electron 1 — orbit 1 (no rotation)
  const e1 = {
    x: CX + RX * Math.cos(angles.a1),
    y: CY + RY * Math.sin(angles.a1),
  };

  // Electron 2 — orbit 2 (rotated 60deg)
  const lx2 = RX * Math.cos(angles.a2);
  const ly2 = RY * Math.sin(angles.a2);
  const e2 = rotatePoint(lx2, ly2, 60);

  // Electron 3 — orbit 3 (rotated 120deg)
  const lx3 = RX * Math.cos(angles.a3);
  const ly3 = RY * Math.sin(angles.a3);
  const e3 = rotatePoint(lx3, ly3, 120);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="qng" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="#06ffa5" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#059669" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="qbg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06ffa5" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#06ffa5" stopOpacity="0"/>
        </radialGradient>
        <filter id="qog">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="qeg">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="qgg">
          <feGaussianBlur stdDeviation="8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* bg glow */}
      <circle cx="250" cy="250" r="160" fill="url(#qbg)"/>

      {/* Orbit 1 — green */}
      <ellipse cx="250" cy="250" rx="190" ry="65"
        fill="none" stroke="#06ffa5" strokeWidth="1.8" opacity="0.8" filter="url(#qog)"/>

      {/* Orbit 2 — purple */}
      <ellipse cx="250" cy="250" rx="190" ry="65"
        fill="none" stroke="#a855f7" strokeWidth="1.8" opacity="0.7"
        transform="rotate(60 250 250)" filter="url(#qog)"/>

      {/* Orbit 3 — blue */}
      <ellipse cx="250" cy="250" rx="190" ry="65"
        fill="none" stroke="#3b82f6" strokeWidth="1.8" opacity="0.7"
        transform="rotate(120 250 250)" filter="url(#qog)"/>

      {/* Nucleus glow */}
      <circle cx="250" cy="250" r="55" fill="url(#qng)" opacity="0.25" filter="url(#qgg)"/>

      {/* O — nucleus circle */}
      <circle cx="250" cy="250" r="40"
        fill="none" stroke="#06ffa5" strokeWidth="3" opacity="0.95" filter="url(#qog)"/>

      {/* X — crossing lines */}
      <line x1="222" y1="222" x2="278" y2="278"
        stroke="#06ffa5" strokeWidth="3" strokeLinecap="round" opacity="0.95" filter="url(#qog)"/>
      <line x1="278" y1="222" x2="222" y2="278"
        stroke="#06ffa5" strokeWidth="3" strokeLinecap="round" opacity="0.95" filter="url(#qog)"/>

      {/* Q tail */}
      <line x1="270" y1="268" x2="298" y2="296"
        stroke="#06ffa5" strokeWidth="4.5" strokeLinecap="round" opacity="0.95" filter="url(#qog)"/>

      {/* Electrons */}
      <circle cx={e1.x} cy={e1.y} r="8" fill="#06ffa5" filter="url(#qeg)"/>
      <circle cx={e2.x} cy={e2.y} r="7" fill="#a855f7" filter="url(#qeg)"/>
      <circle cx={e3.x} cy={e3.y} r="6" fill="#3b82f6" filter="url(#qeg)"/>

      {/* Sparkles */}
      <circle cx="130" cy="120" r="2.5" fill="#06ffa5" opacity="0.45"/>
      <circle cx="380" cy="105" r="2"   fill="#a855f7" opacity="0.4"/>
      <circle cx="395" cy="385" r="2.5" fill="#3b82f6" opacity="0.35"/>
      <circle cx="110" cy="370" r="2"   fill="#06ffa5" opacity="0.35"/>
      <circle cx="250" cy="82"  r="1.8" fill="#a855f7" opacity="0.3"/>
      <circle cx="250" cy="415" r="1.8" fill="#3b82f6" opacity="0.3"/>
    </svg>
  );
};

export default QuantumLogo;