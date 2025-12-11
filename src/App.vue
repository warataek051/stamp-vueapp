<template>
  <div>
    <Navbar />
    <div v-if="!showResults">
        <FormComponent @save="insertEmployee" @show-results="showResults = true"/>
        <!-- //เมื่อผู้ใช้กดปุ่มSaveในFormComponentจะเปลี่ยนกน้าไปแสดงผลลัพธ์ -->

    </div>
    <div v-if="!showResults">
      <ListComponent :employees="employee"/>
    </div>
        <!-- แสดงประวัติ-->

    <div v-if="showResults">
      <Show 
        @back="showResults = false" 
        :bmr="lastEmployee.bmr"   
        :tdee="lastEmployee.tdee"  
      />
     <!-- ดึงค่าจาก lastEmployee.bmr และ lastEmployee.tdee ส่งต่อผ่าน Props (:bmr, :tdee) -->
    </div>
  </div>
</template>

<script >
import FormComponent from './components/FormComponent.vue';
import ListComponent from './components/ListComponent.vue';
import Navbar from './components/Navbar.vue';
import Show from './components/Show.vue';
export default {
    name: 'App',
    components: {
        FormComponent,
        ListComponent,
        Navbar,
        Show
    },
    data() {
        return {
          employee: [],
          showResults: false,
          lastEmployee: null
        }
    },

    // รับจากฟอร์มผ่านตัวแปร: data (ใน method insertEmployee)

    methods: {
        insertEmployee(data) { 
          this.employee.push(data);
          // นำข้อมูล data ที่ได้รับมา ไปเพิ่มใน Array employee (ซึ่งเก็บข้อมูลทุกคนที่เคยกด Save)
          this.lastEmployee = data;
          // นำข้อมูลชุดเดียวกันนั้น (data) ไปใส่ในตัวแปร lastEmployee เป็นคนล่าสุด
        }
    }
};
</script>


  <!-- หน้านี้แสดงหน้ากรอกข้อมูล/ดูรายการและหน้าแสดงผลลัพธ์คำนวณ BMR/TDEE -->

<!-- 
  รับจากฟอร์มผ่านตัวแปร: data (ใน method insertEmployee)
  นำข้อมูล data ที่ได้รับมา ไปเพิ่มใน Array employee (ซึ่งเก็บข้อมูลทุกคนที่เคยกด Save)
  นำข้อมูลชุดเดียวกันนั้น (data) ไปใส่ในตัวแปร lastEmployee เป็นคนล่าสุด และส่งผ่าน prop โดยใช้คำสั่ง v-bind -->
