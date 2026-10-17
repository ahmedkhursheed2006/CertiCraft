// High-resolution procedural SVG certificate backgrounds (300 DPI / 1920x1080)
export const SAMPLE_TEMPLATES = [
  {
    id: 'classic-gold',
    name: 'Classic Royal Gold',
    width: 1920,
    height: 1080,
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="50%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#090d16" />
          </linearGradient>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b" />
            <stop offset="25%" stop-color="#fbbf24" />
            <stop offset="50%" stop-color="#d97706" />
            <stop offset="75%" stop-color="#fef08a" />
            <stop offset="100%" stop-color="#b45309" />
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(251,191,36,0.04)" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#bg)" />
        <rect width="1920" height="1080" fill="url(#grid)" />
        
        <!-- Outer Gold Border -->
        <rect x="40" y="40" width="1840" height="1000" fill="none" stroke="url(#gold)" stroke-width="4" rx="12" />
        <rect x="55" y="55" width="1810" height="970" fill="none" stroke="rgba(245,158,11,0.3)" stroke-width="1.5" rx="8" />
        
        <!-- Corner Ornaments -->
        <g stroke="url(#gold)" stroke-width="3" fill="none">
          <path d="M 65 140 L 65 65 L 140 65" />
          <path d="M 1855 140 L 1855 65 L 1780 65" />
          <path d="M 65 940 L 65 1015 L 140 1015" />
          <path d="M 1855 940 L 1855 1015 L 1780 1015" />
          <circle cx="102" cy="102" r="10" fill="url(#gold)" opacity="0.7"/>
          <circle cx="1818" cy="102" r="10" fill="url(#gold)" opacity="0.7"/>
          <circle cx="102" cy="978" r="10" fill="url(#gold)" opacity="0.7"/>
          <circle cx="1818" cy="978" r="10" fill="url(#gold)" opacity="0.7"/>
        </g>
        
        <!-- Center Header Typography / Badge -->
        <g transform="translate(960, 200)" text-anchor="middle">
          <circle cx="0" cy="-30" r="45" fill="none" stroke="url(#gold)" stroke-width="2.5" />
          <circle cx="0" cy="-30" r="38" fill="rgba(245,158,11,0.1)" stroke="url(#gold)" stroke-width="1" stroke-dasharray="4,4" />
          <polygon points="0,-48 10,-24 35,-24 15,-9 22,16 0,2 -22,16 -15,-9 -35,-24 -10,-24" fill="url(#gold)" />
          <text y="50" font-family="'Cinzel', Georgia, serif" font-size="22" letter-spacing="12" fill="#fbbf24" font-weight="600">CERTIFICATE OF APPRECIATION</text>
          <text y="80" font-family="'Inter', sans-serif" font-size="14" letter-spacing="4" fill="#94a3b8">THIS IS PROUDLY PRESENTED TO</text>
        </g>
        
        <!-- Signature Line Elements -->
        <g transform="translate(480, 890)" text-anchor="middle">
          <line x1="-150" y1="0" x2="150" y2="0" stroke="#475569" stroke-width="1.5" />
          <text y="24" font-family="'Inter', sans-serif" font-size="13" letter-spacing="2" fill="#94a3b8">AUTHORIZED SIGNATURE</text>
        </g>
        <g transform="translate(1440, 890)" text-anchor="middle">
          <line x1="-150" y1="0" x2="150" y2="0" stroke="#475569" stroke-width="1.5" />
          <text y="24" font-family="'Inter', sans-serif" font-size="13" letter-spacing="2" fill="#94a3b8">DATE OF ISSUANCE</text>
        </g>
      </svg>
    `)
  },
  {
    id: 'modern-cyber-blue',
    name: 'Modern Tech Blue',
    width: 1920,
    height: 1080,
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#030712" />
            <stop offset="100%" stop-color="#0f172a" />
          </linearGradient>
          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#06b6d4" />
            <stop offset="100%" stop-color="#3b82f6" />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#bg2)" />
        
        <!-- Abstract Tech Angles -->
        <path d="M 0 0 L 400 0 L 250 1080 L 0 1080 Z" fill="rgba(6,182,212,0.06)" />
        <path d="M 1920 0 L 1600 0 L 1750 1080 L 1920 1080 Z" fill="rgba(59,130,246,0.06)" />
        
        <!-- Cyber Border -->
        <rect x="40" y="40" width="1840" height="1000" fill="none" stroke="url(#cyanGrad)" stroke-width="2" rx="16" />
        <line x1="100" y1="40" x2="300" y2="40" stroke="#38bdf8" stroke-width="6" />
        <line x1="1620" y1="1040" x2="1820" y2="1040" stroke="#06b6d4" stroke-width="6" />
        
        <g transform="translate(960, 210)" text-anchor="middle">
          <text y="20" font-family="'Montserrat', sans-serif" font-size="20" letter-spacing="8" fill="#38bdf8" font-weight="700">CERTIFICATE OF COMPLETION</text>
          <text y="55" font-family="'Inter', sans-serif" font-size="13" letter-spacing="3" fill="#64748b">FOR SUCCESSFUL PARTICIPATION &amp; ACHIEVEMENT</text>
        </g>
        
        <g transform="translate(480, 890)" text-anchor="middle">
          <line x1="-140" y1="0" x2="140" y2="0" stroke="#334155" stroke-width="2" />
          <text y="24" font-family="'Inter', sans-serif" font-size="12" letter-spacing="2" fill="#64748b">INSTRUCTOR</text>
        </g>
        <g transform="translate(1440, 890)" text-anchor="middle">
          <line x1="-140" y1="0" x2="140" y2="0" stroke="#334155" stroke-width="2" />
          <text y="24" font-family="'Inter', sans-serif" font-size="12" letter-spacing="2" fill="#64748b">ORGANIZATION</text>
        </g>
      </svg>
    `)
  },
  {
    id: 'clean-ivory',
    name: 'Clean Minimalist Light',
    width: 1920,
    height: 1080,
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
        <rect width="1920" height="1080" fill="#fcfbf7" />
        
        <!-- Elegant Double Border -->
        <rect x="50" y="50" width="1820" height="980" fill="none" stroke="#292524" stroke-width="3" />
        <rect x="62" y="62" width="1796" height="956" fill="none" stroke="#78716c" stroke-width="1" />
        
        <g transform="translate(960, 220)" text-anchor="middle">
          <text y="20" font-family="'Cinzel', Georgia, serif" font-size="26" letter-spacing="10" fill="#1c1917" font-weight="700">CERTIFICATE OF MERIT</text>
          <text y="60" font-family="'Inter', sans-serif" font-size="14" letter-spacing="4" fill="#78716c">IS PRESENTED TO</text>
        </g>
        
        <g transform="translate(480, 890)" text-anchor="middle">
          <line x1="-150" y1="0" x2="150" y2="0" stroke="#a8a29e" stroke-width="1.5" />
          <text y="24" font-family="'Inter', sans-serif" font-size="13" letter-spacing="2" fill="#57534e">DIRECTOR</text>
        </g>
        <g transform="translate(1440, 890)" text-anchor="middle">
          <line x1="-150" y1="0" x2="150" y2="0" stroke="#a8a29e" stroke-width="1.5" />
          <text y="24" font-family="'Inter', sans-serif" font-size="13" letter-spacing="2" fill="#57534e">DATE</text>
        </g>
      </svg>
    `)
  }
];

export const DEFAULT_ELEMENTS = [
  {
    id: 'el_name',
    tag: '{{Full_Name}}',
    text: 'Dr. Evelyn Montgomery',
    x: 460,
    y: 380,
    width: 1000,
    height: 100,
    fontSize: 54,
    fontFamily: 'Great Vibes',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fill: '#fbbf24',
    align: 'center',
    autoFit: true
  },
  {
    id: 'el_course',
    tag: '{{Course_Name}}',
    text: 'Mastering Advanced Full-Stack Architecture & Cloud AI',
    x: 460,
    y: 520,
    width: 1000,
    height: 60,
    fontSize: 22,
    fontFamily: 'Montserrat',
    fontWeight: '500',
    fontStyle: 'normal',
    fill: '#e2e8f0',
    align: 'center',
    autoFit: true
  },
  {
    id: 'el_date',
    tag: '{{Date}}',
    text: 'October 17, 2026',
    x: 1320,
    y: 840,
    width: 240,
    height: 40,
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fill: '#fbbf24',
    align: 'center',
    autoFit: true
  },
  {
    id: 'el_cert_id',
    tag: '{{Certificate_ID}}',
    text: 'CERT-2026-98124',
    x: 810,
    y: 990,
    width: 300,
    height: 30,
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: '600',
    fontStyle: 'normal',
    fill: '#64748b',
    align: 'center',
    autoFit: false
  }
];

// Sample recipients dataset for quick 1-click test
export const SAMPLE_RECIPIENTS = [
  { 'Full_Name': 'Alexander Hayes', 'Course_Name': 'Mastering Advanced Full-Stack Architecture', 'Date': 'October 17, 2026', 'Certificate_ID': 'CERT-2026-001' },
  { 'Full_Name': 'Dr. Samantha Vance', 'Course_Name': 'Mastering Advanced Full-Stack Architecture', 'Date': 'October 17, 2026', 'Certificate_ID': 'CERT-2026-002' },
  { 'Full_Name': 'Liam O\'Connor', 'Course_Name': 'Mastering Advanced Full-Stack Architecture', 'Date': 'October 17, 2026', 'Certificate_ID': 'CERT-2026-003' },
  { 'Full_Name': 'Zainab Fatima Al-Mansoor', 'Course_Name': 'Mastering Advanced Full-Stack Architecture', 'Date': 'October 17, 2026', 'Certificate_ID': 'CERT-2026-004' },
  { 'Full_Name': 'Marcus Sterling', 'Course_Name': 'Mastering Advanced Full-Stack Architecture', 'Date': 'October 17, 2026', 'Certificate_ID': 'CERT-2026-005' }
];
