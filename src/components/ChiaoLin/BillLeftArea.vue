<script>
export default {
    data() {
        return {
            newInputEvent: ''
        }
    },
    props: [
        'order_id', 'order_amount', 'serviceFee', 'entertain', 'discount', 'allowance',
        'orderAmountText', 'serviceText', 'entertainText', 'discountText', 'allowanceText', 'inputEvent'
    ],
    methods: {
        // 當下所點選的輸入框
        setFocusedInput(input) {
            this.$emit('set-focused-input', input);
        },
        // 刪除該付款方式
        removeInputEvent(index) {
            this.$emit('remove-input-event', index);
        },
        // 新增其他付款方式
        addInputEvent() {
            if (this.newInputEvent.trim() != '') {
                this.$emit('add-input-event', this.newInputEvent.trim());
                this.newInputEvent = '';
            }
        }
    }
}
</script>

<template>
    <div class="leftArea">
        <div class="showOrderId">
            <!-- order_id & 功能 -->
            <div>單號</div>
            <div>{{ order_id }}</div>
            <button class="spaceArea"></button>
            <button type="button" class="bars myMouse"><i class="fa-solid fa-bars fa-xl"></i></button>
        </div>
        <div class="billDetailTextArea">
            <p>結帳明細</p>
        </div>
        <div class="billdetail">
            <p>{{ orderAmountText }}&nbsp;</p>
            <div class="inputAera"><input type="text"></div>
            <p>{{ discountText }}&nbsp;</p>
            <div class="inputAera"><input type="text" v-model="discount" @focus="setFocusedInput($event.target)"
                    name="discount"><span>%</span></div>
            <p>{{ serviceText }}&nbsp;</p>
            <div class="inputAera"><input type="text" v-model="serviceFee" @focus="setFocusedInput($event.target)"
                    name="serviceFee"><span>%</span></div>
            <p>{{ entertainText }}&nbsp;</p>
            <div class="inputAera"><input type="text" v-model="entertain" @focus="setFocusedInput($event.target)"
                    name="entertain"></div>
            <p>{{ allowanceText }}&nbsp;</p>
            <div class="inputAera" style="border-bottom: thick double rgb(213, 212, 212);"><input type="text"
                    v-model="allowance" @focus="setFocusedInput($event.target)" name="allowance"></div>
            <div class="inputEventArea" v-for="(event, index) in inputEvent" :key="index">
                <p>{{ event.type }}&nbsp; <button class="myMouse" @click="removeInputEvent(index)"><i
                            class="fa-solid fa-circle-minus fa-lg" style="color: #b00000;"></i></button></p>
                <div class="inputAera"><input type="text" v-model="event.value" @focus="setFocusedInput($event.target)"
                        :name="event.type">
                </div>
            </div>
            <div class="inputAera">
                <input type="text" v-model="newInputEvent" placeholder="請輸入項目名稱">
                <button type="button" id="addDetail" @click="addInputEvent" class="myMouse"><i
                        class="fa-solid fa-circle-plus fa-2xl"></i></button>
            </div>
        </div>
    </div>
</template>



<style lang="scss"scoped>
.leftArea {
    width: 50%;

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

    .billDetailTextArea {
        margin: 2dvh 0;
        margin-top: 4dvh;
        padding-left: 2dvw;

        p {
            color: gray;
            font-size: 2dvh;
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
