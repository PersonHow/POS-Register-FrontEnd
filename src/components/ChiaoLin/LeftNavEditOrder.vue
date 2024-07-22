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
    data() {
        return {
            mealDetailfromDB: [],
            deleteOptionIcon: false,
            printDetail: false
        }
    },
    methods: {
        deleteOption(mealList, option) {
            const optionsArray = mealList.custom_option.split(';');
            const optionIndex = optionsArray.indexOf(option);
            if (optionIndex !== -1) {
                optionsArray.splice(optionIndex, 1);
                mealList.custom_option = optionsArray.join(';');
            }
        },
        showDeleteOptionBut() {
            this.deleteOptionIcon = !this.deleteOptionIcon
        },
        printDetailBut() {
            this.printDetail = true;
            this.autoClosePrintBox();
        },
        updateQuantity(mealList, change) {
            const newQuantity = mealList.quantities + change;
            if (newQuantity >= 0) {
                mealList.quantities = newQuantity;
            }
        },
        autoClosePrintBox(){
            setTimeout(() => {
                this.printDetail = false;
            }, 1000); // 1秒後自動關閉
        }
    }
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
            <li>桌號：{{ Billstore.table_num }}</li>
            <li>點餐內容：{{ Billstore.order_detail }}</li>
            <button>列印</button>
            <button>編輯</button>
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
    padding-top: 0.5dvh;


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
        padding: 0 1dvw;

        li {
            list-style-type: none;
            font-size: 2.25dvh;
            color: black;

        }

        button {
            font-family: "Chocolate Classical Sans", sans-serif;
            font-size: 2.5dvh;
            margin: 0.5dvh 0.5dvw;
        }
    }
}
</style>
