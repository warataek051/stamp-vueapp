<template>
  <div class="show-container">
    <div class="show-content" :class="{ 'visible': isVisible }">
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
      //   category: 'main' | 'snack' | 'drink' (หมวดหมู่อาหาร)
      // },
      // ========================================================================
      allFoods: [
        { name: 'ข้าวมันไก่', calories: 600, image: 'https://f.ptcdn.info/395/086/000/m4f7e1g0ie15RJ586YF-o.jpg', category: 'main' },
        { name: 'สลัดผัก', calories: 250, image: 'https://i.pinimg.com/736x/a3/41/d4/a341d44bf1bf710eda354fa2f7c1267c.jpg', category: 'snack' },
        { name: 'กะเพราไก่ไข่ดาว', calories: 550, image: 'https://us-fbcloud.net/hottopic/data/1107/1107933.x7c0cp1p16pi.n3.webp', category: 'main' },
        { name: 'สเต็กปลาแซลมอน', calories: 450, image: 'https://fit-d.com/image_webp/f?src=./uploads/food/649f7d8be26053a1f6132fdd3cb67ffe.jpeg', category: 'main' },
        { name: 'ต้มยำกุ้ง', calories: 350, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoMt-i0iEpQTjuBCwcVXa-vS250HmfjXwksQ&s', category: 'main' },
        { name: 'แกงเขียวหวานไก่', calories: 480, image: 'https://recipe.sgethai.com/wp-content/uploads/2019/03/26022025-chicken-green-curry-2.webp', category: 'main' },
        { name: 'ข้าวไข่เจียว', calories: 300, image: 'https://img.kapook.com/u/2016/wanwanat/0_edit/385698979x.jpg', category: 'main' },
        { name: 'โยเกิร์ตผลไม้', calories: 150, image: 'https://cheewajit.com/app/uploads/2017/01/%E0%B9%82%E0%B8%A2%E0%B9%80%E0%B8%81%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%9C%E0%B8%A5%E0%B9%84%E0%B8%A1%E0%B9%89%E0%B8%AB%E0%B8%A5%E0%B8%B2%E0%B8%81%E0%B8%AA%E0%B8%B5-02.jpg', category: 'snack' },
        { name: 'กล้วยหอม', calories: 120, image: 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/03/banana-1296x728-header.jpg?w=1155&h=1528', category: 'snack' },
        { name: 'อเมริกาโน่ (ไม่หวาน)', calories: 15, image: 'https://www.nespresso.com/ncp/res/uploads/recipes/nespresso-recipes-Americano.jpg', category: 'drink' },
        { name: 'นมจืด', calories: 150, image: 'https://inwfile.com/s-o/yqg2wu.jpg', category: 'drink' },
        // <-- เพิ่มเมนูใหม่ต่อท้ายตรงนี้ได้เลยครับ เช่น:
        // { name: 'ผัดไทยกุ้งสด', calories: 680, image: 'URL_รูปภาพผัดไทย.jpg', category: 'main' },
        // { name: 'ข้าวขาหมู', calories: 700, image: 'URL_รูปภาพข้าวขาหมู.jpg', category: 'main' },
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
    recommendedMeals(): Record<string, { foods: { name: string; calories: number; image: string; category: string }[], totalCalories: number }> {
      const tdee = this.tdee;
      if (!tdee || tdee <= 0 || this.allFoods.length === 0) return {}; //หยุดการสร้างเมนูอาหาร ถ้าเงื่อนไขไม่พร้อมไม่มี TDEEหรือ ค่า TDEE ผิดหรือ ไม่มีรายการอาหารให้เลือก







      // กำหนดสัดส่วนแคลอรี่สำหรับแต่ละมื้อ ปริมาณอาหาร 
      const mealTargets = {
        Breakfast: { target: tdee * 0.30, categories: ['main', 'snack', 'drink'] }, // 30%
        Lunch:     { target: tdee * 0.40, categories: ['main', 'drink'] }, // 40%
        Dinner:    { target: tdee * 0.30, categories: ['main', 'snack'] }, // 30%
      };

      let availableFoods = [...this.allFoods];
      const meals: Record<string, { foods: any[], totalCalories: number }> = {};

      for (const mealName in mealTargets) {
        const mealInfo = mealTargets[mealName as keyof typeof mealTargets];
        let remainingCalories = mealInfo.target;
        const mealFoods: any[] = [];
        let mealTotalCalories = 0;

        // สร้าง pool อาหารสำหรับมื้อนี้ตาม category ที่กำหนด
        let foodPoolForMeal = availableFoods.filter(food => mealInfo.categories.includes(food.category));

        // จัดลำดับความสำคัญ: อาหารหลัก (main) > ของว่าง (snack) > เครื่องดื่ม (drink)
        foodPoolForMeal.sort((a, b) => {
            const categoryOrder = { 'main': 1, 'snack': 2, 'drink': 3 };
            return categoryOrder[a.category as keyof typeof categoryOrder] - categoryOrder[b.category as keyof typeof categoryOrder];
        });

        while (remainingCalories > 100 && foodPoolForMeal.length > 0) { // พยายามเติมจนกว่าแคลจะเหลือน้อยกว่า 100 หรือไม่มีอาหารให้เลือก
            // หาอาหารที่แคลอรี่ใกล้เคียงกับที่เหลืออยู่ที่สุด แต่ไม่เกิน
            let bestFood = null;
            let smallestDiff = Infinity;

            for (const food of foodPoolForMeal) {
                if (food.calories <= remainingCalories) {
                    const diff = remainingCalories - food.calories;
                    if (diff < smallestDiff) {
                        smallestDiff = diff;
                        bestFood = food;
                    }
                }
            }

            if (bestFood) {
                mealFoods.push(bestFood);
                mealTotalCalories += bestFood.calories;
                remainingCalories -= bestFood.calories;
                // นำอาหารที่เลือกแล้วออกจาก pool ทั้งหมด
                availableFoods = availableFoods.filter(f => f.name !== bestFood.name);
                foodPoolForMeal = foodPoolForMeal.filter(f => f.name !== bestFood.name);
            } else {
                break; // ไม่มีอาหารที่เหมาะสมแล้ว
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
