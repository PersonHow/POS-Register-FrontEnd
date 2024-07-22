<script>
import { useBillstore } from '@/stores/BillStore'
import { mapState } from 'pinia';

export default {
    setup() {
        const Billstore = useBillstore();

        return {
            Billstore,
            ...mapState(Billstore, ['inputEvent']),
        };
    },
    data() {
        return {
            paymentList: [],
            searchObj: {
                orderId: "", // 預設空字串
                invoiceNum:"", // 預設空字串
                createTime1: "",
                createTime2: "",
            },
            allbills: [],
            searchList: [],
            isSearchActive: false,
            focusColumn: '',
            sortOrder: 'asc',
            searchResultList: []
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
                    console.log(data);
                    this.searchList = data.reverse();
                    this.isSearchActive = true;
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        },
        sortColumnWay(column) {
            // if 點擊排序為此列
            if (this.focusColumn === column) {
                // 切換排序 asc => desc，desc => asc
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.focusColumn = column;
                this.sortOrder = 'asc';
            }
        },
        sortClassWay(column) {
            return {
                asc: this.focusColumn === column && this.sortOrder === 'asc',
                desc: this.focusColumn === column && this.sortOrder === 'desc'
            };
        },
    },
    computed: {
        sortedBills() {
            const bills = this.isSearchActive ? this.searchList : this.allbills;
            return bills.slice().sort((a, b) => {
                let modifier = 1;
                if (this.sortOrder === 'desc') modifier = -1;
                if (a[this.focusColumn] < b[this.focusColumn]) return -1 * modifier;
                if (a[this.focusColumn] > b[this.focusColumn]) return 1 * modifier;
                return 0;
            });
        },
        // 月曆選擇器早於start_date灰階不可選
        minEndDate() {
            const minDay = this.searchObj.createTime1;
            return minDay;
        }
    },
    mounted() {
        fetch("http://localhost:8080/bill", {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                this.allbills = data.reverse();
            });
    }
}
</script>


<template>
    <div class="allBillArea">
        <div class="searchArea">
            <label for="orderSearch">點餐單號：</label>
            <input type="text" id="orderSearch" v-model="searchObj.orderId">
            <label for="invoiceSearch">發票號碼：</label>
            <input type="text" id="invoiceSearch" v-model="searchObj.invoice">
            <p></p>
            <div class="inputDateArea">
                <label for="startDate">起始日：</label>
                <p></p>
                <input type="date" id="startDate" v-model="searchObj.createTime1">
                <p></p>
                <label for="endDate">結束日：</label>
                <p></p>
                <input type="date" id="endDate" v-model="searchObj.createTime2" :min="minEndDate">
                <p></p>
            </div>
            <button @click="searchBill()">
                <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            </button>
        </div>

        <div class="serchResultArea">
            <table >
                <thead >
                    <tr>
                        <th >
                            序號
                            <!-- <span class="icon-arrow" :class="sortClassWay('index')">&UpArrow;</span> -->
                            <!-- <span v-if="focusColumn === 'index' && sortOrder === 'desc'" class="icon-arrow" :class="sortClassWay('index')">&DownArrow;</span> -->
                        </th>
                        <th @click="sortColumnWay('createTime')" :class="{ active: focusColumn === 'createTime' }">
                            結帳時間
                            <span v-if="focusColumn === 'createTime' && sortOrder === 'asc'" class="icon-arrow" :class="sortClassWay('createTime')">&UpArrow;</span>
                            <span v-else="focusColumn === 'createTime' && sortOrder === 'desc'" class="icon-arrow" :class="sortClassWay('createTime')">&DownArrow;</span>
                        </th>
                        <th @click="sortColumnWay('orderId')" :class="{ active: focusColumn === 'orderId' }">
                            點餐單號
                            <span v-if="focusColumn === 'orderId' && sortOrder === 'asc'" class="icon-arrow" :class="sortClassWay('orderId')">&UpArrow;</span>
                            <span v-else="focusColumn === 'orderId' && sortOrder === 'desc'" class="icon-arrow" :class="sortClassWay('orderId')">&DownArrow;</span>
                        </th>
                        <th>
                            已開發票
                            <!-- <span class="icon-arrow" :class="sortClassWay('invoice')">&UpArrow;</span> -->
                        </th>
                        <th colspan="3">
                            支付方式及金額
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="content" v-for="(bill, index) in sortedBills" :key="index">
                        <td>{{ index + 1 }}.</td>
                        <td>{{ bill.createTime }}</td>
                        <td>{{ bill.orderId }}</td>
                        <td>{{ bill.invoice }}</td>
                        <td>現金：{{ bill.payment_cash }}</td>
                        <td>信用卡：{{ bill.payment_credit }}</td>
                        <td v-if="bill.memo !== null && bill.payment_other !== 0">{{ bill.memo }}：{{ bill.payment_other
                            }}</td>
                        <td v-else></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<style scoped lang="scss">
.allBillArea {
    padding: 1dvw;
    background-color: white;

    .searchArea {
        width: 100%;
        display: flex;
        font-size: 2dvh;
        background-color: white;
        margin: 2dvh 0;
        justify-content: center;

        label {
            margin: 0 1dvw;
            line-height: 3.5dvh;
        }

        input {
            border: 1px solid rgb(152, 152, 152);
            border-radius: 8px;
            font-size: 2dvh;
        }
        #orderSearch,
        #invoiceSearch{
            width: 15%;
        }

        button {
            margin-left: 1dvw;
            width: 3dvw;
            background: #748cdd;
            color: white;
            border-radius: 50%;
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
        margin: 0.8rem auto;
        border-radius: 8px;
        border: none;
        overflow: auto;
        font-size: 1.8dvh;
        display: flex;
        justify-content: center;

        thead {
            border-top-right-radius: 8px;
        }

        tr {
            background-color: rgba(116, 140, 211, 0.2);
            height: 5dvh;
        }

        td {
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
            text-align: center;
        }

        tbody tr:nth-child(even) {
            background-color: white;
        }

        tbody tr:hover {
            background-color: #a8afc9;
            color: white;
            border:1px solid gray;
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
