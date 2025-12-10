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
 <button class="btn back" @click="handleBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          Back to Form
        </button>
            </div>
    </div>
    </div>
 
</template>


<script lang="ts">
import { defineComponent, nextTick, PropType } from 'vue';

// สร้าง Interface เพื่อกำหนด Type ของข้อมูลอาหารให้ชัดเจน
interface Food {
  name: string;
  calories: number;
  image: string;
  category: 'main' | 'snack' | 'drink';
}

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

//รับค่า bmr และ tdee ผ่าน props จาก Component แม่คือ App.vue 
  data() {
    return {
      animatedBmr: 0,
      animatedTdee: 0,
      isVisible: false,
      // คลังข้อมูลเมนูอาหารทั้งหมด (All Food Database) 
      allFoods: [
        { name: 'ข้าวมันไก่', calories: 700,  image: 'https://f.ptcdn.info/395/086/000/m4f7e1g0ie15RJ586YF-o.jpg', category: 'main' },
        { name: 'สลัดผัก', calories: 100, image: 'https://i.pinimg.com/736x/a3/41/d4/a341d44bf1bf710eda354fa2f7c1267c.jpg', category: 'snack' },
        { name: 'กะเพราไก่ไข่ดาว', calories: 	630, image: 'https://us-fbcloud.net/hottopic/data/1107/1107933.x7c0cp1p16pi.n3.webp', category: 'main' },
        { name: 'สเต็กปลาแซลมอน', calories: 550, image: 'https://fit-d.com/image_webp/f?src=./uploads/food/649f7d8be26053a1f6132fdd3cb67ffe.jpeg', category: 'main' },
        { name: 'ต้มยำกุ้ง', calories: 900, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoMt-i0iEpQTjuBCwcVXa-vS250HmfjXwksQ&s', category: 'main' },
        { name: 'แกงเขียวหวานไก่', calories: 480, image: 'https://recipe.sgethai.com/wp-content/uploads/2019/03/26022025-chicken-green-curry-2.webp', category: 'main' },
        { name: 'ข้าวไข่เจียว', calories: 300, image: 'https://img.kapook.com/u/2016/wanwanat/0_edit/385698979x.jpg', category: 'main' },
        { name: 'โยเกิร์ตผลไม้', calories: 150, image: 'https://cheewajit.com/app/uploads/2017/01/%E0%B9%82%E0%B8%A2%E0%B9%80%E0%B8%81%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%9C%E0%B8%A5%E0%B9%84%E0%B8%A1%E0%B9%89%E0%B8%AB%E0%B8%A5%E0%B8%B2%E0%B8%81%E0%B8%AA%E0%B8%B5-02.jpg', category: 'snack' },
        { name: 'กล้วยหอม', calories: 120, image: 'https://fit-d.com/uploads/food/5f6c8c69a8f190b979f93f02475aac80.jpg', category: 'snack' },
        { name: 'อเมริกาโน่ (ไม่หวาน)', calories: 15, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR78UC_rZkNIYznhXQ7i-rzONJR5eGfgoJ68w&s', category: 'drink' },
        { name: 'น้ำผลไม้ปั่น', calories: 200, image: 'https://s359.kapook.com/pagebuilder/f949109b-88c9-4c5a-b478-97bd5440f117.jpg', category: 'drink' },
        { name: 'ก๋วยเตี๋ยวต้มยำกุ้ง', calories: 320, image: 'https://image.posttoday.com/media/content/2015/10/22/72B601BC3315419397159E2FA0247215.jpg', category: 'main' },
        { name: 'ข้าวแกงกะหรี่หมู', calories: 1200, image: 'https://recipe.sgethai.com/wp-content/uploads/2025/09/18092025-tonkatsu-curry-rice-cover.webp', category: 'main' },
        { name: 'ข้าวหมูแดง', calories: 541 , image: 'https://food.mthai.com/app/uploads/2014/10/DSC0343.jpg', category: 'main' },
        { name: 'น้ำมะพร้าว', calories: 120, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2gXO_Y-3_7i3Nj_6aUHDhkN-nNfbUuBd1cw&s', category: 'drink' },
        { name: 'ข้าวปลาทูทอด', calories: 280, image: 'https://i.ytimg.com/vi/4M3IHrgUqcA/hqdefault.jpg', category: 'main' },  
        { name: 'ผัดผักรวมหมู', calories: 210, image: 'https://www.sgethai.com/wp-content/uploads/2023/12/Stir-Fried-Mixed-Vegetables-ct3_result.webp', category: 'main' },
        { name: 'พะโล้', calories: 210, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPzgYQu3CpP82KN65hYX1rDfQtHmYXDimE1A&s', category: 'main' },
        { name: 'ยำวุ้นเส้น', calories: 250, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbBfxFubgk9kEFo9cWBErHiHSOLn-1AiThag&s', category: 'snack' },
        { name: 'สเต๊กหมู + ผักสลัด', calories: 505, image: 'https://www.pitchameat.com/wp-content/uploads/2022/07/4.%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3-%E0%B8%AA%E0%B9%80%E0%B8%95%E0%B9%87%E0%B8%81-%E0%B8%AB%E0%B8%A1%E0%B8%B9-%E0%B8%99%E0%B8%B8%E0%B9%88%E0%B8%A1.jpg', category: 'main' },
        { name: 'ลิ้นจี่', calories: 150, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVtyOiCrfwX1N8phGekAErqNNz-HVhUI1Xrw&s', category: 'snack' },
        { name: 'สับปะรด', calories: 80, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXSJ3A0xD9TXY8BzXNTswmcz_AKbG-_7YCAg&s', category: 'snack' },
        { name: 'ข้าวเหนียวสังขยา', calories: 370, image: 'https://www.kp-sugargroup.com/_sys/wp-content/uploads/2021/04/6-1.jpg', category: 'main' },
        { name: 'น้ำฝรั่ง', calories: 100, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrcHNc18IQ12Niw1V3pLplL7tifdis8DFVGQ&s', category: 'drink' }, { name: 'แฮมเบอร์เกอร์หมู', calories: 450, image: 'https://fit-d.com/uploads/food/1c97e984642c7b29d1b8c529c807d690.jpg', category: 'main' },                   { name: 'ไอศกรีมกะทิ', calories: 108, image: 'https://recipe.sgethai.com/wp-content/uploads/2025/04/cover-coconut-ice-cream-1.webp', category: 'snack' },
        { name: 'น้ำเต้าหู้', calories: 80, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfgaamlc-E5BsffSsfIeKr8kRO_TJdjlVyoQ&s', category: 'drink' },
        { name: 'น้ำส้มคั้น', calories: 110, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnHYW7iEUdsvEK6gnCHp-JEfZREaVwy0ub0Q&s', category: 'drink' },
        { name: 'ข้าวผัดปู', calories: 530, image: 'https://recipe.sgethai.com/wp-content/uploads/2025/05/140525-crab-fried-rice-cover.webp', category: 'main' },
                                                                                                                                                                
      ] as Food[] // กำหนดให้ allFoods เป็น Array ของ Food
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
    handleBack() {
      // 1. ทำให้ component หายไปพร้อม animation
      this.isVisible = false;
      // 2. รอให้ animation จบ (ประมาณ 500ms ตาม CSS) แล้วค่อยส่ง event 'back'
      // เพื่อให้ Component แม่สลับหน้าจอได้อย่างราบรื่น
      setTimeout(() => this.$emit('back'), 500);
    },
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
    recommendedMeals(): Record<string, { foods: Food[], totalCalories: number }> {
      const tdee = this.tdee;
      if (!tdee || tdee <= 0 || this.allFoods.length === 0) return {}; //หยุดการสร้างเมนูอาหาร ถ้าเงื่อนไขไม่พร้อมไม่มี TDEEหรือ ค่า TDEE ผิดหรือ ไม่มีรายการอาหารให้เลือก

      // กำหนดสัดส่วนแคลอรี่สำหรับแต่ละมื้อ ปริมาณอาหาร 
      const mealTargets = {
        Breakfast: { target: tdee * 0.30, categories: ['main' ] }, // 30%
        Lunch:     { target: tdee * 0.40, categories: ['main', 'drink'] }, // 40%
        Dinner:    { target: tdee * 0.30, categories: ['snack'] }, // 30% - อัปเดตตามที่ร้องขอ
      };

      let availableFoods = [...this.allFoods];
      const meals: Record<string, { foods: Food[], totalCalories: number }> = {};

      for (const mealName in mealTargets) {
        const mealInfo = mealTargets[mealName as keyof typeof mealTargets];
        let remainingCalories = mealInfo.target;
        const mealFoods: Food[] = [];
        let mealTotalCalories = 0;

        // สร้าง pool อาหารสำหรับมื้อนี้ตาม category ที่กำหนด
        let foodPoolForMeal = availableFoods.filter(food => mealInfo.categories.includes(food.category));

        // --- Logic ใหม่: เลือกอาหารหลักก่อน แล้วค่อยเติมด้วยหมวดหมู่อื่น ---

        // 1. เลือกอาหารหลัก (main) ก่อน 1 อย่าง (ถ้ามีในหมวดหมู่นี้)
        if (mealInfo.categories.includes('main')) {
            const mainFoods = foodPoolForMeal.filter(f => f.category === 'main');
            if (mainFoods.length > 0) {
                // หาอาหารหลักที่แคลอรี่ใกล้เคียงเป้าหมายที่สุด แต่ไม่เกิน
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
                    // นำอาหารที่เลือกแล้วออกจาก pool ทั้งหมด
                    availableFoods = availableFoods.filter(f => f.name !== bestMain!.name);
                    foodPoolForMeal = foodPoolForMeal.filter(f => f.name !== bestMain!.name);
                }
            }
        }

        // 2. เติมแคลอรี่ที่เหลือด้วยอาหารหมวดหมู่อื่นๆ (snack, drink)
        while (remainingCalories > 50 && foodPoolForMeal.length > 0) { // ลดเกณฑ์เหลือ 50 สำหรับของว่าง/เครื่องดื่ม
            // หาอาหารที่แคลอรี่น้อยกว่าหรือเท่ากับที่เหลือ
            const fittingFoods = foodPoolForMeal.filter(f => f.calories <= remainingCalories && f.category !== 'main');
            if (fittingFoods.length === 0) break;

            // สุ่มเลือกจากรายการที่เหมาะสม เพื่อความหลากหลาย
            const randomFood = fittingFoods[Math.floor(Math.random() * fittingFoods.length)];

            if (randomFood) {
                mealFoods.push(randomFood);
                mealTotalCalories += randomFood.calories;
                remainingCalories -= randomFood.calories;
                // นำอาหารที่เลือกแล้วออกจาก pool (ยกเว้นของว่างที่อาจใช้ซ้ำได้)
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


.actions-top {
  display: flex;
  justify-content: flex-start; /* align to left */
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
