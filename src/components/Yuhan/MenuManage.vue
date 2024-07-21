<script>
import AddMenu from './EditMenu.vue'
import UpdateCustom from './EditCustom.vue'
import { useMenuStore } from '@/stores/MenuStore';
import { useBillstore } from '@/stores/BillStore'

export default {
    setup(){
        const Billstore = useBillstore();
        const MenuStore = useMenuStore()
        return{
            Billstore,
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
    components:{
        AddMenu,UpdateCustom
    },
}
</script>

<template>
    <div class="body">
        <div class="navi">
            <h2>
                <button @click="Billstore.closeTopbar()" class="icon mb-3"><i class="fa-solid fa-house-chimney"></i></button>
                <h1>菜單管理</h1>
            </h2>
            <div v-for="page in pages" :key="page" class="changePage" :class="{'currentPage' : selectedPage === page}">
                <input type="radio" v-model="selectedPage" :value="page" :id="page" >
                <label @click="MenuStore.clearMeal()" :for="page">{{page}}</label>
            </div>
        </div>
        <div class="rightView">
            <div v-show="selectedPage === pages[0]" class="c-container">
                <!-- menu菜單頁 -->
                <div class="typeSelect">
                    <div class="column">
                        <p>餐點種類</p>
                        <select name="" id="type" v-model="selectedType">
                            <option value="all">全部</option>
                            <option v-for="(type,i) in MenuStore.types" :key="i" :value="type">{{type}}</option>
                        </select>
                    </div>
                    <div class="column">
                        <p>工作台種類</p>
                        <select name="" id="workingArea" v-model="selectedType">
                            <option value="all">全部</option>
                            <option v-for="area in MenuStore.working_areas" :key="area" :value="area">{{area}}</option>
                        </select>
                    </div>
                </div>
                <div class="menuArea">
                    <div v-for="meal in MenuStore.getItemsByType(selectedType)"  :key="meal" class="menu">
                        <img :src="meal.img" alt="">
                        <div class="col text">
                            <p>{{meal.meal_id+". "+meal.name}}</p>
                            NT. {{meal.price}}<br>
                            {{meal.description}}<br>
                        </div>
                        <button @click="cancelEditing,MenuStore.editing(meal.meal_id)" class="c-btn">編輯</button>
                    </div>
                </div>
            </div>
            
            <div v-show="MenuStore.toggleEdit" class="bg"></div>
            <div v-if="selectedPage === pages[1]" class="c-container">
                <AddMenu>
                    <div class="d-flex justify-content-end">
                        <button @click="MenuStore.setNewMenu(MenuStore.meal)" class="btn btn-lg btn-main">確認新增</button>
                    </div>
                </AddMenu>
            </div>
            <div v-if="selectedPage === pages[2]" class="c-container">
                <UpdateCustom />
            </div>
        </div>
        <transition name="jump">
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
            </transition>
    </div>
    
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&family=Noto+Sans+TC:wght@100..900&display=swap');
$main-color: #7b90da;
// $main-color: linear-gradient(90deg, #00c1ca, #01e1c5);
$secondary-color: #a8afc9;
.body{
    display: flex;
    justify-content: space-between;
    background: #f1f3fb;
}
p{
    margin-bottom: 10px;
}
.icon{
    background: transparent;
    border: none;
    i{
        color: #fff;
    }
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
    background: linear-gradient(360deg, #a8afc9 0%, #7b90da 80%);
    color: #fff;
    font-size: large;
    
    h2{
        margin: 20px 0;
    }
    input{
        display: none;
    }
    .changePage{
        align-content: center;
        height: 80px;
    }
    .currentPage{
        margin-left: 50%;
        width: 120%;
        background: #f1f3fb;
        color: black;
        border-radius: 25em;
        position: relative;
        label{
            padding: 5% 10%;
        }
        &::before {
        content: "";
        position: absolute;
        bottom: -23px;
        right: 70px;
        height: 25px;
        width: 50px;
        border-top-right-radius: 25px;
        box-shadow: 25px 0  0 0 #f1f3fb;
        }
    }
}
.rightView{
    position: relative;
}

.c-container{
    width: 80dvw;
    height: 100dvh;
    overflow-y: auto;
    font-size: 18px;
    padding: 2% 3%;
    font-family: 'Chocolate Classical Sans', sans-serif;
    position: relative;
}
.typeSelect{
    width: 60%;
    height: 15%;
    display: flex;
    align-items: center;
    select{
        width: 95%;
        height: 50px;
        border-radius: 10px;
        font-size: 20px;
    }
    .column{
    width: 100%;
    margin:2% 0;
}
}
.menuArea{
    max-height: 80%;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    &::-webkit-scrollbar {
        width: 5px;
    }
    &::-webkit-scrollbar-thumb {
        background: #c4c4c4;
        border-radius: 5px;
    }
    .menu{
        width: 45%;
        box-shadow:3px 3px 6px rgba(150, 150, 150, 0.5);
        height: 120px;
        display: flex;
        flex-wrap: wrap;
        border-radius: 5px;
        background: #fff;
        img{
            height: 120px;
            width: 120px;
            object-fit: cover;
            border-radius: 5px 0 0 5px;
        }
        .text{
            flex-grow: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 10px;
            p{
                font-weight: 600;
            }
        }
        .c-btn{
            cursor: pointer;
            width: 15%;
            border: none; 

            background: $main-color;
            color: #fff;
            font-size: 24px;
            border-radius: 0 5px 5px 0;
            &:active{
                opacity: 0.85;
            }
        }
    }
}
.edit{
    position: absolute;
    top: 5%;
    left: 15%;
    width: 70%;
    height: 90%;
    max-height: 90vh;
    overflow-y: auto;
    background: #efefef;
    z-index: 5;
}



.jump-enter-active,
.jump-leave-active {
  transition: all .3s ;
  transform: scale(1);
}

.jump-enter-from,
.jump-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.jump-enter-to,
.jump-leave-from {
  opacity: 1;

}

.bg{
    position: fixed;
    top: 0;
    left: 0;
    width: 200vw;
    height: 200vh;
    backdrop-filter: brightness(70%);
}
</style>