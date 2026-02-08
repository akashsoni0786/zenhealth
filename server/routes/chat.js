import express from 'express';
import { protect } from '../middleware/auth.js';
import ChatHistory from '../models/ChatHistory.js';

const router = express.Router();

// ═══════════════════════════════════════════════════════════
//  HEALTH AI KNOWLEDGE ENGINE
//  Comprehensive keyword → response mapping with categories
// ═══════════════════════════════════════════════════════════

const HEALTH_KNOWLEDGE = [
  // ─── BMI & WEIGHT ───
  {
    keywords: ['bmi', 'body mass index', 'bmi calculate', 'bmi kya', 'bmi check'],
    category: 'fitness',
    response: (ctx) => {
      if (ctx.bmi) {
        return `Based on your profile, your BMI is **${ctx.bmi}** (${ctx.bmiCategory || 'N/A'}).\n\n📏 **BMI Categories:**\n• Under 18.5 — Underweight\n• 18.5–24.9 — Normal (Healthy)\n• 25.0–29.9 — Overweight\n• 30.0+ — Obese\n\n${ctx.bmi < 18.5 ? '💡 Focus on nutrient-dense foods, strength training, and caloric surplus (300-500 extra cal/day).' : ctx.bmi < 25 ? '✅ Great! You\'re in the healthy range. Maintain with balanced diet and regular exercise.' : ctx.bmi < 30 ? '💡 Focus on portion control, 150+ min cardio/week, and strength training to improve body composition.' : '⚠️ Consider consulting a healthcare provider. Start with walking 30 min/day and reducing processed foods.'}\n\nUse our **BMI Calculator** tool for a detailed breakdown!`;
      }
      return `**BMI (Body Mass Index)** measures body fat based on height & weight.\n\n📏 **Categories:**\n• Under 18.5 — Underweight\n• 18.5–24.9 — Normal\n• 25.0–29.9 — Overweight\n• 30.0+ — Obese\n\n💡 BMI is a screening tool, not a diagnostic. Athletes may have high BMI due to muscle mass.\n\nUse our **BMI Calculator** from the sidebar to check yours!`;
    }
  },
  {
    keywords: ['lose weight', 'weight loss', 'fat loss', 'vajan kam', 'motapa', 'reduce weight', 'slim', 'belly fat', 'pet kam'],
    category: 'fitness',
    response: () => `**Science-backed Weight Loss Plan:**\n\n🥗 **Diet (80% of results):**\n• Create a caloric deficit of 500 cal/day = 0.5 kg/week loss\n• High protein: 1.6–2.2g per kg body weight\n• Fill half plate with vegetables\n• Cut sugar, processed food, sugary drinks\n• Drink 3-4L water daily (boosts metabolism 24-30%)\n\n🏃 **Exercise (20% of results):**\n• 150+ min moderate cardio per week\n• Strength training 3x/week (builds metabolism)\n• HIIT 2x/week for fat burning\n• 10,000 steps daily target\n\n😴 **Lifestyle:**\n• 7-8 hours sleep (lack of sleep increases hunger hormones)\n• Manage stress (cortisol promotes belly fat)\n• Eat slowly, no distractions while eating\n• Avoid eating after 8 PM\n\n📊 **Realistic timeline:**\n• Week 1-2: Water weight loss (1-2 kg)\n• Month 1-3: Steady 2-4 kg/month\n• Healthy rate: 0.5-1 kg per week\n\n⚠️ Crash diets slow metabolism! Sustainable changes > quick fixes.`
  },
  {
    keywords: ['gain weight', 'weight gain', 'bulk', 'muscle gain', 'patla', 'dubla', 'underweight', 'muscle build', 'mass gain'],
    category: 'fitness',
    response: () => `**Healthy Weight & Muscle Gain Plan:**\n\n🥗 **Nutrition (caloric surplus):**\n• Eat 300-500 calories MORE than maintenance\n• High protein: 1.8-2.2g per kg (most important!)\n• Complex carbs: Oats, rice, sweet potato, banana\n• Healthy fats: Nuts, ghee, avocado, olive oil\n• 5-6 meals per day, never skip breakfast\n\n💪 **Training (Progressive Overload):**\n• Compound exercises: Squat, Deadlift, Bench Press, Rows\n• Train 4-5 days/week, 45-60 min per session\n• Increase weight by 2.5kg every 1-2 weeks\n• Rest 48h between same muscle groups\n• Focus on time under tension\n\n🥤 **High-calorie Shake (600+ cal):**\nBanana + Oats + Peanut Butter + Milk + Honey + Whey protein\n\n📊 **Timeline:**\n• Beginner: 1-1.5 kg muscle/month possible\n• Track weight weekly (same time, morning)\n• Take progress photos monthly\n\n💡 Sleep 8+ hours — muscle grows during rest, not in gym!`
  },

  // ─── DIET & NUTRITION ───
  {
    keywords: ['diet', 'nutrition', 'food', 'eat', 'healthy food', 'khana', 'balanced diet', 'meal plan', 'diet plan', 'kya khaye'],
    category: 'nutrition',
    response: (ctx) => {
      let extra = '';
      if (ctx.primaryConcern === 'weight') extra = '\n\n🎯 Since your focus is weight management, prioritize protein-rich foods and reduce refined carbs.';
      else if (ctx.primaryConcern === 'stress') extra = '\n\n🎯 Since your focus is stress, include magnesium-rich foods (dark chocolate, spinach, bananas) and omega-3 fatty acids.';
      return `**Balanced Indian Diet Plan:**\n\n🌅 **Morning (7 AM):** Warm lemon water + 5 soaked almonds\n\n🥣 **Breakfast (8-9 AM):**\n• Option 1: Oats upma + boiled egg + fruit\n• Option 2: Moong dal chilla + chutney + buttermilk\n• Option 3: Poha + sprouts + green tea\n\n🥗 **Lunch (12-1 PM):**\n• 2 roti/1 cup rice + dal + sabzi + salad + curd\n• Include: Green leafy vegetables, lentils, seasonal veggies\n\n🍎 **Snack (4-5 PM):**\n• Fruits + handful of nuts OR\n• Makhana (fox nuts) OR roasted chana\n\n🍽️ **Dinner (7-8 PM):**\n• 1 roti + light sabzi + dal/soup\n• Keep it lighter than lunch\n• Finish 2-3 hours before bed\n\n💧 **Throughout day:** 3-4L water, green tea, buttermilk\n\n📊 **Daily targets:**\n• Protein: 1.2-1.6g per kg body weight\n• Fiber: 25-30g\n• Fruits: 2-3 servings\n• Vegetables: 4-5 servings${extra}`;
    }
  },
  {
    keywords: ['protein', 'protein food', 'protein source', 'high protein', 'protein kya', 'how much protein', 'protein diet'],
    category: 'nutrition',
    response: () => `**Complete Protein Guide:**\n\n📊 **Daily Requirement:**\n• Sedentary: 0.8g per kg body weight\n• Active: 1.2-1.6g per kg\n• Muscle building: 1.6-2.2g per kg\n• Weight loss: 1.6-2.0g per kg (preserves muscle)\n\n🥚 **Top Sources (per 100g):**\n\n**Non-Veg:**\n• Chicken breast — 31g\n• Fish (Rohu) — 17g\n• Eggs (2 large) — 12g\n• Mutton — 25g\n\n**Vegetarian:**\n• Soya chunks — 52g ⭐\n• Paneer — 18g\n• Moong dal — 24g\n• Chana (chickpeas) — 19g\n• Greek yogurt — 10g\n• Rajma — 24g\n• Peanuts — 26g\n• Tofu — 8g\n\n⏰ **Timing:**\n• Spread across ALL meals (30-40g per meal)\n• Post-workout: Within 30-60 min\n• Before bed: Paneer/milk (casein = slow release)\n\n💡 **Veggie tip:** Combine dal + rice = complete amino acid profile!\n💡 **Absorption tip:** Max 40-50g absorbed per meal, so spread it out.`
  },
  {
    keywords: ['vitamin', 'vitamins', 'deficiency', 'supplement', 'vitamin d', 'vitamin b12', 'iron', 'calcium', 'vitamin c'],
    category: 'nutrition',
    response: () => `**Essential Vitamins & Minerals Guide:**\n\n☀️ **Vitamin D** (80%+ Indians deficient!)\n• 15-20 min morning sunlight (before 10 AM)\n• Foods: Eggs, mushrooms, fortified milk\n• Supplement: 1000-2000 IU daily if deficient\n\n💊 **Vitamin B12** (Critical for vegetarians)\n• Needed for: Nerves, blood cells, energy\n• Sources: Eggs, dairy, meat, fortified cereals\n• Vegetarians: Supplement 1000mcg daily\n\n🩸 **Iron** (Common in women)\n• Sources: Spinach, jaggery (gud), pomegranate, dates, beetroot\n• Pair with Vitamin C for better absorption\n• Avoid tea/coffee with iron-rich meals\n\n🦴 **Calcium**\n• Sources: Milk, ragi, sesame seeds (til), curd, cheese\n• Needs Vitamin D for absorption\n• Adults need: 1000mg/day\n\n🍊 **Vitamin C** (Immunity booster)\n• Sources: Amla, orange, guava, capsicum, lemon\n• 100mg/day recommended\n\n⚠️ **Important:** Get blood tests (Vitamin D, B12, Iron, CBC) done before supplementing. Over-supplementation can be harmful!`
  },
  {
    keywords: ['water', 'hydration', 'dehydration', 'pani', 'how much water', 'water intake'],
    category: 'nutrition',
    response: () => `**Hydration Guide:**\n\n💧 **How much water daily?**\n• General rule: 35ml per kg body weight\n• 60kg person → ~2.1L minimum\n• 80kg person → ~2.8L minimum\n• Add 500ml-1L if exercising or hot climate\n\n🕐 **Optimal Schedule:**\n• Wake up: 2 glasses warm water (kickstarts metabolism)\n• 30 min before each meal: 1 glass\n• During workout: Sip every 15-20 min\n• Between meals: Regular sips\n• Before bed: 1 glass (not too much)\n\n⚠️ **Dehydration Signs:**\n• Dark yellow urine (should be light yellow)\n• Dry mouth, headache\n• Fatigue & dizziness\n• Reduced urine frequency\n\n✅ **What counts:**\n• Plain water (best!)\n• Coconut water, buttermilk, nimbu pani\n• Green tea, herbal teas\n• Fruits with high water (watermelon, cucumber)\n\n❌ **Don't count:** Tea/coffee (diuretic), sugary drinks, alcohol\n\n💡 **Trick:** Keep a bottle at desk, set hourly reminders!`
  },
  {
    keywords: ['sugar', 'diabetes', 'blood sugar', 'madhumeh', 'sugar level', 'insulin', 'sugar kam', 'diabetic'],
    category: 'medical',
    response: () => `**Diabetes & Blood Sugar Management:**\n\n📊 **Normal Blood Sugar Levels:**\n• Fasting: 70-100 mg/dL\n• 2hrs after meal: Below 140 mg/dL\n• HbA1c (3-month avg): Below 5.7%\n• Pre-diabetic: Fasting 100-125, HbA1c 5.7-6.4%\n\n🥗 **Diet Management:**\n• **Low GI foods:** Oats, barley, rajma, most vegetables\n• **Avoid:** White rice (switch to brown), white bread, maida, sugar, juices\n• **Eat fiber:** Slows sugar absorption\n• **Small, frequent meals** (5-6 per day)\n• **Chromium-rich:** Broccoli, green beans\n\n🌿 **Ayurvedic Support:**\n• Methi (fenugreek) seeds — Soak overnight, drink water morning\n• Karela (bitter gourd) juice — 30ml on empty stomach\n• Jamun seeds powder — 1 tsp with water\n• Cinnamon (dalchini) — ½ tsp daily in warm water\n• Turmeric milk — Anti-inflammatory\n\n🏃 **Lifestyle:**\n• Walk 30-45 min daily (best after meals)\n• Yoga: Mandukasana, Dhanurasana, Paschimottanasana\n• Monitor sugar regularly\n• Manage stress (raises blood sugar)\n• Sleep 7-8 hours\n\n⚠️ This is informational only. Always follow your doctor's prescribed medication!`
  },

  // ─── FITNESS & EXERCISE ───
  {
    keywords: ['exercise', 'workout', 'gym', 'fitness', 'cardio', 'kasrat', 'vyayam', 'exercise plan', 'workout plan'],
    category: 'fitness',
    response: () => `**Complete Exercise Guide (WHO-Recommended):**\n\n🏃 **Cardio (Heart + Fat Burn):**\n• 150 min moderate OR 75 min vigorous per week\n• Options: Walking, jogging, cycling, swimming, dancing\n• Start with 20 min, increase by 5 min weekly\n\n💪 **Strength Training (Muscle + Metabolism):**\n• 2-3 times per week\n• Compound moves: Squats, push-ups, lunges, planks\n• No gym needed! Bodyweight works great\n\n🤸 **Flexibility (Injury Prevention):**\n• 5-10 min stretch daily\n• Yoga 2-3 times per week\n\n📋 **Beginner Weekly Plan:**\n• **Mon:** 30 min brisk walk + 15 min bodyweight\n• **Tue:** 30 min Yoga\n• **Wed:** 30 min jog/cycle\n• **Thu:** Rest or light walk\n• **Fri:** 30 min strength training\n• **Sat:** 45 min walk/swim/sport\n• **Sun:** Stretching + rest\n\n⚡ **Tips:**\n• Warm up 5 min before, cool down 5 min after\n• Never skip rest days (muscles grow during rest)\n• Stay hydrated, carry water\n• Track progress weekly\n• Find a workout buddy for motivation!`
  },
  {
    keywords: ['yoga', 'yoga poses', 'asana', 'yoga for', 'pranayam', 'yoga kaise', 'surya namaskar'],
    category: 'fitness',
    response: () => `**Yoga Guide for Health:**\n\n🧘 **For Beginners (Start Here):**\n• Tadasana (Mountain Pose) — Posture & grounding\n• Vrksasana (Tree Pose) — Balance\n• Virabhadrasana (Warrior) — Strength\n• Balasana (Child's Pose) — Relaxation\n• Savasana (Corpse Pose) — Deep rest\n\n☀️ **Surya Namaskar (12 poses):**\n• Complete body workout in 12 steps\n• Start with 3 rounds, increase to 12\n• Burns ~13.9 cal per round\n• Best done on empty stomach, morning\n\n🎯 **Yoga by Goal:**\n• **Weight loss:** Surya Namaskar, Naukasana, Dhanurasana\n• **Stress relief:** Balasana, Shavasana, Anulom-Vilom\n• **Back pain:** Cat-Cow, Bhujangasana, Setu Bandhasana\n• **Flexibility:** Paschimottanasana, Trikonasana\n• **Digestion:** Pawanmuktasana, Mandukasana, Vajrasana\n• **Sleep:** Viparita Karani, Supta Baddha Konasana\n\n🌬️ **Pranayama (Breathing):**\n• Anulom-Vilom — Balances energy, calms mind\n• Kapalbhati — Detox, metabolism boost\n• Bhramari — Reduces anxiety instantly\n\n💡 Practice on empty stomach, use a yoga mat, wear comfortable clothes.\n\nExplore our **Yoga Library** for guided poses!`
  },
  {
    keywords: ['running', 'jogging', 'walk', 'walking', 'steps', 'daudna', '10000 steps'],
    category: 'fitness',
    response: () => `**Running & Walking Guide:**\n\n🚶 **Walking (Best exercise for beginners):**\n• Start: 20 min/day → gradually increase to 45-60 min\n• Target: 8,000-10,000 steps daily\n• Brisk walking burns 300-400 cal/hour\n• Best time: Morning (empty stomach) or evening\n\n🏃 **Running (Couch to 5K plan):**\n• Week 1-2: Walk 5 min → Jog 1 min → Walk 2 min (repeat 6x)\n• Week 3-4: Walk 3 min → Jog 2 min (repeat 6x)\n• Week 5-6: Walk 2 min → Jog 3 min (repeat 5x)\n• Week 7-8: Walk 1 min → Jog 5 min (repeat 4x)\n• Week 9-10: Continuous 25-30 min jog\n\n👟 **Tips:**\n• Invest in good running shoes\n• Warm up 5 min, cool down 5 min\n• Stay hydrated (sip water, don't gulp)\n• Run on soft surfaces when possible\n• Breathe: Inhale nose, exhale mouth\n\n📊 **Calorie Burn (approx. per 30 min):**\n• Slow walk: 100-150 cal\n• Brisk walk: 150-200 cal\n• Jogging: 250-350 cal\n• Running (fast): 350-500 cal\n\n⚠️ If you have knee issues, start with walking and consult a physiotherapist.`
  },

  // ─── MENTAL HEALTH ───
  {
    keywords: ['stress', 'anxiety', 'tension', 'mental health', 'chinta', 'tanav', 'worried', 'panic', 'nervous'],
    category: 'mental_health',
    response: () => `**Stress & Anxiety Management:**\n\n🆘 **Immediate Relief (do right now):**\n1. **Box Breathing:** Inhale 4s → Hold 4s → Exhale 4s → Hold 4s (repeat 5x)\n2. **5-4-3-2-1 Grounding:** Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste\n3. **Cold water on wrists** — Activates vagus nerve, calms instantly\n\n🧠 **Daily Habits (long-term):**\n• Exercise 30 min/day (releases endorphins, nature's anti-anxiety)\n• Meditation 10-15 min morning (even 5 min helps!)\n• Journal 5 min before bed (write worries down)\n• Limit social media to 30 min/day\n• Gratitude practice: Write 3 things you're grateful for\n\n🌿 **Ayurvedic Remedies:**\n• **Ashwagandha** — Reduces cortisol by 30% (research-proven)\n• **Brahmi** — Improves focus & reduces anxiety\n• **Jatamansi** — Natural sleep & calm aid\n• **Tulsi tea** — Adaptogen, reduces stress response\n• **Shankhpushpi** — Memory & mental clarity\n\n🍵 **Calming Foods:**\n• Dark chocolate (70%+) — Serotonin boost\n• Walnuts & almonds — Omega-3 for brain\n• Banana — Tryptophan → Serotonin\n• Chamomile / Lavender tea\n\n❤️ **Remember:** It's okay to not be okay. Seeking help is strength, not weakness.\n📞 **Helplines:**\n• iCall: 9152987821\n• Vandrevala Foundation: 1860-2662-345\n• NIMHANS: 080-46110007`
  },
  {
    keywords: ['sleep', 'insomnia', 'neend', 'rest', 'sleep tips', 'nind nahi', 'cant sleep', 'sleepless', 'neend nahi aati'],
    category: 'mental_health',
    response: () => `**Complete Sleep Guide:**\n\n😴 **How Much Sleep?**\n• Adults (18-64): 7-9 hours\n• Teens (14-17): 8-10 hours\n• Seniors (65+): 7-8 hours\n\n🌙 **Sleep Hygiene Checklist:**\n✅ Fixed bedtime & wake time (even weekends!)\n✅ No screens 1 hour before bed (blue light blocks melatonin)\n✅ Room: Cool (18-22°C), dark, quiet\n✅ No caffeine after 2 PM\n✅ No heavy meals 2-3 hours before bed\n✅ Exercise in morning/afternoon, NOT evening\n✅ No alcohol (disrupts sleep quality)\n\n🧘 **Pre-Sleep Routine (30 min before bed):**\n1. Dim lights\n2. Warm shower/bath\n3. **4-7-8 Breathing:** Inhale 4s → Hold 7s → Exhale 8s\n4. Progressive muscle relaxation\n5. Read a book (not phone!)\n\n🌿 **Natural Sleep Aids:**\n• **Haldi doodh** (turmeric milk) — Traditional & effective\n• **Ashwagandha** — Reduces sleep onset time\n• **Jatamansi** — Ayurvedic sleep herb\n• **Chamomile tea** — Mild sedative effect\n• **Lavender oil** — Put on pillow\n\n🍌 **Sleep-promoting foods:**\n• Banana, warm milk, almonds, walnuts, cherry, kiwi\n\n⚠️ If insomnia persists 3+ weeks, consult a doctor. Could be stress, thyroid, or other treatable cause.`
  },
  {
    keywords: ['depression', 'sad', 'udas', 'lonely', 'hopeless', 'depressed', 'sad feel'],
    category: 'mental_health',
    response: () => `**You Matter. Here's What Can Help:**\n\n❤️ **Immediate steps:**\n• Talk to someone you trust — Friend, family, counselor\n• You're not alone. 1 in 5 people experience depression\n• It's a medical condition, NOT a weakness\n\n🌱 **Daily habits that help:**\n• Get sunlight (even 15 min) — Boosts serotonin & Vitamin D\n• Move your body — Even a 10-min walk helps\n• Set ONE small goal per day (just one!)\n• Eat regularly — Skipping meals worsens mood\n• Connect with someone daily (even a text)\n• Maintain sleep schedule\n• Limit alcohol and substance use\n\n🧠 **Neuroscience-backed tips:**\n• Exercise releases endorphins & BDNF (brain growth factor)\n• Gratitude journaling rewires neural pathways\n• Cold showers activate norepinephrine (mood booster)\n• Music therapy: Listen to uplifting music\n\n🌿 **Ayurvedic support:**\n• Ashwagandha — Adaptogen, reduces cortisol\n• Brahmi — Cognitive function & mood\n• Saffron (Kesar) — Research shows antidepressant effect\n\n📞 **Professional Help (PLEASE reach out):**\n• iCall: 9152987821\n• Vandrevala Foundation: 1860-2662-345\n• AASRA: 9820466726\n\n⚠️ If you're having thoughts of self-harm, please call a helpline immediately. You are valued and things can get better.`
  },
  {
    keywords: ['meditation', 'dhyan', 'mindfulness', 'calm', 'relax', 'meditate', 'peace of mind'],
    category: 'mental_health',
    response: () => `**Meditation Guide (Beginner to Advanced):**\n\n🧘 **Beginner (Week 1-2):** Breath Awareness\n1. Sit comfortably, close eyes\n2. Focus on natural breathing\n3. Count breaths: 1 to 10, then restart\n4. Mind wanders? No problem — gently return\n5. Start: **5 min/day**\n\n🌊 **Intermediate (Week 3-6):** Body Scan\n1. Lie down or sit comfortably\n2. Scan from head to toe, noticing sensations\n3. Don't judge, just observe\n4. Duration: **10-15 min/day**\n\n🔮 **Advanced (Month 2+):** Open Awareness\n1. Sit quietly, observe ALL: sounds, feelings, thoughts\n2. Be the observer, not the reactor\n3. Duration: **20-30 min/day**\n\n📋 **Types of Meditation:**\n• **Mindfulness** — Observe without judgment\n• **Loving-kindness (Metta)** — Send love to self & others\n• **Mantra** — Repeat Om, So-Hum, or any word\n• **Walking meditation** — Slow, mindful steps\n• **Trataka** — Candle gazing (great for focus)\n\n✨ **Proven Benefits:**\n• Reduces cortisol by 23% (Harvard study)\n• Increases grey matter in brain\n• Lowers blood pressure & heart rate\n• Improves focus, memory, emotional control\n\n🕐 **Best time:** Morning (empty stomach) or before bed`
  },

  // ─── SLEEP & RECOVERY ───
  {
    keywords: ['back pain', 'spine', 'kamar dard', 'peeth dard', 'posture', 'sitting pain', 'lower back'],
    category: 'medical',
    response: () => `**Back Pain Management Guide:**\n\n🪑 **Posture Correction (If desk job):**\n• Screen at eye level, arms at 90°\n• Lumbar support cushion\n• Feet flat on floor\n• Take micro-breaks every 30 min (stand, stretch)\n• Consider standing desk (alternate sit/stand)\n\n🧘 **Best Exercises for Back Pain:**\n1. **Cat-Cow Stretch** — 10 reps (spinal flexibility)\n2. **Child's Pose** — Hold 30s (gentle stretch)\n3. **Bird-Dog** — 10 each side (core stability)\n4. **Bridge** — 15 reps (glutes & lower back)\n5. **Knee-to-Chest** — Hold 20s each (releases tension)\n6. **Plank** — 30s build to 1 min (core strength)\n7. **Bhujangasana (Cobra)** — 5 reps (back strength)\n\n🌿 **Home Remedies:**\n• Hot compress 15-20 min (muscle tension)\n• Cold compress first 48h (if injury/inflammation)\n• Warm sesame oil massage\n• Epsom salt bath\n• Turmeric milk (anti-inflammatory)\n\n⚠️ **See a Doctor If:**\n• Pain lasts more than 2 weeks\n• Numbness/tingling in legs\n• Pain after injury/fall\n• Difficulty walking or standing\n• Night pain that wakes you\n\n💡 Book a **Physiotherapist** on StayFit for personalized guidance!`
  },

  // ─── HEART & BP ───
  {
    keywords: ['blood pressure', 'bp', 'hypertension', 'low bp', 'high bp', 'bp check', 'bp control'],
    category: 'medical',
    response: () => `**Blood Pressure Complete Guide:**\n\n❤️ **BP Categories (mmHg):**\n• **Normal:** Below 120/80\n• **Elevated:** 120-129 / below 80\n• **Stage 1 High:** 130-139 / 80-89\n• **Stage 2 High:** 140+ / 90+\n• **Crisis:** 180+/120+ ⚠️ (Call emergency)\n\n🥗 **DASH Diet for BP:**\n• Reduce sodium: < 2300mg/day (< 1500mg if high BP)\n• Potassium-rich: Banana, coconut water, spinach\n• Magnesium: Nuts, seeds, dark chocolate\n• Low-fat dairy, whole grains\n• Avoid: Pickles, papad, processed food, excess salt\n\n🏃 **Lifestyle Changes:**\n• Walk 30-45 min daily (reduces BP 5-8 mmHg)\n• Lose weight (each 1 kg loss = ~1 mmHg drop)\n• Limit alcohol\n• Quit smoking\n• Manage stress (meditation, deep breathing)\n\n🌿 **Natural Support:**\n• Garlic: 1-2 cloves morning (raw or in warm water)\n• Arjuna bark powder: Ayurvedic heart tonic\n• Hibiscus tea: Studies show it lowers BP\n• Flaxseeds: 1 tbsp daily\n\nUse our **BP Checker** tool for tracking!\n\n⚠️ Never stop BP medication without doctor's advice.`
  },
  {
    keywords: ['heart', 'heart health', 'cholesterol', 'heart attack', 'cardiac', 'dil', 'chest pain'],
    category: 'medical',
    response: () => `**Heart Health Guide:**\n\n❤️ **Healthy Numbers to Know:**\n• BP: Below 120/80\n• Total Cholesterol: Below 200 mg/dL\n• LDL (bad): Below 100 mg/dL\n• HDL (good): Above 60 mg/dL\n• Resting Heart Rate: 60-100 bpm\n\n🥗 **Heart-Healthy Diet:**\n• Omega-3: Fish, walnuts, flaxseeds (2-3x/week)\n• Fiber: Oats, fruits, vegetables, beans\n• Antioxidants: Berries, green tea, dark chocolate\n• Reduce: Salt, ghee/butter (excess), processed meats\n• **AVOID:** Trans fats, deep-fried food, excess sugar\n\n🏃 **Exercise:**\n• 150 min moderate cardio/week\n• Brisk walking is the BEST heart exercise\n• Avoid sudden intense exercise without warm-up\n\n🌿 **Ayurvedic Heart Tonics:**\n• Arjuna (Terminalia arjuna) — Strengthens heart muscle\n• Garlic — Reduces cholesterol naturally\n• Triphala — Antioxidant, lipid-lowering\n\n🚨 **Warning Signs (CALL 112 immediately):**\n• Chest pain/pressure/tightness\n• Shortness of breath\n• Pain radiating to left arm/jaw/back\n• Sudden dizziness or cold sweat\n• Nausea with chest discomfort\n\n⚠️ Regular cardiac check-ups recommended after age 30.`
  },

  // ─── IMMUNITY ───
  {
    keywords: ['immunity', 'immune', 'rog pratirodhak', 'cold', 'cough', 'flu', 'fever', 'sardi', 'khansi', 'bukhar'],
    category: 'nutrition',
    response: () => `**Immunity Boosting Guide:**\n\n🛡️ **Daily Immunity Protocol:**\n\n🌅 **Morning:**\n• Warm water + lemon + honey\n• 5 soaked almonds + 2 walnuts\n• 15-20 min sunlight (Vitamin D)\n\n🥗 **Immune-boosting Foods:**\n• **Vitamin C:** Amla (1 daily!), orange, guava, capsicum\n• **Zinc:** Pumpkin seeds, sesame, chickpeas\n• **Probiotics:** Curd, buttermilk, kanji\n• **Antioxidants:** Berries, green tea, turmeric\n• **Garlic & Ginger:** Anti-viral, anti-bacterial\n\n🌿 **Ayurvedic Immunity Kit:**\n• **Chyawanprash:** 1 tsp morning (ancient immunity formula)\n• **Giloy/Guduchi Kadha:** Boil stems, drink warm\n• **Haldi Doodh:** Turmeric + pepper + milk before bed\n• **Tulsi Tea:** 4-5 leaves boiled in water\n• **Mulethi (Licorice):** Suck a small piece daily\n\n💪 **Lifestyle:**\n• Exercise 30 min daily (moderate — NOT exhaustive)\n• Sleep 7-8 hours (immunity drops 70% with poor sleep)\n• Manage stress (weakens immune response)\n• Stay hydrated (3L+ water)\n• Wash hands frequently\n\n🤧 **If you have cold/cough:**\n• Steam inhalation with ajwain/eucalyptus\n• Honey + ginger juice + tulsi\n• Warm salt water gargle\n• Rest and hydrate\n\n⚠️ Fever 3+ days? See a doctor.`
  },

  // ─── SKIN & HAIR ───
  {
    keywords: ['skin', 'acne', 'pimple', 'glow', 'skin care', 'face', 'twacha', 'dark circles'],
    category: 'wellness',
    response: () => `**Skin Health Guide:**\n\n✨ **Daily Skincare Routine:**\n\n🌅 **Morning:**\n1. Gentle cleanser (not soap!)\n2. Toner (rose water works great)\n3. Moisturizer\n4. Sunscreen SPF 30+ (even indoors/cloudy days!)\n\n🌙 **Night:**\n1. Double cleanse (oil + foam if makeup)\n2. Toner\n3. Serum (Vitamin C or Niacinamide)\n4. Night cream/moisturizer\n\n🥗 **Skin Diet:**\n• **Glow:** Vitamin C — Amla, orange, guava\n• **Anti-aging:** Vitamin E — Almonds, sunflower seeds\n• **Anti-acne:** Zinc — Pumpkin seeds, chickpeas\n• **Hydration:** Omega-3 — Walnuts, flaxseeds\n• **AVOID:** Excess dairy, sugar, fried food, alcohol\n\n🌿 **Natural Remedies:**\n• **Acne:** Neem paste + turmeric (leave 15 min)\n• **Glow:** Besan + haldi + dahi mask (weekly)\n• **Dark circles:** Cold cucumber slices or potato juice\n• **Pigmentation:** Aloe vera + lemon (patch test first)\n\n💧 **Golden Rules:**\n• Drink 3L+ water daily\n• Don't touch face (transfers bacteria)\n• Change pillowcase weekly\n• Never sleep with makeup on\n• Exercise increases blood flow = natural glow`
  },
  {
    keywords: ['hair', 'hair fall', 'baal', 'hair loss', 'baldness', 'hair growth', 'dandruff', 'baalon ka'],
    category: 'wellness',
    response: () => `**Hair Health Guide:**\n\n💇 **Common Causes of Hair Fall:**\n• Nutritional deficiency (Iron, B12, Vitamin D, Zinc)\n• Stress & poor sleep\n• Hormonal issues (Thyroid, PCOS)\n• Hard water & harsh chemicals\n• Genetics (pattern baldness)\n\n🥗 **Hair Nutrition:**\n• **Protein:** Eggs, lentils, nuts (hair is 95% protein!)\n• **Iron:** Spinach, dates, jaggery, pomegranate\n• **Biotin:** Almonds, sweet potato, eggs\n• **Omega-3:** Flaxseeds, walnuts, fish\n• **Zinc:** Pumpkin seeds, sesame\n\n🌿 **DIY Hair Treatments:**\n• **Oil massage (weekly):** Warm coconut/olive oil + amla → massage scalp 15 min → leave 1 hr → wash\n• **Onion juice:** Apply on scalp 20 min → sulfur promotes growth\n• **Fenugreek (methi):** Soak overnight → grind → apply as paste 30 min\n• **Aloe vera:** Fresh gel on scalp 30 min\n• **Egg mask:** Egg + olive oil → apply 20 min → wash with cold water\n\n✅ **Daily Habits:**\n• Don't comb wet hair (use wide-tooth)\n• Avoid hot water on hair\n• Don't tie hair too tight\n• Silk pillowcase (reduces friction)\n• Manage stress (cortisol = hair fall)\n\n⚠️ Losing 50-100 hairs/day is normal. More? Get blood tests (Iron, B12, Thyroid, Vitamin D).`
  },

  // ─── WOMEN'S HEALTH ───
  {
    keywords: ['pcod', 'pcos', 'period', 'periods', 'menstrual', 'irregular period', 'mahavari', 'period pain', 'cramps'],
    category: 'medical',
    response: () => `**Women's Health — PCOS & Period Care:**\n\n🌸 **Healthy Menstrual Cycle:**\n• Normal cycle: 21-35 days\n• Period duration: 3-7 days\n• Track your cycle regularly\n\n💊 **Period Pain Relief:**\n• Heat pad on lower abdomen\n• Ginger tea (anti-inflammatory)\n• Light exercise/walk (releases endorphins)\n• Ajwain water (carom seeds in warm water)\n• Avoid excess salt, caffeine during periods\n\n🎗️ **PCOS Management:**\n• **Diet:** Low GI, anti-inflammatory foods\n• **Avoid:** Processed food, sugar, dairy (excess)\n• **Exercise:** 30-45 min daily (helps insulin resistance)\n• **Sleep:** 7-8 hours (crucial for hormones)\n• **Stress:** Yoga & meditation (cortisol worsens PCOS)\n\n🌿 **Ayurvedic Support:**\n• Shatavari — Hormonal balance\n• Ashoka bark — Menstrual health\n• Lodhra — PCOS management\n• Cinnamon tea — Regulates cycles\n\n🥗 **PCOS-friendly Foods:**\n• Seeds: Flax, sunflower, pumpkin, sesame (seed cycling)\n• Spearmint tea (reduces androgens)\n• Turmeric, berries, green leafy vegetables\n• Omega-3 rich foods\n\n⚠️ Consult a gynecologist for proper diagnosis & treatment.`
  },

  // ─── AYURVEDA ───
  {
    keywords: ['ayurveda', 'ayurvedic', 'natural remedy', 'home remedy', 'gharelu upay', 'desi nuskha', 'herbs'],
    category: 'ayurveda',
    response: () => `**Ayurvedic Daily Routine (Dinacharya):**\n\n🌅 **Morning Ritual:**\n1. Wake before sunrise (Brahma Muhurta: 4:30-6 AM)\n2. Oil pulling (1 tbsp sesame oil, swish 10 min)\n3. Tongue scraping (removes toxins/ama)\n4. Warm water + lemon + honey\n5. 5 soaked almonds\n\n🌿 **Top Ayurvedic Herbs & Uses:**\n\n• **Ashwagandha** — Stress, energy, sleep, immunity\n• **Triphala** — Digestion, detox, skin (take before bed)\n• **Brahmi** — Memory, focus, anxiety\n• **Shatavari** — Women's health, hormones\n• **Giloy/Guduchi** — Immunity king, fever\n• **Tulsi** — Respiratory health, adaptogen\n• **Amla** — Vitamin C, anti-aging, immunity\n• **Mulethi** — Throat, cough, digestion\n• **Haritaki** — Constipation, detox\n\n🍵 **Daily Kadha Recipe:**\nBoil: Tulsi + Dalchini + Kali Mirch + Sonth + Giloy\nAdd honey after cooling. Drink warm.\n\n⚖️ **Three Doshas:**\n• **Vata** (Air+Space): Thin build, dry skin → Warm, oily foods\n• **Pitta** (Fire+Water): Medium build, sharp mind → Cooling foods\n• **Kapha** (Earth+Water): Heavy build, calm → Light, warm foods\n\n💡 Ayurveda works best as a complement to modern medicine, not a replacement.`
  },
  {
    keywords: ['digestion', 'constipation', 'acidity', 'gas', 'bloating', 'pet dard', 'kabz', 'pet me gas', 'stomach'],
    category: 'ayurveda',
    response: () => `**Digestion & Gut Health:**\n\n🔥 **For Acidity / Acid Reflux:**\n• Cold milk (immediate relief)\n• Fennel (saunf) — Chew after meals\n• Banana — Natural antacid\n• Coconut water — Alkalizing\n• Avoid: Spicy, oily, citrus on empty stomach\n• Don't lie down right after eating\n\n💨 **For Gas & Bloating:**\n• Ajwain (carom) + black salt in warm water\n• Jeera water (cumin boiled in water)\n• Hing (asafoetida) — Pinch in warm water\n• Walk 10-15 min after meals\n• Eat slowly, chew 20-30 times\n\n🚫 **For Constipation (Kabz):**\n• Triphala powder — 1 tsp + warm water before bed\n• Isabgol (psyllium husk) — 1 tbsp + warm water/milk\n• Warm water first thing in morning (2 glasses)\n• Papaya, prunes, figs (anjeer) — Natural laxatives\n• Fiber: 25-30g daily from vegetables, fruits, whole grains\n\n🌿 **Gut Health Protocol:**\n• Probiotics: Curd, buttermilk, kanji daily\n• Prebiotics: Banana, garlic, onion (feed good bacteria)\n• Ginger: Before meals (activates digestive fire/Agni)\n• Avoid: Processed food, excess antibiotics, stress\n\n💡 **Golden rule:** Eat warm, freshly cooked meals. Avoid cold/stale food.\n\n⚠️ Blood in stool, persistent pain, or weight loss? See a gastroenterologist immediately.`
  },

  // ─── GENERAL HEALTH ───
  {
    keywords: ['headache', 'migraine', 'sir dard', 'head pain'],
    category: 'medical',
    response: () => `**Headache & Migraine Relief:**\n\n🆘 **Immediate Relief:**\n• Apply peppermint oil on temples\n• Cold compress on forehead (15 min)\n• Drink 2 glasses water (dehydration is #1 cause)\n• Deep breathing: 4-7-8 technique\n• Dim lights, reduce screen brightness\n\n🔍 **Common Causes:**\n• Dehydration (most common!)\n• Screen strain / blue light\n• Poor posture / neck tension\n• Stress & anxiety\n• Skipping meals\n• Poor sleep\n• Caffeine withdrawal\n\n🌿 **Natural Remedies:**\n• Ginger tea — Anti-inflammatory\n• Clove — Chew 2-3 or apply oil\n• Tulsi tea — Muscle relaxant\n• Cinnamon paste on forehead\n• Head massage with warm oil\n\n🛡️ **Prevention:**\n• Stay hydrated (3L+ water)\n• 20-20-20 rule for screens (every 20 min, look 20 ft away, for 20 sec)\n• Regular sleep schedule\n• Manage stress\n• Correct posture\n• Don't skip meals\n\n⚠️ See a doctor if: Severe/sudden headache, fever + stiff neck, vision changes, or persistent headaches (3+/week).`
  },
  {
    keywords: ['eye', 'eyes', 'vision', 'eye strain', 'ankh', 'eye care', 'screen time', 'dry eyes'],
    category: 'wellness',
    response: () => `**Eye Health & Screen Protection:**\n\n👁️ **20-20-20 Rule (MUST follow):**\n• Every **20 minutes** of screen time\n• Look at something **20 feet** away\n• For at least **20 seconds**\n\n🖥️ **Screen Setup:**\n• Monitor at arm's length, top at eye level\n• Brightness = ambient room light\n• Blue light filter / Night mode after 6 PM\n• Font size large enough to read without squinting\n\n🧘 **Eye Exercises (Daily 5 min):**\n1. Palming: Rub palms warm, cup over closed eyes, 1 min\n2. Blink rapidly 20 times\n3. Look up-down-left-right (10 each)\n4. Focus near (thumb) → far (wall) — 10 times\n5. Figure-8 eye movement\n6. Trataka (candle gazing) — 2 min\n\n🥗 **Eye Nutrition:**\n• Vitamin A: Carrots, sweet potato, mango\n• Lutein: Spinach, kale, eggs\n• Omega-3: Walnuts, flaxseeds, fish\n• Zinc: Pumpkin seeds, chickpeas\n• Amla — Rich in Vitamin C\n\n🌿 **Ayurvedic:**\n• Triphala eye wash (cooled decoction)\n• Rose water drops (soothing)\n• Cold cucumber slices (reduces strain)\n\n⚠️ Annual eye check-up recommended, especially with prolonged screen use.`
  },

  // ─── GREETINGS & PLATFORM ───
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening', 'kaise ho', 'hola'],
    category: 'greeting',
    response: (ctx) => {
      const name = ctx.userName || '';
      const greeting = name ? `Namaste ${name}!` : 'Namaste!';
      let contextNote = '';
      if (ctx.primaryConcern) {
        contextNote = `\n\nI see your primary health focus is **${ctx.primaryConcern}**. I can give you personalized advice on that!`;
      }
      return `${greeting} 🙏 Welcome to **StayFit Health AI**!\n\nI'm your personal wellness assistant. I can help with:\n\n🥗 **Nutrition** — Diet plans, protein, vitamins, hydration\n🏃 **Fitness** — Workout plans, yoga, running, weight goals\n🧠 **Mental Health** — Stress, sleep, meditation, anxiety\n🌿 **Ayurveda** — Natural remedies, herbs, daily routines\n🏥 **Health Info** — BP, diabetes, heart, digestion, skin/hair\n💊 **Women's Health** — PCOS, periods, hormonal balance${contextNote}\n\nWhat would you like to know today?`;
    }
  },
  {
    keywords: ['thank', 'thanks', 'dhanyawad', 'shukriya', 'helpful', 'nice'],
    category: 'greeting',
    response: () => `You're welcome! 😊 Happy to help.\n\n💚 **Daily Health Reminders:**\n• Drink water regularly 💧\n• Move your body for 30 min 🏃\n• Take breaks from screens 👁️\n• Get 7-8 hours sleep 😴\n• Practice gratitude 🙏\n\nFeel free to ask anything else about health & wellness!`
  },
  {
    keywords: ['bye', 'goodbye', 'alvida', 'see you', 'take care', 'good night'],
    category: 'greeting',
    response: () => `Take care! 👋\n\n🌟 **Parting health tip:** The best exercise is the one you actually do. The best diet is the one you can sustain. Start small, stay consistent.\n\n💚 Stay healthy, stay fit!\nCome back anytime for health guidance. 🙏`
  },

  // ─── STAYFIT FEATURES ───
  {
    keywords: ['stayfit', 'about', 'what can you do', 'features', 'kya kar sakte', 'help'],
    category: 'platform',
    response: () => `**What I Can Help With:**\n\n🤖 I'm **StayFit Health AI** — your personal wellness assistant!\n\n**Ask me about:**\n\n🥗 **Nutrition & Diet**\n• Balanced diet plans, protein, vitamins\n• Weight loss / weight gain diet\n• Hydration, supplements\n\n🏃 **Fitness & Exercise**\n• Workout plans, yoga, running\n• Muscle building, fat loss\n• Exercise for specific goals\n\n🧠 **Mental Health**\n• Stress management, anxiety relief\n• Sleep improvement, meditation\n• Dealing with sadness\n\n🌿 **Ayurveda & Natural Remedies**\n• Herbal remedies, daily routines\n• Digestion, immunity boosting\n• Dosha balancing\n\n🏥 **Health Conditions**\n• BP, diabetes, heart health\n• Back pain, headaches, eye care\n• Skin & hair health\n• Women's health (PCOS, periods)\n\n💡 **Try asking:**\n• "How to lose belly fat?"\n• "Give me a protein-rich diet plan"\n• "Tips for better sleep"\n• "Ayurvedic immunity boosters"\n• "Yoga for stress relief"`
  },
];

// ─── Fallback response ───
const FALLBACK_RESPONSE = `I don't have specific information on that topic yet, but I can help you with:\n\n🥗 **Nutrition** — Diet plans, protein, vitamins, weight management\n🏃 **Fitness** — Workouts, yoga, running, muscle building\n🧠 **Mental Health** — Stress, sleep, meditation, anxiety\n🌿 **Ayurveda** — Herbs, remedies, daily routines, digestion\n🏥 **Health Info** — BP, diabetes, heart, skin, hair, women's health\n\nTry rephrasing your question or ask about any of the topics above!`;

// ─── Smart matching engine ───
const findBestResponse = (input, healthContext = {}) => {
  const normalised = input.toLowerCase().trim();
  if (!normalised) return { text: FALLBACK_RESPONSE, category: null };

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of HEALTH_KNOWLEDGE) {
    let score = 0;

    for (const keyword of entry.keywords) {
      // Exact match
      if (normalised === keyword) {
        score += 100;
      }
      // Input contains full keyword
      else if (normalised.includes(keyword)) {
        score += 50 + keyword.length;
      }
      // Keyword contains input (for short queries)
      else if (keyword.includes(normalised) && normalised.length >= 3) {
        score += 20;
      }
      // Word-level matching
      else {
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

    // Boost score if matches user's primary concern
    if (healthContext.primaryConcern) {
      const concern = healthContext.primaryConcern.toLowerCase();
      if (entry.keywords.some(k => k.includes(concern) || concern.includes(k))) {
        score += 10;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore >= 8) {
    const text = typeof bestMatch.response === 'function'
      ? bestMatch.response(healthContext)
      : bestMatch.response;
    return { text, category: bestMatch.category };
  }

  return { text: FALLBACK_RESPONSE, category: null };
};

// ═══════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════

// ─── POST /api/chat/message — Send a message, get AI response ───
// Works with and without authentication
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId, healthContext } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ success: false, message: 'Message too long (max 1000 chars)' });
    }

    // Build context from healthContext sent by frontend
    const ctx = {
      primaryConcern: healthContext?.primaryConcern || null,
      bmi: healthContext?.bmi || null,
      bmiCategory: healthContext?.bmiCategory || null,
      healthScore: healthContext?.healthScore || null,
      userName: healthContext?.userName || null,
    };

    // Get AI response
    const { text: responseText, category } = findBestResponse(message, ctx);

    // Simulate slight processing delay (makes it feel more natural)
    const delay = 300 + Math.random() * 700;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Try to save chat history if user is authenticated
    let savedToHistory = false;
    const token = req.headers.authorization?.split(' ')[1];
    if (token && sessionId) {
      try {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        await ChatHistory.findOneAndUpdate(
          { userId, sessionId },
          {
            $push: {
              messages: {
                $each: [
                  { role: 'user', text: message.trim(), category: null, timestamp: new Date() },
                  { role: 'bot', text: responseText, category, timestamp: new Date() },
                ]
              }
            },
            $inc: { messageCount: 2 },
            $set: {
              lastActivity: new Date(),
              healthContext: ctx,
            },
          },
          { upsert: true, new: true }
        );
        savedToHistory = true;
      } catch {
        // Auth failed or DB error — still return response
      }
    }

    res.json({
      success: true,
      data: {
        response: responseText,
        category,
        savedToHistory,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({ success: false, message: 'Failed to process message' });
  }
});

// ─── GET /api/chat/history — Get chat history for logged-in user ───
router.get('/history', protect, async (req, res) => {
  try {
    const { sessionId, page = 1, limit = 20 } = req.query;

    if (sessionId) {
      // Get specific session
      const chat = await ChatHistory.findOne({ userId: req.user._id, sessionId });
      if (!chat) {
        return res.status(404).json({ success: false, message: 'Chat session not found' });
      }
      return res.json({ success: true, data: chat });
    }

    // Get all sessions (paginated)
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sessions = await ChatHistory.find({ userId: req.user._id })
      .select('sessionId messageCount lastActivity healthContext createdAt')
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ChatHistory.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        }
      }
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chat history' });
  }
});

// ─── DELETE /api/chat/history/:sessionId — Delete a chat session ───
router.delete('/history/:sessionId', protect, async (req, res) => {
  try {
    const result = await ChatHistory.findOneAndDelete({
      userId: req.user._id,
      sessionId: req.params.sessionId,
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }

    res.json({ success: true, message: 'Chat session deleted' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete chat session' });
  }
});

// ─── DELETE /api/chat/history — Delete all chat history ───
router.delete('/history', protect, async (req, res) => {
  try {
    await ChatHistory.deleteMany({ userId: req.user._id });
    res.json({ success: true, message: 'All chat history cleared' });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({ success: false, message: 'Failed to clear chat history' });
  }
});

// ─── GET /api/chat/suggestions — Get topic suggestions ───
router.get('/suggestions', (req, res) => {
  const suggestions = [
    { icon: '🥗', label: 'Diet Plan', query: 'balanced diet plan' },
    { icon: '💪', label: 'Weight Loss', query: 'how to lose weight' },
    { icon: '🧘', label: 'Yoga Guide', query: 'yoga for beginners' },
    { icon: '😴', label: 'Better Sleep', query: 'tips for better sleep' },
    { icon: '🧠', label: 'Stress Relief', query: 'stress management tips' },
    { icon: '🌿', label: 'Ayurveda', query: 'ayurvedic daily routine' },
    { icon: '💊', label: 'Vitamins', query: 'essential vitamins' },
    { icon: '❤️', label: 'Heart Health', query: 'heart health tips' },
    { icon: '💧', label: 'Hydration', query: 'how much water daily' },
    { icon: '🏃', label: 'Workout Plan', query: 'beginner exercise plan' },
    { icon: '🍌', label: 'Protein Guide', query: 'high protein foods' },
    { icon: '🛡️', label: 'Immunity', query: 'boost immunity naturally' },
  ];

  res.json({ success: true, data: suggestions });
});

export default router;
