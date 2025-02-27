<script>
import { useBillstore } from '@/stores/BillStore'
import { mapState, mapActions } from 'pinia';
import { onMounted, watch } from 'vue';

export default {
    setup() {
        const Billstore = useBillstore();
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
            updateValue,
            enterAddInputValue,
            ...mapState(Billstore, ['order_amount', 'discount', 'serviceFee', 'entertain', 'allowance', 'inputEvent', 'newInputEvent',]),
            ...mapActions(Billstore, ['setFocusedInput', 'addInputEvent', 'removeInputEvent', 'getOderId']),
        };
    },

}
</script>

<template>
    <div class="billDetailArea">
        <div class="showOrderId">
            <div style="width: 15%;">單號</div>
            <div style="width: 55%;">{{ Billstore.order_id }}</div>
            <!-- 漢堡按鈕還沒做 -->
            <input type="checkbox" id="noShowOrder" v-model="Billstore.showOrderArea">
            <label for="noShowOrder" class="myMouse"><span>點餐明細</span></label>
            <label for="" class="myMouse"><i class="fa-solid fa-bars fa-xl"></i></label>
        </div>

        <div class="billDetailTextArea">
            <p>結帳明細</p>
        </div>
        <div class="billdetail">
            <p>訂單金額&nbsp;</p>
            <div class="inputAera"><input type="text" :value="Billstore.order_amount"
                    @input="updateValue($event, 'order_amount')">
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
                <input type="text" id="addInputEvents" :value="Billstore.newInputEvent" @input="enterAddInputValue"
                    placeholder="請輸入項目名稱">
                <button type="button" id="addDetail" @click="Billstore.addInputEvent" class="myMouse"><i
                        class="fa-solid fa-circle-plus fa-xl"></i></button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.billDetailArea {
    width: 100%;

    .billDetailTextArea {
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
        height: 8dvh;
        background: linear-gradient(90deg, #00c1ca, #01e1c5);
        color: white;
        line-height: 8dvh;
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
            height: 8dvh;
            width: 8dvw;
            cursor: pointer; // 使滑鼠變更樣式，讓使用者知道可以點擊
            transition: 0.3s ease;
            z-index: 9999; // 使其圖層絕對在最上方
            display: flex;
            justify-content: center;

            i {
                z-index: 1;
                line-height: 8dvh;
            }
            span{
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
            border-bottom: 1px solid rgb(213, 212, 212);

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