const fs = require('fs');
const path = require('path');

const outputDir = path.resolve(__dirname, '../public/images/traditions');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const traditions = [
  {
    filename: 'jeelakarra-bellam.jpg',
    category: 'TRADITIONAL RITUAL',
    title: 'Jeelakarra Bellam',
    subtitle: 'Close-up of bride & groom applying Jeelakarra Bellam in traditional Telugu matrimony',
    bgGrad: ['#4A0E17', '#0B2A6B', '#831843'],
    goldGrad: ['#FEF08A', '#D4A017', '#9A3412'],
    badge: '🌿 Sacred Cumin & Jaggery Ritual',
    badgeBg: '#FEF3C7',
    badgeColor: '#92400E',
    iconPath: `
      <!-- Betel Leaf & Cumin Jaggery Paste Icon -->
      <path d="M 400 135 C 360 170, 350 210, 400 230 C 450 210, 440 170, 400 135 Z" fill="#15803D" stroke="#D4A017" stroke-width="3"/>
      <circle cx="400" cy="185" r="20" fill="#78350F" stroke="#FEF08A" stroke-width="2"/>
      <circle cx="400" cy="185" r="12" fill="#F59E0B"/>
    `
  },
  {
    filename: 'kanyadanam.jpg',
    category: 'FAMILY RITUAL',
    title: 'Kanyadanam Ceremony',
    subtitle: 'Bride\'s parents performing Kanyadanam while groom respectfully receives the bride',
    bgGrad: ['#0B3B91', '#581C87', '#0284C7'],
    goldGrad: ['#FDE047', '#D4AF37', '#B45309'],
    badge: '🙏 Parents Blessing & Trust',
    badgeBg: '#E0F2FE',
    badgeColor: '#0369A1',
    iconPath: `
      <!-- Brass Kalasam & Sacred Water Stream -->
      <path d="M 370 190 C 370 160 430 160 430 190 C 445 220 355 220 370 190 Z" fill="#D4AF37" stroke="#FEF08A" stroke-width="2"/>
      <ellipse cx="400" cy="155" rx="20" ry="10" fill="#15803D"/>
      <circle cx="400" cy="142" r="14" fill="#78350F" stroke="#D4AF37" stroke-width="2"/>
      <path d="M 400 220 Q 390 245 400 260 T 400 280" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    `
  },
  {
    filename: 'mangalsutra-dharana.jpg',
    category: 'SACRED RITUAL',
    title: 'Mangalsutra Dharana',
    subtitle: 'Groom tying the sacred Mangalsutra (Pustelu) around the bride\'s neck',
    bgGrad: ['#780016', '#051329', '#991B1B'],
    goldGrad: ['#FEF08A', '#F59E0B', '#78350F'],
    badge: '💍 Sacred Knot of Unity',
    badgeBg: '#FEE2E2',
    badgeColor: '#991B1B',
    iconPath: `
      <!-- Mangalsutra Double Disk Pendant (Pustelu) -->
      <path d="M 340 165 Q 400 210 460 165" fill="none" stroke="#D4AF37" stroke-width="4" stroke-dasharray="8 4"/>
      <circle cx="385" cy="190" r="14" fill="#F59E0B" stroke="#FEF08A" stroke-width="3"/>
      <circle cx="415" cy="190" r="14" fill="#F59E0B" stroke="#FEF08A" stroke-width="3"/>
      <circle cx="385" cy="190" r="5" fill="#780016"/>
      <circle cx="415" cy="190" r="5" fill="#780016"/>
      <path d="M 385 204 V 218 M 415 204 V 218" stroke="#D4AF37" stroke-width="3"/>
    `
  },
  {
    filename: 'talambralu.jpg',
    category: 'WEDDING RITUAL',
    title: 'Talambralu Celebration',
    subtitle: 'Bride & groom joyfully showering each other with sacred turmeric rice',
    bgGrad: ['#D97706', '#1E1B4B', '#B45309'],
    goldGrad: ['#FEF08A', '#F59E0B', '#D97706'],
    badge: '✨ Showering Prosperity & Joy',
    badgeBg: '#FEF3C7',
    badgeColor: '#B45309',
    iconPath: `
      <!-- Showering Turmeric Rice Grains & Vessel -->
      <path d="M 360 210 C 360 170 440 170 440 210 Z" fill="#D4AF37" stroke="#FEF08A" stroke-width="2"/>
      <circle cx="370" cy="140" r="4" fill="#FDE047"/>
      <circle cx="390" cy="125" r="5" fill="#F59E0B"/>
      <circle cx="410" cy="135" r="4" fill="#FDE047"/>
      <circle cx="430" cy="145" r="5" fill="#F59E0B"/>
      <circle cx="380" cy="155" r="4" fill="#FDE047"/>
      <circle cx="420" cy="160" r="4" fill="#F59E0B"/>
      <circle cx="400" cy="145" r="6" fill="#FEF08A"/>
    `
  },
  {
    filename: 'saptapadi.jpg',
    category: 'SEVEN SACRED STEPS',
    title: 'Saptapadi Vows',
    subtitle: 'Bride & groom taking seven sacred steps around the holy fire with priest\'s guidance',
    bgGrad: ['#C2410C', '#881337', '#431407'],
    goldGrad: ['#FEF08A', '#F59E0B', '#EA580C'],
    badge: '🔥 Seven Lifelong Vows',
    badgeBg: '#FFEDD5',
    badgeColor: '#C2410C',
    iconPath: `
      <!-- Agni Kunda Holy Fire & 7 Lotus Steps -->
      <path d="M 360 220 L 370 190 H 430 L 440 220 Z" fill="#78350F" stroke="#D4AF37" stroke-width="2"/>
      <path d="M 400 145 C 380 170, 390 190, 400 190 C 410 190, 420 170, 400 145 Z" fill="#F97316"/>
      <path d="M 400 160 C 390 175, 395 188, 400 188 C 405 188, 410 175, 400 160 Z" fill="#FDE047"/>
      <circle cx="340" cy="235" r="6" fill="#FDE047"/>
      <circle cx="360" cy="235" r="6" fill="#FDE047"/>
      <circle cx="380" cy="235" r="6" fill="#FDE047"/>
      <circle cx="400" cy="235" r="7" fill="#F59E0B"/>
      <circle cx="420" cy="235" r="6" fill="#FDE047"/>
      <circle cx="440" cy="235" r="6" fill="#FDE047"/>
      <circle cx="460" cy="235" r="6" fill="#FDE047"/>
    `
  },
  {
    filename: 'appaginthalu.jpg',
    category: 'FAMILY BLESSINGS',
    title: 'Appaginthalu Farewell',
    subtitle: 'Bride emotionally bidding farewell while both families bless the newly wedded couple',
    bgGrad: ['#9F1239', '#0B2A6B', '#831843'],
    goldGrad: ['#FEF08A', '#D4AF37', '#9A3412'],
    badge: '❤️ Heartfelt Family Farewell',
    badgeBg: '#FFE4E6',
    badgeColor: '#9F1239',
    iconPath: `
      <!-- Blessing Hands & Heart Motif -->
      <path d="M 370 170 C 370 145, 400 145, 400 165 C 400 145, 430 145, 430 170 C 430 195, 400 215, 400 225 C 400 215, 370 195, 370 170 Z" fill="#F43F5E" stroke="#FEF08A" stroke-width="2"/>
      <path d="M 350 210 Q 400 240 450 210" fill="none" stroke="#D4AF37" stroke-width="3" stroke-linecap="round"/>
    `
  }
];

traditions.forEach((item) => {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${item.bgGrad[0]}"/>
      <stop offset="50%" stop-color="${item.bgGrad[1]}"/>
      <stop offset="100%" stop-color="${item.bgGrad[2]}"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${item.goldGrad[0]}"/>
      <stop offset="50%" stop-color="${item.goldGrad[1]}"/>
      <stop offset="100%" stop-color="${item.goldGrad[2]}"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Layer -->
  <rect width="800" height="600" rx="32" fill="url(#bgGrad)"/>

  <!-- Outer Gold Border Frame -->
  <rect x="16" y="16" width="768" height="568" rx="24" fill="none" stroke="url(#goldGrad)" stroke-width="4" opacity="0.85"/>
  <rect x="26" y="26" width="748" height="548" rx="18" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.15"/>

  <!-- Mandap Floral Backdrop Lines -->
  <path d="M 150 580 C 150 220, 650 220, 650 580" fill="none" stroke="#D4AF37" stroke-width="2" opacity="0.2" stroke-dasharray="8 8"/>
  <circle cx="400" cy="300" r="220" fill="none" stroke="#D4AF37" stroke-width="1.5" opacity="0.1"/>

  <!-- Central Ritual Artwork Box -->
  <rect x="120" y="80" width="560" height="440" rx="28" fill="#FFFFFF" fill-opacity="0.07" stroke="url(#goldGrad)" stroke-width="2.5" filter="url(#glow)"/>

  <!-- Ritual Icon Vector Artwork -->
  <circle cx="400" cy="185" r="65" fill="#051329" stroke="url(#goldGrad)" stroke-width="3.5"/>
  ${item.iconPath}

  <!-- Ritual Category & Title Typography -->
  <text x="400" y="300" text-anchor="middle" font-family="'Outfit', 'Inter', sans-serif" font-size="14" font-weight="800" fill="#D4AF37" letter-spacing="3">${item.category}</text>
  <text x="400" y="348" text-anchor="middle" font-family="'Outfit', 'Georgia', serif" font-size="32" font-weight="800" fill="#FFFFFF">${item.title}</text>
  <text x="400" y="390" text-anchor="middle" font-family="'Inter', sans-serif" font-size="15" fill="#E2E8F0">${item.subtitle}</text>

  <!-- Bottom Badge Callout -->
  <rect x="240" y="430" width="320" height="38" rx="19" fill="${item.badgeBg}"/>
  <text x="400" y="454" text-anchor="middle" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="${item.badgeColor}">${item.badge}</text>
</svg>`;

  const filePath = path.join(outputDir, item.filename);
  fs.writeFileSync(filePath, svgContent, 'utf8');
  console.log('Successfully generated tradition placeholder:', filePath);
});
