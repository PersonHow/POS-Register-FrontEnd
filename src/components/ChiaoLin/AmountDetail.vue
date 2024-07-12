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
            ...mapActions(Billstore, ['setFocusedInput', 'addInputEvent', 'removeInputEvent', 'updateNewInputEventValue', 'updateInputEventValue', 'tothousendShowValue',]),
        };
    },
}
</script>

<template>
    <div class="AmountDetailArea">
        <div class="showInvoiceNum">
            <p style="width: 8dvw; margin-left: 0.5dvw">發票號碼</p>
            <p>{{ Billstore.invoiceNum }}</p>
            <span>|</span>
            <p style="width: 10dvw;">統一編號</p>
            <input type="text">
        </div>
        <div class="amountDetail">
            <div class="amountDetailShow">
                <span>總計 NT.{{ Billstore.tothousendShowValue(Billstore.order_amount) }} * 折扣{{ Billstore.discount
                    }}%(NT.{{ Billstore.tothousendShowValue(Billstore.discountAmount) }}) * 服務費{{ Billstore.serviceFee
                    }}%(NT.{{ Billstore.tothousendShowValue(Billstore.serviceAmount) }}) </span>
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
                            <span id="totalAmount">{{ Billstore.tothousendShowValue(Billstore.totalAmount) }}</span>
                        </div>
                    </div>
                    <div class="amountShowLeftChange">
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
                            <div class="notyetChargeAreaText">
                                <p>未收</p>
                            </div>
                            <div class="ntTextAera"> <span id="ntText">NT.</span></div>
                            <div class="notyetChargeAreaAmount">
                                <span id="notyetChargeAmount">{{
                                    Billstore.tothousendShowValue(Billstore.notyetChargeAmount) }}</span>
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
    padding: 0 1dvw;

    .showInvoiceNum {
        height: 9dvh;
        line-height: 8dvh;
        color: gray;
        font-weight: 600;
        font-size: 2.25dvh;
        margin-bottom: 0.5dvh;
        display: flex;
        text-align: center;
        align-items: center;

        p {
            width: 12dvw;
        }

        input {
            height: 4dvh;
            border-radius: 5px;
            border: 1px solid gray;
            width: 16.5dvw;
        }
    }

    .amountDetail {
        border: 1px solid rgb(213, 212, 212);
        color: gray;
        font-weight: 600;
        margin: 0 0.5dvw;

        .amountDetailShow {
            width: 100%;
            font-size: 1.8dvh;
            text-align: center;
            padding: 1dvh 0;
            border-bottom: 1px solid rgb(213, 212, 212);
        }

        .amountShow {
            display: flex;

            .amountShowLeft {
                width: 50%;

                .amountShowLeftTotal {
                    padding: 0 1dvw;
                    width: 100%;

                    .totalAreaAmount {
                        text-align: right;
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
                        text-align: right;
                        font-size: 5dvh;
                    }

                    #changeAmount {
                        color: black;
                    }
                }
            }

            .amountShowRight {
                width: 50%;

                .amountShowRightRealCharge {
                    padding: 0 1dvw;
                    width: 100%;

                    .realChargeAreaAmount {
                        text-align: right;
                        font-size: 5dvh;
                    }

                    #realChargeAmount {
                        color: black;
                    }
                }

                .ntTextAera {
                    font-size: 2.5dvh;
                }

                .amountShowRightNotyet {
                    .notyetChargeAreaAmount {
                        text-align: right;
                        font-size: 5dvh;

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