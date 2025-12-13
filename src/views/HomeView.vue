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

