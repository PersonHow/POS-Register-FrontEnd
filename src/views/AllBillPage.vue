<script>
import { useBillstore } from '@/stores/BillStore'
import { onMounted, ref, computed } from 'vue';
import { mapState, mapActions } from 'pinia';
import AllBill from '@/components/ChiaoLin/AllBillPageCompnents/AllBill.vue';
import AllInvoice from '@/components/ChiaoLin/AllBillPageCompnents/AllInvoice.vue';

export default {
    components: {
        AllBill,
        AllInvoice
    },
    setup() {
        const Billstore = useBillstore();
        const visibleBillsCount = ref(5);
        const hasMoreBills = ref(true);
        const updateChangeShow = (value) => {
            Billstore.changeStep(value);
        };

        onMounted(async () => {
            await Billstore.getAllBillsAndTodayBills()
            await Billstore.getChargedOrders();

            if (Billstore.todayCreateBillsOrderId.length <= 5) {
                hasMoreBills.value = false;
            }
        });

        onMounted(() => {
            Billstore.isTopBarHidden = true;
        })

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

        return {
            Billstore,
            updateChangeShow,
            showMoreBills,
            visibleBills,
            hasMoreBills,
            ...mapState(Billstore, ['showLeftNavArea', 'changeShow']),
            ...mapActions(Billstore, ['showInvoiceLeftNavArea', 'changeStep', 'closeTopbar',]),
        };
    },
    methods: {
        toggleSidebar() {
            this.isLeftbarHidden = !this.isLeftbarHidden;
        },

    },
    mounted() {
        // fetch("http://localhost:8080/bill", {
        //     method: "get",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(),
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         console.log(data);
        //         this.allbills = data;
        //     })
    },
    data() {
        return {
            isLeftbarHidden: true,
            billList: [],
        }
    },
}
</script>

<template>
    <div class="allArea">
        <div class="titleArea">
            <div class="titleAndButArea">
                <button style="cursor: pointer;" @click="toggleSidebar">
                    <p v-if="!isLeftbarHidden"><i class="fa-solid fa-xmark fa-2xl"></i></p>
                    <p v-else> <i class="fa-solid fa-bars fa-2xl"></i></p>
                </button>
                <p class="myMouse">帳務總覽</p>
            </div>
            <!-- <input id="showNav" type="checkbox" v-model="Billstore.showLeftNavArea">
            <label for="showNav" class=" myMouse"><span>導覽列</span></label> -->
            <div class="butArea">

                <button @click="Billstore.closeTopbar"><i class="fa-solid fa-house-chimney fa-xl"></i></button>
            </div>
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

                        <!-- <li class="myMouse" @click="updateChangeShow('C')">發票重開</li> -->
                    </ul>
                    <ul>
                        <!-- <li class="myMouse" @click="updateChangeShow('B')">發票搜尋</li> -->
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
        // line-height: 9dvh;
        background: linear-gradient(90deg, #00c1ca, #01e1c5);
        border-radius: 5px;
        color: #fff;
        padding: 0 3dvw;
        font-size: 2.5dvh;
        display: flex;
        justify-content: space-between;

        .titleAndButArea{
            display: flex;
            button{
                margin-right: 2dvw
            }
            p{
                line-height: 9dvh;
            }
        }
        .butArea {
            line-height: 9dvh;
        }

        input {
            z-index: -1;
        }

        button {
            font-size: 2dvh;
            background: none;
            border: none;
            color: #fff;
        }
    }

    .midArea {
        display: flex;
        width: 100%;

        .leftArea {
            width: 20%;
            height: 83dvh;
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
                    padding-left: 2dvw;

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

                    input {
                        height: 5dvh;
                        width: 13dvw;
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
