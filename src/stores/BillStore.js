import { defineStore } from "pinia";

export const useBillstore = defineStore("Billstore", {
  state: () => ({
    // 暫存
    order_amount: null,
    orderAmountfromPage:null,
    serviceFee: 10, // 預設服務費10%
    entertain: 0,
    discount: 0,
    allowance: 0,
    inputEvent: [
      // 預設初始付款方式
      { type: "信用卡", value: 0 },
      { type: "現金", value: 0 },
    ],
    memo: [],
    newInputEvent: "", // 新增其他付款方式用
    showHandInvArea: false, //show手開
    showRightNav: false,
    showVehiArea: false, // show載具
    showBusiNumInput: false, //show統編
    focusedInput: null, // 根據當下點擊的 input 給值
    showOrderArea: true,
    showLeftNavArea: true, // show發票左導覽列
    invoiceNum: "", // 
    lastFiveBills: [], // 近5筆紀錄
    allbills: [],
    // changeAmountforshouw: 0,
    chargedAllOrder: [], // 已結的所有order
    chargedOrders: [], // 已結的所有order
    todayCreateBillsOrderDetail: [], // 今日已結的所有order內容
    chargedTodayBills: [], // 今日已結的bills
    todayCreateBillsOrderId: [], // 今日已結bills的order_id
    newChargedTodayBills: [],
    bill_id: "",
    theLastBill: "",
    handInvoiceInput: "",
    handUniformNum:"",
    changeShow: "A",
    OrderDB: [], // 從DB抓的
    mobileBarcode:"",
    uniformNum:""
  }),
  getters: {
    // ----取值區----
    // 計算機-總額
    totalAmount(state) {
      const discountPersent = (100 - state.discount) / 100;
      const servicePersent = (100 + state.serviceFee) / 100;
      return (
        state.orderAmountfromPage * discountPersent * servicePersent -
        state.entertain -
        state.allowance
      ).toFixed(2);
    },
    // 計算機-找零
    changeAmount(state) {
      return (state.realChargeAmount - state.totalAmount)
    },
    // 計算機-實收
    realChargeAmount(state) {
      return state.inputEvent.reduce((total, event) => total + event.value, 0);
    },
    // 計算機-未收
    notyetChargeAmount(state) {

      if (state.totalAmount > state.realChargeAmount) {
        return (state.totalAmount - state.realChargeAmount).toFixed(2);
      } else {
        return 0;
      }
    },
    discountAmount(state) {
      return (state.orderAmountfromPage * state.discount) / 100;
    },
    serviceAmount(state) {
      return state.orderAmountfromPage * (state.serviceFee / 100);
    },
  },
  actions: {
    // 新增 => 計算機
    addToDisplay(value) {
      if (this.focusedInput && this.focusedInput.value == 0) {
        this.focusedInput.value = "";
      }
      if (this.focusedInput) {
        this.focusedInput.value += value;
        this.updateValue(this.focusedInput);
      }
    },
    // 更正 => 清空計算機
    clearDisplay() {
      if (this.focusedInput) {
        this.focusedInput.value = "";
        this.updateValue(this.focusedInput);
      }
      if (this.focusedInput.value == null) {
        this.updateValue == "0";
      }
    },
    // 修正 => 刪除最後一位數字
    backspace() {
      if (this.focusedInput) {
        let value = this.focusedInput.value; // 取得當下點擊的輸入框值
        this.focusedInput.value = value.slice(0, -1); // 刪除輸入框值的最後一個字
        if (this.focusedInput.value === "") {
          // 如果輸入框值為空，預設回 "0"
          this.focusedInput.value = "0";
        }
        this.updateValue(this.focusedInput);
      } else {
        let lengthOfDisplayVal = this.displayVal.length; // 取得 displayVal 的當前值長度
        this.displayVal = this.displayVal.slice(0, lengthOfDisplayVal - 1); // 刪除 displayVal 的最後一個字
        if (this.displayVal === "") {
          this.displayVal = "0";
        }
      }
    },
    // 當下所點選的輸入框
    setFocusedInput(input) {
      this.focusedInput = input;
    },
    // 更新計算機的值
    updateValue(input) {
      // 根據 inputEvent 陣列中找名稱與 input 名稱相同的 event
      const event = this.inputEvent.find((event) => event.type === input.name);
      if (event) {
        // 如果找到相對應的 event ，則更新該項目的值
        event.value = parseFloat(input.value) || 0;
      } else {
        // 如果沒有找到相對應的 event，則將值更新到對應的固定數據屬性中
        this[input.name] = parseFloat(input.value) || 0;
      }
    },
    // 新增其他付款方式
    addInputEvent() {
      if (this.newInputEvent.trim() != "") {
        this.inputEvent.push({ type: this.newInputEvent.trim(), value: 0 });
        this.newInputEvent = "";
      }
    },
    // 刪除該付款方式
    removeInputEvent(index) {
      this.inputEvent.splice(index, 1);
    },
    // 千分位
    tothousendShowValue(value) {
      if (value != null) {
        return parseFloat(value).toLocaleString();
      }
      return "0";
    },
    // 建立 Bill 並存值到 DB
    saveBillfromP(
      bId,
      oId,
      pCash,
      pCard,
      pOther,
      invNum,
      cTime,
      pId, // 登入員工編號
      upTime,
      pOtherName,
      mobileBarcode, // 載具
      uniformNum, // 統編
    ) {
      let saveObj = {
        bill_id: bId,
        order_id: oId,
        payment_cash: pCash,
        payment_credit: pCard,
        payment_other: pOther,
        invoice: invNum,
        create_time: cTime,
        lastmodified_staff_id: pId,
        lastmodified_time: upTime,
        memo: pOtherName,
        mobile_barcode: mobileBarcode,
        uniform_numbers: uniformNum
      };
      console.log(saveObj);
      fetch("http://localhost:8080/bill/create", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveObj),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    setPaymentCash(value) {
      this.payment_cash = value;
    },
    setPaymentCredit(value) {
      this.payment_credit = value;
    },
    setPaymentOther(value) {
      this.payment_other = value;
    },
    // show showHandInvArea
    showHandInvoiceArea() {
      this.showHandInvArea = !this.showHandInvArea;
    },
    // show showVehicleArea
    showVehicleArea() {
      this.showVehiArea = !this.showVehiArea;
    },
    // show showBuniNumArea
    showBuniNumArea() {
      this.showBusiNumInput = !this.showBusiNumInput;
    },
    // show showInvoiceLeftNavArea
    showInvoiceLeftNavArea() {
      this.showLeftNavArea = !this.showLeftNavArea;
    },
    // 調出所有 bills & 當日的 bills
    async getAllBillsAndTodayBills() {
      try {
        const response = await fetch("http://localhost:8080/bill", {
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
            // 未用 只取近5筆記錄
            // this.lastFiveBills = data.slice(-5).reverse();
            // console.log(this.lastFiveBills);
            this.theLastBill = this.allbills[this.allbills.length - 1];
            // console.log(this.theLastBill);

            const now = new Date();
            const today = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            ).getTime();
            this.todayCreateBills = [];
            this.todayCreateBillsOrderDetail = [];
            for (let bill of this.allbills) {
              let createDate = new Date(bill.create_time);
              createDate.setHours(0, 0, 0, 0);
              if (createDate.getTime() === today) {
                this.todayCreateBills.push(bill);
              }
            }
            // console.log(this.todayCreateBills);
          });
      } catch (error) {
        console.error("Fetching bills is error!!");
      }
    },
    // 調出當日近5筆已結帳的 order
    async getChargedOrders() {
      try {
        this.chargedOrders = [];
        this.chargedTodayBills = [];
        this.chargedBillsContent = []; // 已結 Bills 的 content
        this.todayCreateBillsOrderId = [];
        this.todayCreateBillsOrderDetail = [];
        const today = new Date();
        // 將當天的時間設成0:00:00僅比較日期
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime(); // 將today格式換成時間戳
        // console.log(todayTimestamp);

        // 從 allbills 逐筆取得 每筆 bill 的 createTime 且轉換為時間戳格式 並放入陣列 crateTimeByBills
        this.allbills.forEach((bill) => {
          this.chargedOrders.push(bill.order_id);
          let date = new Date(bill.create_time);
          date.setHours(0, 0, 0, 0);
          this.chargedBillsContent.push({
            bill_id: bill.bill_id,
            order_id: bill.order_id,
            payment_cash: bill.payment_cash,
            payment_credit: bill.payment_credit,
            payment_other: bill.payment_other,
            invoice: bill.invoice,
            create_time: date.getTime(),
            lastmodified_staff_id: bill.lastmodified_staff_id,
            lastmodified_time: bill.lastmodified_time,
          });
        });
        // console.log(this.chargedBillsContent);
        // 從 crateTimeByBills 找出當日建立的 bills 且將其 order_id，放入 todayCreateBillsOrderId
        this.chargedBillsContent.forEach((bill) => {
          if (bill.create_time === todayTimestamp) {
            this.todayCreateBillsOrderId.push(bill.order_id);
            this.chargedTodayBills.push({
              bill_id: bill.bill_id,
              order_id: bill.order_id,
              payment_cash: bill.payment_cash,
              payment_credit: bill.payment_credit,
              payment_other: bill.payment_other,
              invoice: bill.invoice,
              create_time: bill.create_time,
              lastmodified_staff_id: bill.lastmodified_staff_id,
              lastmodified_time: bill.lastmodified_time,
            });
          }
        });
        // console.log(this.todayCreateBillsOrderId);
        // console.log(this.chargedTodayBills);
        // console.log(this.chargedOrders);
        // 取出 todayCreateBillsOrderId 的 order_id 的 order 內容
        for (let orderId of this.todayCreateBillsOrderId) {
          try {
            let response = await fetch(
              "http://localhost:8080/order_info/ById",
              {
                method: "post",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ order_id: orderId }),
              }
            );
            let orderData = await response.json();
            // console.log(orderData);
            this.todayCreateBillsOrderDetail.push(orderData);
          } catch (error) {
            console.error("Fetching order detail is error!!");
          }
        }
        // console.log(this.todayCreateBillsOrderDetail);

        return this.todayCreateBillsOrderDetail;
      } catch (error) {
        console.error("Try is error!!");
      }
    },
    // 切換發票設定頁的components
    changeStep(step) {
      console.log("前往Compnent:", step);
      this.changeShow = step;
    },
  },
});
