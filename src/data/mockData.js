export const yogaData = [
  {
    id: 1,
    name: "Tadasana (Mountain Pose)",
    category: ["flexibility", "back pain", "normal"],
    benefits: "Improves posture, strengthens thighs, knees, and ankles.",
    duration: "1-2 mins",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/embed/l1C0rD_DlUE",
    steps: [
      "Stand with your feet together.",
      "Lift your toes and spread them, then place them back down.",
      "Engage your thigh muscles and lift your knee caps.",
      "Keep your arms at your sides, palms facing forward.",
      "Lengthen your spine and reach the crown of your head toward the ceiling."
    ]
  },
  {
    id: 2,
    name: "Surya Namaskar (Sun Salutation)",
    category: ["weight loss", "flexibility", "mental health"],
    benefits: "Full body workout, improves blood circulation, reduces stress.",
    duration: "5-10 mins",
    difficulty: "Intermediate",
    videoUrl: "https://www.youtube.com/embed/8v_5_S_6n-o",
    steps: [
      "Prayer pose",
      "Raised arms pose",
      "Hand to foot pose",
      "Equestrian pose",
      "Stick pose",
      "Saluting with eight points",
      "Cobra pose",
      "Mountain pose",
      "Equestrian pose",
      "Hand to foot pose",
      "Raised arms pose",
      "Mountain pose"
    ]
  },
  {
    id: 3,
    name: "Adho Mukha Svanasana (Downward Dog)",
    category: ["flexibility", "back pain", "obesity"],
    benefits: "Calms the brain, energizes the body, stretches shoulders, hamstrings, and calves.",
    duration: "1-3 mins",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/embed/6EpSBRCQ3w8",
    steps: [
      "Start on your hands and knees.",
      "Tuck your toes and lift your knees off the floor.",
      "Extend your tailbone away from the back of your pelvis.",
      "Push your top thighs back and stretch your heels toward the floor.",
      "Keep your head between your upper arms."
    ]
  },
  {
    id: 4,
    name: "Bhujangasana (Cobra Pose)",
    category: ["back pain", "flexibility", "stress"],
    benefits: "Strengthens the spine, stretches chest and lungs, shoulders, and abdomen.",
    duration: "30-60 secs",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/embed/fOdrW7nf9gw",
    steps: [
      "Lie prone on the floor.",
      "Place your hands on the floor under your shoulders.",
      "Hugging your elbows into your sides.",
      "Inhale and lift your chest off the floor.",
      "Keep your pubis on the floor."
    ]
  },
  {
    id: 5,
    name: "Vrikshasana (Tree Pose)",
    category: ["mental health", "flexibility", "normal"],
    benefits: "Improves balance and focus, strengthens legs.",
    duration: "1 min per leg",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/embed/dicvOly80_8",
    steps: [
      "Stand tall and find a focal point.",
      "Shift weight to your left foot.",
      "Place your right foot on your left inner thigh (avoid the knee).",
      "Bring hands to prayer position or reach them overhead.",
      "Hold and breathe, then switch legs."
    ]
  },
  {
    id: 6,
    name: "Balasana (Child's Pose)",
    category: ["stress", "flexibility", "back pain"],
    benefits: "Relieves stress, calms the mind, and stretches the lower back.",
    duration: "2-5 mins",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/embed/2MJGg-dUKh0",
    steps: [
      "Kneel on the floor with your big toes touching.",
      "Sit on your heels and separate your knees.",
      "Exhale and lay your torso down between your thighs.",
      "Lay your hands on the floor alongside your torso, palms up.",
      "Release the fronts of your shoulders toward the floor."
    ]
  },
  {
    id: 7,
    name: "Virabhadrasana I (Warrior I)",
    category: ["weight loss", "flexibility", "obesity"],
    benefits: "Strengthens shoulders, arms, legs, and back; improves focus.",
    duration: "1 min per side",
    difficulty: "Intermediate",
    videoUrl: "https://www.youtube.com/embed/O-LCH8X4oV0",
    steps: [
      "Start in Downward Dog.",
      "Step your right foot forward between your hands.",
      "Turn your left heel in and down.",
      "Inhale and reach your arms overhead.",
      "Keep your right knee directly over your right ankle."
    ]
  },
  {
    id: 8,
    name: "Paschimottanasana (Seated Forward Bend)",
    category: ["diabetes", "flexibility", "stress"],
    benefits: "Calms the brain, relieves stress, and stretches the spine and hamstrings.",
    duration: "1-3 mins",
    difficulty: "Beginner",
    videoUrl: "https://www.youtube.com/embed/T8sgVyF4Ux4",
    steps: [
      "Sit with your legs straight out in front.",
      "Inhale and reach your arms overhead.",
      "Exhale and fold forward from the hips.",
      "Hold your feet or shins.",
      "Keep your spine long and breathe."
    ]
  }
];

export const healthAdvice = {
  "back pain": {
    yoga: ["Tadasana", "Bhujangasana", "Balasana"],
    exercises: ["Pelvic tilts", "Cat-Cow stretch", "Bridges"],
    remedies: ["Ginger tea", "Warm salt water soak", "Turmeric milk"],
    medicines: ["Ibuprofen (Consult doctor)", "Topical gels (Consult doctor)"]
  },
  "obesity": {
    yoga: ["Surya Namaskar", "Virabhadrasana I", "Plank Pose"],
    exercises: ["Brisk walking", "Cycling", "HIIT"],
    remedies: ["Lemon water with honey", "Green tea", "Fiber-rich diet"],
    medicines: ["Orlistat (Consult doctor)"]
  },
  "stress": {
    yoga: ["Balasana", "Savasana", "Anulom Vilom"],
    exercises: ["Yoga", "Tai Chi", "Deep breathing"],
    remedies: ["Ashwagandha", "Chamomile tea", "Meditation"],
    medicines: ["Consult a psychiatrist for medical advice"]
  },
  "diabetes": {
    yoga: ["Dhanurasana", "Paschimottanasana", "Vajrasana"],
    exercises: ["Walking", "Resistance training", "Swimming"],
    remedies: ["Fenugreek seeds", "Bitter gourd juice", "Cinnamon"],
    medicines: ["Metformin (Consult doctor)", "Insulin (Consult doctor)"]
  }
};
