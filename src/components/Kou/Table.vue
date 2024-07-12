<template>
    <div id="app">
      <button @click="toggleEdit">調整桌位</button>
  
      <!-- 當進入編輯模式時，啟用拖曳功能 -->
      <draggable
        v-if="isEditing"
        v-model="tables" 
        @start="drag = true"
        @end="saveTableOrder"
        style="width: 106%"
        class="list-group"
        tag="ul"
        v-bind="dragOptions"
        >
        <!-- 顯示每張桌子的內容 -->
        <template #item="{ element }" style="width: 50%">
          <div
            :class="['table', element.status]"
            :id="'table-' + element.table_id"
          >
            <!-- 根據桌子的狀態設置樣式 -->
            <div class="tableNum">
              <div>桌號: {{ element.table_id }}</div>
            </div>
            <div class="staffId">
              <div>員工: {{ element.staff_name }}</div>
            </div>
            <div class="booking">
              <div>預訂: {{ element.booking_num }}</div>
            </div>
            <div class="time">
              <div>時間: {{ formatTime(element.create_time) }}</div>
            </div>
            <div class="childSeat">
              <div>兒童座: {{ element.has_priorityseat ? 'Yes' : 'No' }}</div>
            </div>
            <div class="maxSeat">
              <div>最大人數: {{ element.max_guest_num }}</div>
            </div>
          </div>
        </template>
      </draggable>
      <div v-else class="noEditTableArea">
        <!-- 當不處於編輯模式時，僅顯示桌子 -->
        <div
          v-for="table in tables"
          :key="table.table_id"
          :class="['table', table.status]"
          :id="'table-' + table.table_id"
        >
          <div class="tableNum">
            <div class="Num">桌號: {{ table.table_id }}</div>
          </div>
          <div class="staffId">
            <div>員工: {{ table.staff_name }}</div>
          </div>
          <div class="booking">
            <div>預訂: {{ table.booking_num }}</div>
          </div>
          <div class="time">
            <div>時間: {{ formatTime(table.create_time) }}</div>
          </div>
          <div class="childSeat">
            <div>兒童座: {{ table.has_priorityseat ? 'Yes' : 'No' }}</div>
          </div>
          <div class="maxSeat">
            <div>最大人數: {{ table.max_guest_num }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import draggable from "vuedraggable"; // 導入 vuedraggable 用於實現拖曳功能
  
  export default {
    components: {
      draggable, // 將 draggable 組件套用在此vue上
    },
    data() {
      return {
        isEditing: false, // 判斷是否為編輯模式的變數
        tables: [],
      };
    },
    methods: {
      toggleEdit() {
        this.isEditing = !this.isEditing;
      },
      saveTableOrder() {
        // 保存新的桌子排序
        console.log("新的桌子順序:", this.tables);
      },
      async fetchTables() {
        try {
          const response = await fetch("http://localhost:8080/table");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          this.tables = data.map((table, i) => ({
            ...table,
            id: i + 1,
            label: `1F${String(i + 1).padStart(2, "0")}`,
            status:
              i % 3 === 0 ? "available" : i % 3 === 1 ? "in-use" : "reserved",
          }));
        } catch (error) {
          console.error("Error fetching table data:", error);
        }
      },
      formatTime(timeString) {
        if (!timeString) return "";
        const date = new Date(timeString);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
      },
    },
    mounted() {
      this.fetchTables();
    },
  };
  </script>
  
  <style scoped lang="scss">
  .table {
    width: 136px;
    height: auto; /* 設置高度自動適應內容 */
    margin: 10px;
    display: inline-block;
    text-align: center;
    line-height: 1.5em; /* 行高設置為1.5倍的字體大小 */
    border: 1px solid #ccc;
    padding: 10px; /* 添加內邊距 */
  }
  .available {
    background-color: #2a9d8f;
  }
  .in-use {
    background-color: #e76f51;
  }
  .reserved {
    background-color: #f4a261;
  }
  
  #app {
    padding-left: 0.3%;
    padding-top: 1%;
    border:1px solid #2a9d8f;
  
    .tableNum{
      width: 100%;
      font-size: 25px;
      display: flex;
      justify-content:baseline;
      color: white;
    }
  
    .staffId{
      width: 100%;
      display: flex;
      justify-content: baseline;
      color: white;
    }
  
    .booking{
      width: 100%;
      display: flex;
      justify-content: end;
      color: white;
    }
  
    .time{
      width: 100%;
      display: flex;
      justify-content: end;
      color: white;
    }
  
    .childSeat{
      width: 100%;
      display: flex;
      justify-content: end;
      color: white;
    }
  
    .maxSeat{
      width: 100%;
      display: flex;
      justify-content: end;
      color: white;
    }
  }
  
  .noEditTableArea {
    width: 106%;
  
    .tableNum {
      width: 100%;
      display: flex;
      justify-content: baseline;
  
      .Num {
        font-size: 25px;
        color: white;
      }
    }
  
    .staffId {
      width: 100%;
      display: flex;
      justify-content: baseline;
      color: white;
    }
  
    .booking {
      width: 100%;
      display: flex;
      justify-content: end;
      color: white;
    }
  
    .time {
      width: 100%;
      display: flex;
      justify-content: end;
      color: white;
    }
  
    .childSeat{
      width: 100%;
      display: flex;
      justify-content: end;
      color: white;
    }
  
    .maxSeat {
      width: 100%;
      display: flex;
      justify-content: end;
      color: white;
    }
  }
  </style>
  