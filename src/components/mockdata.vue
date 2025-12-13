<script lang="ts">
// 1. ประกาศ Interface
export interface Food {
  name: string;
  calories: number;
  image: string;
  category: 'main' | 'snack' | 'drink';
}

export const allFoods: Food[] = [
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

// 3. Export Default ว่างๆ เพื่อให้เป็นไฟล์ Component ที่ถูกต้อง
export default {
  name: 'MockDataStore'
}
</script>