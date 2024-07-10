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
    <nav class="navArea" :class="{ active: Billstore.showRightNav }">
        <div>
            <label for="leftBar" class="myMouse">
                <i class="fa-solid fa-xmark fa-2xl"></i>
            </label>
        </div>
        <ul>
            <li><a href="">發票號碼設定</a></li>
            <li>查詢歷史結帳
                <!-- <RouterLink to=""></RouterLink> -->
            </li>
            <li><a href=""></a></li>
        </ul>
    </nav>
</template>

<style scoped lang="scss">
.navArea {
    position: fixed;
    height: 85%;
    top: 0;
    width: 35%;
    right: -37%;
    overflow: hidden;
    background: white;
    border-left: 5px solid #00c1ca;
    border-bottom: 5px solid #00c1ca;
    transition: 0.3s ease;
    opacity: 90%;
    z-index: 2;
    padding: 2dvh 2dvw;
    &.active {
        right: 0;
    }

    div {
        display: flex;
        justify-content: right;
        padding-top: 2dvh;
        padding-right: 2dvw;

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
            list-style-type:none;
            font-size: 2.5dvh;
            color: black;
        }
    }
}</style>