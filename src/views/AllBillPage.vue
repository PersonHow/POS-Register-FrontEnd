<script>
import { useBillstore } from '@/stores/BillStore'
import { mapState, mapActions } from 'pinia';
import AllBill from '@/components/ChiaoLin/AllBillPageCompnents/AllBill.vue';
import AllInvoice from '@/components/ChiaoLin/AllBillPageCompnents/AllInvoice.vue';

export default {
    data() {
        return {
            isLeftbarHidden: false,
        }
    },
    components: {
        AllBill,
        AllInvoice
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
            ...mapActions(Billstore, ['showInvoiceLeftNavArea', 'changeStep',]),
        };
    },
    methods: {
        toggleSidebar() {
            this.isLeftbarHidden = !this.isLeftbarHidden;
        },
    }
}
</script>

<template>
    <div class="allArea">
        <div class="titleArea">
            <p class="myMouse">帳務總覽</p>
            <!-- <input id="showNav" type="checkbox" v-model="Billstore.showLeftNavArea">
            <label for="showNav" class=" myMouse"><span>導覽列</span></label> -->
            <button style="cursor: pointer;" @click="toggleSidebar">
                <p v-if="!isLeftbarHidden"><i class="fa-solid fa-xmark fa-2xl"></i></p>
                <p v-else> <i class="fa-solid fa-bars fa-2xl"></i></p>
            </button>
        </div>
        <div class="midArea">

            <div :class="['leftArea', { hidden: isLeftbarHidden }]">
                <nav class="navArea" :class="{ active: Billstore.showLeftNavArea }">
                    <div class="noShowIcon">
                        <button style="cursor: pointer;" @click="toggleSidebar">
                            <p><i class="fa-solid fa-xmark fa-2xl"></i></p>
                        </button>
                    </div>
                    <ul>
                        <li class="myMouse" @click="updateChangeShow('A')">帳務搜尋</li>
                        <li class="myMouse" @click="updateChangeShow('B')">發票搜尋</li>
                        <!-- <li class="myMouse" @click="updateChangeShow('C')">發票重開</li> -->
                    </ul>
                </nav>
            </div>
            <div :class="['showChangeArea', { expanded: isLeftbarHidden }]">
                <AllBill v-if="Billstore.changeShow === 'A'"></AllBill>
                <AllInvoice v-else-if="Billstore.changeShow === 'B'"></AllInvoice>
                <!-- <DeleteInvoice v-else-if="Billstore.changeShow === 'C'"></DeleteInvoice> -->
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&family=Noto+Sans+TC:wght@100..900&display=swap');

.allArea {
    font-family: "Chocolate Classical Sans", sans-serif;

    .titleArea {
        height: 9dvh;
        line-height: 4dvh;
        background: linear-gradient(90deg, #00c1ca, #01e1c5);
        border-radius: 5px;
        color: #fff;
        padding: 0 3dvw;
        font-size: 2.5dvh;
        display: flex;
        justify-content: space-between;

        input {
            z-index: -1;
        }

        button {
            background: none;
            border: none;
            color: #fff;
        }
    }

    .midArea {
        display: flex;
        width: 100%;

        .leftArea {
            width: 25%;
            transition: width 0.3s ease;
            overflow: hidden;

            &.hidden {
                width: 0;
            }

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
                    padding: 1dvh 2dvw;

                    button {
                        background: none;
                        border: none;
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


        }

        .showChangeArea {
            width: 100%;
            transition: width 0.3s ease;

            &.expanded {
                width: 100%;
            }
        }
    }
}
</style>
