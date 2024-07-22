<script>
import BillDetail from '../components/ChiaoLin/BillDetail.vue';
import AmountDetails from '../components/ChiaoLin/AmountDetail.vue';
import Calculator from '../components/ChiaoLin/Calculator.vue';
import HandInvoiceContent from '../components/ChiaoLin/HandInvoiceContent.vue';
import { useBillstore } from '../stores/BillStore';
import LeftNavEditOrder from '../components/ChiaoLin/LeftNavEditOrder.vue';
import RightNavOtherFun from '../components/ChiaoLin/RightNavOtherFun.vue';

export default {
    setup() {
        const Billstore = useBillstore();

        onMounted(() => {
            useBillstore.isTopBarHidden = true;
        })

        return {
            Billstore,
            ...mapState(Billstore, ['isTopBarHidden']),
            ...mapActions(Billstore, ['closeTopbar'])
        };
        // const OrderStore = useOrderStore();
        // return { OrderStore };
    },
    components: {
        BillDetail,
        AmountDetails,
        Calculator,
        HandInvoiceContent,
        LeftNavEditOrder,
        RightNavOtherFun,
    },
    data() {
        return {
            orderAmountText: "訂單金額",
            serviceText: "服務費",
            entertainText: "招待",
            discountText: "折扣",
            allowanceText: "折讓",
            displayVal: null,
            focusedInput: null,
        }
    },
}
</script>

<template>
    <div class="midArea">
        <BillDetail :orderAmount="Billstore.order_amount" :discount="Billstore.discount"
            :serviceFee="Billstore.serviceFee" :entertain="Billstore.entertain" :allowance="Billstore.allowance"
            :inputEvent="Billstore.inputEvent" :newInputEvent="Billstore.newInputEvent"
            @set-focused-input="Billstore.setFocusedInput" @add-input-event="Billstore.addInputEvent"
            @remove-input-event="Billstore.removeInputEvent" @update:orderAmount="Billstore.order_amount = $event"
            @update:discount="Billstore.discount = $event" @update:serviceFee="Billstore.serviceFee = $event"
            @update:entertain="Billstore.entertain = $event" @update:allowance="Billstore.allowance = $event"
            @update:inputEvent="Billstore.inputEvent = $event"
            @update:newInputEvent="Billstore.newInputEvent = $event" />
        <div class="rightArea">
            <AmountDetails :orderAmount="Billstore.OrderDB.amount" :totalAmount="Billstore.totalAmount"
                :changeAmount="Billstore.changeAmount" :realChargeAmount="Billstore.realChargeAmount"
                :notyetChargeAmount="Billstore.notyetChargeAmount" :discount="Billstore.discount"
                :discountAmount="Billstore.discountAmount" :serviceFee="Billstore.serviceFee"
                :serviceAmount="Billstore.serviceAmount" :entertain="Billstore.entertain"
                :allowance="Billstore.allowance" />
            <Calculator @add-to-display="Billstore.addToDisplay" @clear-display="Billstore.clearDisplay"
                @backspace="Billstore.backspace" />
            <div class="functionButArea">
                <!-- <RouterLink to="/testPage"> -->
                <button type="button" class="comeback myMouse">返回</button>
                <!-- </RouterLink> -->
                <!-- 先放著，確定位置後可刪 -->
                <!-- <input type="checkbox" id="noShowOrder" v-model="Billstore.showHandInvoiceArea">
                <label for="noShowOrder" class="myMouse"><span>點餐明細</span></label> -->
                <button type="button" class="manualInvoice myMouse" @click="Billstore.showHandInvoiceArea">手開發票</button>
                <input type="checkbox" id="leftBar" v-model="Billstore.showRightNav">
                <label for="leftBar" class="myMouse"><i class="fa-solid fa-bars fa-xl"></i></label>
            </div>
        </div>
        <div v-if="Billstore.showHandInvArea">
            <HandInvoiceContent @close="Billstore.showHandInvoiceArea"  />
        </div>
        <!-- <LeftNavEditOrder /> -->
        <!-- <RightNavOtherFun /> -->
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&family=Noto+Sans+TC:wght@100..900&display=swap');

.midArea {
    width: 100dvw;
    display: flex;
    font-family: "Chocolate Classical Sans", sans-serif;

    .rightArea {
        width: 50%;

        .functionButArea {
            display: flex;
            width: 94%;
            height: 7dvh;
            line-height: 7.5dvh;
            background: linear-gradient(90deg, #00c1ca, #01e1c5);
            color: #fff;
            border-radius: 10px;
            padding-left: 1dvw;
            margin: 0 1dvw;

            button {
                border: none;
                background: none;
                color: white;
                font-family: "Chocolate Classical Sans", sans-serif;
                font-size: 2dvh;
                padding-left: 2dvw;
            }

            .comeback {
                margin-right: 2dvw;
            }

            input {
                z-index: -1;
            }

            label {
                // border: 1px solid black;
                height: 8dvh;
                height: 8dvh;
                width: 8dvw;
                cursor: pointer; // 使滑鼠變更樣式，讓使用者知道可以點擊
                transition: 0.3s ease;
                z-index: 1; // 使其圖層絕對在最上方
                display: flex;
                justify-content: center;

                i {
                    z-index: 1;
                    line-height: 8dvh;
                }
            }
        }
    }
}
</style>