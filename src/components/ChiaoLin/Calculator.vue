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
            ...mapActions(Billstore, ['addToDisplay', 'clearDisplay', 'backspace', 'getOderId', 'getInvoiceNum','tothousendShowValue',]),
        };
    },
    methods: {
        ...mapActions(useBillstore, ['saveBillfromP']),
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
            let paymentWays = this.Billstore.inputEvent.map(otherPayment => otherPayment.type);
            let pOtherName = paymentWays.splice(2).join(',');
            // 待連 lastmodified_staff_id: pId
            this.saveBillfromP("", this.Billstore.order_id, pCash, pCard, pOther, this.Billstore.invoiceNum, "", "", "", pOtherName)
            this.Billstore.order_amount = 0;
            this.Billstore.discount = 0;
            this.Billstore.serviceFee = 0;
            this.Billstore.entertain = 0;
            this.Billstore.allowance = 0;
            this.Billstore.inputEvent.forEach(event => {
                if (event.type === "現金") {
                    event.value = 0;
                } else if (event.type === "信用卡") {
                    event.value = 0;
                } else {
                    event.value = 0;
                }
            })
        },
        closeShow() {
            this.$emit('close');
        },
        showChangeArea(){
            this.changeArea = !this.changeArea;
        }
    },
    data() {
        return {
            changeArea: false,
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
                <div class="mathBut butComfirm"><input type="button" value="確定" @click="showChangeArea()" id="butComfirm">
                </div>
            </div>
            <div v-if="changeArea == true">
                <div class="showBack" @click="showChangeArea()">
                    <div class="showBox" @click.stop>
                        <div class="titleArea">
                            <p>找&nbsp;&nbsp;&nbsp;&nbsp;零</p>
                        </div>
                        <div class="showInfoArea">
                            <span id="ntText">NT.</span>
                            <span id="changeAmount">{{ Billstore.tothousendShowValue(Billstore.changeAmount) }}</span>
                        </div>
                        <div class="butArea">
                            <button @click="showChangeArea()">Close</button>
                        </div>
                    </div>
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
        margin-left: 0.5dvw;

        .mathbutArea {
            width: 80%;
            display: flex;
            flex-wrap: wrap;
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
                    width: 100%;
                    height: 18dvh;
                    background: linear-gradient(90deg, #00c1ca, #01e1c5);
                    color: white;
                }
            }
        }
    }

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
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
    font-size: 3dvh;
    line-height: 5dvh;

    .titleArea {
        width: 100%;
        height: 5dvh;
        color: black;
        margin: 0 1dvw;
    }

    .butArea {
        display: flex;
        line-height: 8dvh;

        button {
            width: 9dvw;
            height: 7dvh;
            margin: 0 1dvw;
            margin-top: 1dvh;
            background: none;
            color: gray;
            font-weight: 600;
            font-family: "Chocolate Classical Sans", sans-serif;
            font-size: 2dvh;
            border: 2px solid #00c1ca;
            border-radius: 5px;
        }
    }

    .showInfoArea {
        width: 100%;
        margin: 1dvh 0;
        padding-left: 1dvw;
        span{
            font-size: 3dvh;
        }
    }

}
}
</style>