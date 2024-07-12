<script>
export default {
    data() {
        return {
            order_amount: null,
            serviceFee: 10,
            entertain: 0,
            discount: 0,
            allowance: 0,
            orderAmountText: "訂單金額",
            serviceText: "服務費",
            entertainText: "招待",
            discountText: "折扣",
            allowanceText: "折讓",
            displayVal: null,
            focusedInput: null,
            newInputType: '',
            inputEvent: this.getInputEvents(), // 從 localStorage 獲取輸入項目
            noShow: false,
        }
    },
    methods: {
        addToDisplay(value) {
            // 若當下點選輸入框值為 0 則清空
            if (this.focusedInput.value == 0) {
                this.focusedInput.value = "";
            }
            // 若當下點選輸入框有值，則在後方添加新數字
            if (this.focusedInput) {
                this.focusedInput.value += value;
                this.updateValue(this.focusedInput);
            }
        },
        // 更正 -> 清空計算機
        clearDisplay() {
            if (this.focusedInput) {
                this.focusedInput.value = '';
                this.updateValue(this.focusedInput);
            }
        },
        // 修正 -> 刪除最後一位數字
        backspace() {
            // 檢查是否有當下點擊的輸入框
            if (this.focusedInput) {
                let value = this.focusedInput.value // 取得當下點擊的輸入框值
                this.focusedInput.value = value.slice(0, -1); // 刪除輸入框值的最後一個字
                if (this.focusedInput.value === "") { // 如果輸入框值為空，預設回 "0"
                    this.focusedInput.value = "0";
                }
                this.updateValue(this.focusedInput);
            } else {
                let lengthOfDisplayVal = this.displayVal.length; // 取得 displayVal 的當前值長度
                this.displayVal = this.displayVal.slice(0, lengthOfDisplayVal - 1); // 刪除 displayVal 的最後一個字
                if (this.displayVal === "") {
                    this.displayVal = "0";
                }
            }
        },
        // 當下所點選的輸入框
        setFocusedInput(input) {
            this.focusedInput = input;
        },
        updateValue(input) {
            // 根據 inputEvent 陣列中找名稱與 input 名稱相同的 event
            const event = this.inputEvent.find(event => event.type === input.name);
            if (event) {
                // 如果找到相對應的 event ，則更新該項目的值
                event.value = parseFloat(input.value) || 0;
            } else {
                // 如果沒有找到相對應的 event，則將值更新到對應的固定數據屬性中
                this[input.name] = parseFloat(input.value) || 0;
            }
        },
        // 新增其他付款方式
        addInputEvent() {
            if (this.newInputEvent.trim() != '') {
                this.inputEvent.push({ type: this.newInputEvent.trim(), value: 0 });
                this.newInputEvent = '';
            }
        },
        // 刪除該付款方式
        removeInputEvent(index) {
            this.inputEvent.splice(index, 1);
        },
        // 千分位符號
        tothousendShowValue(value) {
            if (value != null) {
                return parseFloat(value).toLocaleString();
            }
            return '0';
        },
        getInputEvents() {
            // 從 localStorage 獲取 inputEvent
            const events = localStorage.getItem('inputEvent');
            return events ? JSON.parse(events) : [
                { type: '信用卡', value: 0 },
                { type: '現金', value: 0 }
            ];
        },
        saveInputEvents() {
            // 保存 inputEvent 到 localStorage
            localStorage.setItem('inputEvent', JSON.stringify(this.inputEvent));
        }
    },
    computed: {
        totalAmount() {
            const discountPersent = (100 - this.discount) / 100;
            const servicePersent = (100 + this.serviceFee) / 100;
            return (
                this.order_amount * discountPersent * servicePersent -
                this.entertain -
                this.allowance
            ).toFixed(2);
        },
        // 計算機找零
        changeAmount() {
            return (
                this.realChargeAmount - this.totalAmount
            ).toFixed(2);
        },
        // 計算機實收
        realChargeAmount() {
            // 使用 reduce 方法對 inputEvent 數組中的所有項目進行累加計算
            // reduce: 對數組中的每個元素執行一次提供的函數（在這裡是 (total, event) => total + event.value），將其結果累積起來，最終返回單個值
            // (total, event) => total + event.value: 累加器函數，total 是累加器，event 是當前數組元素。該函數將當前元素的 value 加到累加器上。
            // 0: reduce 方法的初始值，即 total 的初始值。
            return (
                this.inputEvent.reduce((total, event) => total + event.value, 0));
        },
        // 計算機未收
        notyetChargeAmount() {
            if (this.totalAmount > this.realChargeAmount) {
                return (
                    this.totalAmount - this.realChargeAmount
                ).toFixed(2);
            } else {
                return 0;
            }
        },
        discountAmount() {
            return (this.order_amount * this.discount / 100);
        },
        serviceAmount() {
            return (this.order_amount * (this.serviceFee / 100));
        },
    },
    watch: {
        // 監聽屬性變化
        serviceFee: 'updateTotalAmount',
        entertain: 'updateTotalAmount',
        discount: 'updateTotalAmount',
        allowance: 'updateTotalAmount',
    }
}

</script>

<template>
    <div class="midArea">
        <div class="leftArea">
            <div class="showOrderId">
                <!-- order_id & 功能 -->
                <div>單號</div>
                <div>{{ order_id }}</div>
                <button class="spaceArea"></button>
                <!-- <input type="checkbox" id="leftBar"> -->
                <label for="leftBar" class="bars myMouse"><i class="fa-solid fa-bars fa-xl"></i></label>
            </div>
            
            <div class="billDetailTextArea">
                <p>結帳明細</p>
            </div>
            <div class="billdetail">
                <p>{{ orderAmountText }}&nbsp;</p>
                <div class="inputAera"><input type="text" v-model="this.order_amount"></div>
                <p>{{ discountText }}&nbsp;</p>
                <div class="inputAera"><input type="text" v-model="this.discount"
                        @focus="setFocusedInput($event.target)" name="discount"><span>%</span></div>
                <p>{{ serviceText }}&nbsp;</p>
                <div class="inputAera"><input type="text" v-model="this.serviceFee"
                        @focus="setFocusedInput($event.target)" name="serviceFee"><span>%</span></div>
                <p>{{ entertainText }}&nbsp;</p>
                <div class="inputAera"><input type="text" v-model="this.entertain"
                        @focus="setFocusedInput($event.target)" name="entertain"></div>
                <p>{{ allowanceText }}&nbsp;</p>
                <div class="inputAera" style="border-bottom: thick double rgb(213, 212, 212);"><input type="text"
                        v-model="this.allowance" @focus="setFocusedInput($event.target)" name="allowance"></div>
                <div class="inputEventArea" v-for="(event, index) in inputEvent" :key="index">
                    <p>{{ event.type }}&nbsp; <button class="myMouse" @click="removeInputEvent(index)"><i
                                class="fa-solid fa-circle-minus fa-lg" style="color: #b00000;"></i></button></p>
                    <div class="inputAera"><input type="text" v-model="event.value"
                            @focus="setFocusedInput($event.target)" :name="event.type">
                    </div>
                </div>
                <div class="inputAera addInputEventsArea">
                    <input type="text" id="addInputEvents" v-model="newInputEvent" placeholder="請輸入項目名稱">
                    <button type="button" id="addDetail" @click="addInputEvent" class="myMouse"><i
                            class="fa-solid fa-circle-plus fa-xl"></i></button>
                </div>
            </div>
        </div>

        <div class="rightArea">
            <div class="showInvoiceNum">
                <span>發票號碼</span>
            </div>
            <div class="amountDetail">
                <div class="amountDetailShow"><span>總計 NT.{{ tothousendShowValue(order_amount) }} * {{ discountText }}{{
                    this.discount
                        }}%(NT.{{ this.discountAmount }}) * {{ serviceText }}{{
                            this.serviceFee }}%(NT.{{ this.serviceAmount }}) </span>
                    <p>- {{ entertainText }}NT.{{ tothousendShowValue(this.entertain) }} -
                        {{ allowanceText }}NT.{{
                            tothousendShowValue(this.allowance)
                        }}</p>
                </div>
                <div class="amountShow">
                    <div class="amountShowLeft">
                        <div class="amountShowLeftTotal">
                            <div class="totalAreaText">
                                <span>總金額</span>
                            </div>
                            <div class="ntTextAera"> <span id="ntText">NT.</span></div>
                            <div class="totalAreaAmount">
                                <span id="totalAmount">{{ tothousendShowValue(totalAmount) }}</span>
                            </div>
                        </div>
                        <!-- 找零 -->
                        <div class="amountShowLeftChange">
                            <div class="changeAreaText">
                                <span>找零</span>
                            </div>
                            <div class="ntTextAera"> <span id="ntText">NT.</span></div>
                            <div class="changeAreaAmount">
                                <span id="changeAmount">{{ tothousendShowValue(changeAmount) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="amountShowRight">
                        <div class="amountShowRightRealCharge">
                            <!-- 實收 -->
                            <div class="realChargeAreaText">
                                <span>實收</span>
                            </div>
                            <div class="ntTextAera"> <span id="ntText">NT.</span></div>
                            <div class="realChargeAreaAmount">
                                <span id="realChargeAmount">{{ tothousendShowValue(realChargeAmount) }}</span>
                            </div>
                            <div class="amountShowRightNotyet">
                                <!-- 未收 -->
                                <div class="notyetChargeAreaText">
                                    <p>未收</p>
                                </div>
                                <div class="ntTextAera"> <span id="ntText">NT.</span></div>
                                <div class="notyetChargeAreaAmount">
                                    <span id="notyetChargeAmount">{{ tothousendShowValue(notyetChargeAmount) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 計算機 -->
            <div class="calculator">
                <div class="mathbutArea">
                    <div class="mathBut but1"><input type="button" value="1" @click="addToDisplay('1')"></div>
                    <div class="mathBut but2"><input type="button" value="2" @click="addToDisplay('2')"></div>
                    <div class="mathBut but3"><input type="button" value="3" @click="addToDisplay('3')"></div>
                    <div class="mathBut but4"><input type="button" value="4" @click="addToDisplay('4')"></div>
                    <div class="mathBut but5"><input type="button" value="5" @click="addToDisplay('5')"></div>
                    <div class="mathBut but6"><input type="button" value="6" @click="addToDisplay('6')"></div>
                    <div class="mathBut but7"><input type="button" value="7" @click="addToDisplay('7')"></div>
                    <div class="mathBut but8"><input type="button" value="8" @click="addToDisplay('8')"></div>
                    <div class="mathBut but9"><input type="button" value="9" @click="addToDisplay('9')"></div>
                    <div class="mathBut but0"><input type="button" value="0" @click="addToDisplay('0')"></div>
                    <div class="mathBut but00"><input type="button" value="00" @click="addToDisplay('00')"></div>
                    <div class="mathBut but."><input type="button" value="." @click="addToDisplay('.')"></div>
                </div>
                <div class="otherButArea">
                    <div class="mathBut butbackspace"><input type="button" value="＜＜" @click="backspace()"
                            id="butbackspace"></div>
                    <div class="mathBut butRevise"><input type="button" value="更正" @click="clearDisplay()"
                            id="butRevise">
                    </div>
                    <div class="mathBut butComfirm"><input type="button" value="確定" @click="" id="butComfirm"></div>
                </div>
            </div>
            <div class="functionButArea">
                <button type="button" class="comeback myMouse">返回</button>
                <button class="spaceArea"></button>
                <button type="button" class="manualInvoice myMouse">手開發票</button>
                <button type="button" class="bars myMouse"><i class="fa-solid fa-bars fa-xl"></i></button>
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&family=Noto+Sans+TC:wght@100..900&display=swap');

.midArea {
    display: flex;
    font-family: "Chocolate Classical Sans", sans-serif;

    .leftArea {
        width: 50%;

        .billDetailTextArea {
            margin: 2dvh 0;
            margin-top: 4dvh;
            padding-left: 2dvw;

            p {
                color: gray;
                font-size: 2dvh;
            }
        }

        .showOrderId {
            display: flex;
            height: 8dvh;
            background: linear-gradient(90deg, #00c1ca, #01e1c5);
            color: white;
            line-height: 8dvh;
            padding-left: 2dvw;

            button {
                border: none;
                background: none;
                color: white;
            }

            .spaceArea {
                width: 85%;
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
                height: 5dvh;
                margin-left: 1dvw;
                font-size: 2dvh;
                padding-top: 1dvh
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

    .rightArea {
        width: 50%;
        padding: 0 1dvw;

        .showInvoiceNum {
            height: 8dvh;
            line-height: 7dvh;
            padding-left: 1dvw;
            color: gray;
            font-weight: 600;

            button {
                width: 5dvw;
                border: none;
                background: none;
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

        .calculator {
            width: 100%;
            display: flex;
            padding-top: 3dvh;
            justify-content: space-between;
            margin-left: 0.5dvw;

            .mathbutArea {
                width: 80%;
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

        .functionButArea {
            width: 100%;
            height: 7dvh;
            line-height: 7dvh;
            background: linear-gradient(90deg, #00c1ca, #01e1c5);
            color: #fff;
            border-radius: 10px;
            padding-left: 1dvw;
            margin-top: 1dvh;

            button {
                border: none;
                background: none;
                color: white;
                font-family: "Chocolate Classical Sans", sans-serif;
                font-size: 2dvh;
                padding-left: 2dvw;
            }

            .spaceArea {
                width: 60%;
            }
        }
    }
}
</style>
