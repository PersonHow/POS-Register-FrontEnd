<script>
import AddMenu from './EditMenu.vue'
import UpdateCustom from './EditCustom.vue'
import { useMenuStore } from '@/stores/MenuStore';
export default {
    setup(){
        const MenuStore = useMenuStore()
        return{
            MenuStore
        }
    },
    data(){
        return{
            selectedType:"",
            pages:["編輯品項","新增餐點","客製化項目"],
            selectedPage:"編輯品項",
            optionList:[]
        }
    },
    created(){
        this.MenuStore.getMenu()
        this.MenuStore.getCustomOption()
        this.selectedType = "all" //預設顯示為全部餐點
    },

    mounted() {
    // 建立一個新的 ResizeObserver 實例
    this.resizeObserver = new ResizeObserver(entries => {
        // 處理尺寸變化
        for (let entry of entries) {
            let wrapWidth = entry.contentRect.width;
            if (wrapWidth > 550) {
                this.$refs.wrap.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else {
                this.$refs.wrap.style.gridTemplateColumns = 'auto';
            }
        }
    });

    // 開始監聽元素的尺寸變化
    this.resizeObserver.observe(this.$refs.wrap);
    },
    beforeDestroy() {
        // 停止監聽元素的尺寸變化
        this.resizeObserver.unobserve(this.$refs.wrap);
        this.resizeObserver = null;
    },
    methods:{

    },
    components:{
        AddMenu,UpdateCustom
    },
}
</script>

<template>
    <div class="body">
        <div v-show="!MenuStore.toggleEdit" class="navi">
            <h2>
                <button class="btn"><font-awesome-icon icon="fa-solid fa-bars" class="icon fa-2x"/></button> 
                菜單管理
            </h2>
            <div v-for="page in pages" :key="page" class="changePage" :class="{'currentPage' : selectedPage === page}">
                <input type="radio" v-model="selectedPage" :value="page" :id="page" >
                <label @click="MenuStore.clearMeal()" :for="page">{{page}}</label>
            </div>
        </div>
        <div class="rightView">
            <div v-show="selectedPage === pages[0]" class="c-container">
                <!-- menu菜單頁 -->
                <div class="type">
                    <div class="colume">
                        <p>餐點種類</p>
                        <select name="" id="type" v-model="selectedType">
                            <option value="all">全部</option>
                            <option v-for="(type,i) in MenuStore.types" :key="i" :value="type">{{type}}</option>
                        </select>
                    </div>
                    <div class="colume">
                        <p>工作台種類</p>
                        <select name="" id="workingArea" v-model="selectedType">
                            <option value="all">全部</option>
                            <option v-for="area in MenuStore.working_areas" :key="area" :value="area">{{area}}</option>
                        </select>
                    </div>
                </div>
                <div class="c-row wrap" ref="wrap">
                    <div v-for="meal in MenuStore.getItemsByType(selectedType)"  :key="meal" class="coluem menu">
                        <img :src="meal.img" alt="">
                        <div class="meal">
                            <p>{{meal.meal_id+". "+meal.name}}</p>
                            NT. {{meal.price}}<br>
                            {{meal.description}}<br>
                        </div>
                        <button @click="cancelEditing,MenuStore.editing(meal.meal_id)" class="c-btn">編輯</button>
                    </div>
                </div>
            </div>
            <div v-if="MenuStore.toggleEdit" class="edit p-5">
                <div v-if="MenuStore.meal.meal_id" class="col mb-3">
                    <button @click="MenuStore.cancelEditing()" type="button" class="btn-close" aria-label="Close"></button>
                </div>
                <AddMenu>
                    <div class="d-flex justify-content-between">
                        <button @click="MenuStore.deleteMeal(MenuStore.meal.meal_id)" class="btn btn-lg btn-danger" >刪除餐點</button>
                        <button @click="MenuStore.setNewMenu(MenuStore.meal)" class="btn btn-lg btn-main">確認修改</button>
                    </div>
                </AddMenu>
            </div>
            <div v-if="selectedPage === pages[1]" class="c-container">
                <AddMenu>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-lg mx-3">儲存草稿</button>
                        <button @click="MenuStore.setNewMenu(MenuStore.meal)" class="btn btn-lg btn-main">確認新增</button>
                    </div>
                </AddMenu>
            </div>
            <div v-if="selectedPage === pages[2]" class="c-container">
                <UpdateCustom />
            </div>
        </div>
    </div>
    
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&family=Noto+Sans+TC:wght@100..900&display=swap');
// $main-color: linear-gradient(120deg,#f9b445 0%, #ff9b69 80%);
$main-color: linear-gradient(90deg, #00c1ca, #01e1c5);
$secondary-color: #FFE2C3;
.body{
    display: flex;
}
p{
    margin-bottom: 10px;
}
.btn-main{
    background: $main-color;
}
.btn{
    color: #fff;
}
.navi{
    width: 200px;
    max-height: 100vh;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(0deg, #01e1c5, #00c1ca);
    color: #fff;
    font-size: large;
    
    h2{
        margin: 50px 0;
    }
    input{
        display: none;
    }
    .changePage{
        align-content: center;
        height: 150px;
    }
    .currentPage{
        margin-left: 50%;
        width: 120%;
        background: #fff;
        color: black;
        border-radius: 25em;
        position: relative;
        label{
            padding: 10%;
        }
        &::before {
        content: "";
        position: absolute;
        bottom: -23px;
        right: 70px;
        height: 25px;
        width: 50px;
        border-top-right-radius: 25px;
        box-shadow: 25px 0  0 0 #fff;
        z-index: 5;
        }
    }
}
.edit{
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
    background: #efefef;
}
.c-container{
    width: 80dvw;
    height: 100dvh;
    overflow-y: auto;
    font-size: 18px;
    padding: 2% 5%;
    font-family: 'Chocolate Classical Sans', sans-serif;
    position: relative;
}
.c-row{
    max-height: 85%;
    overflow-y: auto;
    padding-right: 25px;
    &::-webkit-scrollbar {
        width: 5px;
    }
    &::-webkit-scrollbar-thumb {
        background: #c4c4c4;
        border-radius: 5px;
    }
}
.colume{
    width: 100%;
    margin:2% 0;
    // line-height: 1.5;
}

.type{
    width: 60%;
    height: 15%;
    // padding: 0 5%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    select{
        width: 95%;
        height: 50px;
        border-radius: 10px;
        font-size: 20px;
    }
}
.active{
    background: $main-color;
    color: #fff;
    padding: 10px 20px;
    border-radius: 10px;
}
.createMenu{
    position: absolute;
    top: 10%;
    right: 5%;
    border-radius: 10px;
    width: 15vw;
    border: none; 
    box-shadow:0 1px 2px rgba(128, 128, 128, 0.4);
    background: $main-color;
    color: #fff;
    font-size: 24px;
    &:active{
        opacity: 0.85;
    }
}
.menu{
    width: 100%;
    height: 15vh;
    box-shadow: 1px 0 5px rgba(128, 128, 128, 0.4);
    cursor: pointer;
    display: flex;
    
    img{
        width: 35%;
        height: 100%;
        object-fit: cover;
    }
    .meal{
        width: 50%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 10px;
        p{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-weight: 600;
        }
    }
    .c-btn{
        width: 15%;
        border: none; 
        box-shadow:0 1px 2px rgba(128, 128, 128, 0.4);
        background: $main-color;
        color: #fff;
        font-size: 24px;
        &:active{
            opacity: 0.85;
        }
    }
}

.wrap{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
    position: relative;
}

.price{
    font-size: 30px;
}
.disable{
    color: gray;
}




</style>