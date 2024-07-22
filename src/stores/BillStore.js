import { defineStore } from "pinia";
import { ref } from 'vue';

export const useBillstore = defineStore("Billstore", {
  state: () => ({
    // 暫存
    order_amount: null,
    serviceFee: 10,
    entertain: 0,
    discount: 0,
    allowance: 0,
    inputEvent: [
      // 預設初始付款方式
      { type: "信用卡", value: 0 },
      { type: "現金", value: 0 },
    ],
    newInputEvent: "",
    showHandInvArea: false,
    showRightNav: false,
    focusedInput: null,
    showOrderArea: true,
    // Test
    order_id: "#200",
    invoiceNum: "AB12349876",
  }),
  getters: {
    // ----取值區----
    // 計算機-總額
    totalAmount(state) {
      const discountPersent = (100 - state.discount) / 100;
      const servicePersent = (100 + state.serviceFee) / 100;
      const orderAmount = state.orderAmountfromPage || 0;
      return Math.round(
        orderAmount * discountPersent * servicePersent -
        state.entertain -
        state.allowance
      );
    },
    // 計算機-找零
    changeAmount(state) {
      const totalAmount = parseFloat(this.totalAmount) || 0;
      return Math.round(state.realChargeAmount - totalAmount);
    },
    // 計算機-實收
    realChargeAmount(state) {
      return Math.round(state.inputEvent.reduce((total, event) => total + event.value, 0));
    },
    // 計算機-未收
    notyetChargeAmount(state) {
      const totalAmount = parseFloat(this.totalAmount) || 0;
      const realChargeAmount = this.realChargeAmount;
      if (totalAmount > realChargeAmount) {
        return Math.round(totalAmount - realChargeAmount);
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
    // Bill完成存值到DB
    saveBillfromP(bId, oId, pCash, pCard, pOther, invNum, cTime, pId, upTime) {
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
          if (data.success) {
            console.log("Bill saved successfully");
            console.log(data);
          }
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
    // show HandInvoiceArea
    showHandInvoiceArea(){
      this.showHandInvArea = !this.showHandInvArea
    }
  },
});
