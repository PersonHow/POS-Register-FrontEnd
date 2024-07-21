<script>
import { useBillstore } from '@/stores/BillStore';
import { useOrderStore } from '@/stores/OrderStore';
import { mapState, mapActions } from 'pinia';
export default {
    setup() {
        const Billstore = useBillstore();
        const OrderStore = useOrderStore();

        return {
            Billstore,
            OrderStore,
            ...mapState(Billstore, ['OrderDB']),
        };
    },
    mounted() {
        if (this.$route.params.orderId !== "") {
            let orderId = this.$route.params.orderId
            let orderObj = {
                order_id: orderId,
            }
            // console.log(orderId);
            // console.log(orderObj);
            fetch("http://localhost:8080/order_info/ById", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderObj)
            })
                .then(res => res.json())
                .then(data => {
                    this.Billstore.OrderDB = data;
                    console.log(this.Billstore.OrderDB)
                })
        } else {
            console.error("Wrong oId!")
        }

    },
    data() {
        return {
            mealDetailfromDB: [],
            deleteOptionIcon: false,
            printDetail: false
        }
    },
    methods: {
        deleteOption(mealList, option) {
            const optionsArray = mealList.custom_option.split(';');
            const optionIndex = optionsArray.indexOf(option);
            if (optionIndex !== -1) {
                optionsArray.splice(optionIndex, 1);
                mealList.custom_option = optionsArray.join(';');
            }
        },
        showDeleteOptionBut() {
            this.deleteOptionIcon = !this.deleteOptionIcon
        },
        printDetailBut() {
            this.printDetail = true;
            this.autoClosePrintBox();
        },
        updateQuantity(mealList, change) {
            const newQuantity = mealList.quantities + change;
            if (newQuantity >= 0) {
                mealList.quantities = newQuantity;
            }
        },
        autoClosePrintBox(){
            setTimeout(() => {
                this.printDetail = false;
            }, 1000); // 1秒後自動關閉
        }
    }
}
</script>

<template>
    <nav class="navArea" :class="{ active: Billstore.showOrderArea }">
        <!-- <div class="noShowIcon">
            <label for="noShowOrder" class="myMouse">
                <i class="fa-solid fa-xmark fa-2xl"></i>
            </label>
        </div> -->
        <ul>
            <li>
                <div class="tableAndGuestNum">
                    <p v-if="this.Billstore.OrderDB.table_num !== null">桌號：{{ Billstore.OrderDB.table_num }}</p>
                    <p v-else>
                    <p><span>
                            < <span>
                        </span></span>外帶單 ></p>
                    </p>
                </div>
                <div>
                    <p v-if="Billstore.OrderDB.guest_num !==0">人數：{{ Billstore.OrderDB.guest_num }}</p>
                    <p v-else></p>
                </div>
                <div>用餐金額：{{ (Billstore.OrderDB.amount).toLocaleString('en-US') }}</div>

                <div>點餐內容：</div>
                <ul v-for="(mealList, index) in Billstore.OrderDB.order_detail" :key="index">
                    <li class="orderDetailArea">
                        <span>({{ index + 1 }})</span>&nbsp;
                        <span>{{ mealList.meal_name }}</span>
                        <div class="countArea">
                            <p>數量：{{ mealList.quantities }}</p>
                            <button v-if="deleteOptionIcon" type="button" @click="updateQuantity(mealList, -1)">
                                <i class="fa-solid fa-circle-minus fa-lg" style="color: #b00000;"></i>
                            </button>
                            <button v-if="deleteOptionIcon" type="button" @click="updateQuantity(mealList, 1)">
                                <i class="fa-solid fa-circle-plus fa-lg"></i>
                            </button>
                        </div>
                        <div class="optionArea" v-for="(option, optionIndex) in mealList.custom_option.split(';')"
                            :key="optionIndex">
                            <p v-if="option !== 'null'">{{ option }}</p>
                            <p v-else></p>
                            <button v-if="deleteOptionIcon" type="button" @click="deleteOption(mealList, option)"
                                id="deleteOption">
                                <i class="fa-solid fa-circle-minus fa-lg" style="color: #b00000;"></i>
                            </button>
                        </div>
                    </li>
                </ul>
            </li>
            <div class="butArea">
                <button class="myMouse" @click=printDetailBut()>列印明細</button>
                <!-- <button class="myMouse" v-if="deleteOptionIcon == false"
                    @click="showDeleteOptionBut()">編&nbsp;&nbsp;&nbsp;輯</button>
                <button class="myMouse" v-else @click="showDeleteOptionBut()">修改完成</button> -->
            </div>
            <div class="showPrintResultArea">
                <div class="showBack" v-if="printDetail" >
                    <div class="showBox" @click.stop>
                        <div class="titleArea">
                            <p>正在列印</p>
                        </div>
                    </div>
                </div>
            </div>
        </ul>
    </nav>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&family=Noto+Sans+TC:wght@100..900&display=swap');

.navArea {
    font-family: "Chocolate Classical Sans", sans-serif;
    height: 100%;
    background: white;
    border-right: 5px solid #7b90da;
    transition: 0.3s ease;
    opacity: 90%;
    padding-top: 0.5dvh;


    div {
        display: flex;
        justify-content: left;

        label {
            width: 30px;
            height: 30px;
            display: flex !important;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: 0.3s ease;
            z-index: 9999;

            i {
                font-size: 2.5em;
            }
        }
    }

    .noShowIcon {
        justify-content: right;
    }

    ul {
        padding: 0 1dvw;

        li {
            list-style-type: none;
            font-size: 2.25dvh;
            color: black;
            margin: 1dvh 0;

            div {
                margin: 1dvh 0;

                .tableAndGuestNum {
                    overflow: hidden;

                }
            }

            p {
                margin: 0;
            }

            button {
                font-size: 2.5dvh;
                background: none;
                color: black;
                width: 3dvw;
                height: 3dvh;
                padding: 0;
                padding-top: 0.5dvh;
                margin: 0;
                border: none;
            }

            i {
                font-size: 2.5dvh;
            }

        }

        .optionArea {
            font-size: 2.5dvh;
        }

        .butArea {
            justify-content: space-between;

            button {
                cursor: pointer;
                padding: 0.5dvw;
                width: 8.5dvw;
                height: 6dvh;
                margin: 0 0.5dvw;
                margin-top: 1dvh;
                background: #7b90da;
                color: white;
                font-family: "Chocolate Classical Sans", sans-serif;
                font-size: 2.25dvh;
                border-radius: 5px;
                border: none;
            }
        }

        .showPrintResultArea {
            .showBack {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                font-weight: 500;
            }

            .showBox {
                width: 40%;
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                z-index: 100;
                font-size: 2.5dvh;
                line-height: 5dvh;

                .titleArea {
                    width: 100%;
                    color: black;
                    margin: 0 1dvw;
                    text-align: 3dvh;
                }


            }
        }



    }
}
</style>
