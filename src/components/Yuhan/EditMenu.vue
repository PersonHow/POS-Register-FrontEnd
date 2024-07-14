<script>
import { ref } from 'vue';
import { useMenuStore } from '@/stores/MenuStore';
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap"
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css';
export default {
    setup(){
        const MenuStore = useMenuStore()
        let areas = MenuStore.working_areas.map(type => ({ name: type }));
        let meal_type = ref(null);
        let working_area = ref(null);
        return{
            MenuStore,
            areas,
            meal_type,
            working_area,
        }
    },
    data(){
        return{
            imageUrl: "", //預設
        }
    },
    components: {
        Multiselect
    },
    methods: {
        addOption(newOption) {
            const option = { name: newOption }
            this.mealTypes.push(option)
            this.meal_type = option
        },
    },
    computed:{
    }
}
</script>

<template>
    <div class="container">

        <figure class="figure preview">
            <img :src="MenuStore.meal.img? MenuStore.meal.img : 'https://shop.travel.org.tw/proudimage/0.jpg'" class="figure-img img-fluid rounded" alt="預覽">
            <figcaption class="figure-caption">餐點圖片</figcaption>
        </figure>
        <div class="form-floating mb-4">
            <input type="text" v-model="MenuStore.meal.img" id="img" class="form-control" placeholder="請貼上圖片網址">
            <label for="img">貼上圖片網址(格式: png, jpg, jpeg)</label>
        </div>
        <div class="form-floating mb-4">
            <input v-model="MenuStore.meal.name" type="text" id="name" class="form-control" placeholder="輸入餐點名稱">
            <label for="name">輸入餐點名稱</label>
        </div>
        <div class="form-floating mb-4">
            <textarea v-model="MenuStore.meal.description" id="description" class="form-control" placeholder="輸入餐點描述"></textarea>
            <label for="description">輸入餐點描述</label>
        </div>
        <div class="form-floating mb-4">
            <input v-model="MenuStore.meal.price" type="number" class="form-control" placeholder="設定餐點價格" min="0" id="name">
        <label for="name">設定餐點價格</label>
        </div>
        <div class="type-select mb-3">
            <label class="typo__label">選擇餐點種類</label>
            <Multiselect v-model="meal_type" deselect-label="Can't remove this value" track-by="name" label="name"
                placeholder="選一個種類或新增種類" :options="MenuStore.types" :taggable="true" @tag="addOption" :allow-empty="false">
                <template v-slot:singleLabel="{ option }"><strong>{{ option.name }}</strong></template>
            </multiselect>
        </div>
        <div class="type-select mb-3">
            <label class="typo__label">選擇工作台</label>
            <Multiselect v-model="working_area" deselect-label="Can't remove this value" track-by="name" label="name"
                placeholder="選擇餐點製作區域" :options="areas" :allow-empty="false">
                <template v-slot:singleLabel="{ option }"><strong>{{ option.name }}</strong></template>
            </multiselect>
        </div>
        <slot></slot>

    </div>
    
</template>

<style scoped lang="scss">
.preview{
    width: 25%;
}
.btn-main{
    background: linear-gradient(90deg, #00c1ca, #01e1c5);
    color: #fff;
}
</style>