import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Badge, Tooltip } from 'antd';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  RotateCcw,
  Minus,
  Heart,
  Dumbbell,
  Apple,
  Brain,
  Moon,
  Droplets,
  Shield,
  Stethoscope,
  HelpCircle,
} from 'lucide-react';
import './ChatBot.css';

// ─── Knowledge Base ───
const KNOWLEDGE_BASE = [
  // ══════ SITE / PLATFORM QUESTIONS ══════
  {
    keywords: ['stayfit', 'what is stayfit', 'about stayfit', 'about this', 'kya hai', 'ye kya hai', 'what is this'],
    answer: `**StayFit** is your all-in-one health & wellness platform! 🌿\n\nWe offer:\n• **Health Assessment Quiz** — Get your personalized health score\n• **AI Health Advisor** — Smart recommendations\n• **BMI & BP Tools** — Track your vitals\n• **Yoga Library** — Guided poses & routines\n• **Expert Consultations** — Connect with trainers & nutritionists\n• **Progress Tracking** — Monitor your wellness journey\n\nAll backed by both Ayurvedic and modern health science!`
  },
  {
    keywords: ['how to use', 'kaise use', 'how does it work', 'guide', 'get started', 'start', 'shuru'],
    answer: `Here's how to get started with StayFit:\n\n1️⃣ **Take the Health Quiz** — Go to Health Quiz from the sidebar to get your health score\n2️⃣ **View Your Score** — Check your detailed health dashboard\n3️⃣ **Get a Plan** — Receive a personalized wellness plan\n4️⃣ **Use Health Tools** — BMI Calculator, BP Checker, Yoga Library\n5️⃣ **Book a Trainer** — Find and consult fitness experts\n6️⃣ **Track Progress** — Monitor your improvements over time\n\nStart with the Health Quiz for the best experience!`
  },
  {
    keywords: ['trainer', 'find trainer', 'book trainer', 'consultation', 'expert', 'nutritionist', 'book appointment', 'trainer kaise'],
    answer: `To book a trainer consultation:\n\n1. Use the **Search Bar** at the top to find trainers\n2. Or go to **Search Results** page to browse all trainers\n3. Click on a trainer to see their profile, reviews & availability\n4. Click **"Book Consultation"** and choose:\n   • 📹 Video Call\n   • 🏠 Home Visit\n   • 🏢 In-Person\n5. Select a time slot and proceed to payment\n\nWe have trainers for Yoga, Fitness, Nutrition, Physiotherapy & more!`
  },
  {
    keywords: ['become trainer', 'join as trainer', 'trainer registration', 'trainer signup', 'trainer ban', 'trainer login'],
    answer: `Want to join as a trainer? Here's the process:\n\n1️⃣ Go to **"Join as Trainer"** from the sidebar\n2️⃣ **Register** with your email & password\n3️⃣ **Fill your Profile** — specialization, experience, bio\n4️⃣ **Upload Documents** — certifications & ID proof\n5️⃣ **Admin Verification** — Our team reviews your application\n6️⃣ **Go Live!** — Start receiving consultation bookings\n\nOnce approved, you'll have access to your own Trainer Dashboard!`
  },
  {
    keywords: ['payment', 'pay', 'card', 'upi', 'net banking', 'payment method', 'paisa', 'rupee', 'price'],
    answer: `StayFit supports multiple payment methods:\n\n💳 **Credit/Debit Card** — Visa, Mastercard, Amex, RuPay\n📱 **UPI** — Google Pay, PhonePe, Paytm, BHIM & any UPI ID\n🏦 **Net Banking** — SBI, HDFC, ICICI, Axis & 20+ banks\n\nAll payments are secure and encrypted. You'll get a transaction ID after successful payment.\n\nConsultation prices vary by trainer and type (Video/In-person/Home visit).`
  },
  {
    keywords: ['health quiz', 'health assessment', 'assessment', 'quiz', 'health score', 'score'],
    answer: `The **Health Assessment Quiz** evaluates your overall wellness:\n\n📋 **What it covers:**\n• Physical activity levels\n• Diet & nutrition habits\n• Sleep quality\n• Stress levels\n• Medical history\n• Lifestyle factors\n\n📊 **Your Health Score** (0-100) breaks down into:\n• Physical Health\n• Mental Wellness\n• Nutrition Score\n• Sleep Quality\n• Stress Management\n\nTake it from the sidebar → **Health Quiz**!`
  },
  {
    keywords: ['health plan', 'my plan', 'wellness plan', 'personalized plan', 'plan kya'],
    answer: `Your **Personalized Health Plan** is generated based on your Health Quiz results!\n\n🎯 It includes:\n• **Daily Exercise Routine** — Tailored to your fitness level\n• **Diet Recommendations** — Based on your nutrition score\n• **Sleep Schedule** — Optimal sleep-wake times\n• **Stress Management** — Meditation & relaxation tips\n• **Ayurvedic Remedies** — Natural wellness suggestions\n\nGo to **My Plan** from the sidebar to view your plan. Take the Health Quiz first if you haven't!`
  },
  {
    keywords: ['bmi', 'body mass index', 'weight', 'height', 'overweight', 'underweight', 'bmi calculator', 'bmi kya'],
    answer: `**BMI (Body Mass Index)** measures body fat based on height & weight.\n\n📏 **BMI Categories:**\n• **Under 18.5** — Underweight\n• **18.5 – 24.9** — Normal (Healthy)\n• **25.0 – 29.9** — Overweight\n• **30.0+** — Obese\n\n💡 **Tips:**\n• BMI is a screening tool, not a diagnostic tool\n• Athletes may have high BMI due to muscle mass\n• Consult a doctor for proper assessment\n\nUse our **BMI Calculator** from the sidebar!`
  },
  {
    keywords: ['bp', 'blood pressure', 'hypertension', 'low bp', 'high bp', 'bp checker', 'bp kya'],
    answer: `**Blood Pressure** measures the force of blood against artery walls.\n\n❤️ **BP Categories:**\n• **Normal:** Below 120/80 mmHg\n• **Elevated:** 120-129 / below 80\n• **High (Stage 1):** 130-139 / 80-89\n• **High (Stage 2):** 140+ / 90+\n• **Crisis:** Above 180/120 ⚠️\n\n💡 **Management Tips:**\n• Reduce salt intake\n• Exercise regularly (30 min/day)\n• Manage stress\n• Limit alcohol & caffeine\n• Monitor regularly\n\nUse our **BP Checker** tool from the sidebar!`
  },
  {
    keywords: ['yoga', 'yoga poses', 'asana', 'yoga library', 'yoga kaise'],
    answer: `Our **Yoga Library** has guided poses for all levels! 🧘\n\n📚 **Categories include:**\n• **Beginner Poses** — Mountain, Tree, Warrior I\n• **Intermediate** — Triangle, Half Moon, Crow\n• **Advanced** — Headstand, Scorpion, Lotus\n• **Therapeutic** — For back pain, stress, flexibility\n• **Pranayama** — Breathing exercises\n\n✨ **Benefits:**\n• Improves flexibility & strength\n• Reduces stress & anxiety\n• Better sleep quality\n• Enhanced focus & clarity\n\nExplore it from sidebar → **Yoga Library**!`
  },
  {
    keywords: ['settings', 'account', 'profile', 'change password', 'update profile', 'delete account'],
    answer: `Manage your account from **Settings** (sidebar):\n\n⚙️ **Available options:**\n• **Profile** — Update name, email, phone, avatar\n• **Preferences** — Language, health goal, units\n• **Notifications** — Email, push, SMS alerts\n• **Privacy** — Data sharing, visibility\n• **Account** — Change password, sign out, delete account\n\nGo to sidebar → **Settings** to manage everything!`
  },
  {
    keywords: ['login', 'signup', 'sign up', 'register', 'create account', 'account banana'],
    answer: `**Creating an account** on StayFit:\n\n👤 **User Account:**\n• Click **Sign Up** in the top right\n• Enter name, email & password\n• Or use **Google Sign-In** for quick access\n\n🏋️ **Trainer Account:**\n• Go to sidebar → **Join as Trainer**\n• Register → Complete profile → Get verified\n\n🔐 **Already have an account?**\n• Click **Login** in the top right\n• Use email/password or Google\n\nTrainers can also login with OTP!`
  },
  {
    keywords: ['pricing', 'plan', 'subscription', 'free', 'premium', 'active plan', 'total care', 'cost', 'kitna'],
    answer: `StayFit offers flexible plans:\n\n🆓 **Free:**\n• Health Quiz & Score\n• BMI & BP Tools\n• Basic Yoga Library\n• AI Health Chat\n\n💪 **Active Plan:**\n• Everything in Free\n• Personalized workout plans\n• Advanced tracking\n• Priority trainer access\n\n🌟 **Total Care Plan:**\n• Everything in Active\n• Unlimited consultations\n• Nutrition planning\n• 24/7 expert support\n\nCheck **Pricing** from sidebar for full details!`
  },

  // ══════ HEALTH & WELLNESS QUESTIONS ══════
  {
    keywords: ['lose weight', 'weight loss', 'fat loss', 'vajan kam', 'motapa', 'reduce weight', 'slim'],
    answer: `**Weight Loss Tips** (Science-backed):\n\n🥗 **Diet:**\n• Caloric deficit (consume less than you burn)\n• High protein (1.6-2.2g per kg body weight)\n• More fiber — vegetables, fruits, whole grains\n• Reduce processed food & sugar\n• Drink 3-4L water daily\n\n🏃 **Exercise:**\n• 150+ min cardio per week\n• Strength training 3x/week (builds metabolism)\n• 10,000 steps daily\n\n😴 **Lifestyle:**\n• 7-8 hours sleep\n• Manage stress (cortisol causes belly fat)\n• Eat mindfully, avoid late-night snacking\n\n⚠️ Healthy rate: 0.5-1 kg per week. Consult a nutritionist for a personalized plan!`
  },
  {
    keywords: ['gain weight', 'weight gain', 'bulk', 'muscle gain', 'patla', 'dubla', 'underweight'],
    answer: `**Healthy Weight Gain Tips:**\n\n🥗 **Nutrition:**\n• Caloric surplus (300-500 extra cal/day)\n• High protein — eggs, paneer, chicken, lentils\n• Complex carbs — oats, rice, sweet potato\n• Healthy fats — nuts, avocado, ghee\n• Eat 5-6 smaller meals throughout the day\n\n💪 **Exercise:**\n• Focus on strength training (compound lifts)\n• Squats, deadlifts, bench press, rows\n• Progressive overload (gradually increase weight)\n• Rest 48h between muscle groups\n\n🥤 **Smoothie recipe:**\nBanana + oats + peanut butter + milk + honey = ~500 cal!\n\nAim for 0.25-0.5 kg gain per week for lean muscle.`
  },
  {
    keywords: ['diet', 'nutrition', 'food', 'eat', 'healthy food', 'khana', 'balanced diet', 'meal'],
    answer: `**Balanced Diet Guide:**\n\n🍽️ **Daily plate should have:**\n• **50%** Vegetables & fruits\n• **25%** Whole grains (roti, rice, oats)\n• **25%** Protein (dal, paneer, eggs, chicken)\n• + Healthy fats (nuts, seeds, olive oil)\n\n🕐 **Meal Timing:**\n• Breakfast: 7-9 AM (biggest meal)\n• Lunch: 12-2 PM\n• Snack: 4-5 PM (fruits/nuts)\n• Dinner: 7-8 PM (lightest meal)\n\n💊 **Key Nutrients:**\n• **Protein** — Repair & growth\n• **Iron** — Energy & blood health\n• **Calcium** — Bones & teeth\n• **Vitamin D** — Immunity & mood\n• **Omega-3** — Brain & heart\n\nDrink 8-10 glasses of water daily! 💧`
  },
  {
    keywords: ['exercise', 'workout', 'gym', 'fitness', 'cardio', 'strength', 'kasrat', 'vyayam'],
    answer: `**Exercise Recommendations (WHO Guidelines):**\n\n🏃 **Cardio (Heart health):**\n• 150 min moderate OR 75 min vigorous per week\n• Walking, running, cycling, swimming\n• Start with 20 min and increase gradually\n\n💪 **Strength Training:**\n• 2-3 times per week\n• Target all major muscle groups\n• Bodyweight exercises work too!\n\n🤸 **Flexibility:**\n• Stretch 5-10 min daily\n• Yoga 2-3 times per week\n\n📋 **Beginner Weekly Plan:**\n• Mon: 30 min walk + bodyweight\n• Tue: Yoga\n• Wed: 30 min jog\n• Thu: Rest\n• Fri: Strength training\n• Sat: 45 min walk/cycle\n• Sun: Stretching & rest\n\n⚠️ Always warm up before and cool down after exercise!`
  },
  {
    keywords: ['sleep', 'insomnia', 'neend', 'rest', 'sleep tips', 'nind nahi', 'cant sleep'],
    answer: `**Better Sleep Guide:**\n\n😴 **How much sleep?**\n• Adults: 7-9 hours\n• Teens: 8-10 hours\n• Children: 9-12 hours\n\n🌙 **Sleep Hygiene Tips:**\n• Fixed bedtime & wake time (even weekends!)\n• No screens 1 hour before bed\n• Keep room cool (18-22°C) & dark\n• Avoid caffeine after 2 PM\n• No heavy meals before bed\n• Exercise in the morning, not evening\n\n🧘 **Relaxation techniques:**\n• 4-7-8 breathing: Inhale 4s → Hold 7s → Exhale 8s\n• Progressive muscle relaxation\n• Calm music or white noise\n• Warm milk with turmeric (Haldi doodh)\n\n⚠️ If insomnia persists for 3+ weeks, consult a doctor.`
  },
  {
    keywords: ['stress', 'anxiety', 'tension', 'mental health', 'depression', 'tanav', 'chinta', 'worry'],
    answer: `**Stress & Mental Health Management:**\n\n🧠 **Immediate relief:**\n• **Box breathing:** Inhale 4s → Hold 4s → Exhale 4s → Hold 4s\n• Ground yourself: Name 5 things you see, 4 you touch, 3 you hear\n• Take a 10-min walk outside\n\n🌿 **Daily habits:**\n• Exercise 30 min/day (releases endorphins)\n• Meditation 10-15 min (start with guided)\n• Journal your thoughts\n• Limit social media & news\n• Connect with friends/family\n\n☕ **Ayurvedic remedies:**\n• Ashwagandha — Reduces cortisol\n• Brahmi — Improves focus & calm\n• Tulsi tea — Natural adaptogen\n• Jatamansi — Promotes sleep\n\n❤️ It's okay to not be okay. Reach out to a professional if needed.\n📞 iCall: 9152987821 | Vandrevala Foundation: 1860-2662-345`
  },
  {
    keywords: ['protein', 'protein food', 'protein source', 'high protein', 'protein kya', 'how much protein'],
    answer: `**Protein Guide:**\n\n📊 **How much do you need?**\n• Sedentary: 0.8g per kg body weight\n• Active: 1.2-1.6g per kg\n• Muscle building: 1.6-2.2g per kg\n• Example: 70kg active person → 84-112g/day\n\n🥚 **Top Protein Sources (per 100g):**\n• Chicken breast — 31g\n• Paneer — 18g\n• Eggs (2 large) — 12g\n• Moong dal — 24g\n• Greek yogurt — 10g\n• Soya chunks — 52g\n• Almonds — 21g\n• Chickpeas — 19g\n\n⏰ **Timing:**\n• Spread across all meals\n• Post-workout: within 30-60 min\n• Before bed: casein-rich foods (milk, paneer)\n\n💡 Vegetarian? Combine dal + rice for complete amino acids!`
  },
  {
    keywords: ['water', 'hydration', 'dehydration', 'pani', 'how much water', 'water intake'],
    answer: `**Hydration Guide:**\n\n💧 **Daily Water Intake:**\n• General: 2.5-3.5 litres (8-12 glasses)\n• Active/Exercise: 3.5-4.5 litres\n• Hot climate: Add 500ml-1L more\n• Formula: 30-35ml per kg body weight\n\n🕐 **When to drink:**\n• Morning: 2 glasses on empty stomach\n• Before meals: 1 glass (30 min before)\n• During workout: Sip every 15-20 min\n• Before bed: 1 glass (not too much!)\n\n⚠️ **Signs of dehydration:**\n• Dark yellow urine\n• Dry mouth & headache\n• Fatigue & dizziness\n• Reduced urine output\n\n💡 **Tips:**\n• Carry a water bottle everywhere\n• Set hourly reminders\n• Add lemon/cucumber for flavor\n• Coconut water, buttermilk count too!`
  },
  {
    keywords: ['diabetes', 'sugar', 'blood sugar', 'madhumeh', 'sugar level', 'insulin'],
    answer: `**Diabetes Awareness:**\n\n📊 **Blood Sugar Levels:**\n• Normal fasting: 70-100 mg/dL\n• Pre-diabetic: 100-125 mg/dL\n• Diabetic: 126+ mg/dL\n\n🍽️ **Diet Tips:**\n• Low glycemic foods (oats, vegetables, lentils)\n• Avoid: white bread, sugar, sugary drinks\n• Eat fiber-rich foods (slow sugar absorption)\n• Small, frequent meals\n• Cinnamon may help regulate sugar\n\n🏃 **Lifestyle:**\n• 30 min walk daily (reduces blood sugar)\n• Maintain healthy weight\n• Monitor sugar regularly\n• Take medicines on time\n• Manage stress\n\n🌿 **Ayurvedic support:**\n• Fenugreek (methi) seeds soaked overnight\n• Bitter gourd (karela) juice\n• Jamun seeds powder\n\n⚠️ This is informational only. Always follow your doctor's advice!`
  },
  {
    keywords: ['heart', 'heart health', 'cholesterol', 'heart attack', 'dil', 'cardiac'],
    answer: `**Heart Health Guide:**\n\n❤️ **Healthy Heart Numbers:**\n• BP: Below 120/80 mmHg\n• Total Cholesterol: Below 200 mg/dL\n• Resting Heart Rate: 60-100 bpm\n\n🥗 **Heart-healthy diet:**\n• Omega-3: Fish, walnuts, flaxseeds\n• Fiber: Oats, fruits, vegetables\n• Reduce: Salt, saturated fat, trans fat\n• Limit alcohol\n• Green tea & dark chocolate (in moderation!)\n\n🏃 **Exercise:**\n• 150 min moderate cardio/week\n• Walking is the best heart exercise\n• Avoid sudden intense exercise\n\n⚠️ **Warning signs (call 112):**\n• Chest pain or pressure\n• Shortness of breath\n• Pain in arm/jaw/back\n• Sudden dizziness\n• Cold sweat\n\n⚠️ This is NOT medical advice. Regular check-ups after age 30 are essential!`
  },
  {
    keywords: ['immunity', 'immune system', 'rog pratirodhak', 'resistance', 'prevent disease', 'strong immunity'],
    answer: `**Boost Your Immunity:**\n\n🥗 **Immune-boosting foods:**\n• Citrus fruits (Vitamin C)\n• Turmeric (haldi) — anti-inflammatory\n• Ginger (adrak) — antibacterial\n• Garlic (lahsun) — immune stimulant\n• Green vegetables — antioxidants\n• Yogurt (dahi) — probiotics\n• Nuts & seeds — Vitamin E\n\n🌿 **Ayurvedic immunity boosters:**\n• Chyawanprash (1 spoon daily)\n• Giloy/Guduchi kadha\n• Tulsi tea\n• Ashwagandha\n• Amla (Indian gooseberry)\n\n💪 **Lifestyle:**\n• Exercise regularly\n• Sleep 7-8 hours\n• Manage stress\n• Stay hydrated\n• Get sunlight (Vitamin D)\n• Wash hands frequently`
  },
  {
    keywords: ['back pain', 'spine', 'kamar dard', 'peeth dard', 'posture', 'sitting'],
    answer: `**Back Pain Management:**\n\n🪑 **Posture tips:**\n• Sit straight with lumbar support\n• Screen at eye level\n• Feet flat on floor\n• Take breaks every 30 min\n• Stand desk option for long hours\n\n🧘 **Exercises:**\n• Cat-Cow stretch\n• Child's pose\n• Bird-dog\n• Knee-to-chest stretch\n• Bridge exercise\n• Planks (core strengthening)\n\n🌿 **Home remedies:**\n• Hot/cold compress\n• Epsom salt bath\n• Turmeric milk\n• Gentle massage with warm sesame oil\n\n⚠️ **See a doctor if:**\n• Pain lasts more than 2 weeks\n• Numbness or tingling in legs\n• Pain after injury/fall\n• Difficulty walking or standing\n\nBook a **Physiotherapist** on StayFit for personalized guidance!`
  },
  {
    keywords: ['vitamin', 'vitamins', 'deficiency', 'supplement', 'vitamin d', 'vitamin b12', 'iron'],
    answer: `**Essential Vitamins & Minerals:**\n\n☀️ **Vitamin D (Sunshine vitamin):**\n• 15-20 min morning sunlight\n• Foods: Eggs, mushrooms, fortified milk\n• 80%+ Indians are deficient!\n\n💊 **Vitamin B12:**\n• Crucial for nerves & blood cells\n• Sources: Eggs, dairy, meat\n• Vegetarians: Consider supplements\n\n🩸 **Iron:**\n• Prevents anemia & fatigue\n• Sources: Spinach, jaggery, pomegranate, dates\n• Pair with Vitamin C for absorption\n\n🦴 **Calcium:**\n• Strong bones & teeth\n• Sources: Milk, ragi, sesame seeds\n• Need Vitamin D for absorption\n\n🐟 **Omega-3:**\n• Brain & heart health\n• Sources: Fish, walnuts, flaxseeds\n\n⚠️ Get blood tests before taking supplements. Over-supplementing can be harmful!`
  },
  {
    keywords: ['meditation', 'dhyan', 'mindfulness', 'calm', 'relax', 'peace'],
    answer: `**Meditation Guide for Beginners:**\n\n🧘 **Simple technique (start here):**\n1. Sit comfortably, close eyes\n2. Focus on your breathing\n3. Inhale 4 seconds, exhale 6 seconds\n4. When mind wanders, gently bring focus back\n5. Start with 5 min, increase gradually\n\n📋 **Types of meditation:**\n• **Mindfulness** — Observe thoughts without judgment\n• **Body Scan** — Focus on each body part\n• **Loving-kindness** — Send positive thoughts\n• **Mantra** — Repeat Om or any calming word\n• **Walking meditation** — Mindful slow walking\n\n✨ **Benefits:**\n• Reduces stress & anxiety (proven by research)\n• Improves focus & memory\n• Better sleep quality\n• Lower blood pressure\n• Emotional balance\n\n🕐 Best time: Morning (empty stomach) or before bed.`
  },
  {
    keywords: ['skin', 'acne', 'pimple', 'glow', 'twacha', 'face', 'skin care'],
    answer: `**Skin Health Tips:**\n\n✨ **Daily routine:**\n• Wash face 2x daily (gentle cleanser)\n• Moisturize after washing\n• Sunscreen SPF 30+ (even indoors!)\n• Remove makeup before bed\n• Drink 3L+ water daily\n\n🥗 **Skin-friendly diet:**\n• Vitamin C — Citrus, amla, bell peppers\n• Vitamin E — Almonds, sunflower seeds\n• Zinc — Pumpkin seeds, chickpeas\n• Omega-3 — Walnuts, flaxseeds\n• Avoid: Excess dairy, sugar, fried foods\n\n🌿 **Natural remedies:**\n• Aloe vera gel — Moisturizing & healing\n• Turmeric + honey mask — Glow\n• Rose water toner — pH balance\n• Neem paste — Anti-acne\n\n⚠️ Persistent acne? Consult a dermatologist rather than self-treating.`
  },
  {
    keywords: ['hair', 'hair fall', 'baal', 'hair loss', 'baldness', 'hair growth'],
    answer: `**Hair Health Guide:**\n\n💇 **Common causes of hair fall:**\n• Nutritional deficiency (Iron, B12, Vitamin D)\n• Stress & lack of sleep\n• Hormonal changes (thyroid, PCOS)\n• Harsh chemical products\n• Genetics\n\n🥗 **Hair-friendly diet:**\n• Protein — Eggs, lentils, nuts\n• Iron — Spinach, dates, jaggery\n• Biotin — Almonds, sweet potato\n• Omega-3 — Flaxseeds, walnuts\n• Zinc — Pumpkin seeds\n\n🌿 **Home remedies:**\n• Warm coconut oil massage (weekly)\n• Onion juice on scalp (20 min)\n• Amla + shikakai paste\n• Fenugreek (methi) seed paste\n• Aloe vera gel on scalp\n\n💡 Normal to lose 50-100 hairs daily. More than that? Get blood tests done!`
  },

  // ══════ GREETINGS & SMALL TALK ══════
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'hola', 'good morning', 'good evening', 'good night', 'kaise ho'],
    answer: `Namaste! 🙏 Welcome to **StayFit Health AI**!\n\nI'm your health & wellness assistant. I can help you with:\n\n• 🏥 Health queries (diet, exercise, sleep, stress)\n• 🌿 Ayurvedic remedies & tips\n• 📱 How to use StayFit features\n• 🏋️ Trainer & consultation info\n• 💊 Nutrition & vitamin guidance\n\nWhat would you like to know today?`
  },
  {
    keywords: ['thank', 'thanks', 'dhanyawad', 'shukriya', 'appreciate'],
    answer: `You're welcome! 😊 I'm always here to help.\n\nRemember:\n• Stay hydrated 💧\n• Stay active 🏃\n• Stay positive 🌟\n\nFeel free to ask anything else about health & wellness!`
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'alvida', 'take care'],
    answer: `Take care! 👋 Remember:\n\n💚 Eat well, move more, stress less!\n\nCome back anytime you have health questions. Stay healthy, stay fit! 🌿`
  },
];

// ─── Quick suggestion chips ───
const QUICK_SUGGESTIONS = [
  { icon: <HelpCircle size={13} />, label: 'What is StayFit?', query: 'what is stayfit' },
  { icon: <Heart size={13} />, label: 'Weight Loss Tips', query: 'weight loss tips' },
  { icon: <Apple size={13} />, label: 'Balanced Diet', query: 'balanced diet' },
  { icon: <Moon size={13} />, label: 'Sleep Better', query: 'better sleep' },
  { icon: <Brain size={13} />, label: 'Manage Stress', query: 'stress management' },
  { icon: <Dumbbell size={13} />, label: 'Exercise Plan', query: 'exercise workout' },
  { icon: <Droplets size={13} />, label: 'Hydration Guide', query: 'water intake' },
  { icon: <Shield size={13} />, label: 'Boost Immunity', query: 'immunity boost' },
  { icon: <Stethoscope size={13} />, label: 'Book Trainer', query: 'book trainer' },
];

// ─── Find best matching answer ───
const findAnswer = (input) => {
  const normalised = input.toLowerCase().trim();

  if (!normalised) return null;

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (normalised === keyword) {
        score += 100; // Exact match
      } else if (normalised.includes(keyword)) {
        score += 50 + keyword.length; // Contains — longer keyword = more specific
      } else if (keyword.includes(normalised) && normalised.length >= 3) {
        score += 20;
      } else {
        // Check individual words
        const inputWords = normalised.split(/\s+/);
        const keyWords = keyword.split(/\s+/);
        for (const iw of inputWords) {
          for (const kw of keyWords) {
            if (iw.length >= 3 && kw.length >= 3) {
              if (iw === kw) score += 15;
              else if (iw.includes(kw) || kw.includes(iw)) score += 8;
            }
          }
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore >= 8) {
    return bestMatch.answer;
  }

  return null;
};

// ─── Default fallback ───
const FALLBACK_ANSWER = `I'm not sure about that specific topic, but I can help you with:\n\n• 🏥 **Health queries** — diet, exercise, sleep, stress, vitamins\n• 🌿 **Ayurvedic remedies** — natural wellness tips\n• 📱 **StayFit features** — how to use the platform\n• 🏋️ **Trainers** — finding & booking experts\n• 💳 **Payments** — payment methods & pricing\n\nTry asking about any of these topics, or use the suggestion chips below!`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: `Namaste! 🙏 I'm **StayFit Health AI**\n\nYour personal health & wellness assistant. Ask me anything about:\n• Health, fitness & nutrition\n• Ayurvedic remedies\n• How to use StayFit\n• Trainers & consultations\n\nHow can I help you today?`,
      time: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // Mark read when opened
  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Render markdown-like bold text
  const renderText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|\n|• )/g);
    return parts.map((part, i) => {
      if (part === '\n') return <br key={i} />;
      if (part === '• ') return <span key={i} className="cb-bullet">• </span>;
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const handleSend = (text = null) => {
    const msgText = (text || inputValue).trim();
    if (!msgText) return;

    // User message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: msgText,
      time: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Bot response with delay
    const answer = findAnswer(msgText) || FALLBACK_ANSWER;
    const delay = 600 + Math.random() * 800;

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: answer,
        time: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      if (!isOpen) setUnreadCount(prev => prev + 1);
    }, delay);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'bot',
        text: `Chat reset! 🔄\n\nHow can I help you? Ask me anything about health, fitness, or StayFit features.`,
        time: new Date(),
      },
    ]);
  };

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  // Show suggestion chips only when there are few messages
  const showSuggestions = messages.length <= 2;

  return (
    <div className="chatbot-container">
      {/* ─── Chat Window ─── */}
      {isOpen && (
        <div className={`chatbot-window ${isMinimized ? 'chatbot-minimized' : ''}`}>
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">
                <Bot size={20} />
                <span className="chatbot-status-dot" />
              </div>
              <div className="chatbot-header-info">
                <span className="chatbot-header-title">StayFit Health AI</span>
                <span className="chatbot-header-status">
                  {isTyping ? 'Typing...' : 'Online'}
                </span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button onClick={resetChat} className="chatbot-header-btn" title="Reset chat">
                <RotateCcw size={16} />
              </button>
              <button onClick={() => setIsMinimized(true)} className="chatbot-header-btn" title="Minimize">
                <Minus size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="chatbot-header-btn chatbot-close-btn" title="Close">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              <div className="chatbot-body" ref={chatBodyRef}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`chatbot-msg chatbot-msg-${msg.type}`}>
                    {msg.type === 'bot' && (
                      <div className="chatbot-msg-avatar">
                        <Sparkles size={14} />
                      </div>
                    )}
                    <div className="chatbot-msg-content">
                      <div className="chatbot-msg-bubble">
                        {renderText(msg.text)}
                      </div>
                      <span className="chatbot-msg-time">{formatTime(msg.time)}</span>
                    </div>
                    {msg.type === 'user' && (
                      <div className="chatbot-msg-avatar chatbot-msg-avatar-user">
                        <User size={14} />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="chatbot-msg chatbot-msg-bot">
                    <div className="chatbot-msg-avatar">
                      <Sparkles size={14} />
                    </div>
                    <div className="chatbot-msg-content">
                      <div className="chatbot-msg-bubble chatbot-typing">
                        <span className="chatbot-typing-dot" />
                        <span className="chatbot-typing-dot" />
                        <span className="chatbot-typing-dot" />
                      </div>
                    </div>
                  </div>
                )}

                {showSuggestions && !isTyping && (
                  <div className="chatbot-suggestions">
                    <span className="chatbot-suggestions-label">Quick questions:</span>
                    <div className="chatbot-suggestions-grid">
                      {QUICK_SUGGESTIONS.map((s, i) => (
                        <button
                          key={i}
                          className="chatbot-suggestion-chip"
                          onClick={() => handleSend(s.query)}
                        >
                          {s.icon}
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="chatbot-input-area">
                <div className="chatbot-input-wrap">
                  <input
                    ref={inputRef}
                    type="text"
                    className="chatbot-input"
                    placeholder="Ask about health, diet, fitness..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={500}
                  />
                  <button
                    className={`chatbot-send-btn ${inputValue.trim() ? 'active' : ''}`}
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim()}
                  >
                    <Send size={18} />
                  </button>
                </div>
                <span className="chatbot-disclaimer">
                  AI assistant for informational purposes only. Not medical advice.
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── Floating Action Button ─── */}
      <Tooltip title={isOpen ? '' : 'StayFit Health AI'} placement="left">
        <button className={`chatbot-fab ${isOpen ? 'chatbot-fab-active' : ''}`} onClick={toggleChat}>
          <Badge count={unreadCount} size="small" offset={[-2, 2]}>
            <div className="chatbot-fab-icon">
              {isOpen ? <ChevronDown size={26} color="#fff" /> : <MessageCircle size={26} color="#fff" />}
            </div>
          </Badge>
          {!isOpen && <span className="chatbot-fab-pulse" />}
        </button>
      </Tooltip>
    </div>
  );
};

export default ChatBot;
