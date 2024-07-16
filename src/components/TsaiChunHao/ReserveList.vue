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
              message: booking.message, // 將訊息設置到 message 屬性
            };
          });
          // 在這裡更新 formData.message
          if (data.reserveList.length > 0) {
            this.formData.message = data.reserveList[0].message;
          }
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
    cancelBooking() {
      Swal.fire({
        title: "確定要取消預訂嗎？",
        text: "此操作無法還原！",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.isConfirmed) {
          // 使用者確認要取消預訂
          this.formData.is_canceled = true; // 更新取消狀態為 true
          this.updateData(); // 調用更新資料的方法
        }
      });
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
              is_canceled: this.formData.is_canceled, // 根據表單中的狀態設置取消狀態
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
        <h1 style="color:#01e1c5;">預訂管理系統</h1>
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
        <button v-if="modalMode === 'edit'" @click="cancelBooking">
          取消預訂
        </button>
        <button v-if="modalMode === 'edit'" type="submit" @click="updateData">
          更新
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
/* 全域樣式 */
.tableArea {
  display: flex;
  overflow-y: scroll
}

table,
th,
td {
  border-collapse: collapse;
  padding: 1rem;
  text-align: left;
}

main.table {
  width: 82vw;
  height: 90vh;
  background-color: #ffffff;
  border-radius: 0.8rem;
  overflow: hidden;
}

.table_header {
  display: flex;
  height: 10%;
  background-color: white;
  padding: 0.8rem 1rem;
  justify-content: space-between;
  align-items: center;
}
.search-box {
  width: 30vw;
  margin-left: auto;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
  }

  input {
    width: 100%;
    height: 50px;
    padding: 0 15px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 25px;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #01e1c5;
    }
  }

  .icon {
    width: 5vw;
    height: 100%;
    text-align: center;
    line-height: 50px;
    background-color: #01e1c5;
    color: #fff;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #00af9b;
    }
  }
}

.table_body {
  width: 95%;
  max-height: calc(89% - 1.6rem);
  background-color: #ffffff;
  margin: 0.8rem auto;
  border-radius: 0.6rem;
  border:2px solid #000000;
  overflow: auto;

  th {
    position: sticky;
    top: 0;
    left: 0;
    background-color: #e0e0e0;
    color: #333;
    padding: 1rem;
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

    &:nth-child(1) {
      background-color: #0298cf;
    }

    &:nth-child(2) {
      background-color: green;
      margin-left: 6px;
    }

    &:nth-child(3) {
      background-color: #f80000;
      margin-left: 6px;
    }
  }
}

.table_body::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

.table_body::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: #ccc;
  visibility: hidden;
}

.table_body:hover::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: #ccc;
  visibility: visible;
}

table {
  width: 100%;
}

.status {
  padding: 0.4rem 1rem;
  border-radius: 2rem;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;

  &.delivered {
    background-color: #d4edda;
    color: #155724;
  }

  &.cancelled {
    background-color: #f8d7da;
    color: #721c24;
  }
}

@media (max-width: 1000px) {
  td:not(:first-of-type) {
    min-width: 12.1rem;
  }
}

.icon-arrow {
  display: inline-block;
  width: 1.3rem;
  height: 1.3rem;
  color: #007bff;
  border: 1.4px solid transparent;
  border-radius: 50%;
  text-align: center;
  font-size: 1rem;
  margin-left: 0.5rem;
  transition: 0.2s ease-in-out;

  &.asc {
    transform: rotate(180deg);
  }

  &.desc {
    transform: rotate(0deg);
  }
}

@media (max-width: 768px) {
  .icon-arrow {
    width: 1rem;
    height: 1rem;
    font-size: 0.8rem;
    margin-left: 0.2rem;
  }

  th.active .icon-arrow {
    border-color: #007bff;
    color: #fff;
  }

  th:hover .icon-arrow {
    border-color: #007bff;
  }

  .tableArea {
    flex-direction: column;
  }

  .main.table {
    width: 95vw;
    height: auto;
  }

  .table_header {
    height: auto;
    flex-direction: column;
  }

  .search-box {
    width: 100%;
    max-width: 100%;
    margin-left: 0;
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;

  &.active {
    opacity: 1;
    visibility: visible;
  }

  form {
    background-color: #fff;
    width: 90%;
    max-width: 600px;
    padding: 30px;
    border-radius: 10px;

    h2 {
      margin-bottom: 8px;
      text-align: center;
    }

    label {
      font-size: 16px;
      color: #333;
      margin-bottom: 8px;
      display: block;
    }

    input {
      width: 100%;
      padding: 12px;
      margin-bottom: 20px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 6px;
      outline: none;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #4caf50;
      }
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    button {
      padding: 12px 25px;
      background-color: #4caf50;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #45a049;
      }
    }
  }

  .close-modal {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
}
</style>