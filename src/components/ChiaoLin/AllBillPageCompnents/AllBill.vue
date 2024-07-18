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
        }
    },
    methods: {
        searchBill() {
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
    }
}
</script>

<template>
    <div class="allBillArea">
        <div class="searchArea">
            <label for="orderSearch">Order Id：</label>
            <p></p>
            <input type="text" id="orderSearch" v-model="this.searchObj.orderId">
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
            <button @click="searchBill()">搜尋</button>
        </div>
        <div class="serchResultArea">
            <thead>
                <tr>
                    <th>序&nbsp;&nbsp;&nbsp;號</th>
                    <th>結帳時間</th>
                    <th>點餐單號</th>
                    <th>已開發票</th>
                    <th>支付方式</th>
                    <th>支付金額</th>
                </tr>
            </thead>
            <tbody>
                <tr  class="content" v-for="(bill, index) in (isSearchActive ? searchList : allbills)" :key="index">
                    <td>{{ index + 1 }}.</td>
                    <td>{{ bill.create_time }}</td>
                    <td>{{ bill.order_id }}</td>
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
        label{
            margin: 0 1dvw;
        }

        input{
            border: 1px solid rgb(152,152, 152);
            border-radius: 5px;
            font-size: 2dvh;
        }
        button{
            margin-left: 1dvw;
            width: 5dvw;
            background: #00c1ca;
            color: white;
            border-radius: 5px;
        }

        .inputDateArea {

            display: flex;
        }
    }
    .serchResultArea{

    }
}
</style>
