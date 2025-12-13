<template>
  <div class="show-container">
    <div class="show-content" :class="{ 'visible': isVisible }">
      <!-- Back Button -->
      <h1 class="show-title">Calculation Results</h1>
      <p class="show-description">นี่คือผลลัพธ์การคำนวณและเมนูอาหารที่แนะนำสำหรับคุณ</p>
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
      <div class="actions-top">
      <button class="btn back" @click="handleBack">Back to Form</button>
    </div>
  </div>
</div>
 
</template>


<script lang="ts">
import { defineComponent, nextTick, PropType } from 'vue';

// *สำคัญ* Import ข้อมูลและ Interface จากไฟล์ .vue ที่เราเพิ่งสร้าง
// (ต้องแน่ใจว่าไฟล์อยู่ในโฟลเดอร์เดียวกัน หรือระบุ path ให้ถูก)
import { allFoods, Food } from './mockdata.vue';

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
      // ดึงตัวแปร allFoods ที่ import มาใส่ใน data ของ component นี้
      allFoods: allFoods as Food[] 
    };
  },
  mounted() {
    nextTick(() => {
      this.isVisible = true;
      this.animateNumbers();
    });
  },
  methods: {
    handleBack() {
      this.isVisible = false;
      setTimeout(() => this.$emit('back'), 500);
    },
    animateNumbers() {
      this.tween(this, 'animatedBmr', this.bmr, 1000);
      this.tween(this, 'animatedTdee', this.tdee, 1200);
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
    // *** Code ส่วน computed ใช้ของเดิมได้เลย 100% ***
    recommendedMeals(): Record<string, { foods: Food[], totalCalories: number }> {
      const tdee = this.tdee;
      if (!tdee || tdee <= 0 || this.allFoods.length === 0) return {};

      const mealTargets = {
        Breakfast: { target: tdee * 0.30, categories: ['main' ] }, 
        Lunch:     { target: tdee * 0.40, categories: ['main', 'drink'] }, 
        Dinner:    { target: tdee * 0.30, categories: ['snack'] }, 
      };

      let availableFoods = [...this.allFoods];
      const meals: Record<string, { foods: Food[], totalCalories: number }> = {};

      for (const mealName in mealTargets) {
        const mealInfo = mealTargets[mealName as keyof typeof mealTargets];
        let remainingCalories = mealInfo.target;
        const mealFoods: Food[] = [];
        let mealTotalCalories = 0;

        let foodPoolForMeal = availableFoods.filter(food => mealInfo.categories.includes(food.category));

        if (mealInfo.categories.includes('main')) {
            const mainFoods = foodPoolForMeal.filter(f => f.category === 'main');
            if (mainFoods.length > 0) {
                let bestMain: Food | null = null;
                let smallestDiff = Infinity;
                for (const food of mainFoods) {
                    if (food.calories <= remainingCalories) {
                        const diff = remainingCalories - food.calories;
                        if (diff < smallestDiff) {
                            smallestDiff = diff;
                            bestMain = food;
                        }
                    }
                }

                if (bestMain) {
                    mealFoods.push(bestMain);
                    mealTotalCalories += bestMain.calories;
                    remainingCalories -= bestMain.calories;
                    availableFoods = availableFoods.filter(f => f.name !== bestMain!.name);
                    foodPoolForMeal = foodPoolForMeal.filter(f => f.name !== bestMain!.name);
                }
            }
        }

        while (remainingCalories > 50 && foodPoolForMeal.length > 0) {
            const fittingFoods = foodPoolForMeal.filter(f => f.calories <= remainingCalories && f.category !== 'main');
            if (fittingFoods.length === 0) break;
            const randomFood = fittingFoods[Math.floor(Math.random() * fittingFoods.length)];
            if (randomFood) {
                mealFoods.push(randomFood);
                mealTotalCalories += randomFood.calories;
                remainingCalories -= randomFood.calories;
                if (randomFood.category !== 'snack') {
                    availableFoods = availableFoods.filter(f => f.name !== randomFood!.name);
                }
                foodPoolForMeal = foodPoolForMeal.filter(f => f.name !== randomFood!.name);
            } else {
                break; 
            }
        }
        meals[mealName] = { foods: mealFoods, totalCalories: mealTotalCalories };
      }

      return meals;
    },
    totalRecommendedCalories(): number {
      if (!this.recommendedMeals || Object.keys(this.recommendedMeals).length === 0) {
        return 0;
      }
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


.actions-top {
  display: flex;
  justify-content: center; /* align to left */
  margin-bottom: 20px;
}

.btn.back {
  display: inline-flex; /* to align icon and text */
  align-items: center;
  gap: 8px; /* space between icon and text */
  padding: 12px 24px;
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
