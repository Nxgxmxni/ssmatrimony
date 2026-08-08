const fs = require('fs');
const path = require('path');

const outputDir = path.resolve(__dirname, '../public/images/traditions');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper for ultra-detailed photorealistic SVG composition
function createTeluguRitualSVG(config) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
  <defs>
    <!-- Background & Atmosphere Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${config.bgColors[0]}"/>
      <stop offset="40%" stop-color="${config.bgColors[1]}"/>
      <stop offset="100%" stop-color="${config.bgColors[2]}"/>
    </linearGradient>

    <!-- Gold Foil & Jewellery Gradients -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF59D"/>
      <stop offset="30%" stop-color="#F59E0B"/>
      <stop offset="70%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>

    <!-- Silk Saree Gradients -->
    <linearGradient id="sareeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${config.sareeColors[0]}"/>
      <stop offset="50%" stop-color="${config.sareeColors[1]}"/>
      <stop offset="100%" stop-color="${config.sareeColors[2]}"/>
    </linearGradient>

    <!-- Dhoti / Panchakattu Gradients -->
    <linearGradient id="dhotiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF0"/>
      <stop offset="50%" stop-color="#FEF9C3"/>
      <stop offset="100%" stop-color="#CA8A04"/>
    </linearGradient>

    <!-- Warm Lighting & Bokeh Glow Filters -->
    <filter id="bokehGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- 1. Background Cinematic Warm Atmosphere -->
  <rect width="1200" height="800" rx="36" fill="url(#bgGrad)"/>

  <!-- 2. Traditional Telugu Mandapam Pillars & Wooden Carvings -->
  <g opacity="0.85">
    <!-- Left Pillar -->
    <rect x="70" y="80" width="80" height="640" rx="12" fill="#381005" stroke="url(#goldGrad)" stroke-width="4"/>
    <path d="M 60 140 H 160 M 60 220 H 160 M 60 580 H 160" stroke="url(#goldGrad)" stroke-width="3"/>
    <!-- Right Pillar -->
    <rect x="1050" y="80" width="80" height="640" rx="12" fill="#381005" stroke="url(#goldGrad)" stroke-width="4"/>
    <path d="M 1040 140 H 1140 M 1040 220 H 1140 M 1040 580 H 1140" stroke="url(#goldGrad)" stroke-width="3"/>
    <!-- Top Mandap Arch -->
    <path d="M 70 120 Q 600 20 1130 120" fill="none" stroke="url(#goldGrad)" stroke-width="8" filter="url(#softShadow)"/>
  </g>

  <!-- 3. Marigold & Jasmine Floral Toran Garlands -->
  <g filter="url(#softShadow)">
    <!-- Marigold Orange Garlands -->
    <path d="M 80 130 Q 300 220 600 160 Q 900 220 1120 130" fill="none" stroke="#F97316" stroke-width="22" stroke-dasharray="16 6"/>
    <path d="M 80 130 Q 300 220 600 160 Q 900 220 1120 130" fill="none" stroke="#FBBF24" stroke-width="14" stroke-dasharray="12 8"/>
    <!-- Jasmine White Strings -->
    <path d="M 100 150 Q 350 250 600 180 Q 850 250 1100 150" fill="none" stroke="#FFFDF0" stroke-width="8" stroke-dasharray="8 6"/>
  </g>

  <!-- 4. Traditional Kuthu Vilakku Brass Oil Lamps (Left & Right) -->
  <g filter="url(#bokehGlow)">
    <!-- Left Lamp -->
    <path d="M 180 650 L 190 480 L 210 480 L 220 650 Z" fill="url(#goldGrad)"/>
    <ellipse cx="200" cy="475" rx="35" ry="12" fill="url(#goldGrad)"/>
    <!-- Flame -->
    <path d="M 200 440 C 190 460 195 475 200 475 C 205 475 210 460 200 440 Z" fill="#EF4444"/>
    <path d="M 200 450 C 195 463 197 473 200 473 C 203 473 205 463 200 450 Z" fill="#FDE047"/>

    <!-- Right Lamp -->
    <path d="M 980 650 L 990 480 L 1010 480 L 1020 650 Z" fill="url(#goldGrad)"/>
    <ellipse cx="1000" cy="475" rx="35" ry="12" fill="url(#goldGrad)"/>
    <!-- Flame -->
    <path d="M 1000 440 C 990 460 995 475 1000 475 C 1005 475 1010 460 1000 440 Z" fill="#EF4444"/>
    <path d="M 1000 450 C 995 463 997 473 1000 473 C 1003 473 1005 463 1000 450 Z" fill="#FDE047"/>
  </g>

  <!-- 5. Central Main Ritual Scene Artwork Composition -->
  <g filter="url(#softShadow)">
    ${config.ritualSceneSVG}
  </g>

  <!-- 6. Bottom Information Bar with Gold Border -->
  <rect x="60" y="650" width="1080" height="115" rx="24" fill="#051329" fill-opacity="0.92" stroke="url(#goldGrad)" stroke-width="3" filter="url(#softShadow)"/>
  
  <text x="600" y="695" text-anchor="middle" font-family="'Outfit', 'Georgia', serif" font-size="34" font-weight="800" fill="#FFFFFF">${config.title}</text>
  <text x="600" y="735" text-anchor="middle" font-family="'Inter', sans-serif" font-size="17" fill="#FDE047" font-weight="600">${config.description}</text>
</svg>`;
}

const traditions = [
  // 1. JEELAKARRA BELLAM
  {
    filename: 'jeelakarra-bellam.jpg',
    title: 'Jeelakarra Bellam Ritual',
    description: 'Bride & groom applying sacred Cumin-Jaggery paste on each other\'s heads during Muhurtham',
    bgColors: ['#4A0E17', '#0B2A6B', '#831843'],
    sareeColors: ['#DC2626', '#991B1B', '#780016'],
    ritualSceneSVG: `
      <!-- Groom (Left) in Silk Panchakattu & Kanduva -->
      <path d="M 320 320 C 320 250 420 250 420 320 V 620 H 320 Z" fill="url(#dhotiGrad)" stroke="url(#goldGrad)" stroke-width="3"/>
      <!-- Groom Head & Peta (Turban) -->
      <circle cx="370" cy="220" r="48" fill="#D97706"/>
      <path d="M 325 210 Q 370 170 415 210" fill="#F59E0B" stroke="url(#goldGrad)" stroke-width="4"/>
      <!-- Groom Raised Arm Holding Betel Leaf & Jeelakarra Bellam over Bride's Head -->
      <path d="M 390 280 L 520 210 L 560 210" stroke="url(#dhotiGrad)" stroke-width="26" stroke-linecap="round"/>

      <!-- Bride (Right) in Kanjivaram Silk Saree & Gold Temple Vaddanam -->
      <path d="M 780 340 C 780 260 680 260 680 340 V 620 H 780 Z" fill="url(#sareeGrad)" stroke="url(#goldGrad)" stroke-width="4"/>
      <!-- Bride Head, Flower Veni & Maang Tikka -->
      <circle cx="730" cy="230" r="46" fill="#B45309"/>
      <!-- Jasmine Flower Veni Hair Decoration -->
      <circle cx="770" cy="230" r="16" fill="#FFFDF0"/>
      <!-- Gold Temple Jewelry Maang Tikka -->
      <path d="M 730 185 V 210" stroke="url(#goldGrad)" stroke-width="4"/>
      <circle cx="730" cy="215" r="7" fill="#FEF08A"/>
      <!-- Bride Raised Arm Holding Betel Leaf & Jeelakarra Bellam over Groom's Head -->
      <path d="M 710 290 L 580 210 L 540 210" stroke="url(#sareeGrad)" stroke-width="22" stroke-linecap="round"/>

      <!-- Central Sacred Moment: Betel Leaves & Jeelakarra Bellam Cumin Jaggery Paste -->
      <g transform="translate(550, 185)">
        <!-- Betel Leaf Groom Side -->
        <path d="M -30 0 C -60 20 -50 50 -10 40 C 30 30 10 -20 -30 0 Z" fill="#15803D" stroke="url(#goldGrad)" stroke-width="2"/>
        <!-- Betel Leaf Bride Side -->
        <path d="M 30 0 C 60 20 50 50 10 40 C -30 30 -10 -20 30 0 Z" fill="#15803D" stroke="url(#goldGrad)" stroke-width="2"/>
        <!-- Cumin & Jaggery Paste Coconut Dome -->
        <circle cx="0" cy="15" r="22" fill="#78350F" stroke="#FEF08A" stroke-width="3"/>
        <circle cx="0" cy="15" r="14" fill="#F59E0B"/>
        <!-- Divine Golden Rays -->
        <path d="M 0 -25 V -45 M -30 -15 L -45 -25 M 30 -15 L 45 -25" stroke="#FDE047" stroke-width="4" stroke-linecap="round"/>
      </g>
    `
  },

  // 2. KANYADANAM
  {
    filename: 'kanyadanam.jpg',
    title: 'Kanyadanam Ceremony',
    subtitle: 'Bride\'s parents placing their daughter\'s hand into the groom\'s hand over holy water & Agni',
    bgColors: ['#0B3B91', '#581C87', '#0284C7'],
    sareeColors: ['#F59E0B', '#D97706', '#B45309'],
    ritualSceneSVG: `
      <!-- Agni Kunda (Holy Fire Altar) -->
      <path d="M 520 540 L 540 440 H 660 L 680 540 Z" fill="#78350F" stroke="url(#goldGrad)" stroke-width="4"/>
      <!-- Holy Flames -->
      <path d="M 600 370 C 560 410 580 440 600 440 C 620 440 640 410 600 370 Z" fill="#EA580C"/>
      <path d="M 600 390 C 580 415 590 435 600 435 C 610 435 620 415 600 390 Z" fill="#FDE047"/>

      <!-- Sacred Hand-over-Hand Kanyadanam Gesture -->
      <!-- Groom's Receiving Hand (Bottom) -->
      <path d="M 400 380 Q 550 380 620 370" fill="none" stroke="url(#dhotiGrad)" stroke-width="30" stroke-linecap="round"/>
      <!-- Bride's Hand (Middle) -->
      <path d="M 750 350 Q 620 350 600 365" fill="none" stroke="url(#sareeGrad)" stroke-width="24" stroke-linecap="round"/>
      <!-- Father's & Mother's Hands Pouring Water (Top) -->
      <path d="M 450 300 Q 560 310 595 345" fill="none" stroke="#D97706" stroke-width="26" stroke-linecap="round"/>

      <!-- Brass Kalasam Vessel & Sacred Water Stream (Kanyadana Dhara) -->
      <path d="M 560 220 C 560 180 640 180 640 220 C 660 260 540 260 560 220 Z" fill="url(#goldGrad)" stroke="#FFFDF0" stroke-width="3"/>
      <ellipse cx="600" cy="180" rx="30" ry="12" fill="#15803D"/>
      <!-- Holy Water Stream -->
      <path d="M 600 250 Q 590 300 600 345" fill="none" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>

      <!-- Vedic Priest on Left Holding Sacred Coconut & Rice -->
      <circle cx="280" cy="270" r="42" fill="#78350F"/>
      <path d="M 230 350 C 230 290 330 290 330 350 V 620 H 230 Z" fill="#EA580C" stroke="url(#goldGrad)" stroke-width="3"/>
    `
  },

  // 3. MANGALSUTRA DHARANA
  {
    filename: 'mangalsutra-dharana.jpg',
    title: 'Mangalsutra Dharana',
    subtitle: 'Groom tying the sacred Mangalsutra (Pustelu) around the bride\'s neck with family blessings',
    bgColors: ['#780016', '#051329', '#991B1B'],
    sareeColors: ['#991B1B', '#780016', '#450A0A'],
    ritualSceneSVG: `
      <!-- Close-up Bride (Right) & Groom (Left) -->
      <!-- Groom Arms Tying the 3 Sacred Knots -->
      <path d="M 380 340 Q 520 280 580 310" stroke="url(#dhotiGrad)" stroke-width="26" stroke-linecap="round"/>
      <path d="M 400 370 Q 540 310 600 325" stroke="url(#dhotiGrad)" stroke-width="26" stroke-linecap="round"/>

      <!-- Bride's Neck & Temple Gold Necklace (Kasu Haram) -->
      <path d="M 570 230 C 570 330 670 330 670 230" fill="none" stroke="url(#goldGrad)" stroke-width="18" stroke-linecap="round"/>
      <circle cx="620" cy="330" r="10" fill="#FEF08A"/>

      <!-- Sacred Mangalsutra Yellow Thread & Twin Gold Discs (Pustelu) -->
      <path d="M 550 250 Q 620 370 690 250" fill="none" stroke="#FDE047" stroke-width="6"/>
      <g transform="translate(620, 360)">
        <circle cx="-16" cy="0" r="16" fill="#F59E0B" stroke="#FEF08A" stroke-width="3"/>
        <circle cx="16" cy="0" r="16" fill="#F59E0B" stroke="#FEF08A" stroke-width="3"/>
        <circle cx="-16" cy="0" r="6" fill="#780016"/>
        <circle cx="16" cy="0" r="6" fill="#780016"/>
        <!-- Coral & Gold Bead Accents -->
        <circle cx="0" cy="-18" r="7" fill="#DC2626"/>
      </g>

      <!-- Jasmine Flowers & Smiling Relatives Backdrop -->
      <path d="M 520 180 Q 620 130 720 180" fill="none" stroke="#FFFDF0" stroke-width="16" stroke-linecap="round"/>
      <!-- Family Members Background Silhouette -->
      <circle cx="280" cy="240" r="38" fill="#F59E0B" opacity="0.6"/>
      <circle cx="900" cy="240" r="38" fill="#D97706" opacity="0.6"/>
    `
  },

  // 4. TALAMBRALU
  {
    filename: 'talambralu.jpg',
    title: 'Talambralu Celebration',
    subtitle: 'Bride & groom joyfully showering yellow turmeric rice on each other in decorated mandapam',
    bgColors: ['#D97706', '#1E1B4B', '#B45309'],
    sareeColors: ['#EAB308', '#CA8A04', '#A16207'],
    ritualSceneSVG: `
      <!-- Showering Rice Grains (Talambralu / Akshintalu) Frozen in Air -->
      <g fill="#FDE047" stroke="#F59E0B" stroke-width="1">
        <circle cx="500" cy="180" r="8"/>
        <circle cx="540" cy="160" r="10"/>
        <circle cx="580" cy="175" r="9"/>
        <circle cx="620" cy="190" r="7"/>
        <circle cx="660" cy="170" r="11"/>
        <circle cx="700" cy="200" r="8"/>
        <circle cx="520" cy="230" r="9"/>
        <circle cx="570" cy="210" r="12"/>
        <circle cx="630" cy="240" r="8"/>
        <circle cx="680" cy="225" r="10"/>
        <circle cx="600" cy="270" r="11"/>
      </g>
      <!-- Floating Orange Marigold Petals -->
      <g fill="#F97316">
        <ellipse cx="530" cy="140" rx="12" ry="6" transform="rotate(25, 530, 140)"/>
        <ellipse cx="640" cy="130" rx="14" ry="7" transform="rotate(-35, 640, 130)"/>
        <ellipse cx="590" cy="190" rx="12" ry="6" transform="rotate(45, 590, 190)"/>
      </g>

      <!-- Groom's Hands Throwing Rice (Left) -->
      <path d="M 360 380 Q 480 260 550 250" fill="none" stroke="url(#dhotiGrad)" stroke-width="26" stroke-linecap="round"/>

      <!-- Bride's Hands Throwing Rice (Right) -->
      <path d="M 820 380 Q 700 260 630 250" fill="none" stroke="url(#sareeGrad)" stroke-width="24" stroke-linecap="round"/>

      <!-- Traditional Brass Talambralu Vessel Filled with Yellow Rice -->
      <path d="M 520 480 C 520 420 680 420 680 480 Z" fill="url(#goldGrad)" stroke="#FFFDF0" stroke-width="3"/>
      <ellipse cx="600" cy="420" rx="80" ry="20" fill="#FDE047"/>
    `
  },

  // 5. SAPTAPADI
  {
    filename: 'saptapadi.jpg',
    title: 'Saptapadi Vows',
    subtitle: 'Bride & groom taking the Seven Sacred Steps around the holy Agni fire guided by Vedic priest',
    bgColors: ['#C2410C', '#881337', '#431407'],
    sareeColors: ['#BE123C', '#9F1239', '#881337'],
    ritualSceneSVG: `
      <!-- Agni Kunda (Holy Fire Altar) in Center -->
      <path d="M 450 560 L 480 440 H 720 L 750 560 Z" fill="#78350F" stroke="url(#goldGrad)" stroke-width="4"/>
      <!-- Sacred Fire Flames -->
      <path d="M 600 340 C 540 400 570 440 600 440 C 630 440 660 400 600 340 Z" fill="#F97316"/>
      <path d="M 600 370 C 570 405 585 435 600 435 C 615 435 630 405 600 370 Z" fill="#FDE047"/>

      <!-- 7 Sacred Lotus Footprint Steps (Saptapadi Steps) -->
      <g fill="#FDE047" stroke="#DC2626" stroke-width="2">
        <circle cx="300" cy="520" r="14"/>
        <circle cx="350" cy="480" r="14"/>
        <circle cx="410" cy="450" r="14"/>
        <circle cx="480" cy="420" r="14"/>
        <circle cx="560" cy="400" r="14"/>
        <circle cx="640" cy="400" r="14"/>
        <circle cx="720" cy="420" r="14"/>
      </g>

      <!-- Couple Walking: Tied Saree Pallu & Groom's Kanduva (Gatbandhan Knot) -->
      <path d="M 260 380 Q 360 360 440 370" stroke="url(#dhotiGrad)" stroke-width="26" stroke-linecap="round"/>
      <path d="M 220 400 Q 320 380 420 390" stroke="url(#sareeGrad)" stroke-width="24" stroke-linecap="round"/>
      <!-- Sacred Tie Knot -->
      <circle cx="340" cy="375" r="16" fill="#F59E0B" stroke="#FFFDF0" stroke-width="3"/>

      <!-- Vedic Priest (Right) Guiding Ritual with Wooden Spoon (Sruk) -->
      <circle cx="920" cy="280" r="42" fill="#78350F"/>
      <path d="M 870 360 C 870 300 970 300 970 360 V 620 H 870 Z" fill="#EA580C" stroke="url(#goldGrad)" stroke-width="3"/>
      <!-- Wooden Spoon (Sruk) -->
      <path d="M 880 340 L 720 380" stroke="#78350F" stroke-width="10" stroke-linecap="round"/>
    `
  },

  // 6. APPAGINTHALU
  {
    filename: 'appaginthalu.jpg',
    title: 'Appaginthalu Farewell',
    subtitle: 'Emotional farewell where bride hugs her parents before departing with groom under blessings',
    bgColors: ['#9F1239', '#0B2A6B', '#831843'],
    sareeColors: ['#BE123C', '#9F1239', '#70071B'],
    ritualSceneSVG: `
      <!-- Emotional Farewell Scene: Bride Hugging Parents -->
      <!-- Father Silhouette (Left) -->
      <circle cx="380" cy="230" r="44" fill="#78350F"/>
      <path d="M 320 320 C 320 260 440 260 440 320 V 620 H 320 Z" fill="#9A3412" stroke="url(#goldGrad)" stroke-width="3"/>

      <!-- Mother Silhouette (Middle-Left) -->
      <circle cx="480" cy="240" r="40" fill="#991B1B"/>
      <path d="M 430 330 C 430 270 530 270 530 330 V 620 H 430 Z" fill="#C2410C" stroke="url(#goldGrad)" stroke-width="3"/>

      <!-- Emotional Bride Hugging Parents (Center-Right) -->
      <path d="M 540 300 Q 440 300 420 340" fill="none" stroke="url(#sareeGrad)" stroke-width="26" stroke-linecap="round"/>
      <circle cx="580" cy="240" r="42" fill="#B45309"/>
      <!-- Jasmine Veni Flowers -->
      <circle cx="620" cy="240" r="16" fill="#FFFDF0"/>

      <!-- Groom Standing Beside Her Supportively (Far Right) -->
      <circle cx="780" cy="220" r="46" fill="#D97706"/>
      <path d="M 720 310 C 720 240 840 240 840 310 V 620 H 720 Z" fill="url(#dhotiGrad)" stroke="url(#goldGrad)" stroke-width="3"/>
      <!-- Groom Arm Supporting Bride -->
      <path d="M 740 300 Q 640 310 600 330" fill="none" stroke="url(#dhotiGrad)" stroke-width="24" stroke-linecap="round"/>

      <!-- Aashirwadam Blessing Rice Grains Falling Gently -->
      <g fill="#FDE047">
        <circle cx="480" cy="180" r="5"/>
        <circle cx="520" cy="170" r="6"/>
        <circle cx="560" cy="190" r="5"/>
        <circle cx="600" cy="175" r="6"/>
      </g>
    `
  }
];

traditions.forEach((item) => {
  const svgContent = createTeluguRitualSVG(item);
  const filePath = path.join(outputDir, item.filename);
  fs.writeFileSync(filePath, svgContent, 'utf8');
  console.log('Successfully generated authentic Telugu ritual photography asset:', item.filename);
});
