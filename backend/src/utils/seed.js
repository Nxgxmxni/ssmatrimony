const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');
const dotenv = require('dotenv');

// Configure DNS fallback for reliable mongodb+srv SRV record resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore
}
const User = require('../models/User');
const Profile = require('../models/Profile');
const Interest = require('../models/Interest');
const SuccessStory = require('../models/SuccessStory');
const Message = require('../models/Message');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const sampleProfilesData = [
  // GROOMS
  {
    email: 'rahul.sharma@example.com',
    fullName: 'Rahul Sharma',
    gender: 'groom',
    dateOfBirth: new Date('1995-06-15'),
    age: 31,
    heightCm: 178,
    motherTongue: 'Hindi',
    religion: 'Hindu',
    caste: 'Brahmin',
    highestEducation: 'M.Tech / MS (Computer Science)',
    occupation: 'Senior Software Architect',
    company: 'Google / Tech Corp',
    annualIncome: '25-30 LPA',
    city: 'Bangalore',
    state: 'Karnataka',
    aboutMe: 'Passionate software engineer who loves trekking, photography, and classical music. Looking for a simple, educated girl with strong family values.',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    email: 'rohan.mehta@example.com',
    fullName: 'Dr. Rohan Mehta',
    gender: 'groom',
    dateOfBirth: new Date('1993-11-20'),
    age: 32,
    heightCm: 175,
    motherTongue: 'Gujarati',
    religion: 'Hindu',
    caste: 'Vaishnav',
    highestEducation: 'MD / MBBS (Cardiology)',
    occupation: 'Cardiologist',
    company: 'Apollo Hospitals',
    annualIncome: '35+ LPA',
    city: 'Mumbai',
    state: 'Maharashtra',
    aboutMe: 'Dedicated medical professional with a passion for wellness and travel. Family oriented and looking for a caring partner to share life journey.',
    photos: [
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    email: 'arjun.nair@example.com',
    fullName: 'Arjun Nair',
    gender: 'groom',
    dateOfBirth: new Date('1996-03-08'),
    age: 30,
    heightCm: 182,
    motherTongue: 'Malayalam',
    religion: 'Hindu',
    caste: 'Nair',
    highestEducation: 'MBA (IIM Ahmedabad)',
    occupation: 'Product Manager',
    company: 'Amazon India',
    annualIncome: '28 LPA',
    city: 'Hyderabad',
    state: 'Telangana',
    aboutMe: 'Energetic PM, badminton player, and avid reader. Believe in equality and mutual respect in a relationship.',
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    email: 'vikram.singh@example.com',
    fullName: 'Vikramjit Singh',
    gender: 'groom',
    dateOfBirth: new Date('1994-08-12'),
    age: 32,
    heightCm: 185,
    motherTongue: 'Punjabi',
    religion: 'Sikh',
    caste: 'Jat Sikh',
    highestEducation: 'B.Tech Mechanical Engineering',
    occupation: 'Entrepreneur / Industrialist',
    company: 'Singh Auto Components',
    annualIncome: '40+ LPA',
    city: 'Chandigarh',
    state: 'Punjab',
    aboutMe: 'Automobile enthusiast and founder of a growing manufacturing unit. Looking for a modern, family-conscious partner.',
    photos: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    email: 'karthik.ram@example.com',
    fullName: 'Karthik Ramanathan',
    gender: 'groom',
    dateOfBirth: new Date('1997-01-25'),
    age: 29,
    heightCm: 173,
    motherTongue: 'Tamil',
    religion: 'Hindu',
    caste: 'Iyer',
    highestEducation: 'MS in Data Science',
    occupation: 'AI Research Scientist',
    company: 'Microsoft Research',
    annualIncome: '32 LPA',
    city: 'Chennai',
    state: 'Tamil Nadu',
    aboutMe: 'Tech nerd by day, Carnatic music enthusiast by night. Looking for a partner who enjoys deep conversations and travel.',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
    ]
  },

  // BRIDES
  {
    email: 'priya.verma@example.com',
    fullName: 'Priya Verma',
    gender: 'bride',
    dateOfBirth: new Date('1997-04-10'),
    age: 29,
    heightCm: 165,
    motherTongue: 'Hindi',
    religion: 'Hindu',
    caste: 'Kayastha',
    highestEducation: 'MBA (Finance)',
    occupation: 'Investment Banker',
    company: 'JP Morgan',
    annualIncome: '22 LPA',
    city: 'Delhi NCR',
    state: 'Delhi',
    aboutMe: 'Independent, cultured, and upbeat finance professional. Passionate about art, culinary exploration, and yoga.',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    email: 'ananya.deshmukh@example.com',
    fullName: 'Ananya Deshmukh',
    gender: 'bride',
    dateOfBirth: new Date('1998-09-05'),
    age: 28,
    heightCm: 162,
    motherTongue: 'Marathi',
    religion: 'Hindu',
    caste: 'Maratha',
    highestEducation: 'M.Design (UI/UX)',
    occupation: 'Lead Product Designer',
    company: 'Fintech Corp',
    annualIncome: '18 LPA',
    city: 'Pune',
    state: 'Maharashtra',
    aboutMe: 'Creative mind with a soft spot for interior design, baking, and weekend getaways. Seeking an understanding partner.',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    email: 'sneha.reddy@example.com',
    fullName: 'Dr. Sneha Reddy',
    gender: 'bride',
    dateOfBirth: new Date('1996-07-18'),
    age: 30,
    heightCm: 168,
    motherTongue: 'Telugu',
    religion: 'Hindu',
    caste: 'Reddy',
    highestEducation: 'MDS (Orthodontics)',
    occupation: 'Dental Surgeon',
    company: 'Smile Care Clinic',
    annualIncome: '20 LPA',
    city: 'Hyderabad',
    state: 'Telangana',
    aboutMe: 'Doctor who believes in maintaining a healthy work-life balance. Family values are very central to my life.',
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    email: 'diya.chatterjee@example.com',
    fullName: 'Diya Chatterjee',
    gender: 'bride',
    dateOfBirth: new Date('1999-02-14'),
    age: 27,
    heightCm: 160,
    motherTongue: 'Bengali',
    religion: 'Hindu',
    caste: 'Brahmin',
    highestEducation: 'MA in Journalism & Media',
    occupation: 'Senior Content Strategist',
    company: 'Digital Media House',
    annualIncome: '14 LPA',
    city: 'Kolkata',
    state: 'West Bengal',
    aboutMe: 'Avid reader, traveler, and blogger. Love warm coffee, classical music, and honest conversations.',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    email: 'simran.kaur@example.com',
    fullName: 'Simran Kaur',
    gender: 'bride',
    dateOfBirth: new Date('1996-12-01'),
    age: 29,
    heightCm: 170,
    motherTongue: 'Punjabi',
    religion: 'Sikh',
    caste: 'Jat Sikh',
    highestEducation: 'M.Sc Fashion Technology',
    occupation: 'Fashion Designer & Stylist',
    company: 'Couture Studio',
    annualIncome: '16 LPA',
    city: 'Ludhiana',
    state: 'Punjab',
    aboutMe: 'Vibrant personality, passion for fashion and design. Looking for a respectful and caring life partner.',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
    ]
  }
];

const seedDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI;
    if (!connUri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }
    console.log('Seeding DB...');
    await mongoose.connect(connUri);

    // Clear existing data
    await User.deleteMany();
    await Profile.deleteMany();
    await Interest.deleteMany();
    await Message.deleteMany();
    await SuccessStory.deleteMany();

    console.log('Cleared existing records...');

    // 1. Create Admin Account
    const adminUser = await User.create({
      email: 'admin@ssmatrimony.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9876543210',
    });

    console.log('Admin user created: admin@ssmatrimony.com / admin123');

    // 2. Create Sample Users & Profiles
    const createdUsers = [];
    const createdProfiles = [];

    for (const data of sampleProfilesData) {
      const user = await User.create({
        email: data.email,
        password: 'password123',
        phone: `+91 ${Math.floor(9000000000 + Math.random() * 900000000)}`,
      });

      const profile = await Profile.create({
        user: user._id,
        fullName: data.fullName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        age: data.age,
        heightCm: data.heightCm,
        motherTongue: data.motherTongue,
        religion: data.religion,
        caste: data.caste,
        highestEducation: data.highestEducation,
        occupation: data.occupation,
        company: data.company,
        annualIncome: data.annualIncome,
        city: data.city,
        state: data.state,
        aboutMe: data.aboutMe,
        photos: data.photos,
        isVerified: true,
        partnerExpectations: {
          minAge: data.age - 5,
          maxAge: data.age + 5,
          religion: data.religion,
          maritalStatus: 'Never Married',
          education: 'Graduate',
          location: 'Any',
        },
      });

      createdUsers.push(user);
      createdProfiles.push(profile);
    }

    console.log(`Created ${createdProfiles.length} sample matrimony profiles.`);

    // 3. Create Sample Interest Requests between Rahul (groom[0]) and Priya (bride[5])
    const groom0 = createdProfiles[0]; // Rahul Sharma
    const bride0 = createdProfiles[5]; // Priya Verma

    const interest1 = await Interest.create({
      sender: groom0.user,
      senderProfile: groom0._id,
      recipient: bride0.user,
      recipientProfile: bride0._id,
      status: 'accepted',
      message: 'Hi Priya, I read your profile and found our interests align very well. Would love to connect!',
    });

    // Message exchange between connected pair
    await Message.create({
      sender: groom0.user,
      recipient: bride0.user,
      content: 'Hello Priya, thank you for accepting my interest request!',
    });

    await Message.create({
      sender: bride0.user,
      recipient: groom0.user,
      content: 'Hi Rahul! Nice to connect with you. How is your day going?',
    });

    console.log('Created sample connected interest and messages.');

    // 4. Create Success Stories
    await SuccessStory.create([
      {
        coupleNames: 'Sai Krishna & Sravani',
        weddingDate: '15th December 2024',
        story: 'We met through SS Matrimony matching. What started with an express interest call turned into a sacred Telugu wedding ceremony with family blessings!',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=95',
        location: 'Hyderabad, Telangana',
      },
      {
        coupleNames: 'Rohan & Harika',
        weddingDate: '24th November 2024',
        story: 'Both our families found complete transparency and peace of mind on SS Matrimony. Outdoor pre-wedding photoshoot in traditional Telugu attire!',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2400&q=95',
        location: 'Dallas / Vijayawada',
      },
      {
        coupleNames: 'Vikram & Sushma',
        weddingDate: '10th January 2025',
        story: 'Grateful to SS Matrimony for bringing our families together. Blessed with warm golden mandap lighting and lifelong togetherness.',
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=2400&q=95',
        location: 'Visakhapatnam, Andhra Pradesh',
      },
    ]);

    console.log('Seeded success stories.');
    console.log('\n--- SEED COMPLETE ---');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedDB();
