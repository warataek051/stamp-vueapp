<template>
  <nav class="navbar-container">
    <div class="navbar-content">
      <h1 class="navbar-title">
        <span class="highlight">Fit</span> Woi
      </h1>
      <p class="navbar-subtitle">Balance your calories, balance your life.</p>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Navbar',
});
</script>

<style scoped>
/* นำเข้าฟอนต์ (ถ้าใน App.vue มีแล้ว ไม่ต้องใส่บรรทัดนี้ก็ได้ครับ) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Sarabun:wght@400;500&display=swap');

.navbar-container {
  /* พื้นหลังสีขาวสะอาดตา */
  background-color: #ffffff;
  /* เส้นขอบล่างบางๆ แทนเงาหนักๆ */
  border-bottom: 1px solid #edf2f0; 
  padding: 24px 0;
  font-family: 'Inter', 'Sarabun', sans-serif;
  
  /* Sticky Navbar (Optional: ถ้าอยากให้เกาะติดด้านบนตลอด) */
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center; /* จัดกลางแบบ Minimal */
  
  /* จัด layout ให้ title กับ subtitle ห่างกันพอดี */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.navbar-title {
  font-size: 2rem; /* 32px */
  font-weight: 700;
  color: #0a149a; /* สีเทาเข้มเกือบดำ (อ่านง่ายกว่าสีดำสนิท) */
  margin: 0;
  letter-spacing: -0.5px; /* บีบตัวอักษรนิดนึงให้ดู Modern */
}

/* คำว่า Fit เป็นสีเขียวธีมหลัก */
.navbar-title .highlight {
  color: #f15500; /* Sage Green (เข้าชุดกับหน้า Person) */
}

.navbar-subtitle {
  font-size: 0.95rem;
  color: #95a5a6; /* สีเทาอ่อน */
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.5px;
}

/* Responsive adjustment */
@media (max-width: 600px) {
  .navbar-container {
    padding: 16px 0;
  }
  
  .navbar-title {
    font-size: 1.5rem;
  }
  
  .navbar-subtitle {
    font-size: 0.8rem;
  }
}
</style>