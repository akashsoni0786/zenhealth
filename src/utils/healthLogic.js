/**
 * Advanced Health Logic: BMI, Subscriptions, and AI Analysis Simulation
 */

export const calculateBMI = (heightCm, weightKg) => {
  if (!heightCm || !weightKg) return null;
  const heightM = heightCm / 100;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);
  
  let category = '';
  let color = '';
  if (bmi < 18.5) { category = 'Underweight'; color = '#1890ff'; }
  else if (bmi < 25) { category = 'Normal'; color = '#52c41a'; }
  else if (bmi < 30) { category = 'Overweight'; color = '#faad14'; }
  else { category = 'Obese'; color = '#ff4d4f'; }

  return { value: parseFloat(bmi), category, color };
};

export const runAIAnalysis = (answers, planLevel = 'basic') => {
  const bmi = calculateBMI(answers.height, answers.weight);
  const isPremium = planLevel === 'active' || planLevel === 'total';
  const isTotal = planLevel === 'total';
  
  // Simulated AI insights based on data points
  const insights = [];
  
  if (bmi && (bmi.category === 'Obese' || bmi.category === 'Overweight')) {
    insights.push("Your BMI indicates higher metabolic load. Focus on insulin sensitivity through diet.");
  }

  if (answers.sleepQuality === 'poor') {
    insights.push("Elevated cortisol patterns detected due to poor sleep quality. This may be hindering weight management.");
  }

  if (isPremium) {
    if (answers.stressLevel === 'high') {
      insights.push("High stress levels are impacting your nervous system. Priority: Vagus nerve stimulation through Pranayama.");
    }
    if (answers.dietType === 'junk-heavy') {
      insights.push("High inflammatory markers suggested by diet profile. Gut-health restoration required.");
    }
  }

  // Calculate scores
  let lifestyle = 100;
  let nutrition = 100;
  let fitness = 100;
  let mental = 100;

  if (answers.stressLevel === 'high') mental -= 40;
  if (answers.sleepQuality === 'poor') lifestyle -= 30;
  if (answers.activityLevel === 'sedentary') fitness -= 40;
  if (answers.dietType === 'junk-heavy') nutrition -= 50;

  const healthScore = Math.round((lifestyle + nutrition + fitness + mental) / 4);

  return {
    bmi,
    insights: insights.length > 0 ? insights : ["Maintain a healthy lifestyle."],
    healthScore,
    planLevel,
    rootCauses: isPremium ? [
      { factor: 'Metabolism', impact: bmi?.value > 25 ? 'High' : 'Normal' },
      { factor: 'Stress', impact: answers.stressLevel === 'high' ? 'Critical' : 'Moderate' },
      { factor: 'Sleep', impact: answers.sleepQuality === 'poor' ? 'Low' : 'Optimal' }
    ] : null,
    recommendations: generateAdvancedRecommendations(answers, planLevel)
  };
};

const generateAdvancedRecommendations = (answers, planLevel) => {
  const isPremium = planLevel === 'active' || planLevel === 'total';
  const isTotal = planLevel === 'total';

  const recs = {
    yoga: [
      { name: 'Tadasana (Mountain Pose)', reason: 'Fundamental for posture and spinal alignment.', duration: '2 mins daily' }
    ],
    exercise: [
      { name: 'Walking', reason: 'Basic cardiovascular health.', duration: '30 mins daily' }
    ],
    diet: [
      { name: 'Increase Water Intake', reason: 'Hydration is key for metabolism.', duration: '3-4 Liters' }
    ]
  };

  if (isPremium) {
    recs.yoga.push({ name: 'Surya Namaskar', reason: 'Dynamic flow for metabolic boost.', duration: '12 rounds' });
    recs.exercise.push({ name: 'Strength Training', reason: 'Build muscle mass to improve BMR.', duration: '45 mins, 3x week' });
    recs.diet.push({ name: 'Protein Optimization', reason: 'Essential for muscle repair and satiety.', duration: '1.2g/kg body weight' });
  }

  if (isTotal) {
    recs.ayurveda = [{ name: 'Ashwagandha & Brahmi', reason: 'Condition-specific adaptogens for nervous system.', duration: 'Consult your assigned doctor' }];
    recs.consultations = [
      { name: 'Doctor Consultation', reason: 'Medical review of vitals and history.', duration: 'Booked: 15th of Month' },
      { name: 'Nutritionist Call', reason: 'Macro-nutrient adjustment based on progress.', duration: 'Weekly check-in' }
    ];
  }

  return recs;
};

export const getSubscriptionTiers = () => [
  {
    key: 'basic',
    name: 'Basic Wellness',
    price: '99',
    color: '#52c41a',
    bestFor: 'Beginners & exploration users',
    features: [
      { text: 'Basic health assessment', included: true },
      { text: 'BMI calculation & interpretation', included: true },
      { text: 'Limited yoga (Beginner)', included: true },
      { text: 'Basic home workouts', included: true },
      { text: 'AI deep analysis', included: false },
      { text: 'Nutritionist access', included: false },
      { text: 'Doctor consultation', included: false }
    ],
    buttonText: 'Get Started'
  },
  {
    key: 'active',
    name: 'Active Health',
    price: '499',
    color: '#1890ff',
    recommended: true,
    bestFor: 'Fitness & lifestyle focused',
    features: [
      { text: 'Full multi-level assessment', included: true },
      { text: 'AI-based health analysis', included: true },
      { text: 'Personalized yoga plans', included: true },
      { text: 'Gym workouts (Home + Gym)', included: true },
      { text: 'AI Health Coach chat', included: true },
      { text: 'Doctor consultation', included: false }
    ],
    buttonText: 'Most Popular'
  },
  {
    key: 'total',
    name: 'Total Care',
    price: '1,499',
    color: '#722ed1',
    bestFor: 'Medical + Holistic support',
    features: [
      { text: 'Everything in Active Health', included: true },
      { text: 'Advanced AI health reports', included: true },
      { text: 'Doctor consultation (1-2/mo)', included: true },
      { text: 'Nutritionist consultation', included: true },
      { text: 'Condition-specific yoga', included: true },
      { text: 'Downloadable PDF reports', included: true }
    ],
    buttonText: 'Go Premium'
  }
];
