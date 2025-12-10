<template>
        <!-- ฟอร์มกรอกข้อมูลพนักงาน -->
        <form @submit.prevent="supmitFrm" class="form-container">
            <!-- หัวข้อฟอร์ม -->
           
            <!-- แถวของฟอร์มกรอกชื่อ -->
            <div class="form-row">
                <label class="label">Age</label>
                <input class="input" type="number" v-model.number="employee.age" min="0" placeholder="0" />
            </div>
            <!-- แถวของฟอร์มกรอกเงินเดือน -->
            <div class="form-row">
                <label class="label">Weight</label>
                <input class="input" type="number" v-model.number="employee.weight" min="0"  placeholder="kg" />
            </div>
             <div class="form-row">
                <label class="label">Height</label>
                <input class="input" type="number" v-model.number="employee.height" min="0"  placeholder="cm" />
            </div>
            <!-- แถวของฟอร์มเลือกสาขาวิชา -->
            <div class="form-row">
                <label class="label">Activity</label>
                <select class="select" v-model="employee.activity">
                    <option>Sedentary (0 day/week)</option>
                    <option>Light Exercise (1-2 day /week)</option>
                    <option>Moderate Exercise (3-5 day /week)</option>
                    <option>Heavy Exercise (6-7 day /week)</option>
                    <option>Athlete (2x per day)</option>
                </select>
            </div>
            <!-- แถวของฟอร์มเลือกเพศ -->
            <div class="form-row form-inline">
                <label class="label">Gender</label>
                <div class="radio-group">
                        <label class="radio"><input type="radio" value="M" v-model="employee.gender" /> Male</label>
                        <label class="radio"><input type="radio" value="F" v-model="employee.gender" /> Female</label>
                </div>
            </div>
            <!-- แถวของปุ่มส่งฟอร์ม -->
            <div class="form-row actions">
                <button class="btn primary" type="submit" :disabled="!isFormValid">Submit</button>
                <button v-if="isSubmitted" class="btn secondary" type="button" @click="goToShow">Next</button>
            </div>
            <!-- แสดงตัวอย่างข้อมูลที่กรอกในฟอร์ม -->
          
        </form>
</template>




<script>
export default {
    name: 'FormComponent',
    // สร้างข้อมูลรองรับข้อมูลจากฟอร์ม
    data() {
        return {
           employee: {
            age: 0,
            weight: 0,
            height: 0,
            activity: "Sedentary (0 day/week)",
            gender: "",
            
           }, //end employee
           isSubmitted: false
        } //end return
    }, //end data
    computed: {
        // computed BMR value (kcal/day) or null when not enough data
        bmr() {
            const g = this.employee.gender;
            const weight = parseFloat(this.employee.weight) || 0;
            const height = parseFloat(this.employee.height) || 0;
            const age = parseFloat(this.employee.age) || 0;
            if (!g) return null;
            if (g === 'M') {
                // BMR = (13.7 x weight) + (5 x height) - (6.8 x age) + 66
                return (13.7 * weight) + (5 * height) - (6.8 * age) + 66;
            }
            if (g === 'F') {
                // BMR = (9.6 x weight) + (1.8 x height) - (4.7 x age) + 665
                return (9.6 * weight) + (1.8 * height) - (4.7 * age) + 665;
            }
            return null;
        },
        // computed TDEE value (kcal/day) or null when not enough data
        tdee() {
            if (this.bmr === null) return null;
            const activity = this.employee.activity;
            const activityMultipliers = {
                "Sedentary (0 day/week)": 1.2,
                "Light Exercise (1-2 day /week)": 1.375,
                "Moderate Exercise (3-5 day /week)": 1.55,
                "Heavy Exercise (6-7 day /week)": 1.725,
                "Athlete (2x per day)": 1.9
            };
            const multiplier = activityMultipliers[activity];
            if (!multiplier) return null;

            return this.bmr * multiplier;
        },
        bmrDisplay() {
            const v = this.bmr;
            return (v === null) ? '-' : Math.round(v) + ' kcal/day';
        },
        employeeWithBmr() {
            return { ...this.employee, bmr: (this.bmr === null ? null : Math.round(this.bmr)) };
        },
        // ตรวจสอบว่าข้อมูลครบหรือไม่
        isFormValid() {
            return this.employee.age > 0 
                && this.employee.weight > 0 
                && this.employee.height > 0 
                && this.employee.gender !== ''
                && !this.isSubmitted;
        }
    },
    methods: {
        supmitFrm() {
            if (this.isSubmitted) return;
            
            const results = { 
                ...this.employee,
                bmr: this.bmr ? Math.round(this.bmr) : null,
                tdee: this.tdee ? Math.round(this.tdee) : null
            };
            this.$emit('save', results);
            this.isSubmitted = true;
        },
        goToShow() {
            this.$emit('show-results', { bmr: this.bmr, tdee: this.tdee });
        }
    }
}
</script>

<style scoped>
/* นำเข้าฟอนต์ที่อ่านง่ายและดูทันสมัย (แนะนำ Google Fonts: Inter หรือ Sarabun) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Sarabun:wght@300;400;500&display=swap');

/* --- Main Layout --- */
.form-container {
    max-width: 450px;
    margin: 40px auto;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03); /* เงาจางๆ */
    font-family: 'Inter', 'Sarabun', sans-serif;
    color: #333;
    border: 1px solid #f0f0f0;
}

/* --- Typography --- */
.form-title {
    text-align: center;
    margin-bottom: 30px;
    font-weight: 600;
    font-size: 1.5rem;
    color: #1a1a1a;
    letter-spacing: -0.5px;
}

.label {
    display: block;
    margin-bottom: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #666; /* สีเทากลางๆ ไม่ดำสนิท */
}

/* --- Inputs & Selects --- */
.form-row {
    margin-bottom: 24px;
}

.input,
.select {
    width: 100%;
    padding: 12px 16px;
    font-size: 1rem;
    color: #333;
    background-color: #fafafa; /* พื้นหลังเทาจางมากๆ */
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.2s ease-in-out;
    box-sizing: border-box;
    appearance: none; /* ลบ style เดิมของ browser */
}

/* Effect ตอนคลิกพิมพ์ */
.input:focus,
.select:focus {
    background-color: #fff;
    border-color: #333; /* เปลี่ยนขอบเป็นสีเข้มขึ้นตอน active */
    outline: none;
    box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.1);
}

.input::placeholder {
    color: #bbb;
}

/* --- Radio Buttons --- */
.radio-group {
    display: flex;
    gap: 20px;
    padding-top: 5px;
}

.radio {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.95rem;
    color: #444;
}

.radio input[type="radio"] {
    margin-right: 8px;
    width: 18px;
    height: 18px;
    accent-color: #333; /* เปลี่ยนสีจุด Radio เป็นสีเทาเข้ม */
    cursor: pointer;
}

/* --- Buttons --- */
.actions {
    margin-top: 30px;
    display: flex;
    gap: 12px;
}

.btn.primary {
    flex: 1;
    padding: 14px;
    background-color: #000109; /* สีดำด้าน */
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
}

.btn.primary:hover {    
    background-color: #5d5e67; /* สีจางลงเล็กน้อยตอนชี้ */
}

.btn.primary:active {
    transform: scale(0.98); /* ยุบลงเล็กน้อยตอนกด */
}

.btn.primary:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
    opacity: 0.6;
}

.btn.primary:disabled:hover {
    background-color: #cccccc;
    transform: none;
}

.btn.secondary {
    flex: 1;
    padding: 14px;
    background-color: #4CAF50;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
}

.btn.secondary:hover {
    background-color: #45a049;
}

.btn.secondary:active {
    transform: scale(0.98);
}

/* --- Preview Section --- */
.form-preview {
    margin-top: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    border: 1px dashed #e0e0e0;
    font-size: 0.85rem;
}

.preview-line {
    margin-bottom: 10px;
    font-size: 1rem;
    color: #333;
}

.form-preview pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #555;
    font-family: 'Courier New', Courier, monospace;
    margin: 0;
}
</style>
