<script>
import { useBillstore } from '@/stores/BillStore';
export default {
    setup() {
        const Billstore = useBillstore();
        return { Billstore };
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
            <li>桌號：{{ Billstore.table_num }}</li>
            <li>點餐內容：{{ Billstore.order_detail }}</li>
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
    height: 100%;
    top: 8dvh;
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
        justify-content: right;

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
