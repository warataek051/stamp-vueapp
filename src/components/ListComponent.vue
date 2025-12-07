<template>
  <div class="list-wrapper">
    <ul class="list">
    <Person v-for="(item,index) in employees" 
    :key="index"
    :age="item.age"
    :weight="item.weight"
    :height="item.height"
    :activity="item.activity"
    :gender="item.gender"
    :bmr="calcBmr(item)"
    :tdee="calcTdee(item)"
    :macros="calcMacros(item)"/>
    </ul>
    

    
  </div>
</template>

<script lang="ts">
// นำเข้า component Person
import Person from './Person.vue'

// Define type for employee item
interface Employee {
  age: string | number;
  weight: string | number;
  height: string | number;
  activity: string;
  gender: string;
}

// Define type for macro factors
interface MacroFactors {
  cut: number;
  maintenance: number;
  bulk: number;
  [key: string]: number;
}

// Define type for macro result
interface MacroResult {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

// Define type for result object
interface ResultObject {
  [key: string]: MacroResult;
}

export default {
    //ส่งออกของตนเอง คือ คอมโพเนนต์ ListComponent
    //ตั้งชื่อ component
    name: 'ListComponent',
    //เรียกใช้ component Person
    components: {
     Person
    },//end components
    props: ['employees'],
    methods: {
      // calculate BMR for a single employee item and return rounded value or null
      calcBmr(item: Employee) {
        if (!item || !item.gender) return null;
        const g = item.gender;
        const weight = Number(item.weight) || 0;
        const height = Number(item.height) || 0;
        const age = Number(item.age) || 0;
        let val: number | null = null;
        if (g === 'M') {
          val = (13.7 * weight) + (5 * height) - (6.8 * age) + 66;
        } else if (g === 'F') {
          val = (9.6 * weight) + (1.8 * height) - (4.7 * age) + 665;
        }
        return (val === null) ? null : Math.round(val);
      },
        // calculate macros (protein/fat/carbs in grams) for cut/maintenance/bulk
        calcMacros(item: Employee) {
          const tdee = this.calcTdee(item);
          if (tdee === null) return null;
          const weight = Number(item.weight) || 0;
          // protein g/kg: cut, maintenance, bulk
          const proteinFactor: MacroFactors = { cut: 1.6, maintenance: 2.0, bulk: 2.4 };
          // fat g/kg: cut, maintenance, bulk
          const fatFactor: MacroFactors = { cut: 0.8, maintenance: 1.0, bulk: 1.25 };
          // calorie multipliers relative to maintenance TDEE
          const calFactor: MacroFactors = { cut: 0.78, maintenance: 1.0, bulk: 1.2 };

          const result: ResultObject = {};
          ['cut', 'maintenance', 'bulk'].forEach(key => {
            const cal = Math.round(tdee * calFactor[key]);
            const proteinG = Math.round(weight * proteinFactor[key]);
            const fatG = Math.round(weight * fatFactor[key]);
            const proteinCal = proteinG * 4;
            const fatCal = fatG * 9;
            const carbCal = cal - (proteinCal + fatCal);
            const carbsG = Math.max(0, Math.round(carbCal / 4));
            result[key] = {
              calories: cal,
              protein: proteinG,
              fat: fatG,
              carbs: carbsG
            };
          });
          return result;
        },
      // calculate TDEE by multiplying BMR with activity factor
      calcTdee(item: Employee) {
        const bmr = this.calcBmr(item);
        if (bmr === null) return null;
        const activity = (item && item.activity) ? String(item.activity) : '';
        let factor = 1.0;
        if (activity.includes('Sedentary')) {
          factor = 1.2;
        } else if (activity.includes('Light Exercise')) {
          factor = 1.375;
        } else if (activity.includes('Moderate Exercise')) {
          factor = 1.55;
        } else if (activity.includes('Heavy Exercise') && activity.includes('6-7')) {
          factor = 1.725;
        } else if (activity.includes('Athlete')) {
          factor = 1.9;
        }
        return Math.round(bmr * factor);
      }
    },
    }




</script>


