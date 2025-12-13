<template>
  <div>
    <Navbar />
    <div v-if="!showResults">
        <FormComponent @save="insertEmployee" @show-results="showResults = true"/>
    </div>
    <div v-if="!showResults">
      <ListComponent :employees="employee"/>
    </div>
    <div v-if="showResults">
      <Show 
        @back="showResults = false" 
        :bmr="lastEmployee.bmr"   
        :tdee="lastEmployee.tdee"  
      />
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
    methods: {
        insertEmployee(data) { 
          this.employee.push(data);
          this.lastEmployee = data;
        }
    }
};
</script>


 