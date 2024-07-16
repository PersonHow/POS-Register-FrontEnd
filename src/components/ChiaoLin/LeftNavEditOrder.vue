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
    mounted() {
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
                    this.Billstore.OrderDB = data;
                    console.log(this.Billstore.OrderDB)
                })
        } else {
            console.error("Wrong oId!")
        }

    },
}
</script>

<template>
    <nav class="navArea" :class="{ active: Billstore.showOrderArea }">
        <!-- <div class="noShowIcon">
            <label for="noShowOrder" class="myMouse">
                <i class="fa-solid fa-xmark fa-2xl"></i>
            </label>
        </div> -->
        <ul>
            <li>
                <div class="tableAndGuestNum">
                    <p v-if="this.Billstore.OrderDB.table_num !== null">桌號：{{ Billstore.OrderDB.table_num }}</p>
                    <p v-else>
                    <p><span>
                            <</span>外帶單></p>
                    </p>
                    
                </div>
                <div><p>人數：{{ Billstore.OrderDB.guest_num }}</p></div>
                <div>用餐金額：{{ Billstore.OrderDB.amount }}</div>

                <div>點餐內容：</div>
                <ul v-for="(mealList, index) in Billstore.OrderDB.order_detail" :key="index">
                    <li><span>({{ index + 1 }})</span>&nbsp;

                        <span> {{ mealList.meal_name }}</span>
                        <p>數量：{{ mealList.quantities }}</p>
                    </li>
                    <li v-if="mealList.custom_option === null"> {{ mealList.custom_option }}</li>
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
    height: 100%;
    background: white;
    border-right: 5px solid #00c1ca;
    transition: 0.3s ease;
    opacity: 90%;


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
        padding-left: 1dvw;

        li {
            list-style-type: none;
            font-size: 2.25dvh;
            color: black;
            margin: 1dvh 0;

            div {
                margin: 0.5dvh 0;
                .tableAndGuestNum{
                        overflow: hidden;
                }
            }

            p {
                margin: 0;
            }
        }

        button {
            font-family: "Chocolate Classical Sans", sans-serif;
            font-size: 2.25dvh;
            margin: 0.5dvh 0.5dvw;
            border: none;
            cursor: pointer;
            border-radius: 10px;
            background: #00c1ca;
            padding: 0.5dvw;
            color: white;
            transition: transform 0.3s;
            &.active{
                transform: scale(1.2);
            }
        }
    }
}
</style>
