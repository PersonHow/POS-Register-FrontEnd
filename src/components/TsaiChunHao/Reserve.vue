<script>
import Swal from "sweetalert2"; // 引入 SweetAlert2 庫

export default {
  data() {
    return {
      formData: {
        fname: "", // 姓名
        phone: "", // 電話
        number: "", // 人數
        date: "", // 日期
        message: "", // 訊息
      },
      currentTime: "", // 存放當前時間的資料
      tomorrowDate: "", // 存放明天日期的資料
    };
  },
  mounted() {
    this.setCurrentTime(); // 初始化當前時間
    this.setTomorrowDate(); // 設定明天的日期
  },
  methods: {
    setCurrentTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      this.currentTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    },
    setTomorrowDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // 取得明天的日期
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
      const day = String(tomorrow.getDate()).padStart(2, "0");
      this.tomorrowDate = `${year}-${month}-${day}`;
    },
    submitForm() {
      // 驗證必填欄位
      if (
        !this.formData.fname ||
        !this.formData.phone ||
        !this.formData.number ||
        !this.formData.date
      ) {
        Swal.fire({
          icon: "error",
          title: "必須項目都要填寫",
          text: "姓名、電話、人數、日期選擇為必填項目。",
        });
        return;
      }

      // 驗證電話號碼是否是10位數字
      const phonePattern = /^\d{10}$/;
      if (!phonePattern.test(this.formData.phone)) {
        Swal.fire({
          icon: "error",
          title: "電話號碼錯誤",
          text: "電話號碼至少要10位數字。",
        });
        return;
      }

      // 如果表單填寫完整，則執行提交功能
      this.submitToBackend();
    },
    submitToBackend() {
      const formData = {
        name: this.formData.fname,
        phone: this.formData.phone,
        guestNum: parseInt(this.formData.number), // 確保人數是數字類型
        date: this.formData.date,
        message: this.formData.message,
        is_canceled: "false"
      };

      fetch("http://localhost:8080/reserve/create_update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data); // 確保從後端正確收到數據
          // 可以在這裡處理後端返回的數據，例如顯示成功提示等
          Swal.fire({
            icon: "success",
            title: "成功提交訂單",
            text: "訂單已成功提交！",
          });
          this.resetForm(); // 提交成功後重設表單
        })
        .catch((error) => {
          console.error("錯誤:", error);
          // 可以在這裡處理錯誤情況，例如顯示錯誤提示框
          Swal.fire({
            icon: "error",
            title: "提交訂單失敗",
            text: "發生錯誤，請稍後再試。",
          });
        });
    },
    resetForm() {
      this.formData.fname = "";
      this.formData.phone = "";
      this.formData.number = "";
      this.formData.date = "";
      this.formData.message = "";
    },
  },
};
</script>

<template>
  <div class="bf-container">
    <div class="bf-body">
      <div class="bf-head">
        <h1>預約表單</h1>
        <p>開始預約吧</p>
      </div>

      <form class="bf-body-box" @submit.prevent="submitForm">
        <!-- 姓名和電話輸入欄 -->
        <div class="bf-row">
          <div class="bf-col-6">
            <p>姓名<span class="required">(必填)</span></p>
            <input
              v-model="formData.fname"
              type="text"
              name="fname"
              id="fname"
              placeholder="姓名"
              required
            />
          </div>
          <div class="bf-col-6">
            <p>電話號碼<span class="required">(必填)</span></p>
            <input
              v-model="formData.phone"
              type="text"
              name="phone"
              id="phone"
              placeholder="電話號碼"
              required
              pattern="\d{10}"
              title="電話號碼必須是10位數字"
            />
          </div>
        </div>

        <!-- 人數和日期選擇欄 -->
        <div class="bf-row">
          <div class="bf-col-6">
            <p>人數<span class="required">(必填)</span></p>
            <input
              v-model="formData.number"
              type="number"
              name="number"
              id="number"
              required
            />
          </div>
          <div class="bf-col-6">
            <p>日期選擇<span class="required">(必填)</span></p>
            <input
              v-model="formData.date"
              type="date"
              name="date"
              id="date"
              :min="tomorrowDate"
              required
            />
          </div>
        </div>

        <!-- 訊息輸入欄 -->
        <div class="bf-row">
          <div class="bf-col-12">
            <p>訊息</p>
            <textarea
              v-model="formData.message"
              name="message"
              id="message"
              cols="10"
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- 提交按鈕 -->
        <div class="bf-row">
          <div class="bf-col-3">
            <input type="submit" value="提交" />
          </div>
        </div>
      </form>

      <!-- 顯示當前時間 -->
      <div class="bf-footer">
        <p>訂單確定時間：{{ currentTime }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 表單元素樣式設定 */
input,
textarea,
select {
  width: 100%; /* 元素寬度為父元素寬度的100% */
  background-color: #f0f0f0; /* 淺灰色背景 */
  border: 2px solid #003087; /* 2px 寬度的深藍色邊框 */
  outline: none; /* 移除預設的外框 */
  padding: 10px; /* 內間距為10px */
  font-family: "Arial", sans-serif; /* 字體為Arial或sans-serif */
  margin-top: 5px; /* 上邊距為5px */
  resize: none; /* 禁止調整大小 */
  color: #003087; /* 文字顏色為深藍色 */
  transition: border-color 0.3s ease-in-out; /* 加入邊框顏色變化的過渡效果 */
}

input[type="text"]:hover,
input[type="number"]:hover,
input[type="date"]:hover,
textarea:hover {
  border-color: #ff8200; /* 滑鼠懸停時邊框顏色變為橘色 */
}

/* 表單欄位佈局 */
.bf-col-12 {
  width: 100%; /* 寬度佔滿父元素的100% */
}

.bf-col-3 {
  width: 30%; /* 寬度佔滿父元素的30% */
}

.bf-col-6 {
  width: 48%; /* 寬度佔滿父元素的48% */
}

/* 表單頭部和尾部樣式 */
.bf-head,
.bf-footer {
  background-color: #f0f0f0; /* 淺灰色背景 */
  padding: 20px 10px; /* 內間距為20px上下，10px左右 */
  text-align: center; /* 文字置中 */
}

/* 整體表單容器樣式 */
.bf-container {
  display: flex; /* 使用Flex布局 */
  justify-content: center; /* 水平置中 */
  align-items: center; /* 垂直置中 */
  width: 100%; /* 寬度佔滿父元素的100% */
  min-height: 100vh; /* 最小高度為視窗高度的100% */
  overflow-y: auto; /* 垂直溢出時顯示滾動條 */
  padding: 20px 16px; /* 內間距為20px上下，16px左右 */

  /* 表單主體樣式 */
  .bf-body {
    width: 500px; /* 表單主體寬度為500px */
    background-color: white; /* 白色背景 */
    padding: 20px; /* 內間距為20px */
    border-radius: 8px; /* 圓角為8px */
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* 淡淡的陰影 */

    /* 表單內容盒子樣式 */
    .bf-body-box {
      padding: 10px; /* 內間距為10px */

      /* 表單行樣式 */
      .bf-row {
        display: flex; /* 使用Flex布局 */
        justify-content: space-between; /* 空間平均分配 */
        padding: 10px 0; /* 上下內間距為10px */
      }

      /* 設定必填提示文字樣式 */
      .required {
        color: red; /* 必填提示文字為紅色 */
        margin-left: 5px; /* 與標籤之間的間距為5px */
        font-size: 0.9em; /* 字體大小為0.9em */
      }
    }
  }
}

/* 送出按鈕樣式 */
.bf-col-3 input[type="submit"] {
  background-color: #003087; /* 深藍色背景 */
  color: white; /* 文字顏色為白色 */
  border: none; /* 無邊框 */
  padding: 12px 20px; /* 內間距為12px上下，20px左右 */
  font-size: 16px; /* 字體大小為16px */
  cursor: pointer; /* 游標為手型 */
  transition: background-color 0.3s ease-in-out; /* 加入背景色變化的過渡效果 */
}

.bf-col-3 input[type="submit"]:hover {
  background-color: #ff8200; /* 滑鼠懸停時背景色變為橘色 */
}

/* 標題和段落樣式 */
h1 {
  font-size: 40px; /* 標題字體大小為40px */
  color: #003087; /* 文字顏色為深藍色 */
  margin-bottom: 10px; /* 下邊距為10px */
}

p {
  color: #003087; /* 文字顏色為深藍色 */
  margin-bottom: 10px; /* 下邊距為10px */
}

/* 連結樣式 */
a {
  text-decoration: none; /* 移除下劃線 */
  color: #ff8200; /* 文字顏色為橘色 */
}

a:hover {
  color: #003087; /* 滑鼠懸停時文字顏色變為深藍色 */
}

/* 媒體查詢：螢幕寬度小於等於600px的設定 */
@media screen and (max-width: 600px) {
  .bf-row {
    flex-direction: column; /* 表單行的排列方式改為垂直 */
    padding: 0; /* 內間距為0 */
  }

  .bf-col-12 {
    padding: 10px 0; /* 上下內間距為10px */
    width: 100%; /* 寬度佔滿父元素的100% */
  }

  .bf-col-3 {
    padding: 10px 0; /* 上下內間距為10px */
    width: 30%; /* 寬度佔滿父元素的30% */
  }

  .bf-col-6 {
    padding: 10px 0; /* 上下內間距為10px */
    width: 100%; /* 寬度佔滿父元素的100% */
  }

  .bf-container {
    padding: 50px 16px; /* 內間距為50px上下，16px左右 */
  }
}
</style>