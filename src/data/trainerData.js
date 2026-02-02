export const TRAINER_DATA = [
  {
    id: 1,
    name: "Aavya Sharma",
    category: "yoga",
    specialization: "Hatha Yoga & Meditation",
    experience: 8,
    rating: 4.9,
    reviewCount: 234,
    bio: "Certified yoga instructor specializing in traditional Hatha yoga and mindfulness meditation. Helping clients find inner peace and physical balance.",
    availability: "available",
    price: 1200,
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop&crop=face",
    isTopRated: true,
    certifications: ["RYT-500", "Meditation Coach"]
  },
  {
    id: 2,
    name: "Aryan Khan",
    category: "gym",
    specialization: "Bodybuilding & HIIT",
    experience: 7,
    rating: 4.8,
    reviewCount: 189,
    bio: "Professional fitness trainer with expertise in muscle building and high-intensity workouts. Transform your body with science-backed training.",
    availability: "available",
    price: 1800,
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=400&fit=crop&crop=face",
    isTopRated: true,
    certifications: ["ACE Certified", "CrossFit L2"]
  },
  {
    id: 3,
    name: "Dr. Ananya Iyer",
    category: "nutrition",
    specialization: "Clinical Nutrition",
    experience: 10,
    rating: 4.9,
    reviewCount: 312,
    bio: "Board-certified nutritionist specializing in weight management and therapeutic diets. Evidence-based approach to optimal health.",
    availability: "busy",
    price: 2000,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    isTopRated: true,
    certifications: ["PhD Nutrition", "Diabetes Educator"]
  },
  {
    id: 4,
    name: "Rohan Varma",
    category: "yoga",
    specialization: "Vinyasa Flow & Power Yoga",
    experience: 5,
    rating: 4.8,
    reviewCount: 156,
    bio: "Dynamic yoga instructor bringing energy and flow to every session. Perfect for those looking to build strength through yoga.",
    availability: "available",
    price: 999,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face",
    isTopRated: false,
    certifications: ["RYT-200", "Yoga Alliance"]
  },
  {
    id: 5,
    name: "Dr. Meera Krishnan",
    category: "doctor",
    specialization: "Ayurvedic Medicine",
    experience: 15,
    rating: 5.0,
    reviewCount: 428,
    bio: "Renowned Ayurvedic physician combining ancient wisdom with modern diagnostics. Holistic healing for chronic conditions.",
    availability: "available",
    price: 2500,
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop&crop=face",
    isTopRated: true,
    certifications: ["BAMS", "MD Ayurveda"]
  },
  {
    id: 6,
    name: "Sana Reddy",
    category: "gym",
    specialization: "Functional Training & Zumba",
    experience: 4,
    rating: 4.9,
    reviewCount: 198,
    bio: "Energetic trainer making fitness fun! Specializing in dance-based workouts and functional movement patterns.",
    availability: "available",
    price: 1200,
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400&h=400&fit=crop&crop=face",
    isTopRated: false,
    certifications: ["Zumba Licensed", "NASM-CPT"]
  },
  {
    id: 7,
    name: "Vikram Malhotra",
    category: "nutrition",
    specialization: "Sports Nutrition & Keto",
    experience: 6,
    rating: 4.7,
    reviewCount: 145,
    bio: "Sports nutrition specialist helping athletes and fitness enthusiasts optimize performance through diet.",
    availability: "busy",
    price: 1499,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    isTopRated: false,
    certifications: ["Sports Dietitian", "Precision Nutrition"]
  },
  {
    id: 8,
    name: "Ishani Gupta",
    category: "yoga",
    specialization: "Therapeutic & Prenatal Yoga",
    experience: 12,
    rating: 5.0,
    reviewCount: 267,
    bio: "Senior yoga therapist with special focus on healing yoga and prenatal care. Gentle, restorative sessions for all levels.",
    availability: "available",
    price: 1500,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    isTopRated: true,
    certifications: ["C-IAYT", "Prenatal Certified"]
  },
  {
    id: 9,
    name: "Dr. Rajesh Menon",
    category: "doctor",
    specialization: "Integrative Medicine",
    experience: 20,
    rating: 4.9,
    reviewCount: 521,
    bio: "Pioneer in integrative medicine combining Western medicine with traditional healing. Comprehensive approach to wellness.",
    availability: "available",
    price: 3000,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
    isTopRated: true,
    certifications: ["MD", "Fellowship Integrative Medicine"]
  },
  {
    id: 10,
    name: "Priya Nair",
    category: "gym",
    specialization: "Strength & Conditioning",
    experience: 6,
    rating: 4.8,
    reviewCount: 176,
    bio: "Strength coach dedicated to empowering women through weight training. Build confidence alongside muscle.",
    availability: "available",
    price: 1400,
    image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=400&fit=crop&crop=face",
    isTopRated: false,
    certifications: ["CSCS", "Women's Fitness Specialist"]
  }
];

export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Trainers' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'gym', label: 'Gym & Fitness' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'doctor', label: 'Doctors' }
];

export const getCategoryColor = (category) => {
  const colors = {
    yoga: '#52c41a',
    gym: '#722ed1',
    nutrition: '#1890ff',
    doctor: '#eb2f96'
  };
  return colors[category] || '#2d6a4f';
};

export const getCategoryLabel = (category) => {
  const labels = {
    yoga: 'Yoga',
    gym: 'Fitness',
    nutrition: 'Nutrition',
    doctor: 'Doctor'
  };
  return labels[category] || category;
};
