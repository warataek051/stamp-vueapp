<template>
  <div class="show-container">
    <div class="show-content" :class="{ 'visible': isVisible }">
      <h1 class="show-title">Calculation Results</h1>
      <p class="show-description">นี่คือผลลัพธ์การคำนวณและเมนูอาหารที่แนะนำสำหรับคุณ</p>
      
      <!-- BMR & TDEE Results -->
      <div class="results-grid">
        <div v-if="typeof tdee === 'number'" class="result-card main-result">
          <!-- //เอาไว้ตรวจสอบว่า tdee เป็นตัวเลขจริงหรือยังถ้า tdee เป็นตัวเลข → จะแสดงการ์ดผลลัพธ์ (result card) -->

          <h3>TDEE (Total Daily Energy Expenditure)</h3>
          <p class="result-value">{{ animatedTdee.toFixed(0) }}</p>
          <span>แคลอรี่/วัน</span>
          <small>พลังงานที่ร่างกายต้องการใช้ในแต่ละวัน</small>
        </div>
      </div>

      <!-- Food Suggestions -->
      <div v-if="Object.keys(recommendedMeals).length > 0" class="food-suggestions"> <!--ตรวจสอบว่ามีเมนูอาหารแนะนำอยู่หรือไม่ -->
        <p class="total-calories-info">
          แคลอรี่รวม 3 มื้อ: <strong>{{ totalRecommendedCalories.toFixed(0) }} kcal</strong>
        </p>
        <div v-for="(meal, mealName) in recommendedMeals" :key="mealName" class="meal-section">  <!--การวนลูปแสดงเมนูอาหารแต่ละมื้อ ที่อยู่ใน recommendedMeals โดยใช้ v-for-->
          <div class="meal-header">
            <h3 class="meal-title">{{ mealName }}</h3>
            <span class="meal-calories">Total: {{ meal.totalCalories.toFixed(0) }} kcal</span>
          </div>
          <div class="food-grid">
            <div v-for="(food, index) in meal.foods" :key="food.name" class="food-card" :style="{ 'transition-delay': `${index * 100}ms` }">
              <img :src="food.image" :alt="food.name" class="food-image">
              <div class="food-info">
                <h4 class="food-name">{{ food.name }}</h4>
                <p class="food-calories">{{ food.calories }} kcal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn back" @click="$emit('back')">Back to Form</button>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, nextTick } from 'vue';

export default defineComponent({
  name: 'ShowComponent',
  props: {
    bmr: {
      type: Number,
      required: true,
    },
    tdee: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      animatedBmr: 0,
      animatedTdee: 0,
      isVisible: false,
      // ========================================================================
      // == คลังข้อมูลเมนูอาหารทั้งหมด (All Food Database) ==
      // คุณสามารถเพิ่มเมนูอาหารใหม่ๆ ใน array นี้ได้เลย
      // เพื่อเพิ่มความหลากหลายและความแม่นยำในการแนะนำอาหาร
      //
      // โครงสร้างของแต่ละเมนู:
      // { 
      //   name: 'ชื่อเมนูอาหาร', 
      //   calories: จำนวนแคลอรี่ (ตัวเลข), 
      //   image: 'URL ของรูปภาพ' 
      // },
      // ========================================================================
      allFoods: [
        { name: 'ข้าวมันไก่', calories: 600, image: 'https://f.ptcdn.info/395/086/000/m4f7e1g0ie15RJ586YF-o.jpg' },
        { name: 'สลัดผัก', calories: 250, image: 'https://i.pinimg.com/736x/a3/41/d4/a341d44bf1bf710eda354fa2f7c1267c.jpg' },
        { name: 'กะเพราไก่ไข่ดาว', calories: 550, image: 'https://www.ajinomoto.co.th/storage/photos/shares/our-story/blog/krapao-story/krapao-02.jpg' },
        { name: 'สเต็กปลาแซลมอน', calories: 450, image: 'https://krua.co/wp-content/uploads/2022/02/KS_0010-scaled.jpg' },
        { name: 'ต้มยำกุ้ง', calories: 350, image: 'https://s359.kapook.com/pagebuilder/e8336043-a086-4923-8869-5f74523a59fb.jpg' },
        { name: 'แกงเขียวหวานไก่', calories: 480, image: 'https://d12man5gwydfvl.cloudfront.net/wp-content/uploads/2020/02/Green-curry-recipe-1-1.jpg' },
        { name: 'ข้าวไข่เจียว', calories: 300, image: 'https://s359.kapook.com/pagebuilder/372c8d79-913c-4161-8f3a-93a44e5b1b95.jpg' },
        { name: 'โยเกิร์ตผลไม้', calories: 150, image: 'https://i.ytimg.com/vi/YfP33u5T__4/maxresdefault.jpg' },
        // <-- เพิ่มเมนูใหม่ต่อท้ายตรงนี้ได้เลยครับ เช่น:
        // { name: 'ผัดไทยกุ้งสด', calories: 680, image: 'URL_รูปภาพผัดไทย.jpg' },
        // { name: 'ข้าวขาหมู', calories: 700, image: 'URL_รูปภาพข้าวขาหมู.jpg' },
      ]
    };
  },
  mounted() {
    // ใช้ nextTick เพื่อให้แน่ใจว่า DOM พร้อมแล้วก่อนเริ่ม animation
    nextTick(() => {
      this.isVisible = true;
      this.animateNumbers();
    });
  },
  methods: {
    animateNumbers() {
      const animateValue = (ref: 'animatedBmr' | 'animatedTdee', targetValue: number, duration: number) => {
        // Animation logic here... (omitted for brevity, will be handled by CSS or a simple tween)
      };
      this.tween(this, 'animatedBmr', this.bmr, 1000);
      this.tween(this, 'animatedTdee', this.tdee, 1200);
      //บรรทัดนี้ใช้ tween function ด้านล่างในการทำอนิเมชันตัวเลขเฉยๆ ไม่มีฟังัก์ชันอะไร 
    },
    tween(target: any, key: string, endValue: number, duration: number) {
      const startValue = target[key];
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          target[key] = startValue + (endValue - startValue) * progress;
          requestAnimationFrame(animate);
        } else {
          target[key] = endValue;
        }
      };
      requestAnimationFrame(animate);
    }
  },
  computed: {
    recommendedMeals(): Record<string, { foods: { name: string; calories: number; image: string }[], totalCalories: number }> {
      const tdee = this.tdee;
      if (!tdee || tdee <= 0 || this.allFoods.length === 0) return {}; //หยุดการสร้างเมนูอาหาร ถ้าเงื่อนไขไม่พร้อมไม่มี TDEEหรือ ค่า TDEE ผิดหรือ ไม่มีรายการอาหารให้เลือก







      // กำหนดสัดส่วนแคลอรี่สำหรับแต่ละมื้อ ปริมาณอาหาร 
      const mealTargets = {
        Breakfast: tdee * 0.30, // 30%
        Lunch:     tdee * 0.40, // 40%
        Dinner:    tdee * 0.30, // 30%
      };

      let availableFoods = [...this.allFoods];
      const meals: Record<string, { foods: any[], totalCalories: number }> = {};

      // ฟังก์ชันสำหรับหาอาหารที่แคลอรี่ใกล้เคียงเป้าหมายที่สุด
      const findBestFood = (target: number, foodPool: any[]) => {
        if (foodPool.length === 0) return null;
        // เรียงลำดับอาหารตามความต่างของแคลอรี่กับเป้าหมาย (น้อยที่สุดไปมากที่สุด)
        const sorted = [...foodPool].sort((a, b) => Math.abs(a.calories - target) - Math.abs(b.calories - target));
        return sorted[0];
      };

      for (const mealName in mealTargets) {
        const target = mealTargets[mealName as keyof typeof mealTargets];
        const bestFood = findBestFood(target, availableFoods);

        if (bestFood) {
          meals[mealName] = {
            foods: [bestFood],
            totalCalories: bestFood.calories
          };
          // นำอาหารที่เลือกแล้วออกจาก pool เพื่อไม่ให้เลือกซ้ำ
          availableFoods = availableFoods.filter(food => food.name !== bestFood.name);
        }
      }

      return meals;
    },

    totalRecommendedCalories(): number {
      if (!this.recommendedMeals || Object.keys(this.recommendedMeals).length === 0) {
        return 0;
      }
      // รวมแคลอรี่จากทุกมื้อ
      return Object.values(this.recommendedMeals).reduce((sum, meal) => sum + meal.totalCalories, 0);
    }
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.show-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.show-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.show-content {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 30px 40px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.show-content.visible {
  opacity: 1;
  transform: translateY(0);
}

.show-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.show-description {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
}

.results-grid {
  display: grid;
  /* จัดให้การ์ดที่เหลืออยู่ตรงกลาง */
  justify-content: center;
  margin-bottom: 40px;
}

.result-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  border: 1px solid #e9ecef;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}
.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.07);
}

.result-card.main-result h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: 500;
}

.result-card .result-value {
  font-size: 3rem;
  font-weight: bold;
  color: #10b981; /* Health-themed color */
  margin: 5px 0;
}

.result-card span {
  font-size: 0.9rem;
  color: #555;
}

.result-card small {
  display: block;
  margin-top: 10px;
  color: #666;
  font-size: 0.8rem;
}

.food-suggestions {
  margin-top: 20px;
}

.suggestions-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.total-calories-info {
  text-align: center;
  margin-top: -15px;
  margin-bottom: 25px;
  color: #555;
}
.meal-section {
  margin-bottom: 40px;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.meal-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

/* ============================
   🥗 Food Section Minimal Style
   ============================ */

.food-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* bigger cards */
  gap: 28px; /* more spacing = more minimal */
  padding: 10px 0;
}

.food-card {
  background-color: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  /* animation on show */
  opacity: 0;
  transform: translateY(15px);
  transition-property: opacity, transform;
  transition-duration: 0.45s;
  transition-timing-function: ease-out;
}

.visible .food-card {
  opacity: 1;
  transform: translateY(0);
}

.food-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.food-image {
  width: 100%;
  height: 160px;              /* bigger image */
  object-fit: cover;
  border-bottom: 1px solid #f0f0f0;
}

.food-info {
  padding: 18px 16px;         /* more inside spacing */
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.food-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.food-calories {
  font-size: 0.9rem;
  color: #10b981;             /* green tone keeps the health vibe */
  font-weight: 500;
  margin-top: 2px;
}


.actions {
  display: flex;
  justify-content: center;
}

.btn.back {
  padding: 14px 32px;
  background-color: #2c3e50;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn.back:hover {
  background-color: #34495e;
}

.btn.back:active {
  transform: scale(0.98);
}
</style>
