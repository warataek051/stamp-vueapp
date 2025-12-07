<template>
  <li class="item">
    <div class="person-top">
      <div class="stat-pill">
        <span class="stat-label">BMR</span>
        <span class="stat-value">{{ bmr ? Math.round(bmr) : '-' }}</span>
        <span class="stat-unit">kcal</span>
      </div>
      <div class="divider"></div>
      <div class="stat-pill">
        <span class="stat-label">TDEE</span>
        <span class="stat-value">{{ tdee ? tdee : '-' }}</span>
        <span class="stat-unit">kcal</span>
      </div>
    </div>

    <div class="macros-row" v-if="macros">
      <div class="macro-card">
        <div class="card-header">Cutting</div>
        <div class="macro-content">
          <div class="nutrient">
            <strong>{{ macros.cut.protein }}g</strong> <span>Protein</span>
          </div>
          <div class="nutrient">
            <strong>{{ macros.cut.fat }}g</strong> <span>Fat</span>
          </div>
          <div class="nutrient">
            <strong>{{ macros.cut.carbs }}g</strong> <span>Carbs</span>
          </div>
        </div>
      </div>

      <div class="macro-card highlight">
        <div class="card-header">Maintenance</div>
        <div class="macro-content">
          <div class="nutrient">
            <strong>{{ macros.maintenance.protein }}g</strong> <span>Protein</span>
          </div>
          <div class="nutrient">
            <strong>{{ macros.maintenance.fat }}g</strong> <span>Fat</span>
          </div>
          <div class="nutrient">
            <strong>{{ macros.maintenance.carbs }}g</strong> <span>Carbs</span>
          </div>
        </div>
      </div>

      <div class="macro-card">
        <div class="card-header">Bulking</div>
        <div class="macro-content">
          <div class="nutrient">
            <strong>{{ macros.bulk.protein }}g</strong> <span>Protein</span>
          </div>
          <div class="nutrient">
            <strong>{{ macros.bulk.fat }}g</strong> <span>Fat</span>
          </div>
          <div class="nutrient">
            <strong>{{ macros.bulk.carbs }}g</strong> <span>Carbs</span>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: "Person",
  props: ["age", "weight", "height", "activity", "gender", "bmr", "tdee", "macros"],
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Sarabun:wght@400;500&display=swap');

/* --- Theme Variables : Orange & Navy --- */
:root {
  --navy-primary: #002244;    /* น้ำเงินเข้ม (เหมือน Navbar) */
  --orange-vibrant: #ff6600;  /* ส้มสด (เหมือน Navbar) */
  --grey-text: #546e7a;       /* เทาอมน้ำเงิน */
  --bg-card: #ffffff;
}

.item {
  font-family: 'Inter', 'Sarabun', sans-serif;
  list-style: none;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 24px;
  /* เงาบางๆ สีน้ำเงินจาง */
  box-shadow: 0 8px 20px rgba(0, 34, 68, 0.05);
  border: 1px solid #eef2f5;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0, 34, 68, 0.1);
  border-color: #ffccbc; /* เปลี่ยนขอบเป็นสีส้มอ่อนๆ ตอนชี้ */
}

/* --- Top Section (BMR/TDEE) --- */
.person-top {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.stat-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--grey-text, #546e7a);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800; /* ตัวหนาพิเศษแบบสปอร์ต */
  color: var(--navy-primary, #002244);
  line-height: 1.2;
}

.stat-unit {
  font-size: 0.85rem;
  color: var(--orange-vibrant, #ff6600); /* หน่วยเป็นสีส้ม */
  font-weight: 600;
}

.divider {
  width: 2px;
  height: 50px;
  background-color: #eceff1;
  margin: 0 10px;
}

/* --- Macros Grid --- */
.macros-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

/* --- Macro Cards --- */
.macro-card {
  background-color: #fcfcfc;
  border: 1px solid #edf0f2;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  transition: all 0.2s ease;
}

/* การ์ด Maintenance (Highlight) */
.macro-card.highlight {
  background-color: #ffffff;
  /* ขอบสีน้ำเงินเข้ม */
  border: 2px solid var(--navy-primary, #002244); 
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 34, 68, 0.08);
}

/* แถบสีส้มคาดด้านบนการ์ด Highlight */
.macro-card.highlight::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px; /* แถบสีส้ม */

}

.card-header {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #90a4ae;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #eceff1;
}

.macro-card.highlight .card-header {
  color: var(--navy-primary, #002244); /* หัวข้อสีน้ำเงินเข้ม */
  margin-top: 5px; /* ขยับลงหนีแถบสีส้ม */
}

/* Nutrient List */
.macro-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nutrient {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #607d8b;
}

.nutrient strong {
  color: var(--navy-primary, #002244);
  font-weight: 700;
}


</style>