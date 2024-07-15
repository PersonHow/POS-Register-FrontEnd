<script>
import { onMounted, ref, computed } from 'vue';
import { useBillstore } from '@/stores/BillStore';
import { RouterLink } from 'vue-router';
export default {
    setup() {
        const Billstore = useBillstore();
        const visibleBillsCount = ref(5);
        const hasMoreBills = ref(true);

        onMounted(async () => {
            await Billstore.getAllBillsAndTodayBills()
            await Billstore.getChargedOrders();

            if (Billstore.todayCreateBillsOrderId.length <= 5) {
                hasMoreBills.value = false;
            }
        });

        const showMoreBills = () => {
            if (visibleBillsCount.value >= Billstore.allbills.length) {
                hasMoreBills.value = false; // 没有更多紀錄
            } else {
                visibleBillsCount.value += 5; // 每次點增加5個紀錄
                if (visibleBillsCount.value >= Billstore.allbills.length) {
                    hasMoreBills.value = false; // 更新成沒有更多紀錄
                }
            }
        };

        const visibleBills = computed(() => {
            return Billstore.chargedTodayBills.slice(0, visibleBillsCount.value).reverse();
        });

        // 用 order_id 取得 Order 的 amount
        const getAmountForOrder = (order_id) => {
            if (!Billstore.todayCreateBillsOrderDetail) return '未有金額';
            const orderDetail = Billstore.todayCreateBillsOrderDetail.find(detail => detail.order_id === order_id);
            return orderDetail ? orderDetail.amount : 'loading';
        };


        return {
            Billstore,
            getAmountForOrder,
            showMoreBills,
            visibleBills,
            hasMoreBills
        };
    },
    data() {
        return {
            showDetail: false,
        }
    }
}
</script>

<template>
    <nav class="navArea" :class="{ active: Billstore.showRightNav }">
        <div>
            <label for="rightBar" class="myMouse" id="closeRightBar">
                <i class="fa-solid fa-xmark fa-2xl"></i>
            </label>
        </div>
        <ul>
            <div class="invoiceHistoryFunArea">
                <li>當天結帳紀錄</li>
                <button @click="showMoreBills" v-if="hasMoreBills">查看更多</button>
                <span v-if="!hasMoreBills">已到最底</span>
            </div>
            <div class="lastFiveBillArea">
                <ul>
                    <li id="eachBillInfo" v-for="bill in visibleBills" :key="bill.bill_id">
                    <li id="inputLabelArea"><input type="checkbox" :id="'showBillDetail' + bill.bill_id"
                            v-model="bill.showDetail">
                        <label :for="'showBillDetail' + bill.bill_id"><span>其他內容</span></label>
                    </li>
                    <div id="idAndCreateTimeArea">
                        <p>帳單ID：{{ bill.bill_id }}</p>
                        <p>結帳時間：{{ bill.create_time }}</p>
                    </div>
                    <div>
                        <p>點餐ID：{{ bill.order_id }}</p>
                        <p>總金額：{{ getAmountForOrder(bill.order_id) }}</p>
                    </div>
                    <div>
                        <p>發票號碼：{{ bill.invoice }}</p>
                    </div>
                    <template v-if="bill.showDetail">
                        <div class="showDetailArea">
                            <!-- <p>用餐桌號：{{ Billstore.eachOrderDetail.amount }}</p> -->
                            <p>用餐人數：{{ "待接" }}</p>
                        </div>
                    </template>
                    </li>
                </ul>
            </div>
            <!-- <RouterLink to=""></RouterLink> -->
        </ul>
    </nav>
</template>

<style scoped lang="scss">
.navArea {
    position: fixed;
    height: 83%;
    top: 0;
    width: 40%;
    right: -42%;
    overflow: hidden;
    background: white;
    border-left: 5px solid #00c1ca;
    border-bottom: 5px solid #00c1ca;
    transition: 0.3s ease;
    opacity: 90%;
    z-index: 2;
    padding: 2dvh 2.5dvw;
    overflow: scroll;

    &.active {
        right: 0;
    }

    div {
        display: flex;
        justify-content: right;
        padding-top: 1dvh;

        label {
            width: 8%;
            height: 30px;
            display: flex !important;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: 0.3s ease;
            z-index: 9999;

            i {
                font-size: 2.5em;
            }
        }
    }

    .invoiceHistoryFunArea {
        justify-content: space-between;
        font-size: 2.5dvh;

        a {
            text-decoration: none;
            color: rgb(36, 36, 76);
        }

        span {
            font-size: 2.25dvh;
            color: rgb(178, 31, 31);
            line-height: 3.5dvh;
        }
    }

    .lastFiveBillArea {
        width: 100%;
        justify-content: space-between;

        #eachBillInfo {
            border-top: 1px solid #00c1ca;
        }

        li {

            font-size: 2dvh;
            color: black;

            input {
                // display: flex;
                z-index: -1;
            }

            div {
                justify-content: space-between;
                padding: 0.5dvh 0.5dvw;
            }
        }

        .showDetailArea {
            padding: 0.5dvh 0.5dvw;
        }

    }

    ul {
        width: 100%;

        li {
            list-style-type: none;
            font-size: 2.5dvh;

        }
    }
}
</style>