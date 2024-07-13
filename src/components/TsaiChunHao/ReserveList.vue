<script>
import Swal from "sweetalert2";

export default {
  name: "Booking",
  data() {
    return {
      orders: [], // 存放訂單資料
      searchKeyword: "", // 搜尋關鍵字
      sortColumn: "", // 排序列名
      sortOrder: "", // 排序方式（asc 或 desc）
      modalOpen: false, // 控制彈出視窗顯示
      modalMode: "", // 彈出視窗模式（view, edit, add）
      formData: {
        id: "",
        name: "",
        phone: "",
        number: 0,
        orderDate: "",
        message: "", // 備註欄位
      },
      readonly: false, // 控制表單是否為唯讀
    };
  },
  created() {
    // 在 created 鉤子中自動調用 fetchBookingData 方法
    this.fetchBookingData();
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders.filter((order) => {
        return (
          order.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
          order.phone.includes(this.searchKeyword) ||
          order.orderDate.includes(this.searchKeyword)
        );
      });
      return this.sortOrders(filtered);
    },
  },
  methods: {
    fetchBookingData() {
      fetch("http://localhost:8080/reserve/search", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.orders = data.reserveList.map((booking) => {
            return {
              id: booking.bookingNum,
              name: booking.name,
              phone: booking.phone,
              number: booking.guestNum,
              orderDate: booking.date,
              status: booking.canceled ? "已取消" : "預訂成功",
            };
          });
        })
        .catch((error) => {
          console.error("錯誤:", error);
        });
    },
    confirmDelete(orderId) {
      let order = this.orders.find((order) => order.id === orderId);
      if (!order) return;

      Swal.fire({
        title: "確定刪除？",
        text: "此操作無法還原！",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch("http://localhost:8080/reserve/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_list: [orderId], // 傳遞要刪除的預訂編號
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.statusCode === 200) {
                // 刪除成功，更新 orders 資料
                this.orders = this.orders.filter(
                  (order) => order.id !== orderId
                );
                Swal.fire("刪除成功！", "訂單已成功刪除。", "success");
              } else {
                // 處理錯誤情況
                Swal.fire("錯誤", "刪除失敗，請稍後再試。", "error");
              }
            })
            .catch((error) => {
              console.error("錯誤:", error);
              Swal.fire("錯誤", "刪除失敗，請稍後再試。", "error");
            });
        }
      });
    },
    openModal(mode, order) {
      console.log("Modal opened with order:", order); // 確認 order 內容
      this.modalMode = mode;
      this.formData = {
        id: order.id,
        name: order.name,
        phone: order.phone,
        number: order.number,
        orderDate: order.orderDate,
        message: order.message || "", // 確保 message 不會是 undefined
      };
      console.log("Form data:", this.formData); // 確認 formData 內容
      this.modalOpen = true;

      if (mode === "view") {
        this.readonly = true;
      } else if (mode === "edit") {
        this.readonly = false;
      }
    },
    submitForm() {
      this.modalOpen = false;
      // 提交表單的邏輯可以在這裡實現
    },
    updateData() {
      Swal.fire({
        title: "確定要更新嗎？",
        text: "此操作將會更新預訂資料！",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch("http://localhost:8080/reserve/create_update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              booking_num: this.formData.id,
              name: this.formData.name,
              phone: this.formData.phone,
              guestNum: this.formData.number,
              date: this.formData.orderDate,
              message: this.formData.message,
              is_canceled: false, // 或是根據實際情況設置取消狀態
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.statusCode === 200) {
                this.fetchBookingData(); // 更新訂單列表
                Swal.fire("更新成功！", "訂單已成功更新。", "success");
              } else {
                Swal.fire("錯誤", "更新失敗，請稍後再試。", "error");
              }
            })
            .catch((error) => {
              console.error("錯誤:", error);
              Swal.fire("錯誤", "更新失敗，請稍後再試。", "error");
            });
        }
      });
    },
    sortOrders(filteredOrders) {
      if (this.sortColumn && this.sortOrder) {
        filteredOrders.sort((a, b) => {
          let modifier = 1;
          if (this.sortOrder === "desc") modifier = -1;
          if (a[this.sortColumn] < b[this.sortColumn]) return -1 * modifier;
          if (a[this.sortColumn] > b[this.sortColumn]) return 1 * modifier;
          return 0;
        });
      }
      return filteredOrders;
    },
    sortTable(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column;
        this.sortOrder = "asc";
      }
    },
    searchTable() {
      this.sortColumn = "";
      this.sortOrder = "";
    },
    closeModal() {
      this.modalOpen = false;
    },
  },
};
</script>

<template>
  <!-- 主要的模板區域 -->
  <div class="tableArea">
    <!-- 表格主區域 -->
    <main class="table">
      <!-- 表格標題區域 -->
      <section class="table_header">
        <!-- 系統名稱 -->
        <h1>預訂管理系統</h1>
        <div class="box">
          <div class="search-box">
            <!-- 搜尋框 -->
            <input
              type="text"
              class="input-group input"
              placeholder="搜尋資料"
              v-model="searchKeyword"
              @input="searchTable"
            />
            <label class="icon">
              <!-- 搜尋圖示 -->
              <i
                class="fa-solid fa-magnifying-glass"
                @click="fetchBookingData"
              ></i>
            </label>
          </div>
        </div>
      </section>

      <!-- 表格內容區域 -->
      <section class="table_body">
        <table>
          <thead>
            <tr>
              <!-- 表頭：編號 -->
              <th
                @click="sortTable('id')"
                :class="{ active: sortColumn === 'id' }"
              >
                編號
                <span
                  class="icon-arrow"
                  :class="{
                    asc: sortColumn === 'id' && sortOrder === 'asc',
                    desc: sortColumn === 'id' && sortOrder === 'desc',
                  }"
                >
                  &UpArrow;
                </span>
              </th>
              <!-- 表頭：名稱 -->
              <th
                @click="sortTable('name')"
                :class="{ active: sortColumn === 'name' }"
              >
                名稱
              </th>
              <!-- 表頭：電話號碼 -->
              <th
                @click="sortTable('phone')"
                :class="{ active: sortColumn === 'phone' }"
              >
                電話號碼
              </th>
              <!-- 表頭：人數 -->
              <th
                @click="sortTable('number')"
                :class="{ active: sortColumn === 'number' }"
              >
                人數
                <span
                  class="icon-arrow"
                  :class="{
                    asc: sortColumn === 'number' && sortOrder === 'asc',
                    desc: sortColumn === 'number' && sortOrder === 'desc',
                  }"
                >
                  &UpArrow;
                </span>
              </th>
              <!-- 表頭：預訂日期 -->
              <th
                @click="sortTable('orderDate')"
                :class="{ active: sortColumn === 'orderDate' }"
              >
                預訂日期
                <span
                  class="icon-arrow"
                  :class="{
                    asc: sortColumn === 'orderDate' && sortOrder === 'asc',
                    desc: sortColumn === 'orderDate' && sortOrder === 'desc',
                  }"
                >
                  &UpArrow;
                </span>
              </th>
              <!-- 表頭：狀態 -->
              <th>狀態</th>
              <!-- 表頭：操作 -->
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- 表格內容，動態渲染每一筆預訂資料 -->
            <tr v-for="order in filteredOrders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.name }}</td>
              <td>{{ order.phone }}</td>
              <td>{{ order.number }}</td>
              <td>{{ order.orderDate }}</td>
              <td>
                <p
                  :class="[
                    'status',
                    order.status === '預訂成功' ? 'delivered' : 'cancelled',
                  ]"
                >
                  {{ order.status }}
                </p>
              </td>
              <td>
                <button @click="openModal('view', order)">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button @click="openModal('edit', order)">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button @click="confirmDelete(order.id)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>

  <!-- 彈出視窗區域，根據 modalOpen 變數控制顯示與隱藏 -->
  <div class="modal" :class="{ active: modalOpen }">
    <!-- 關閉彈出視窗按鈕 -->
    <svg
      class="close-modal"
      width="20"
      height="20"
      viewBox="0 0 29 29"
      fill="none"
      @click="closeModal"
    >
      <path
        d="M3 3L26.5 26.5"
        stroke="#333"
        stroke-width="5"
        stroke-linecap="round"
      />
      <path
        d="M26.5 3L3 26.5"
        stroke="#333"
        stroke-width="5"
        stroke-linecap="round"
      />
    </svg>
    <form @submit.prevent="submitForm">
      <!-- 模式標題 -->
      <h2>{{ modalMode === "view" ? "查看預訂資訊" : "編輯預訂資訊" }}</h2>

      <!-- 姓名欄位 -->
      <label>姓名</label>
      <input type="text" v-model="formData.name" :readonly="readonly" />

      <!-- 電話號碼欄位 -->
      <label>電話號碼</label>
      <input type="text" v-model="formData.phone" :readonly="readonly" />

      <!-- 人數欄位 -->
      <label>人數</label>
      <input type="number" v-model="formData.number" :readonly="readonly" />

      <!-- 日期選擇欄位 -->
      <label>日期選擇</label>
      <input
        v-if="modalMode === 'edit'"
        type="date"
        v-model="formData.orderDate"
      />
      <input
        v-if="modalMode === 'view'"
        type="text"
        v-model="formData.orderDate"
        readonly
      />

      <!-- 備註欄位 -->
      <label>備註</label>
      <input type="text" v-model="formData.message" :readonly="readonly" />

      <!-- 按鈕群組 -->
      <div class="button-group">
        <button v-if="modalMode === 'edit'" type="submit" @click="updateData">
          更新
        </button>
      </div>
    </form>
  </div>
</template>

/* 全域樣式 */
<style scoped lang="scss">
/* 定義主要區域，使用Flex布局，置中對齊 */
.tableArea {
  display: flex;
  min-height: 100vh; /* 最小高度為整個視窗高度 */
  justify-content: center; /* 水平置中對齊 */
  align-items: center; /* 垂直置中對齊 */
  background-color: #f0f0f0; /* 柔和的灰色背景 */
}

/* 設定表格、表頭和表格資料的共同樣式 */
table,
th,
td {
  border-collapse: collapse; /* 邊框合併 */
  padding: 1rem; /* 內部間距 */
  text-align: left; /* 文字左對齊 */
}

/* 主要表格的外層設定 */
main.table {
  width: 82vw; /* 寬度佔視窗的82% */
  height: 90vh; /* 高度佔視窗的90% */
  background-color: #ffffff; /* 淡白色背景 */
  box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.1); /* 淡黑色陰影 */
  border-radius: 0.8rem; /* 圓角 */
  overflow: hidden; /* 溢出隱藏 */
}

/* 表格頭部區域 */
.table_header {
  display: flex; /* 使用Flex布局 */
  width: 100%; /* 寬度100% */
  height: 10%; /* 高度10% */
  background-color: #f5f5f5; /* 淡灰色背景 */
  padding: 0.8rem 1rem; /* 內部間距 */
  justify-content: space-between; /* 兩側對齊，中間留白 */
  align-items: center; /* 垂直置中對齊 */
}

/* 搜尋框及其樣式 */
.box {
  max-width: 400px; /* 最大寬度為400px */
  width: 100%; /* 寬度100% */
}

.search-box {
  position: relative; /* 相對定位 */
  width: 300px; /* 初始寬度 */
  margin-left: auto; /* 左邊距自動填滿 */

  @media (max-width: 768px) {
    width: 100%; /* 在小螢幕下佔滿寬度 */
    max-width: 400px; /* 最大寬度為400px */
  }

  input {
    width: 100%; /* 寬度100% */
    height: 50px; /* 高度50px */
    padding: 0 15px; /* 內部間距 */
    font-size: 16px; /* 字體大小 */
    border: 1px solid #ccc; /* 邊框 */
    border-radius: 25px; /* 圓角 */
    outline: none; /* 聚焦時無邊框 */
    transition: border-color 0.3s ease; /* 邊框顏色過渡效果 */

    &:focus {
      border-color: #0298cf; /* 聚焦時的邊框顏色 */
    }
  }

  .icon {
    position: absolute; /* 絕對定位 */
    top: 0; /* 上方距離 */
    right: 0; /* 右方距離 */
    width: 50px; /* 寬度50px */
    height: 100%; /* 高度100% */
    text-align: center; /* 文字置中 */
    line-height: 50px; /* 行高等於高度 */
    background-color: #0298cf; /* 藍色背景 */
    color: #fff; /* 白色文字 */
    border-radius: 25px; /* 圓角 */
    cursor: pointer; /* 游標變成手指 */
    transition: background-color 0.3s ease; /* 背景色過渡效果 */

    &:hover {
      background-color: #0278a6; /* 滑鼠懸停時的背景色 */
    }
  }
}

/* 表格主體區域 */
.table_body {
  width: 95%; /* 寬度95% */
  max-height: calc(89% - 1.6rem); /* 最大高度，考慮表頭高度和邊框 */
  background-color: #ffffff; /* 淡白色背景 */
  margin: 0.8rem auto; /* 外邊距 */
  border-radius: 0.6rem; /* 圓角 */
  overflow: auto; /* 滾動條 */

  /* 表頭的樣式，當捲動時保持在頂部 */
  th {
    position: sticky; /* 粘性定位 */
    top: 0; /* 距離上方0 */
    left: 0; /* 距離左邊0 */
    background-color: #e0e0e0; /* 淡灰色背景 */
    color: #333; /* 深灰色文字 */
    padding: 1rem; /* 內部間距 */
    cursor: pointer; /* 游標變成手指 */
  }

  /* 奇數行的背景色設定 */
  tbody tr:nth-child(even) {
    background-color: #f5f5f5; /* 淡灰色背景 */
  }

  /* 滑鼠懸停時的行背景色 */
  tbody tr:hover {
    background-color: #f0f0f0; /* 更淺的灰色背景 */
  }

  /* 按鈕的樣式設定 */
  button {
    outline: none; /* 無外框 */
    border: none; /* 無邊框 */
    border-radius: 6px; /* 圓角 */
    cursor: pointer; /* 游標變成手指 */
    padding: 10px; /* 內部間距 */
    color: #ffffff; /* 白色文字 */

    /* 第一個按鈕的背景色 */
    &:nth-child(1) {
      background-color: #0298cf; /* 藍色背景 */
    }

    /* 第二個按鈕的背景色 */
    &:nth-child(2) {
      background-color: green; /* 綠色背景 */
      margin-left: 6px; /* 左邊距 */
    }

    /* 第三個按鈕的背景色 */
    &:nth-child(3) {
      background-color: #f80000; /* 紅色背景 */
      margin-left: 6px; /* 左邊距 */
    }
  }
}

/* 滾動條的樣式設定 */
.table_body::-webkit-scrollbar {
  width: 0.5rem; /* 寬度 */
  height: 0.5rem; /* 高度 */
}

/* 滾動條的拇指部分樣式 */
.table_body::-webkit-scrollbar-thumb {
  border-radius: 0.5rem; /* 圓角 */
  background-color: #ccc; /* 淡灰色滾動條 */
  visibility: hidden; /* 初始時隱藏 */
}

/* 滑鼠懸停時顯示滾動條 */
.table_body:hover::-webkit-scrollbar-thumb {
  border-radius: 0.5rem; /* 圓角 */
  background-color: #ccc; /* 淡灰色滾動條 */
  visibility: visible; /* 顯示 */
}

/* 表格的全域設定 */
table {
  width: 100%; /* 寬度100% */
}

/* 狀態標籤的樣式設定 */
.status {
  padding: 0.4rem 1rem; /* 內部間距 */
  border-radius: 2rem; /* 圓角 */
  text-align: center; /* 文字置中 */
  font-weight: bold; /* 粗體 */
  text-transform: uppercase; /* 轉換為大寫 */

  /* 已交付狀態的背景色和文字顏色 */
  &.delivered {
    background-color: #d4edda; /* 淡綠色 */
    color: #155724; /* 深綠色文字 */
  }

  /* 已取消狀態的背景色和文字顏色 */
  &.cancelled {
    background-color: #f8d7da; /* 淡紅色 */
    color: #721c24; /* 深紅色文字 */
  }
}

/* 響應式設計：當視窗小於1000px時 */
@media (max-width: 1000px) {
  /* 調整非第一列的列寬度 */
  td:not(:first-of-type) {
    min-width: 12.1rem; /* 最小寬度 */
  }
}

/* 箭頭圖示的樣式 */
.icon-arrow {
  display: inline-block; /* 行內元素 */
  width: 1.3rem; /* 寬度 */
  height: 1.3rem; /* 高度 */
  color: #007bff; /* 藍色 */
  border: 1.4px solid transparent; /* 透明邊框 */
  border-radius: 50%; /* 圓形 */
  text-align: center; /* 文字置中 */
  font-size: 1rem; /* 字體大小 */
  margin-left: 0.5rem; /* 左邊距 */
  transition: 0.2s ease-in-out; /* 過渡效果 */

  /* 向上的箭頭 */
  &.asc {
    transform: rotate(180deg); /* 旋轉180度 */
  }

  /* 向下的箭頭 */
  &.desc {
    transform: rotate(0deg); /* 不旋轉 */
  }
}

/* 在小尺寸螢幕上調整箭頭的大小和間距 */
@media (max-width: 768px) {
  .icon-arrow {
    width: 1rem; /* 寬度 */
    height: 1rem; /* 高度 */
    font-size: 0.8rem; /* 字體大小 */
    margin-left: 0.2rem; /* 左邊距 */
  }
}

/* 當標頭被點擊時的樣式 */
th.active .icon-arrow {
  border-color: #007bff; /* 藍色邊框 */
  color: #fff; /* 白色文字 */
}

/* 滑鼠懸停時的樣式 */
th:hover .icon-arrow {
  border-color: #007bff; /* 藍色邊框 */
}

/* 彈出視窗的樣式設定 */
.modal {
  position: fixed; /* 固定定位 */
  top: 0; /* 上方距離0 */
  left: 0; /* 左方距離0 */
  width: 100%; /* 寬度100% */
  height: 100%; /* 高度100% */
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  display: flex; /* 使用Flex布局 */
  justify-content: center; /* 水平置中對齊 */
  align-items: center; /* 垂直置中對齊 */
  z-index: 100; /* 層級設定，位於最上層 */
  opacity: 0; /* 初始透明度為0 */
  visibility: hidden; /* 初始不可見 */
  transition: opacity 0.3s ease; /* 透明度變化動畫效果 */

  /* 啟用時的樣式 */
  &.active {
    opacity: 1; /* 透明度為1 */
    visibility: visible; /* 可見 */
  }

  /* 彈出視窗內部表單樣式 */
  form {
    background-color: #fff; /* 白色背景 */
    width: 90%; /* 寬度90% */
    max-width: 600px; /* 最大寬度為600px */
    padding: 30px; /* 內部間距 */
    border-radius: 10px; /* 圓角 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 微弱的陰影 */

    h2 {
      margin-bottom: 8px;
      text-align: center;
    }

    /* 標籤樣式 */
    label {
      font-size: 16px; /* 字體大小 */
      color: #333; /* 深灰色文字 */
      margin-bottom: 8px; /* 底部間距 */
      display: block; /* 块級元素 */
    }

    /* 輸入框樣式 */
    input {
      width: 100%; /* 寬度100% */
      padding: 12px; /* 內部間距 */
      margin-bottom: 20px; /* 底部間距 */
      font-size: 16px; /* 字體大小 */
      border: 1px solid #ccc; /* 邊框 */
      border-radius: 6px; /* 圓角 */
      outline: none; /* 聚焦時無邊框 */
      transition: border-color 0.3s ease; /* 邊框顏色過渡效果 */

      &:focus {
        border-color: #4caf50; /* 聚焦時的邊框顏色 */
      }
    }

    /* 按鈕群組樣式 */
    .button-group {
      display: flex; /* 使用Flex布局 */
      justify-content: flex-end; /* 右側對齊 */
      gap: 10px; /* 按鈕間的間距 */
    }

    /* 按鈕樣式 */
    button {
      padding: 12px 25px; /* 內部間距 */
      background-color: #4caf50; /* 綠色背景 */
      color: #fff; /* 白色文字 */
      border: none; /* 無邊框 */
      border-radius: 6px; /* 圓角 */
      cursor: pointer; /* 游標變成手指 */
      font-size: 14px; /* 字體大小 */
      transition: background-color 0.3s ease; /* 背景色過渡效果 */

      &:hover {
        background-color: #45a049; /* 深綠色背景 */
      }
    }
  }

  /* 關閉視窗按鈕的樣式 */
  .close-modal {
    position: absolute; /* 絕對定位 */
    top: 10px; /* 上方距離 */
    right: 10px; /* 右方距離 */
    cursor: pointer; /* 游標變成手指 */
  }
}
</style>