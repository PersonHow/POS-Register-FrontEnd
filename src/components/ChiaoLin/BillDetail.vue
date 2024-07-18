<script>
import { useBillstore } from '@/stores/BillStore'
import { useOrderStore } from '@/stores/OrderStore'
import { useOrderStore } from '@/stores/OrderStore'
import { mapState, mapActions } from 'pinia';
import { onMounted, watch } from 'vue';
import LeftNavEditOrder from '@/components/ChiaoLin/LeftNavEditOrder.vue';

export default {
    setup() {
        const Billstore = useBillstore();
        const OrderStore = useOrderStore();
        // event 對應 input, propName 對應 屬性名稱, 
        // event.target.value 當前輸入框的值, parseFloat 將字符串轉換為浮點數，確保輸入值為數字
        const updateValue = (event, propName) => {
            Billstore[propName] = parseFloat(event.target.value) || 0;
        };
        const enterAddInputValue = (event) => {
            Billstore.newInputEvent = event.target.value;
        };



        // 避免切換分頁 inputEvent 刷新
        // 在 onMounted 生命週期時從 localStorage 中恢復 newInputEvent 的值
        onMounted(() => {
            // 從 localStorage 中獲取名為 newInputEvent 的值
            const savedNewInputEvent = localStorage.getItem('newInputEvent');
            if (savedNewInputEvent) { // 如果 savedNewInputEvent 有值
                Billstore.newInputEvent = savedNewInputEvent; // 放入 pinia 的 newInputEvent
            }
        });

        // 監視 newInputEvent 並 save 到 localStorage
        watch(
            () => Billstore.newInputEvent,
            (newValue) => {
                localStorage.setItem('newInputEvent', newValue);
            }
        );

        return {
            Billstore,
            OrderStore,
            OrderStore,
            updateValue,
            enterAddInputValue,
            ...mapState(Billstore, ['orderAmountfromPage', 'discount', 'serviceFee', 'entertain', 'allowance', 'inputEvent', 'newInputEvent','lastBill']),
            ...mapState(OrderStore, ['order_info']),
            ...mapActions(Billstore, ['setFocusedInput', 'addInputEvent', 'removeInputEvent', 'getOderId', 'getBillIdfromDB','getAllBillsAndTodayBills']),
        };
    },
    methods: {
        toggleSidebar() {
            this.isLeftNavHidden = !this.isLeftNavHidden;
        },
    },
    data() {
        return {
            OrderDB: [],
            isLeftNavHidden: false,
        }
    },
    created() {
        // 判斷orderId是不是空
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
                    this.OrderDB = data;
                    console.log(this.OrderDB)
                })
            // 結帳單號
            const now = new Date();
            const year = now.getFullYear().toString().slice(-2);  // 只取年份後2碼
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = now.getHours();

            // 餐期 A, B, 非以上為 Other
            let AorB;
            if (hours >= 11 && hours < 15) {
                AorB = 'A';
            } else if (hours >= 17 && hours < 21) {
                AorB = 'B';
            } else {
                AorB = 'Other';
            }
            this.showBillId = `${year}${month}${day}-${AorB}` + ((this.Billstore.chargedTodayBills.length)+1);
        } else {
            console.error("Wrong oId!")
        };
        
    },
    components: {
        LeftNavEditOrder,
    }

}
</script>

<template>
    <div class="allArea">
        <div class="showOrderId">
            <div style="width: 20%;">結帳單號</div>
            <div style="width: 40%;">{{ this.showBillId }}</div>
            <!-- 漢堡按鈕還沒做 -->
            <input type="checkbox" id="noShowOrder" v-model="this.Billstore.showOrderArea">
            <button style="cursor: pointer;" @click="toggleSidebar">
                <p  v-if="!isLeftNavHidden">關閉左側明細</p>
                <p  v-else>開啟左側明細</p>
            </button>
            <label for="" class="myMouse"><i class="fa-solid fa-bars fa-xl"></i></label>
        </div>
        <div class="billDetailArea">
            <div :class="['billDetailLeftArea', { hidden: isLeftNavHidden }]">
                
                <LeftNavEditOrder></LeftNavEditOrder>
            </div>
            <div :class="['billDetailRightArea', { expanded: isLeftNavHidden }]">
                <!-- <div class="titleArea">
                    <p>結帳明細</p>
                </div> -->
                <div class="billdetail">
                    <p>訂單金額&nbsp;</p>
                    <div class="inputAera"><input type="text" :value="this.OrderDB.amount" disabled>
                    </div>
                    <p>折扣&nbsp;</p>
                    <div class="inputAera"><input type="text" :value="Billstore.discount"
                            @input="updateValue($event, 'discount')" @focus="Billstore.setFocusedInput($event.target)"
                            name="discount"><span>%</span></div>
                    <p>服務費&nbsp;</p>
                    <div class="inputAera"><input type="text" :value="Billstore.serviceFee"
                            @input="updateValue($event, 'serviceFee')" @focus="Billstore.setFocusedInput($event.target)"
                            name="serviceFee"><span>%</span></div>
                    <p>招待&nbsp;</p>
                    <div class="inputAera"><input type="text" :value="Billstore.entertain"
                            @input="updateValue($event, 'entertain')" @focus="Billstore.setFocusedInput($event.target)"
                            name="entertain">
                    </div>
                    <p>折讓&nbsp;</p>
                    <div class="inputAera" style="border-bottom: thick double rgb(213, 212, 212);"><input type="text"
                            :value="Billstore.allowance" @input="updateValue($event, 'allowance')"
                            @focus="Billstore.setFocusedInput($event.target)" name="allowance"></div>
                    <!-- 其他付款方式 -->
                    <div class="inputEventArea" v-for="(event, index) in Billstore.inputEvent" :key="index">
                        <p>{{ event.type }}&nbsp; <button class="myMouse" @click="Billstore.removeInputEvent(index)"><i
                                    class="fa-solid fa-circle-minus fa-lg" style="color: #b00000;"></i></button></p>
                        <div class="inputAera"><input type="text" v-model="event.value"
                                @focus="Billstore.setFocusedInput($event.target)" :name="event.type"></div>
                    </div>
                    <div class="inputAera addInputEventsArea">
                        <input type="text" id="addInputEvents" :value="Billstore.newInputEvent"
                            @input="enterAddInputValue" placeholder="請輸入項目名稱">
                        <button type="button" id="addDetail" @click="Billstore.addInputEvent" class="myMouse"><i
                                class="fa-solid fa-circle-plus fa-xl"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&family=Noto+Sans+TC:wght@100..900&display=swap');
.allArea {
    width: 50%;
    font-family: "Chocolate Classical Sans", sans-serif;

    .titleArea {
        margin: 2dvh 0;
        margin-bottom: 3dvh;
        padding-left: 2.5dvw;

        p {
            color: gray;
            font-size: 2.25dvh;
        }
    }

    .showOrderId {
        display: flex;
        height: 8dvh;
        background: linear-gradient(90deg, #00c1ca, #01e1c5);
        border-radius: 5px;
        color: white;
        line-height: 8dvh;
        padding-left: 2dvw;
        font-size: 2.25dvh;

        button {
            width: 25%;
            border: none;
            background: none;
            color: white;
            font-family: "Chocolate Classical Sans", sans-serif;
            font-size: 2dvh;
        }

        input {
            z-index: -1;
        }

        label {
            // border: 1px solid black;
            height: 8dvh;
            width: 8dvw;
            cursor: pointer; // 使滑鼠變更樣式，讓使用者知道可以點擊
            transition: 0.3s ease;
            z-index: 99; // 使其圖層絕對在最上方
            z-index: 99; // 使其圖層絕對在最上方
            display: flex;
            justify-content: center;

            i {
                z-index: 1;
                line-height: 8dvh;
            }


            span {
                font-size: 2.25dvh;
            }
        }
    }

    .billDetailArea {
        display: flex;
        width: 100%;
        overflow: hidden;

        .billDetailLeftArea {
            width: 90%;
            transition: width 0.3s ease;
            overflow: hidden;

            &.hidden {
                width: 0;
            }
        }

        .billDetailRightArea {
            width: 100%;
            transition: width 0.3s ease;

            &.expended {
                width: 100%;
            }

            .billdetail {
                padding: 0 1.5dvw;
                padding-top: 2.25dvh;

                input {
                    width: 90%;
                    border-radius: 5px;
                    border: none;
                    background-color: white;
                    text-align: right;
                    font-size: 2.25dvh;
                }

                p {
                    height: 2.5dvh;
                    margin-left: 1dvw;
                    font-size: 2dvh;
                    margin-top: 1dvh;
                }

                .inputAera {
                    width: auto;
                    text-align: right;
                    padding-right: 1dvw;
                    border-bottom: 2px solid rgb(213, 212, 212);

                    #addDetail {
                        height: 5dvh;
                    }

                    #addInputEvents {
                        text-align: left;
                    }

                }

                .inputEventArea {
                    border-bottom: 1px solid rgb(213, 212, 212);

                    input {
                        text-align: right;
                    }

                    button {
                        background: none;
                        border: none;
                    }
                }

                .addInputEventsArea {
                    input {
                        width: 100%;
                        padding-left: 1dvw;
                        margin-top: 1dvh;
                        font-family: "Chocolate Classical Sans", sans-serif;
                    }
                }

            }
        }
    }



    #addDetail {
        background: none;
        border: none;
    }

    #addDetail:active {
        scale: 1.2;
    }


}
</style>