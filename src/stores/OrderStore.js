import {defineStore} from 'pinia'

export const useOrderStore = defineStore("OrderStore",{
    state: () => ({
        order_info:[
            {
                order_detail:[ //點餐明細
                    {
                        meal_id: null,
                        name: "",
                        price: null,
                        options:[],
                        otherReq:"",
                        description:"",
                        img: "", 
                        workingArea: "",
                        quantities:1,
                        status:"未出餐"
                    }
                ],
            }
        ]
    }),
    getters:{
        //代入工作臺後會自動過濾出屬於該工作臺的餐點
        filterByWorkingArea: (state) => (workingArea) => {
            return state.meal_info.filter(meal => meal.status === '未出餐' && meal.working_area === workingArea);
        },
        //依照訂單編號找出訂單
        findByOId(){
            return this.order_info.find(order => order.oId === oId)
        }
    },
    actions:{
        getOrderInfo(){
            fetch("http://localhost:8080/order_info",{
                method:'GET',
            })
            .then(res => res.json())
            .then(data => {
                data.sort((a, b) => new Date(a.lastmodified_time) - new Date(b.lastmodified_time))
                this.order_info = data.slice(-5) //取最後存入的五筆資料
                this.order_info.sort((a,b) => new Date(b.lastmodified_time) - new Date(a.lastmodified_time))
            })
        },
        //將訂單內容存入
        createOrder(order){
            this.order_info.push(order);
        },
        addToOrderList(oId, orderDetail){
            const order = this.order_info.find(order => order.oId === oId);
            if (order) {
                order.order_detail.push(orderDetail);
            } else {
                console.error(`Order with id ${oId} not found.`);
            }
        }
    }
})