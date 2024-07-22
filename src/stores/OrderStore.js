import { defineStore } from "pinia";

export const useOrderStore = defineStore("OrderStore",{
    state: () => ({
        order_info:[]
        
    }),
    getters:{
        //代入工作臺後會自動過濾出屬於該工作臺的餐點
        filterByWorkingArea(workingArea){ 
            return this.order_info.map(item => item.filter(o => o.workingArea === workingArea))
        },
        //依照訂單編號找出訂單
        findByOId(){
            return this.order_info.find(order => order.oId === oId)
        }
    },
    actions:{

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