<script>
import { useBillstore } from '@/stores/BillStore';
import { useOrderStore } from '@/stores/OrderStore';
import { mapState, mapActions } from 'pinia';
import { computed } from 'vue';
export default {
    setup() {
        const Billstore = useBillstore();
        const OrderStore = useOrderStore();
        // 取得 order_info 內容
        const orderInfo = computed(() => OrderStore.order_info);

        return {
            Billstore,
            OrderStore,
            orderInfo,
        };

    },
}
</script>

<template>
    <nav class="navArea" :class="{ active: Billstore.showOrderArea }">
        <div>
            <label for="noShowOrder" class="myMouse">
                <i class="fa-solid fa-xmark fa-2xl"></i>
            </label>
        </div>
        <ul>
            <li v-for="(order, index) in orderInfo" :key="index">
                <div>桌號：{{ order.table_num }}</div>
                <div>用餐人數：{{ order.guest_num }}</div>
                <div>點餐內容：</div>
                <ul>
                    <li v-for="(detail, detailIndex) in order.order_detail" :key="detailIndex">
                        {{ detail }}</li>
                </ul>
            </li>
            <button class="myMouse">列印</button>
            <button class="myMouse">編輯</button>
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
    overflow: hidden;
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

    ul {
        li {
            list-style-type: none;
            font-size: 2.5dvh;
            color: black;
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
