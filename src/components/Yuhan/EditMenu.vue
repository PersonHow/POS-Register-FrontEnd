<script>
import { ref,watch } from 'vue';
import { useMenuStore } from '@/stores/MenuStore';
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap"
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css';
export default {
    setup(){
        let MenuStore = useMenuStore()
        // 將餐點種類和工作台轉成multiselect可以使用的形式
        let types = MenuStore.types.map(type => ({ name: type }))
        let areas = MenuStore.working_areas.map(area => ({ name: area }))
        let customs = MenuStore.custom_options.map(option => ({ name: option.option , id: option.custom_id}))

        let customsVal = ref(MenuStore.meal.option)


        //若已有選中的項目 將它轉換成multiselect可用的形式
        let typeVal = ref({name:MenuStore.meal.type})
        let areaVal = ref({name: MenuStore.meal.working_area})

        //監聽若MenuStore.meal的值發生變化(更換了編輯餐點)，會將種類、工作台、客製選項更新
        watch(() => MenuStore.meal, (newMeal) => {
            typeVal.value = { name: newMeal.type };
            areaVal.value = { name: newMeal.working_area };
            customsVal.value = newMeal.option;
        }, { deep: true });

        //若有選項發生變化 將值反應給MenuStore
        watch(customsVal, (newVal) => {
            MenuStore.meal.option = newVal;
        })
        watch(typeVal, (newVal) => {
            MenuStore.meal.type = newVal.name
        })

        watch(areaVal, (newVal) => {
            MenuStore.meal.working_area = newVal.name
        })
        return{
            MenuStore,
            types,
            areas,
            customs,
            typeVal,
            areaVal,
            customsVal,
        }
    },
    components: {
        Multiselect
    },
    methods: {
        addTypeOption(newOption) {
            let option = { name: newOption }
            this.types.push(option)
            this.typeVal = option
        },
    },
}
</script>

<template>
    <div class="container">
        {{ customsVal }}
        <div class="col h3">{{MenuStore.meal.meal_id? "修改餐點":"新增餐點"}}</div>
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
            <Multiselect v-model="typeVal" track-by="name" label="name"
                placeholder="選一個種類或新增種類" :options="types" :taggable="true" @tag="addTypeOption" :allow-empty="false">
                <template v-slot:singleLabel="{ option }"><strong>{{ option.name }}</strong></template>
            </multiselect>
        </div>
        <div class="type-select mb-3">
            <label class="typo__label">選擇工作台</label>
            <Multiselect v-model="areaVal"  track-by="name" label="name"
                placeholder="選擇餐點製作區域" :options="areas" :allow-empty="false">
                <template v-slot:singleLabel="{ option }"><strong>{{ option.name }}</strong></template>
            </multiselect>
        </div>
        <div v-show="customsVal" class="mb-3">
            <label class="typo__label">已關聯的客製化項目</label>
            <multiselect v-model="customsVal" track-by="name" 
            label="name" :options="customs" :allow-empty="true" :multiple="true" disabled></multiselect>
        </div>
        <slot></slot>
    </div>
    
</template>

<style scoped lang="scss">
.preview{
    width: 25%;
}
// .btn-main{
//     background: linear-gradient(90deg, #00c1ca, #01e1c5);
//     color: #fff;
// }
</style>