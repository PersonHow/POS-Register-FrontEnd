<script>
import { useBillstore } from '@/stores/BillStore'
import { mapState, mapActions } from 'pinia';
import MobileBarcodeArea from '@/components/ChiaoLin/MobileBarcodeArea.vue'
import UniformNumArea from '@/components/ChiaoLin/UniformNumArea.vue'
export default {
    setup() {
        const Billstore = useBillstore();
        return {
            Billstore,
            ...mapState(Billstore, ['orderAmountfromPage', 'discount', 'serviceFee', 'entertain', 'allowance', 'inputEvent', 'newInputEvent', 'showInvoiceComponent', 'showNav',
                'focusedInput', 'totalAmount', 'changeAmount', 'realChargeAmount', 'notyetChargeAmount', 'discountAmount', 'serviceAmount']),
            ...mapActions(Billstore, ['setFocusedInput', 'addInputEvent', 'removeInputEvent', 'updateNewInputEventValue', 'updateInputEventValue', 'tothousendShowValue',]),
        };
    },
    components: {
        MobileBarcodeArea,
        UniformNumArea
    },
    created() {
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
                    this.Billstore.orderAmountfromPage = this.OrderDB.amount;
                    // console.log(this.orderAmountfromPage);
                })
        } else {
            console.error("Wrong oId!")
        };
    },
    data() {
        return {
            OrderDB: [],
            mobileBox: false,
            uniformBox: false
        }
    },
    methods: {
        showMobileBox() {
            this.mobileBox = !this.mobileBox;
        },
        showUniformBox() {
            this.uniformBox = !this.uniformBox;
        },
        closeMobileBox() {
            this.mobileBox = false;
        },
        closeUniformBox() {
            this.uniformBox = false;
        }
    }
}
</script>

<template>
    <div class="AmountDetailArea">
        <div class="showInvoiceNum">
            <div class="showInvoiceNumArea">
                <p>發票號碼</p>
                <p>{{ Billstore.invoiceNum }}</p>
            </div>
            <div class="inputShowArea">
                <button type="button" class="myMouse"
                    @click="showMobileBox()"><span>載&nbsp;&nbsp;&nbsp;&nbsp;具</span></button>
                <button type="button" class="myMouse" @click="showUniformBox()"><span>統一編號</span></button>
            </div>
            <div v-if="mobileBox == true">
                <MobileBarcodeArea @close="closeMobileBox()" />
            </div>
            <div v-if="uniformBox == true">
                <UniformNumArea @close="closeUniformBox()" />
            </div>
        </div>
        <div class="amountDetail">
            <div class="amountDetailShow">
                <p>總計 NT.{{ Billstore.tothousendShowValue(Billstore.orderAmountfromPage) }} </p>
                <p>* 折扣{{ Billstore.discount
                    }}%(NT.{{ Billstore.tothousendShowValue(Billstore.discountAmount) }}) * 服務費{{ Billstore.serviceFee
                    }}%(NT.{{ Billstore.tothousendShowValue(Billstore.serviceAmount) }}) </p>
                <p>- 招待NT.{{ Billstore.tothousendShowValue(Billstore.entertain) }} - 折讓NT.{{
                    Billstore.tothousendShowValue(Billstore.allowance) }}</p>
            </div>
            <div class="amountShow">
                <div class="amountShowLeft">
                    <div class="amountShowLeftTotal">
                        <div class="totalAreaText">
                            <span>總金額</span>
                        </div>
                        <div class="ntTextAera"> <span id="ntText">NT.</span></div>
                        <div class="totalAreaAmount">
                            <span id="totalAmount">{{ Billstore.tothousendShowValue(this.OrderDB.amount) }}</span>
                        </div>
                    </div>
                    <div class="amountShowLeftChange" hidden>
                        <div class="changeAreaText">
                            <span>找零</span>
                        </div>
                        <div class="ntTextAera"> <span id="ntText">NT.</span></div>
                        <div class="changeAreaAmount">
                            <span id="changeAmount">{{ Billstore.tothousendShowValue(Billstore.changeAmount) }}</span>
                        </div>
                    </div>
                </div>
                <div class="amountShowRight">
                    <div class="amountShowRightRealCharge">
                        <div class="realChargeAreaText">
                            <span>實收</span>
                        </div>
                        <div class="ntTextAera"> <span id="ntText">NT.</span></div>
                        <div class="realChargeAreaAmount">
                            <span id="realChargeAmount">{{ Billstore.tothousendShowValue(Billstore.realChargeAmount)
                                }}</span>
                        </div>
                        <div class="amountShowRightNotyet">
                            <div class="amountShowRightNotyet">
                                <div class="notyetChargeAreaText">
                                    <p style="margin: 0;padding: 0;">未收</p>
                                </div>
                                <div class="ntTextAera"> <span id="ntText">NT.</span></div>
                                <div class="notyetChargeAreaAmount">
                                    <span id="notyetChargeAmount">{{ -
                                        Billstore.tothousendShowValue(Billstore.notyetChargeAmount) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.AmountDetailArea {
    width: 100%;
    padding-left: 0.5dvw;

    .showInvoiceNum {
        height: 9dvh;
        color: gray;
        font-weight: 600;
        font-size: 2.25dvh;
        margin-bottom: 0.5dvh;
        display: flex;
        justify-content: space-between;
        padding-left: 1dvw;
        justify-content: space-between;
        padding-left: 1dvw;

        .showInvoiceNumArea,
        .inputShowArea {
            display: flex;
            width: 23.5dvw;

            button {
                width: 9.5dvw;
                height: 6dvh;
                margin: 0 1dvw;
                margin-top: 2.5dvh;
                background: #00c1ca;
                color: white;
                font-family: "Chocolate Classical Sans", sans-serif;
                font-size: 2dvh;
                border-radius: 5px;
                border: none;
            }

        }

        .showInvoiceNumArea {
            padding-left: 1dvw;
            line-height: 9dvh
        }

        p {
            width: 10dvw;
        }

        input {
            height: 4dvh;
            border-radius: 5px;
            border: 1px solid gray;
            width: 17dvw;
        }
    }

    .amountDetail {
        border: 1px solid rgb(213, 212, 212);
        color: gray;
        font-weight: 600;
        margin: 0 0.5dvw;
        margin-right: 1.5dvw;
        border-radius: 5px;

        .amountDetailShow {
            width: 100%;
            font-size: 2dvh;
            text-align: center;
            padding: 1dvh 0;
            border-bottom: 1px solid rgb(213, 212, 212);

            p {
                margin: 0.5dvh 0;
            }
        }

        .amountShow {
            display: flex;

            .amountShowLeft {
                width: 45%;

                .amountShowLeftTotal {
                    padding: 1dvh 1dvw;
                    width: 100%;
                    margin: 1dvh 0;

                    .totalAreaAmount {
                        text-align: center;
                        font-size: 5dvh;
                    }

                    #totalAmount {
                        color: black;
                    }
                }

                .ntTextAera {
                    font-size: 2.5dvh;
                }

                .amountShowLeftChange {
                    padding: 0 1dvw;
                    width: 100%;

                    .changeAreaAmount {
                        text-align: center;
                        font-size: 4dvh;
                    }

                    #changeAmount {
                        color: black;
                    }
                }
            }

            .amountShowRight {
                width: 50%;
                margin-left: 0.5dvw;

                .amountShowRightRealCharge {
                    padding: 0 1dvw;
                    margin: 1dvh 0;

                    .realChargeAreaAmount {
                        text-align: center;
                        font-size: 4dvh;
                    }

                    #realChargeAmount {
                        color: black;
                    }
                }

                .ntTextAera {
                    font-size: 2.5dvh;
                }

                .amountShowRightNotyet {
                    .notyetChargeAreaText {
                        margin: 0;
                        padding: 0;
                    }

                    .notyetChargeAreaAmount {
                        text-align: center;
                        font-size: 4dvh;

                        #notyetChargeAmount {
                            color: black;
                        }
                    }
                }
            }
        }
    }
}
</style>