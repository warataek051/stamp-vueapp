<template>
  <div class="meal-list-container">
    
    <div v-if="totalRecommendedCalories > 0">
      <p class="total-calories-info">
        แคลอรี่รวม 3 มื้อ: <strong>{{ totalRecommendedCalories.toFixed(0) }} kcal</strong>
      </p>

      <div v-for="(meal, mealName) in recommendedMeals" :key="mealName" class="meal-section">
        <div class="meal-header">
          <h3 class="meal-title">{{ mealName }}</h3>
          <span class="meal-calories">Total: {{ meal.totalCalories.toFixed(0) }} kcal</span>
        </div>
        <div class="food-grid">
          <div 
            v-for="(food, index) in meal.foods" 
            :key="food.name" 
            class="food-card" 
            :style="{ 'transition-delay': `${index * 100}ms` }"
          >
            <img :src="food.image" :alt="food.name" class="food-image">
            <div class="food-info">
              <h4 class="food-name">{{ food.name }}</h4>
              <p class="food-calories">{{ food.calories }} kcal</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <p>ไม่สามารถคำนวณรายการอาหารได้ (TDEE ต่ำเกินไป หรือ ไม่มีข้อมูลอาหาร)</p>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// 1. ประกาศ Interface และ Data ไว้ในนี้เลย
interface Food {
  name: string;
  calories: number;
  image: string;
  category: 'main' | 'snack' | 'drink';
}

const allFoods: Food[] = [
    { name: 'ข้าวมันไก่', calories: 700,  image: 'https://f.ptcdn.info/395/086/000/m4f7e1g0ie15RJ586YF-o.jpg', category: 'main' },
    { name: 'สลัดผัก', calories: 100, image: 'https://i.pinimg.com/736x/a3/41/d4/a341d44bf1bf710eda354fa2f7c1267c.jpg', category: 'snack' },
    { name: 'กะเพราไก่ไข่ดาว', calories:  630, image: 'https://us-fbcloud.net/hottopic/data/1107/1107933.x7c0cp1p16pi.n3.webp', category: 'main' },
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
    { name: 'น้ำฝรั่ง', calories: 100, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrcHNc18IQ12Niw1V3pLplL7tifdis8DFVGQ&s', category: 'drink' }, 
    { name: 'แฮมเบอร์เกอร์หมู', calories: 450, image: 'https://fit-d.com/uploads/food/1c97e984642c7b29d1b8c529c807d690.jpg', category: 'main' },                   
    { name: 'ไอศกรีมกะทิ', calories: 108, image: 'https://recipe.sgethai.com/wp-content/uploads/2025/04/cover-coconut-ice-cream-1.webp', category: 'snack' },
    { name: 'น้ำเต้าหู้', calories: 80, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfgaamlc-E5BsffSsfIeKr8kRO_TJdjlVyoQ&s', category: 'drink' },
    { name: 'น้ำส้มคั้น', calories: 110, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnHYW7iEUdsvEK6gnCHp-JEfZREaVwy0ub0Q&s', category: 'drink' },
    { name: 'ข้าวผัดปู', calories: 530, image: 'https://recipe.sgethai.com/wp-content/uploads/2025/05/140525-crab-fried-rice-cover.webp', category: 'main' },
];

export default defineComponent({
  name: 'MealList',
  props: {
    // รับแค่ TDEE ก็พอ เดี๋ยวคำนวณเอง
    tdee: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
        // อ้างอิง data จากตัวแปรด้านบน
        allFoodsList: allFoods
    }
  },
  computed: {
    // ย้าย Logic การคำนวณมาไว้ที่นี่
    recommendedMeals(): Record<string, { foods: Food[], totalCalories: number }> {
      const tdee = this.tdee;
      if (!tdee || tdee <= 0 || this.allFoodsList.length === 0) return {};

      const mealTargets = {
        Breakfast: { target: tdee * 0.30, categories: ['main' ] }, 
        Lunch:     { target: tdee * 0.40, categories: ['main', 'drink'] }, 
        Dinner:    { target: tdee * 0.30, categories: ['snack'] }, 
      };

      let availableFoods = [...this.allFoodsList];
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
/* CSS เดิมที่ใช้ตกแต่ง List และ Card */
.total-calories-info {
  text-align: center;
  margin-top: 0;
  margin-bottom: 25px;
  color: #555;
  font-size: 1.1rem;
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

.meal-calories {
  font-size: 0.9rem;
  color: #555;
}

.food-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 28px;
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
  
  opacity: 0;
  transform: translateY(15px);
  animation: slideIn 0.5s ease-out forwards;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.food-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.food-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-bottom: 1px solid #f0f0f0;
}

.food-info {
  padding: 18px 16px;
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
  color: #10b981;
  font-weight: 500;
  margin-top: 2px;
}

.no-data {
    text-align: center;
    color: #999;
    padding: 20px;
}
</style>