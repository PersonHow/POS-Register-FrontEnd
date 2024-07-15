<script>
import AddInvoice from '@/components/ChiaoLin/InvoiceCompnents/AddInvoice.vue';
import DeleteInvoice from '@/components/ChiaoLin/InvoiceCompnents/DeleteInvoice.vue';
import SearchInvoice from '@/components/ChiaoLin/InvoiceCompnents/SearchInvoice.vue'
import { useBillstore } from '@/stores/BillStore'
import { mapState, mapActions } from 'pinia';

export default {
    data() {
        return {
        }
    },
    components: {
        AddInvoice,
        DeleteInvoice,
        SearchInvoice,

    },
    setup() {
        const Billstore = useBillstore();
        const updateChangeShow = (value) => {
            Billstore.changeStep(value);
        };
        return {
            Billstore,
            updateChangeShow,
            ...mapState(Billstore, ['showLeftNavArea', 'changeShow']),
            ...mapActions(Billstore, ['showInvoiceLeftNavArea','changeStep',]),
        };
    }
}
</script>

<template>
    <div class="allArea">
        <div class="titleArea">
            <p class="myMouse">發票設定</p>
            <input id="showNav" type="checkbox" v-model="Billstore.showLeftNavArea">
            <label for="showNav" class=" myMouse"><span>導覽列</span></label>
        </div>
        <div class="midArea">
            <div class="leftArea">
                <nav class="navArea" :class="{ active: Billstore.showLeftNavArea }">
                    <div class="noShowIcon">
                        <label for="showNav" class="myMouse">
                            <i class="fa-solid fa-xmark fa-2xl"></i>
                        </label>
                    </div>
                    <ul>
                        <li class="myMouse" @click="updateChangeShow('A')">搜 尋</li>
                        <li class="myMouse" @click="updateChangeShow('B')">新增發票</li>
                        <li class="myMouse" @click="updateChangeShow('C')">作廢發票</li>
                    </ul>
                </nav>
            </div>
            <div class="showChangeArea">
                <SearchInvoice v-if="Billstore.changeShow === 'A'"></SearchInvoice>
                <AddInvoice v-else-if="Billstore.changeShow === 'B'"></AddInvoice>
                <DeleteInvoice v-else-if="Billstore.changeShow === 'C'"></DeleteInvoice>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&family=Noto+Sans+TC:wght@100..900&display=swap');

.allArea {
    font-family: "Chocolate Classical Sans", sans-serif;

    .titleArea {
        height: 10dvh;
        line-height: 10dvh;
        background: linear-gradient(90deg, #00c1ca, #01e1c5);
        color: #fff;
        padding: 0 3dvw;
        font-size: 2.5dvh;
        display: flex;
        justify-content: space-between;

        input {
            z-index: -1;
        }
    }

    .midArea {
        display: flex;

        .navArea {
            font-family: "Chocolate Classical Sans", sans-serif;
            position: fixed;
            height: 91%;
            top: 10dvh;
            width: 25%;
            left: -27%;
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

            .noShowIcon {
                justify-content: right;
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

        .showChangeArea {
            width: 70%;
            height: 30dvh;
        }
    }
}
</style>
