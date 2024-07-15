<script>
import { useBillstore } from '@/stores/BillStore'
import { useOrderStore } from '@/stores/OrderStore'
import { mapState, mapActions } from 'pinia';
import { onMounted, watch } from 'vue';

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
            updateValue,
            enterAddInputValue,
            ...mapState(Billstore, ['orderAmountfromPage', 'discount', 'serviceFee', 'entertain', 'allowance', 'inputEvent', 'newInputEvent',]),
            ...mapState(OrderStore, ['order_info']),
            ...mapActions(Billstore, ['setFocusedInput', 'addInputEvent', 'removeInputEvent', 'getOderId', 'getBillIdfromDB']),
        };
    },
    methods: {
        
    },
    data() {
        return {
            OrderDB: [],
        }
    },
    created() {
        // 判斷orderId是不是空
        if (this.$route.params.orderId !== "") {
            let orderId = this.$route.params.orderId
            let orderObj = {
                order_id: orderId,
            }
            console.log(orderId);
            console.log(orderObj);
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
            // 100 ~ 999 的三位數
            const randomNum = String(Math.floor(100 + Math.random() * 900));
            this.Billstore.bId = `${year}${month}${day}-${AorB}${randomNum}`;
        } else {
            console.error("Wrong oId!")
        }
    }

}
</script>

<template>
    <div class="allArea">
        <div class="showOrderId">
            <div style="width: 20%;">結帳單號</div>
            <div style="width: 50%;">{{ this.Billstore.bId }}</div>
            <!-- 漢堡按鈕還沒做 -->
            <input type="checkbox" id="noShowOrder" v-model="this.Billstore.showOrderArea">
            <label for="noShowOrder" class="orderDetailLabel myMouse"><span>點餐明細</span></label>
            <label for="" class="myMouse"><i class="fa-solid fa-bars fa-xl"></i></label>
        </div>
        <div class="billDetailArea"></div>
        <div class="billDetailLeftArea">

        </div>
        <div class="billDetailRightArea">
            <div class="titleArea">
                <p>結帳明細</p>
            </div>
        </div>
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
                    @input="updateValue($event, 'serviceFee')" @focus="tBillstore.setFocusedInput($event.target)"
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
                <input type="text" id="addInputEvents" :value="Billstore.newInputEvent" @input="enterAddInputValue"
                    placeholder="請輸入項目名稱">
                <button type="button" id="addDetail" @click="Billstore.addInputEvent" class="myMouse"><i
                        class="fa-solid fa-circle-plus fa-xl"></i></button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.allArea {
    width: 50%;

    .titleArea {
        margin: 2dvh 0;
        margin-top: 3dvh;
        padding-left: 3dvw;

        p {
            color: gray;
            font-size: 2.25dvh;
        }
    }

    .showOrderId {
        display: flex;
        height: 9dvh;
        background: linear-gradient(90deg, #00c1ca, #01e1c5);
        color: white;
        line-height: 9dvh;
        padding-left: 2dvw;
        font-size: 2.25dvh;

        button {
            width: 20%;
            border: none;
            background: none;
            color: white;
        }

        input {
            z-index: -1;
        }

        label {
            // border: 1px solid black;
            height: 9dvh;
            width: 8dvw;
            cursor: pointer; // 使滑鼠變更樣式，讓使用者知道可以點擊
            transition: 0.3s ease;
            z-index: 99; // 使其圖層絕對在最上方
            display: flex;
            justify-content: center;

            i {
                z-index: 1;
                line-height: 9dvh;
            }

            span {
                font-size: 2.25dvh;
            }
        }
    }

    .billdetail {
        padding: 0 2.5dvw;

        input {
            width: 90%;
            border-radius: 5px;
            border: none;
            background-color: white;
            text-align: right;
            font-size: 2dvh;
        }

        p {
            height: 4dvh;
            margin-left: 1dvw;
            font-size: 2dvh;
            padding-top: 0.5dvh;
            margin-top: 0.5dvh;
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

    #addDetail {
        background: none;
        border: none;
    }

    #addDetail:active {
        scale: 1.2;
    }


}
</style>