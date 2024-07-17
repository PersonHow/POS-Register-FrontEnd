<script>
import BillDetail from '@/components/ChiaoLin/BillDetail.vue';
import AmountDetails from '@/components/ChiaoLin/AmountDetail.vue';
import Calculator from '@/components/ChiaoLin/Calculator.vue';
import HandInvoiceContent from '@/components/ChiaoLin/HandInvoiceContent.vue';
import { useBillstore } from '../stores/BillStore'
import LeftNavEditOrder from '@/components/ChiaoLin/LeftNavEditOrder.vue';
import RightNavOtherFun from '@/components/ChiaoLin/RightNavOtherFun.vue';
// import { useOrderStore } from '@/stores/OrderStore'

export default {
    setup() {
        const Billstore = useBillstore();
        return { Billstore };
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
    methods: {
        // 更新 Billstore 中的多個屬性，將 event 中的所有屬性複製到 this.Billstore 中
        // event 的每個屬性都會覆蓋 this.Billstore 的對應屬性，就可以批量更新 Billstore 的屬性
        updateBillstore(event) {
            Object.assign(this.Billstore, event);
        },
        closeShow() {
            this.$emit('close');
        },
    },
}
</script>

<template>
    <div class="midArea">
        <!-- 用 v-bind -->
        <BillDetail :orderAmount="Billstore.OrderDB.amount" :discount="Billstore.discount"
            :serviceFee="Billstore.serviceFee" :entertain="Billstore.entertain" :allowance="Billstore.allowance"
            :inputEvent="Billstore.inputEvent" :newInputEvent="Billstore.newInputEvent"
            @set-focused-input="Billstore.setFocusedInput" @add-input-event="Billstore.addInputEvent"
            @remove-input-event="Billstore.removeInputEvent" @update="updateBillstore" />
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
                <RouterLink to="/OrderPage"><button type="button" class="comeback myMouse">取消</button></RouterLink>
                <button type="button" class="manualInvoice myMouse" @click="Billstore.showHandInvoiceArea">手開發票</button>
                <RouterLink to="/InvoicePage"><button type="button" class="comeback myMouse">發票設定</button></RouterLink>
                <RouterLink to="/AllBillPage"> <button type="button" class="comeback myMouse">帳務總覽</button></RouterLink>
                <input type="checkbox" id="rightBar" v-model="Billstore.showRightNav">
                <label for="rightBar" class="myMouse"><i class="fa-solid fa-bars fa-xl"></i></label>
            </div>
        </div>
        <div v-if="Billstore.showHandInvArea">
            <HandInvoiceContent @close="Billstore.showHandInvoiceArea" />
        </div>
        <!-- <LeftNavEditOrder /> -->
        <RightNavOtherFun />
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&family=Noto+Sans+TC:wght@100..900&display=swap');

.midArea {
    display: flex;
    font-family: "Chocolate Classical Sans", sans-serif;

    .rightArea {
        width: 50%;

        .functionButArea {
            display: flex;
            width: 95%;
            height: 7dvh;
            line-height: 7dvh;
            background: linear-gradient(90deg, #00c1ca, #01e1c5);
            color: #fff;
            border-radius: 10px;
            padding-left: 1dvw;
            margin-top: 1dvh;
            margin-left: 1.5dvh;

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
            }
        }
    }
}
</style>