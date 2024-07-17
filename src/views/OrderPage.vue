<script>
import axios from 'axios'
import EditMeal from '../components/Yuhan/EditOrder.vue'
import { useOrderStore } from '@/stores/OrderStore'
export default {
    data() {
        return {
            selected_table:{},
            selected_target_table:{},
            oId: "", //訂單編號
            menu: [], //所有菜單
            meal: { //餐點物件
                id: "",
                type: "",
                name: "",
                description: "",
                price: "",
                options: [], //餐點選項 如:["直麵","筆管麵","天使細麵","加麵"]
            },
            types: [], //餐點所有種類 如:["排餐","炸物","飯類","披薩","義大利麵"]
            selectedType: "", //目前顯示的種類

            tableNum: null, //桌號====>TODO
            guestNum: "", //用餐人數==>TODO
            memo: null, //備註
            showMemoInput: false,

            orderList: [], //點餐列表
            orderItem: { //要加入列表的餐點
                id: 0,
                name: "",
                price: 0,
                option: "",
                quantities: 1,
                otherReq: ""
            },
            editingIndex: null, //欲修改的餐點索引
        }
    },
    components: {
        EditMeal
    },
    created() {
        if(this.$route.query.selected_table){
            this.selected_table=JSON.parse(this.$route.query.selected_table);
            console.log(this.selected_table);    
        }
        if(this.$route.query.selected_target_table){
                this.selected_target_table =JSON.parse(this.$route.query.selected_target_table);
                console.log(this.selected_target_table);
        }
        this.getMenu()
        this.generateOrderNumber() //建立新訂單流水號
        this.orderStore = useOrderStore() //useOrderStore為store中定義的常數名稱
    },
    methods: {
        //取得菜單內餐點
        getMenu() {
            fetch("http://localhost:8080/menu", {
                method: 'GET',
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    this.menu = data
                    //將所有餐點類別取出 並放到不允許重複的set中
                    this.types = new Set(data.map(item => item.type))
                    //預設顯示的餐點為資料裡第一個種類
                    this.selectedType = data[0].type
                })
        },
        //生成不重複的流水號
        generateOrderNumber() {
            let date = new Date();
            let year = date.getFullYear().toString().slice(-2);  // 獲取年份的最後兩位
            let month = ('0' + (date.getMonth() + 1)).slice(-2);  // 獲取月份，並確保它總是兩位數
            let day = ('0' + date.getDate()).slice(-2);  // 獲取日期，並確保它總是兩位數

            // 確保生成的是四位數的隨機數
            let random = Math.floor(1000 + Math.random() * 9000).toString();
            this.oId = year + month + day + random;  // 將以上部分組合成訂單流水號
        },
        //加入點餐清單
        addMealToList(meal) {
            //檢查加入的該餐點是否有必填選項 若有則顯示選項
            this.checkIfMustfill(meal.meal_id, this.orderList.length)
            this.orderItem = {
                meal_id: meal.meal_id,
                meal_name: meal.name,
                price: meal.price,
                meal_type: meal.type,
                custom_option: null,
                quantities: 1,
                other_request: null,
                description: meal.description,
                working_area: meal.working_area,
                img: meal.img ? meal.img : "https://shop.travel.org.tw/proudimage/0.jpg", //預設值
                status: "未出餐"
            }
            this.orderList.push(this.orderItem)
        },
        checkIfMustfill(id, index) {
            axios.post("http://localhost:8080/custom/by_meal_id", [id])
                .then(data => {
                    console.log(data.data)
                    //取得的資料為陣列 先判斷裡面有內容再遍歷裝進optionList
                    if (data.data.length != 0) {
                        const optionList = data.data.map(item => {
                            if (item.ismustfill) {
                                this.editing(index)
                            }
                        })
                    }
                })
        },
        //從清單移除該餐點
        removeFromList(i) {
            this.orderList.splice(i, 1)
            this.quantityTemp = null
        },
        //取得菜單內的餐點金額傳給EditMeal元件 避免重複加總金額
        getMealPrice(meal_id) {
            const meal = this.menu.find(meal => meal.meal_id === meal_id)
            return meal.price
        },
        //打開EditMeal元件進行編輯
        editing(index) {
            this.editingIndex = index;
        },
        //關閉EditMeal元件
        closeEditing() {
            this.editingIndex = null;
        },
        //將EditMeal元件傳來的資料存回orderList並關閉元件
        handleUpdate(updateMealDetail) {
            this.orderList[this.editingIndex] = updateMealDetail
            this.closeEditing()
        },
        //開關memo欄
        editMemo() {
            this.showMemoInput = !this.showMemoInput
        },
        //下單
        placeOrder() {
            // 將選項去除加價後以分號串接成字串
            this.orderList.forEach(order => {
                // 檢查該餐點有客製選項
                if (order.custom_option) {
                    // 判斷選項是否為複數 是則用;串接
                    if (order.custom_option.length > 0) {
                        order.custom_option = order.custom_option.map(option => {
                            return option.split('+')[0]
                        }).join(';')
                    } else {
                        order.custom_option = order.custom_option[0].split('+')[0]
                    }
                }
            })
            let order = {
                order_id: this.oId,
                table_num: null,
                guest_num: null,
                order_detail: this.orderList,
                amount: this.orderAmount,
                memo: this.memo,
                booking_num: null,
                staff_name: "Andy",
                lastmodified_staff_id: 1
            }
            fetch("http://localhost:8080/order_info/create", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            })
                .then(res => res.json())
                .then(data => {
                    this.orderStore.createOrder(order) //將訂餐存入orderStore
                    // this.$router.push('/BillPage/'+order.order_id);
                })
            // this.orderStore.navigateTobillPage(this.oId)
        },
        // 將訂單編號作為參數傳給帳單頁
        navigateToBillPage() {
            this.$router.push({ name: 'BillPage', params: { orderId: this.oId } })
        },
        // 跳轉到桌位頁
        navigateToTablePage() {
            this.$router.push('/table')
        }
    },
    computed: {
        //已點餐點個別數量
        mealQuantities() {
            let quantities = {};
            this.orderList.forEach(meal => {
                if (quantities[meal.meal_id]) {
                    quantities[meal.meal_id] += meal.quantities;
                } else {
                    quantities[meal.meal_id] = meal.quantities;
                }
            });
            return quantities;
        },
        //所有餐點加總金額
        orderAmount() {
            return this.orderList.reduce((total, meal) => total + meal.price * meal.quantities, 0)
        },
        //餐點總數量
        totalQuantities() {
            return this.orderList.reduce((total, meal) => total + meal.quantities, 0)
        },
    }
}
</script>

<template>
    <div class="bigArea">
        <!-- orderList點餐明細 -->
        <div class="container left-side">
            <div class="header col">
                <span>單號: {{ oId }} </span>
                <span><font-awesome-icon icon="fa-solid fa-bars" class="icon fa-2x" /></span>
            </div>
            <!-- 點餐列表 -->
            <div class="order-list">
                <div v-for="(item, i) in orderList" :key="i">
                    <!-- 編輯餐點份數&客製選項 -->
                    <div v-if="editingIndex === i" class="editMeal">
                        <EditMeal :meal_detail="item" :meal_price="getMealPrice(item.meal_id)"
                            @update_meal_detail="handleUpdate" @cancel_edting="closeEditing()"
                            @option_needing="editing(i)" />
                    </div>
                    <!-- 列表中的餐點 -->
                    <div class="order-item">
                        <div class="item-id">{{ i + 1 }}</div>
                        <div class="item">
                            <strong>{{ item.meal_name }}</strong><br>
                            <span v-for="(option, i) in item.custom_option" :key="option">{{ option.split('+')[0] }}
                                <span v-if="i < item.custom_option.length - 1">, </span></span><br>
                            <span>{{ item.quantities }} x {{ item.price }}</span>
                        </div>
                        <div @click="editing(i)">
                            <font-awesome-icon icon="fa-regular fa-pen-to-square" class="edit" />
                        </div>
                        <div @click="removeFromList(i)" class="remove">
                            <font-awesome-icon icon="fa-regular fa-trash-can" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- 點餐金額 -->
            <div class="amount">
                <div class="text-left">金額(不含服務費)<br> NT. </div>
                <span class="large">{{ orderAmount }}</span>
                <div class="text-right">總數量<br><span>{{ totalQuantities }}</span></div>
            </div>
        </div>

        <!-- menu菜單 -->
        <div class="container">
            <div class="row type">
                <div v-for="type in types" :key="type" class="col">
                    <input type="radio" v-model="selectedType" :value="type" :id="type">
                    <label :for="type" :class="{ active: selectedType === type }">{{ type }}</label>
                </div>
            </div>
            <div class="row wrap">
                <div v-for="meal in menu" v-show="selectedType === meal.type" @click="addMealToList(meal)"
                    :key="meal.type" class="col meal">
                    <img :src="meal.img" alt="">
                    <div v-for="item in orderList" :key="item.meal_id">
                        <div v-if="item.meal_id === meal.meal_id" class="orderQty">
                            {{ mealQuantities[meal.meal_id] }}
                        </div>
                    </div>
                    <div class="mealName">
                        {{ meal.name }}
                    </div>
                    <!-- <p >NT. {{meal.price}}</p> -->
                </div>
            </div>
            <form v-show="showMemoInput" class="memo">
                <div class="input">
                    <input v-model="memo" type="text" placeholder="請輸入備註或特殊需求">
                    <button type="reset" class="reset"><font-awesome-icon icon="fa-solid fa-xmark" /></button>
                </div>
                <button @click.prevent="editMemo()" class="btn">完成</button>
            </form>
            <div class="bottom">
                <button type="button" class="btn placeOrder" data-bs-toggle="modal" data-bs-target="#FirstModal">
                    送出訂單
                </button>

                <!-- 彈出視窗 -->
                <div class="modal fade" id="FirstModal" tabindex="-1" aria-labelledby="FirstModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <h4>送單前請務必與消費者核對<strong>餐點內容</strong>與<strong>金額</strong></h4>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">修改</button>
                                <button type="button" class="btn placeOrder" data-bs-dismiss="modal"
                                    data-bs-toggle="modal" @click="placeOrder()" data-bs-target="#secondModal">
                                    確認無誤，送出</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="secondModal"
                    tabindex="-1" aria-labelledby="secondModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4><strong>送單完畢，是否前往結帳</strong></h4>
                            </div>
                            <div class="modal-body d-flex justify-content-evenly">
                                <!-- 跳轉至桌位頁 -->
                                <button @click="navigateToTablePage()" class="btn btn-secondary"
                                    data-bs-dismiss="modal">稍後再結</button>
                                <!-- 跳轉至結帳頁 -->
                                <button @click="navigateToBillPage" class="btn btn-primary"
                                    data-bs-dismiss="modal">立即結帳</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="secondModal"
                    tabindex="-1" aria-labelledby="secondModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4><strong>送單完畢，是否前往結帳</strong></h4>
                            </div>
                            <div class="modal-body d-flex justify-content-evenly">
                                <!-- 跳轉至桌位頁 -->
                                <a class="btn btn-secondary" data-bs-dismiss="modal">稍後再結</a>
                                <!-- 跳轉至結帳頁 -->
                                <a class="btn btn-primary">立即結帳</a>
                            </div>
                        </div>
                    </div>
                </div>
                <button @click="editMemo()" class="btn">訂單備註</button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&family=Noto+Sans+TC:wght@100..900&display=swap');
$main-color: linear-gradient(90deg, #00c1ca, #01e1c5);
$secondary-color: #FFE2C3;

.bigArea {
    width: 100dvw;
    height: 100dvh;
    display: flex;
    justify-content: end;
    font-size: 18px;
    font-family: 'Chocolate Classical Sans', sans-serif;
    border: 1px solid #F9BF45;
}

.container {
    height: 100%;
    width: 55%;
    box-shadow: 0 0 5px rgba(128, 128, 128, 0.4);
    position: relative;
}

.row {
    padding: 0 5%;
}

.col {
    width: 100%;
    margin: 5%;
    line-height: 2;
}

.left-side {
    width: 45%;
    position: relative;

    .header {
        height: 10vh;
        margin: 0;
        display: flex;
        width: 100%;
        color: #fff;
        padding: 5%;
        background: $main-color;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .icon {
        padding-top: 25%;
    }
}

.order-list {
    height: 70%;
    max-height: 70%;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c4c4c4;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #888;
    }
}

.editMeal {
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    top: 0;
}

.order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .5em 10%;
    line-height: 2;
    border-bottom: 1px solid rgba(128, 128, 128, 0.4);

    .item {
        width: 55%;
    }
}

.item-id {
    font-weight: 600;
    font-size: 20px;
    margin-right: 10px;
}

.edit {
    background: $secondary-color;
    color: #fff;
    padding: 15px;
    border-radius: 50%;
}

.remove {
    clip-path: circle(30%);
    background: #EB7A77;
    color: #fff;
    padding: 27px;
    margin-bottom: 7px;
    border-radius: 50%;
}

.amount {
    height: 20vh;
    border-top: 1px solid rgba(128, 128, 128, 0.4);
    color: #888;
    position: relative;

    .large {
        color: black;
        display: inline-block;
        width: 100%;
        font-size: 52px;
        font-weight: 500;
        text-align: center;
        position: absolute;
        top: 30%;
    }

    .text-right {
        text-align: right;
        position: absolute;
        right: 5%;
        bottom: 5%;
    }

    .text-left {
        text-align: left;
        position: absolute;
        left: 5%;
        top: 5%;
    }
}

.type {
    width: 100%;
    max-width: 55vw;
    overflow-x: auto;
    white-space: nowrap;
    display: flex;
    background: rgb(240, 240, 240);
    font-weight: 600;
    font-size: 20px;

    &::-webkit-scrollbar {
        height: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c4c4c4;
        border-radius: 5px;
    }

    input {
        display: none;
    }
}

.active {
    background: $main-color;
    color: #fff;
    padding: 10px 20px;
    border-radius: 10px;
}

.meal {
    width: 10vw;
    height: 15vh;
    display: inline-block;
    box-shadow: 1px 0 5px rgba(128, 128, 128, 0.4);
    border-top: 10px solid $secondary-color;
    border-image-slice: 1;
    cursor: pointer;
    position: relative;

    p {
        padding: 5px 10px;
        position: absolute;
        bottom: 0;
        right: 5px;
    }

    img {
        width: 100%;
        height: 60%;
        object-fit: cover;
        ;
        padding: 0;
    }

    .mealName {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        background: #fff;
    }
}

.wrap {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin: 5% 0;
}

.price {
    font-size: 30px;
}

.disable {
    color: gray;
}

.orderQty {
    clip-path: circle(30%);
    position: absolute;
    top: -45px;
    right: -10%;
    background: #f96c45;
    color: white;
    border-radius: 50%;
    padding: 10px 15px;
    font-size: 24px;

}

.memo {
    width: 80%;
    height: 40px;
    box-shadow: 0 1px 5px rgba(128, 128, 128);
    position: absolute;
    bottom: 130px;
    right: 10%;
    display: flex;

    .input {
        width: 70%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;

        input {
            width: 100%;
            height: 100%;
            border: none;
            padding-left: 20px;
        }

        .reset {
            background: #fff;
            border: none;
            color: #c4c4c4;
            position: absolute;
            right: 10%;
        }
    }

    .btn {
        width: 30%;
        height: 100%;
        padding: 0 15px;
        border: none;
    }

}

.bottom {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-evenly;
    position: absolute;
    bottom: 5%;

    .btn {
        border: none;
        align-items: center;
        width: 20%;
        border-radius: 10px;
        box-shadow: 0 1px 2px rgba(128, 128, 128, 0.4);
        background: #c5c5c5;
        color: #fff;
        font-size: 24px;

        &:active {
            opacity: 0.85;
        }
    }

    .placeOrder {
        width: 60%;
        background: $main-color;
    }
}
</style>