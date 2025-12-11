<template>
  <div class="home">
    <div>
        <FormComponent @save="insertEmployee"/>
    </div>
    <div>
      <ListComponent :employees="employee"/>
    </div>
  </div>
</template>

<script>
import FormComponent from '../components/FormComponent.vue';
import ListComponent from '../components/ListComponent.vue';

export default {
  name: 'HomeView',
  components: {
    FormComponent,
    ListComponent,
  },
  data() {
    return {
      employee: []
    }
  },
  methods: {
    insertEmployee(data) {
      this.employee.push(data);
    }
  }
}
</script>


 <!-- ภาพรวมการไหลของข้อมูล (Data Flow)
FormComponent (ส่งข้อมูลขึ้นมา) ➡️ HomeView (รับและเก็บลงตัวแปร) ➡️ ListComponent (รับไปแสดงผล)
หน้านี้จึงเปรียบเสมือน "ฐานข้อมูลชั่วคราว" ในขณะที่เปิดหน้าเว็บอยู่ครับ เพื่อเชื่อมระหว่างคนกรอก (Form) และคนแสดงผล (List) เข้าด้วยกัน -->
