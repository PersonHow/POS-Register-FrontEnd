<script>
import { useBillstore } from '@/stores/BillStore';
import { useOrderStore } from '@/stores/OrderStore';
import { mapState, mapActions } from 'pinia';
export default {
    setup() {
        const Billstore = useBillstore();
        const OrderStore = useOrderStore();

        return {
            Billstore,
            OrderStore,
            ...mapState(Billstore, ['OrderDB']),
        };
    },
    data() {
        return {
        }
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
                    console.log(this.OrderDB)
                })
        } else {
            console.error("Wrong oId!")
        }

    },
}
</script>

<template>
    <nav class="navArea" :class="{ active: Billstore.showOrderArea }">
        <div class="noShowIcon">
            <label for="noShowOrder" class="myMouse">
                <i class="fa-solid fa-xmark fa-2xl"></i>
            </label>
        </div>
        <ul>
            <li>
                <div class="tableAndGuestNum">
                    <p v-if="this.OrderDB.table_num !== null">桌號：{{ this.OrderDB.table_num }}</p>
                    <p v-else><span><</span>外帶單></p>
                    <p>人數：{{ this.OrderDB.guest_num }}</p>
                </div>
                <div>用餐金額：{{ this.OrderDB.amount }}</div>

                <div>點餐內容：</div>
                <ul v-for="(mealList, index) in this.OrderDB.order_detail" :key="index">
                    <li>{{ index + 1 }}.</li>
                    <li>
                        <p> {{ mealList.meal_name }}</p>
                        <p>數量：{{ mealList.quantities }}</p>
                    </li>
                    <li> {{ mealList.custom_option }}</li>
                    <li> </li>
                </ul>
            </li>
            <button class="myMouse">列印明細</button>
            <button class="myMouse">編&nbsp;&nbsp;&nbsp;輯</button>
        </ul>
    </nav>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&family=Noto+Sans+TC:wght@100..900&display=swap');

.navArea {
    font-family: "Chocolate Classical Sans", sans-serif;
    position: fixed;
    height: 91%;
    top: 9dvh;
    width: 35%;
    left: -37%;
    overflow: scroll;
    background: white;
    border-right: 5px solid #00c1ca;
    transition: 0.3s ease;
    opacity: 90%;
    z-index: 2;
    padding: 2dvh 2dvw;

    &.active {
        left: 0;
    }

    div {
        display: flex;
        justify-content: left;

        label {
            width: 30px;
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

    .noShowIcon {
        justify-content: right;
    }

    ul {
        margin-top: 2dvh;

        li {
            list-style-type: none;
            font-size: 2.5dvh;
            color: black;
            padding: 0 1dvw;


            .tableAndGuestNum {
                padding-right: 5dvw;
                display: flex;
                justify-content: space-between;
            }
        }

        button {
            font-family: "Chocolate Classical Sans", sans-serif;
            font-size: 2.25dvh;
            margin: 0.5dvh 0.5dvw;
            border: none;
            border-radius: 10px;
            background: #00c1ca;
            padding: 0.5dvw;
            color: white;
        }
    }
}
</style>
