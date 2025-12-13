<template>
  <div class="show-container">
    <div class="show-content" :class="{ 'visible': isVisible }">
      
      <h1 class="show-title">Calculation Results</h1>
      <p class="show-description">นี่คือผลลัพธ์การคำนวณและเมนูอาหารที่แนะนำสำหรับคุณ</p>

      <div v-if="Object.keys(recommendedMeals).length > 0" class="food-suggestions">
        
        <p class="total-calories-info">
          แคลอรี่รวม 3 มื้อ: <strong>{{ totalRecommendedCalories.toFixed(0) }} kcal</strong>
        </p>

        <MealList :meals="recommendedMeals" />

      </div>

      <div class="actions-top">
        <button class="btn back" @click="handleBack">Back to Form</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import { allFoods, Food } from './mockdata.vue';
// Import Component ใหม่เข้ามา
import MealList from './MealList.vue';

export default defineComponent({
  name: 'ShowComponent',
  components: {
    MealList // ลงทะเบียน Component
  },
  props: {
    bmr: { type: Number, required: true },
    tdee: { type: Number, required: true }
  },
  data() {
    return {
      animatedBmr: 0,
      animatedTdee: 0,
      isVisible: false,
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
      // (คงเดิมไว้) ...
      this.tween(this, 'animatedBmr', this.bmr, 1000);
      this.tween(this, 'animatedTdee', this.tdee, 1200);
    },
    tween(target: any, key: string, endValue: number, duration: number) {
      // (คงเดิมไว้) ...
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
    // *** Logic การคำนวณอาหาร (recommendedMeals) เก็บไว้ที่ Parent เหมือนเดิมถูกต้องแล้ว ***
    // เพราะต้องใช้ค่า tdee ในการคำนวณ แล้วค่อยส่งผลลัพธ์ไปให้ลูกแสดงผล
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
/* เหลือไว้เฉพาะ CSS ของ Layout หลัก */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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

.food-suggestions {
  margin-top: 20px;
}

.total-calories-info {
  text-align: center;
  margin-top: -15px;
  margin-bottom: 25px;
  color: #555;
}

.actions-top {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.btn.back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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