<script>
import { useBillstore } from '@/stores/BillStore'
import { mapState, mapActions } from 'pinia';
export default {
    setup() {
        const Billstore = useBillstore();

        return {
            Billstore,
            // ...mapState(Billstore, ['todayCreateBills', 'allbills']),
            // ...mapActions(Billstore, ['showInvoiceLeftNavArea', 'changeStep',]),
        };

    },
    data() {
        return {
            paymentList: [],
            searchObj: {
                orderId: "",
                createTime1: "",
                createTime2: "",
            },
            allbills: [],
            searchList: [],
            isSearchActive: false,  // 增加狀態標誌來決定顯示內容
            sortColumn: '',
            sortOrder: 'asc',
        }
    },
    methods: {
        searchBill() {
            if(this.searchObj.orderId !== null){
                this.searchObj.createTime1 = "";
                this.searchObj.createTime2 = "";
            }
            fetch("http://localhost:8080/bill/search", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.searchObj)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    this.searchList = data
                    // 設置狀態標誌為 true
                    this.isSearchActive = true;
                }).catch(error => {
                    console.error("Error:", error);
                })
        }
    },
    mounted() {
        fetch("http://localhost:8080/bill", {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                this.allbills = data;
            })
    },
    computed:{
        
    }
}
</script>

<template>
    <div class="allBillArea">
        <div class="searchArea">
            <label for="orderSearch">點餐單號：</label>
            <input type="text" id="orderSearch" v-model="this.searchObj.orderId">
            <!-- <button class="searchBtn"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /></button> -->
            <p></p>
            <div class="inputDateArea">
                <label for="startDate">起始日：</label>
                <p></p>
                <input type="date" id="startDate" v-model="this.searchObj.createTime1">
                <p></p>
                <label for="endDate">結束日：</label>
                <p></p>
                <input type="date" id="endDate" v-model="this.searchObj.createTime2">
                <p></p>
            </div>
            <button @click="searchBill()"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /></button>
        </div>
        <div class="serchResultArea">
            <thead>
                <tr>
                    <th @click="sortTable('index')" :class="{ active: sortColumn === 'index' }">
                        序號
                        <span class="icon-arrow" :class="{
                            asc: sortColumn === 'index' && sortOrder === 'asc',
                            desc: sortColumn === 'index' && sortOrder === 'desc',
                        }">
                            &UpArrow;
                        </span>
                    </th>
                    <th @click="sortTable('createTime')" :class="{ active: sortColumn === 'createTime' }">
                        結帳時間
                        <span class="icon-arrow" :class="{
                            asc: sortColumn === 'createTime' && sortOrder === 'asc',
                            desc: sortColumn === 'createTime' && sortOrder === 'desc',
                        }">
                            &UpArrow;
                        </span>
                    </th>
                    <th @click="sortTable('orderId')" :class="{ active: sortColumn === 'orderId' }">
                        點餐單號
                        <span class="icon-arrow" :class="{
                            asc: sortColumn === 'orderId' && sortOrder === 'asc',
                            desc: sortColumn === 'orderId' && sortOrder === 'desc',
                        }">
                            &UpArrow;
                        </span>
                    </th>
                    <th @click="sortTable('invoice')" :class="{ active: sortColumn === 'invoice' }">
                        已開發票
                        <span class="icon-arrow" :class="{
                            asc: sortColumn === 'invoice' && sortOrder === 'asc',
                            desc: sortColumn === 'invoice' && sortOrder === 'desc',
                        }">
                            &UpArrow;
                        </span>
                    </th>
                    <th @click="sortTable('memo')" :class="{ active: sortColumn === 'memo' }">
                        支付方式
                        <span class="icon-arrow" :class="{
                            asc: sortColumn === 'memo' && sortOrder === 'asc',
                            desc: sortColumn === 'memo' && sortOrder === 'desc',
                        }">
                            &UpArrow;
                        </span>
                    </th>
                    <th @click="sortTable('payment_total')" :class="{ active: sortColumn === 'payment_total' }">
                        支付金額
                        <span class="icon-arrow" :class="{
                            asc: sortColumn === 'payment_total' && sortOrder === 'asc',
                            desc: sortColumn === 'payment_total' && sortOrder === 'desc',
                        }">
                            &UpArrow;
                        </span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="content" v-for="(bill, index) in (isSearchActive ? searchList : allbills)" :key="index">
                    <td>{{ index + 1 }}.</td>
                    <td>{{ bill.createTime }}</td>
                    <td>{{ bill.orderId }}</td>
                    <td>{{ bill.invoice }}</td>
                    <td>{{ '現金；信用卡；' }}{{ bill.memo }}</td>
                    <td>{{ bill.payment_cash }}；
                        {{ bill.payment_credit }}；
                        {{ bill.payment_other }}
                    </td>
                </tr>
            </tbody>
        </div>
    </div>
</template>

<style scoped lang="scss">
.allBillArea {
    padding: 1dvw;

    .searchArea {
        width: 100%;
        display: flex;
        font-size: 2dvh;

        label {
            margin: 0 1dvw;
        }

        input {
            border: 1px solid rgb(152, 152, 152);
            border-radius: 5px;
            font-size: 2dvh;
        }

        button {
            margin-left: 1dvw;
            width: 5dvw;
            background: #00c1ca;
            color: white;
            border-radius: 5px;
            border: none;
        }

        .inputDateArea {

            display: flex;
        }

        .short {
            width: 30%;
            border-radius: 50px;

        }
    }

    .serchResultArea {
        width: 95%;
        max-height: calc(89% - 1.6rem);
        background-color: #ffffff;
        margin: 0.8rem auto;
        border-radius: 5px;
        border: none;
        overflow: auto;
        font-size: 1.8dvh;

        td{
            text-align: center;
            padding: 0 1dvw;
        }
        th {
            position: sticky;
            top: 0;
            left: 0;
            color: black;
            padding: 1dvw;
            cursor: pointer;
        }

        tbody tr:nth-child(even) {
            background-color: #f5f5f5;
        }

        tbody tr:hover {
            background-color: #f0f0f0;
        }

        button {
            outline: none;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            padding: 10px;
            color: #ffffff;
        }
    }
}
</style>
