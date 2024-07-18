<script>
import { useBillstore } from '@/stores/BillStore'
import { mapState, mapActions } from 'pinia';
export default {
    setup() {
        const Billstore = useBillstore();
        return {
            Billstore,
            ...mapState(Billstore, ['orderAmountfromPage', 'discount', 'serviceFee', 'entertain', 'allowance', 'inputEvent', 'newInputEvent', 'showInvoiceComponent', 'showNav',
                'focusedInput', 'totalAmount', 'changeAmount', 'realChargeAmount', 'notyetChargeAmount', 'discountAmount', 'serviceAmount', 'OrderDB']),
            ...mapActions(Billstore, ['addToDisplay', 'clearDisplay', 'backspace', 'getOderId', 'getInvoiceNum', 'tothousendShowValue',]),
        };
    },
    methods: {
        ...mapActions(useBillstore, ['saveBillfromP']),
        saveBill() {
            if (this.Billstore.notyetChargeAmount > 0) {
                alert('未收不可小於0')
                return;
            }
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
            const staff = JSON.parse(sessionStorage.getItem("token"));
            console.log(staff);
            // 跳出找零box
            this.changeArea = !this.changeArea;
            this.needTochange = this.Billstore.changeAmount;
            // 若有手開發票
            if (this.Billstore.handInvoiceInput !== "") {
                this.Billstore.invoiceNum = this.Billstore.handInvoiceInput;
                this.Billstore.uniformNum = this.Billstore.handUniformNum;
            }
            // 存入pinia
            this.saveBillfromP("", this.OrderDB.order_id, pCash, pCard, pOther, this.Billstore.invoiceNum, "", staff.staff_id, "", pOtherName, this.Billstore.mobileBarcode, this.Billstore.uniformNum)
            this.Billstore.orderAmountfromPage = 0;
            this.Billstore.discount = 0;
            this.Billstore.serviceFee = 0;
            this.Billstore.entertain = 0;
            this.Billstore.allowance = 0;
            this.Billstore.mobileBarcode = "";
            this.Billstore.uniformNum = "";
            this.Billstore.handInvoiceInput = "";
            this.Billstore.handUniformNum = "";
            this.OrderDB.amount = 0;
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
        showChangeArea() {
            this.changeArea = !this.changeArea;
        }
    },
    data() {
        return {
            changeArea: false,
            needTochange: 0
        }
    },
    created() {
        // 抓目前登入在操作的員工
        const staff = JSON.parse(sessionStorage.getItem("token"));
        // console.log(staff);
        // 抓orderId from route
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
                    // console.log(this.OrderDB)
                })
        } else {
            console.error("Wrong oId!")
        }
        // 產生Invoice字軌
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const firstChar = chars.charAt(Math.floor(Math.random() * chars.length));
        const secondChar = chars.charAt(Math.floor(Math.random() * chars.length));
        // 10000000 ~ 99999999 的8位數
        const randomNum = String(Math.floor(10000000 + Math.random() * 99999999));
        this.Billstore.invoiceNum = `${firstChar}${secondChar}${randomNum}`;
        // 檢查未收
    },
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
                <div class="mathBut butRevise"><input type="button" value="更  正" @click="Billstore.clearDisplay()"
                        id="butRevise"></div>
                <div class="mathBut butComfirm"><input type="button" value="完成結帳" @click="saveBill()" id="butComfirm">
                </div>
            </div>
            <div v-if="changeArea == true">
                <div class="showBack">
                    <div class="showBox" @click.stop>
                        <div class="titleArea">
                            <p>找&nbsp;&nbsp;&nbsp;&nbsp;零</p>
                        </div>
                        <div class="showInfoArea">
                            <span id="ntText">NT.</span>
                            <span id="changeAmount">{{ Billstore.tothousendShowValue(this.needTochange) }}</span>
                        </div>
                        <p style="text-align: center;">是否列印明細?</p>
                        <div class="butArea">
                            <button id="closebutton" @click="showChangeArea()">是</button>
                            <button id="closebutton" @click="showChangeArea()">Close</button>
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
        padding-top: 1.5dvh;

        .mathbutArea {
            width: 100%;
            display: grid;
            grid-template-columns: 33% 33% 33%;
        }

        .mathBut {
            width: 100%;
            height: 10dvh;

            input {
                width: 85%;
                height: 8dvh;
                border: 1px solid rgb(213, 212, 212);
                background: linear-gradient(white 80%, #00c1ca 20%);
                color: black;
                font-size: 3dvh;
                border-radius: 5px;

                &.active {
                    background: linear-gradient(rgb(152, 152, 152) 70%, #009688 30%);
                }
            }
        }

        .otherButArea {
            width: 30%;

            .mathBut {
                width: 95%;

                input {
                    width: 100%;
                    font-family: "Chocolate Classical Sans", sans-serif;
                    font-size: 2dvh;
                    border-radius: 5px;
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
                    border-radius: 5px;
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
        width: 40%;
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
            padding-left: 1dvw;
        }

        .butArea {
            display: flex;
            line-height: 8dvh;
            justify-content: space-between;

            button {
                width: 9dvw;
                height: 6dvh;
                margin: 0 1dvw;
                margin-top: 1dvh;
                background: #00c1ca;
                color: white;
                font-family: "Chocolate Classical Sans", sans-serif;
                font-size: 2dvh;
                border-radius: 5px;
                border: none;
            }
        }

        .showInfoArea {
            width: 100%;
            margin: 1dvh 0;
            text-align: center;
            p{
                text-align: center;
            }

            span {
                font-size: 4dvh;
            }
        }

    }
}
</style>