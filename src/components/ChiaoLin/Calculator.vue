<script>
import { useBillstore } from '@/stores/BillStore'
import { mapState, mapActions } from 'pinia';
export default {
    setup() {
        const Billstore = useBillstore();
        return {
            Billstore,
            ...mapState(Billstore, ['order_amount', 'discount', 'serviceFee', 'entertain', 'allowance', 'inputEvent', 'newInputEvent', 'showInvoiceComponent', 'showNav',
                'focusedInput', 'totalAmount', 'changeAmount', 'realChargeAmount', 'notyetChargeAmount', 'discountAmount', 'serviceAmount']),
            ...mapActions(Billstore, ['addToDisplay', 'clearDisplay', 'backspace', 'getOderId', 'getInvoiceNum']),
        };
    },
    methods: {
        ...mapActions(useBillstore, ['saveBilltoDB']),
        saveBill() {
            let pCash = 0, pCard = 0, pOther = 0;
            this.Billstore.inputEvent.forEach(event => {
                if (event.type === "現金") {
                    pCash = event.value;
                } else if (event.type === "信用卡") {
                    pCard = event.value;
                } else {
                    pOther += event.value;
                }
            });
            this.saveBilltoDB("", this.Billstore.order_id, pCash, pCard, pOther, this.Billstore.invoiceNum, "", 2, "")
            console.log(this.saveBilltoDB);
        }
    }
}
</script>

<template>
    <div class="calculatorArea">
        <div class="calculator">
            <div class="mathbutArea">
                <div class="mathBut but1"><input type="button" value="1" @click="Billstore.addToDisplay('1')"></div>
                <div class="mathBut but2"><input type="button" value="2" @click="Billstore.addToDisplay('2')"></div>
                <div class="mathBut but3"><input type="button" value="3" @click="Billstore.addToDisplay('3')"></div>
                <div class="mathBut but4"><input type="button" value="4" @click="Billstore.addToDisplay('4')"></div>
                <div class="mathBut but5"><input type="button" value="5" @click="Billstore.addToDisplay('5')"></div>
                <div class="mathBut but6"><input type="button" value="6" @click="Billstore.addToDisplay('6')"></div>
                <div class="mathBut but7"><input type="button" value="7" @click="Billstore.addToDisplay('7')"></div>
                <div class="mathBut but8"><input type="button" value="8" @click="Billstore.addToDisplay('8')"></div>
                <div class="mathBut but9"><input type="button" value="9" @click="Billstore.addToDisplay('9')"></div>
                <div class="mathBut but0"><input type="button" value="0" @click="Billstore.addToDisplay('0')"></div>
                <div class="mathBut but00"><input type="button" value="00" @click="Billstore.addToDisplay('00')"></div>
                <div class="mathBut but."><input type="button" value="." @click="Billstore.addToDisplay('.')"></div>
            </div>
            <div class="otherButArea">
                <div class="mathBut butbackspace"><input type="button" value="＜＜" @click="Billstore.backspace()"
                        id="butbackspace"></div>
                <div class="mathBut butRevise"><input type="button" value="更正" @click="Billstore.clearDisplay()"
                        id="butRevise"></div>
                <div class="mathBut butComfirm"><input type="button" value="確定" @click="saveBill()" id="butComfirm">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.calculatorArea {
    width: 100%;
    padding: 0 1dvw;

    .calculator {
        width: 100%;
        display: flex;
        padding-top: 3dvh;
        justify-content: space-between;
        margin-left: 0.5dvw;

        .mathbutArea {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
        }

        .mathBut {
            width: 28%;
            height: 10dvh;
            margin-right: 2dvw;

            input {
                width: 100%;
                height: 8dvh;
                border: 1px solid rgb(213, 212, 212);
                background: linear-gradient(white 80%, #00c1ca 20%);
                color: black;
                font-size: 3dvh;
            }
        }

        .otherButArea {
            width: 20%;
            margin-right: 1dvw;

            .mathBut {
                width: 100%;

                input {
                    width: 100%;
                    font-family: "Chocolate Classical Sans", sans-serif;
                    font-size: 2dvh;
                }

                #butbackspace,
                #butRevise {
                    width: 100%;
                    background: #f29700;
                    color: white;
                }

                #butComfirm {
                    height: 18dvh;
                    background: linear-gradient(90deg, #00c1ca, #01e1c5);
                    color: white;
                }
            }
        }
    }
}
</style>