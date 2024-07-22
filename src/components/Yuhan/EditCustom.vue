<script>
import { ref,computed,watch,onBeforeUnmount } from 'vue';
import { useMenuStore } from '@/stores/MenuStore';
import 'bootstrap/dist/css/bootstrap.css'
import Swal from 'sweetalert2';
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css';
export default{
    setup(){
        const MenuStore = useMenuStore()
        let custom_options = ref(MenuStore.custom_options)
        let showAddCustom = ref(false)
        let updateCustom = ref({
            custom_id :"new",
            option: "",
            meal_id: [],
            ismustfill: false,
            other: "",
            staff_id: 1
            }
        )
        let notice = ref(false)
        // 將菜單中的餐點選項轉為multiselect可用的形式
        const mealOptions = MenuStore.menu.map(meal => ({ name: meal.name , id: meal.meal_id}))
        let isShow = ref(false)
        
        let newIds = computed (() => {
            if(updateCustom.value.custom_id){
                return updateCustom.value.meal_id.map(meal => ({ name: meal.name , id: meal.meal_id}))
            }
        })

        
        function editUpdateCustom(custom){
            if(!Array.isArray(custom.meal_id)){
                custom.meal_id = custom.meal_id.split(";").filter(Boolean).map(id => (Number(id)))
            }
            updateCustom.value = custom
        }

        //將物件傳至menuStore 然後還原updateCustom到預設值
        function pushCustomToStore(custom){
            //確保選項中有值
            if(!custom.option){
                return 
            }
            //如果沒有custom_id 則新增至左側列表
            if(custom.custom_id==="new"){
                custom_options.value.unshift(custom)
            }
            MenuStore.pushCustomToList(custom) 
            updateCustom.value = {
                custom_id :"new",
                option: "",
                meal_id: [],
                ismustfill: false,
                other: "",
                staff_id: 1
            }
        }

        // 監聽MenuStore是否有未儲存的物件
        watch([() => MenuStore.newCustom?.length, 
        () => MenuStore.updateCustom?.length, 
        () => MenuStore.removeCustom?.length], 
        (newValues, oldValues) => {
        notice.value = newValues.some(length => length !== 0);
        })

        // 如果在未儲存前離開網頁，則跳訊息警告
        onBeforeUnmount(() =>{
            if(MenuStore.updateCustom.length>0 || MenuStore.newCustom.length>0){
                Swal.fire({
                    text:"是否儲存已變更項目?",
                    icon:"warning",
                    showDenyButton: true,
                    confirmButtonText: "儲存",
                    confirmButtonColor:'#00c1ca',
                    denyButtonText: "不儲存"
                }).then((result) => {
                    if (result.isConfirmed) {
                        MenuStore.saveCustoms()
                        Swal.fire("儲存完畢!", "", "success");
                    }
                });
            }
        })

        return {
            MenuStore,
            editUpdateCustom,
            pushCustomToStore,
            custom_options,
            showAddCustom,
            updateCustom,
            newIds,
            mealOptions,
            notice, //提醒未儲存
            isShow //右側欄開關
        }
    },
    data(){
        return{
        }
    },
    components: {
        Multiselect
    },
    props:['staffId']
}
</script>

<template>
    <p class="h4 mb-3">編輯客製化項目</p>
    
    <!-- 搜尋項目 -->
    <small class="">請搜尋或點選欲編輯的項目</small>
    <div class="searchArea d-flex mb-4">
        <input class="form-control short" list="datalistOptions" id="DataList" placeholder="輸入客製項目...">
        <button  class="searchBtn"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /></button>
        
    </div>
    <datalist id="datalistOptions">
        <option v-for="option in custom_options" :key="option.custom_id" :value="option.option"></option>
    </datalist>


    <div class="d-flex justify-content-between">
        <!-- 選項選單 -->
        <div class="optionArea">
            <div v-for="detail in custom_options" :key="detail.custom_id" class="labels mb-3">
                <div @click="MenuStore.removeFromList(detail)" class="removeBtn"><font-awesome-icon icon="fa-solid fa-trash" /></div>
                <button @click="editUpdateCustom(detail),isShow = true" type="button" class="btn btn-label" :class="{'btn-active': detail.custom_id === updateCustom.custom_id}">
                    {{detail.custom_id+". "+detail.option}}</button>
            </div>
        </div>
        

        <!-- 編輯項目 -->
        <transition name="slide" mode="out-in">
            <div class="editItem">
                <div v-show="isShow" class="d-flex justify-content-between align-item-center">
                    <h5 class="modal-title">{{updateCustom? "新增":"修改"}}編輯項目</h5>
                    <button @click="pushCustomToStore(updateCustom),isShow = true" type="button" class="btn btn-secondary ms-3">
                        新增項目</button>
                    <button @click="pushCustomToStore(updateCustom),isShow = false" type="button" class="btn btn-secondary">完成</button>
                </div>
                <div v-show="isShow" class="modal-body">
                    <form>
                    <div class="mb-3">
                        <label for="custom_options" class="col-form-label">客製選項:</label><br>
                        <small>(選項後面請加價錢 不加價為+0，選項間請用;區隔)</small>
                        <input v-model="updateCustom.option"
                        type="text" class="form-control" id="custom_options">
                    </div>
                    <div class="mb-3">
                        <input v-model="updateCustom.ismustfill" class="form-check-input" type="checkbox"  id="ifMustfill">
                        <label class="form-check-label" for="ifMustfill">必選</label>
                    </div>
                    <div class="mb-3">
                        <label for="message-text" class="col-form-label">其他說明:</label>
                        <textarea v-model="updateCustom.other" class="form-control" id="message-text"></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="typo__label">選擇套用餐點</label>
                        <div v-for="meal in mealOptions" :key="meal.id" >
                            <input v-model="updateCustom.meal_id" type="checkbox" :value="meal.id" :id="meal.id">
                            <label :for="meal.id">{{ meal.name }}</label>
                        </div>
                        
                        <!-- <Multiselect v-if="newIds" v-model="updateCustom.meal_id" :value="mealOptions.id" track-by="id" label="name" placeholder="選擇餐點"
                            :options="mealOptions" :searchable="true" :allow-empty="true" :taggable="true" :multiple="true">
                        </Multiselect> -->
                    </div>
                    </form>
                </div>
            </div>
        </transition>
    </div>
    <div class="mt-2">
        <button @click="MenuStore.saveCustoms()" type="button" class="btn btn-main me-2">儲存所有變更</button>
        <small v-show="notice">*尚有變更未儲存</small>
    </div>
</template>

<style lang="scss" scoped>
$main-color: linear-gradient(90deg, #00c1ca, #01e1c5);

.btn-main{
    background: $main-color;
    color: #fff;
}

.optionArea,.editItem{
    width: 45%;
    height: 65vh;
    max-height: 50%;
    overflow-y: auto;
    padding: 2%;
    border: 1px solid gray;
    border-radius: 5px;
    &::-webkit-scrollbar {
        width: 5px;
    }
    &::-webkit-scrollbar-thumb {
        background: #c4c4c4;
        border-radius: 10px;
    }
}
.removeBtn{
    width: 30px;
    height: 30px;
    background: #f0f0f0;
    color: #535353;
    padding-left: 7px;
    border-radius: 5px;
    margin-right: 5px;

}
.labels{
    padding: 5px;
    display: flex;
    align-items: center;
}
.btn-label{
    background: #f0f0f0;
    box-shadow: 2px 1px 3px rgb(206, 206, 206);
    text-align: start;
}

.addCustom{
    width: 50%;
    // height: 200px;
    display: block;
    overflow: hidden;
}
.slide-leave-active{
    transition: all .5s ease;
}
.slide-enter-active{
    transition: all .5s ease;
}
.slide-enter-from{
    transform: translateX(-100%);
}
.slide-leave-to{
    transform: translateX(-100%);
}
.searchArea{
    position: relative;
}
.short{
    width: 45%;
    border-radius: 50px;

}
.btn-active{
    background: gray;
    color: #fff;
}

.searchBtn{
    border: 0;
    position: absolute;
    right: 54%;
    top: -10px;
    scale: .65;
    padding: 15px 20px;
    background: #00c1ca;
    color: #fff;
    border-radius: 50%;
}
</style>