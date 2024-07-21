<template>
  <div style="display: flex;">
    <div id="tableTop">
      <div class="tableTopArea" style="display: flex; align-items: center;">
        <button @click="toggleEdit" class="btn_not_adjust_table">調整桌位</button>
        <button @click="toggleTarget" class="btn_cancel_target_table">設定目標桌位</button>
        <button @click="cleanselectedTable" class="btn_clear_select_table">清除桌位</button>
        <p v-if="this.isTargetEditing"
          style="display: flex;flex-direction: column;margin-left: 2rem;margin-right:2rem;font-weight: bold; font-size:1.5rem;color: #748cdd;">
          你選擇的桌位：{{ select_table.table_id == "#" ? "尚未選擇" : select_table.table_id }}
          >> 目標桌位：{{ target_table.table_id == "#" ? "尚未選擇" : target_table.table_id }}</p>
        <p v-else
          style="display: flex;flex-direction: column;margin-left: 2rem;font-weight: bold; font-size:1.5rem;margin-right:2rem;color: #748cdd;">
          你選擇的桌位：{{ select_table.table_id == "#" ? "尚未選擇" : select_table.table_id }}</p>
      </div>
      <!-- 當進入編輯模式時，啟用拖曳功能 -->
      <div v-if="this.isEditing">
        <draggable v-model="this.tables_list1" animation="300" @start="onStart" @end="onEnd"
          style="display: flex;flex-direction: row; min-height: 200px;min-width: 100%;" class="list-group" tag="ul"
          :group="group_tables" v-bind="dragOptions">
          <!-- 顯示每張桌子的內容 -->
          <template #item="{ element }">
            <div>
              <div :class="['table', element.status]" :id="'table-' + element.table_id" style="margin: 0.5rem;" @click="() => {
                selectTableHandler(element);
              }">
                <!-- 根據桌子的狀態設置樣式 -->
                <div class="tableNum">
                  <div class="Num">桌號: {{ element.table_id }}</div>
                </div>
                <div class="staffId">
                  <div>員工: {{ element.staff_name }}</div>
                </div>
                <div class="status">
                  <div>{{ element.table_status == 0 ? "空位" : element.table_status == 1 ? "使用中" : element.table_status ==
                    2
                    ? "已預約" : "帶位中" }}</div>
                </div>
                <div class="booking">
                  <div>預訂: {{ element.booking_num }}</div>
                </div>
                <div class="childSeat">
                  <div>兒童座: {{ element.has_priorityseat ? '有' : '無' }}</div>
                </div>
                <div class="Seat">
                  <div>用餐人數: {{ element.guest_num }}</div>
                </div>
                <div class="bill">
                  <div>金額: 0 </div>
                </div>
              </div>
            </div>
          </template>
        </draggable>
        <div style="display: flex;flex-direction: row;">
          <draggable v-model="tables_list2" :group="group_tables_list2" animation="300" @start="onStart" @end="onEnd"
            style="display:flex;width:100%;flex-direction: column;justify-content: space-between;position: relative;min-height: 200px;min-width: 70%;"
            class="list-group" tag="ul" v-bind="dragOptions">
            <template #item="{ element }">
              <div>
                <div :class="['table', element.status]" :id="'table-' + element.table_id" style="margin: 0.5rem;"
                  @click="() => {
                    selectTableHandler(element);
                  }">
                  <!-- 根據桌子的狀態設置樣式 -->
                  <div class="tableNum">
                    <div class="Num">桌號: {{ element.table_id }}</div>
                  </div>
                  <div class="staffId">
                    <div>員工: {{ element.staff_name }}</div>
                  </div>
                  <div class="status">
                    <div>{{ element.table_status == 0 ? "空位" : element.table_status == 1 ? "使用中" : element.table_status
                      == 2
                      ? "已預約" : "帶位中" }}</div>
                  </div>
                  <div class="booking">
                    <div>預訂: {{ element.booking_num }}</div>
                  </div>
                  <div class="childSeat">
                    <div>兒童座: {{ element.has_priorityseat ? '有' : '無' }}</div>
                  </div>
                  <div class="Seat">
                    <div>用餐人數: {{ element.guest_num }}</div>
                  </div>
                  <div class="bill">
                    <div>金額: 0 </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 顯示每張桌子的內容 -->
          </draggable>
          <draggable v-model="tables_list3" :group="group_tables_list3" animation="300" @start="onStart" @end="onEnd"
            style="display:flex;flex-direction: column;justify-content: space-between;width:100%;position: relative;min-height: 200px;min-width: 70%;"
            class="list-group" tag="ul" v-bind="dragOptions">
            <template #item="{ element }">
              <div>
                <div :class="['table', element.status]" :id="'table-' + element.table_id" style="margin: 0.5rem;"
                  @click="() => {
                    selectTableHandler(element);
                  }">
                  <!-- 根據桌子的狀態設置樣式 -->
                  <div class="tableNum">
                    <div class="Num">桌號: {{ element.table_id }}</div>
                  </div>
                  <div class="staffId">
                    <div>員工: {{ element.staff_name }}</div>
                  </div>
                  <div class="status">
                    <div>{{ element.table_status == 0 ? "空位" : element.table_status == 1 ? "使用中" : element.table_status
                      == 2
                      ? "已預約" : "帶位中" }}</div>
                  </div>
                  <div class="booking">
                    <div>預訂: {{ element.booking_num }}</div>
                  </div>
                  <div class="childSeat">
                    <div>兒童座: {{ element.has_priorityseat ? '有' : '無' }}</div>
                  </div>
                  <div class="Seat">
                    <div>用餐人數: {{ element.guest_num }}</div>
                  </div>
                  <div class="bill">
                    <div>金額: 0 </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 顯示每張桌子的內容 -->
          </draggable>
        </div>
        <draggable v-model="tables_list4" :group="group_tables_list4" animation="300" @start="onStart" @end="onEnd"
          style="display:flex;flex-direction:row;width:100%;position: relative;min-height: 200px;min-width: 100%;"
          class="list-group" tag="ul" v-bind="dragOptions">
          <template #item="{ element }">
            <div>
              <div :class="['table', element.status]" :id="'table-' + element.table_id" style="margin: 0.5rem;" @click="() => {
                selectTableHandler(element);
              }">
                <!-- 根據桌子的狀態設置樣式 -->
                <div class="tableNum">
                  <div class="Num">桌號: {{ element.table_id }}</div>
                </div>
                <div class="staffId">
                  <div>員工: {{ element.staff_name }}</div>
                </div>
                <div class="status">
                  <div>{{ element.table_status == 0 ? "空位" : element.table_status == 1 ? "使用中" : element.table_status ==
                    2
                    ? "已預約" : "帶位中" }}</div>
                </div>
                <div class="booking">
                  <div>預訂: {{ element.booking_num }}</div>
                </div>
                <div class="childSeat">
                  <div>兒童座: {{ element.has_priorityseat ? '有' : '無' }}</div>
                </div>
                <div class="Seat">
                  <div>用餐人數: {{ element.guest_num }}</div>
                </div>
                <div class="bill">
                  <div>金額: 0 </div>
                </div>
              </div>
            </div>
          </template>
          <!-- 顯示每張桌子的內容 -->
        </draggable>
      </div>
      <div v-else class="noEditTableArea">
        <!-- 當不處於編輯模式時，僅顯示桌子 -->
        <div style="display: flex;min-height: 200px;min-width: 100%;">
          <div v-for="table in this.tables_list1" :key="table.table_id" :class="['table', table.status]"
            :id="'table-' + table.table_id" @click="() => {
              selectTableHandler(table);
            }">
            <div class="tableNum">
              <div class="Num">桌號: {{ table.table_id }}</div>
            </div>
            <div class="staffId">
              <div>員工: {{ table.staff_name }}</div>
            </div>
            <div class="status">
              <div>{{ table.table_status == 0 ? "空位" : table.table_status == 1 ? "使用中" : table.table_status == 2 ? "已預約"
                : "帶位中" }}
              </div>
            </div>
            <div class="booking">
              <div>預訂: {{ table.booking_num }}</div>
            </div>
            <div class="childSeat">
              <div>兒童座: {{ table.has_priorityseat ? '有' : '無' }}</div>
            </div>
            <div class="Seat">
              <div>用餐人數: {{ table.guest_num }}</div>
            </div>
            <div class="bill">
              <div>金額: 0 </div>
            </div>
          </div>
        </div>
        <div style="display: flex;flex-direction: row;">
          <div
            style="display: flex;flex-direction: column;justify-content: space-between;min-height: 200px;min-width: 70%;">
            <div v-for="table in tables_list2" :key="table.table_id" :class="['table', table.status]"
              :id="'table-' + table.table_id" @click="() => {
                selectTableHandler(table);
              }">
              <div class="tableNum">
                <div class="Num">桌號: {{ table.table_id }}</div>
              </div>
              <div class="staffId">
                <div>員工: {{ table.staff_name }}</div>
              </div>
              <div class="status">
                <div>{{ table.table_status == 0 ? "空位" : table.table_status == 1 ? "使用中" : table.table_status == 2 ?
                  "已預約"
                  : "帶位中" }}
                </div>
              </div>
              <div class="booking">
                <div>預訂: {{ table.booking_num }}</div>
              </div>
              <div class="childSeat">
                <div>兒童座: {{ table.has_priorityseat ? '有' : '無' }}</div>
              </div>
              <div class="Seat">
                <div>用餐人數: {{ table.guest_num }}</div>
              </div>
              <div class="bill">
                <div>金額: 0 </div>
              </div>
            </div>
          </div>
          <div
            style="display: flex;flex-direction: column;justify-content: space-between;min-height: 200px;min-width: 70%;">
            <div v-for="table in tables_list3" :key="table.table_id" :class="['table', table.status]"
              :id="'table-' + table.table_id" @click="() => {
                selectTableHandler(table);
              }">
              <div class="tableNum">
                <div class="Num">桌號: {{ table.table_id }}</div>
              </div>
              <div class="staffId">
                <div>員工: {{ table.staff_name }}</div>
              </div>
              <div class="status">
                <div>{{ table.table_status == 0 ? "空位" : table.table_status == 1 ? "使用中" : table.table_status == 2 ?
                  "已預約"
                  : "帶位中" }}
                </div>
              </div>
              <div class="booking">
                <div>預訂: {{ table.booking_num }}</div>
              </div>
              <div class="childSeat">
                <div>兒童座: {{ table.has_priorityseat ? '有' : '無' }}</div>
              </div>
              <div class="Seat">
                <div>用餐人數: {{ table.guest_num }}</div>
              </div>
              <div class="bill">
                <div>金額: 0 </div>
              </div>
            </div>
          </div>
        </div>
        <div style="display: flex;min-height: 200px;min-width: 100%;">
          <div v-for="table in tables_list4" :key="table.table_id" :class="['table', table.status]"
            :id="'table-' + table.table_id" @click="() => {
              selectTableHandler(table);
            }">
            <div class="tableNum">
              <div class="Num">桌號: {{ table.table_id }}</div>
            </div>
            <div class="staffId">
              <div>員工: {{ table.staff_name }}</div>
            </div>
            <div class="status">
              <div>{{ table.table_status == 0 ? "空位" : table.table_status == 1 ? "使用中" : table.table_status == 2 ? "已預約"
                : "帶位中" }}
              </div>
            </div>
            <div class="booking">
              <div>預訂: {{ table.booking_num }}</div>
            </div>
            <div class="childSeat">
              <div>兒童座: {{ table.has_priorityseat ? '有' : '無' }}</div>
            </div>
            <div class="Seat">
              <div>用餐人數: {{ table.guest_num }}</div>
            </div>
            <div class="bill">
              <div>金額: 0 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="this.isEditTable" class="full-screen-form">
      <form class="input_add_table">
        <div style="display: flex; justify-content: space-between;align-items: center">
          <h2>桌號：{{ input_table.table_id == "#" ? "未選擇" : input_table.table_id }}</h2>
          <button @click="cancelEditTable" style="border: none;background-color: unset;cursor: pointer;"><i
              class="fa-solid fa-xmark fa-2xl" style="color: #7b90da;font-size: 4dvh;"></i></button>
        </div>
        <div style="display: flex; justify-content: space-between;align-items: center">
          <h5>員工：</h5>
          <select v-model="input_table.staff_id" style="width: 78%;">
            <option v-for="working_staff in working_staff_list" :key="working_staff_list.staff_id"
              :value="working_staff.staff_id">{{ working_staff.staff_name }}</option>
          </select>
        </div>
        <div style="display: flex; justify-content: space-between;align-items: center">
          <h5>客人姓名：</h5>
          <input v-model="input_table.guest_name" type="text" maxlength="10">
          <h5>客人電話：</h5>
          <input v-model="input_table.guest_phone" type='text' maxlength="10" />
        </div>
        <div style="display: flex; justify-content: space-between;align-items: center">
          <h5>訂位：<br>(0:未訂位)</h5>
          <select v-model="input_table.booking_num">
            <option :value="0">0</option>
            <option v-for="booking in this.booking_list_today" :key="booking.bookingNum" :value="booking.bookingNum">{{
              booking.bookingNum }}</option>
          </select>
          <h5>桌位狀態：</h5>
          <select v-model="input_table.table_status">
            <option :value="0">空位</option>
            <option :value="1">使用中</option>
            <option :value="2">已預約</option>
            <option :value="3">帶位中</option>
          </select>
        </div>
        <div style="display: flex; justify-content: space-between;align-items: center">
          <h5>最大容納人數：</h5>
          <input v-model="input_table.max_guest_num" type="number" min="0" max="10">
          <h5>用餐人數：</h5>
          <input v-model="input_table.guest_num" type="number" min="0" max="10">
        </div>
        <div style="display: flex; justify-content: space-between;align-items: center">
          <h5>用餐區：</h5>
          <select v-model="input_table.table_area">
            <option v-for="table_area in this.nav_item_list" :value="table_area">{{ table_area }}</option>
          </select>
          <h5>兒童座：</h5>
          <select v-model="input_table.has_priorityseat">
            <option :value="true">有</option>
            <option :value="false">無</option>
          </select>
        </div>
        <div style="display: flex; width: 100%; justify-content: space-between">
          <a href="javascript: void(0)" class="boxBtn" @click="postTableHandler">
            <div>
              <span>提交</span>
            </div>
          </a>
          <a href="javascript: void(0)" class="boxBtn" @click="deleteTableHandler">
            <div>
              <span>刪除</span>
            </div>
          </a>
        </div>
      </form>
    </div>
  </div>
  <div style="display: flex;align-items: center; justify-content: space-between;padding-right: 2dvw">
    <h2 style="color:#748cdd;margin-left: 1rem;font-size: 1.5rem; ">你預計新增桌位如下：</h2>
    <a @click="addTableHandler"><i class="fa-solid fa-circle-plus fa-2xl"
        style="color: #7b90da;font-size: 4dvh;"></i></a>
  </div>
  <div style="display: flex;align-items:start;justify-content: space-between;">
    <div id="add_app">
      <draggable v-if="this.isEditing" v-model="add_table_list" animation="300" @start="onStart" @end="onEnd"
        style="display: flex;min-height: 200px;min-width: 200px;" class="list-group" tag="ul"
        :group="group_add_table_list">
        <!-- 顯示每張桌子的內容 -->
        <template #item="{ element }">
          <div>
            <div :class="['table', element.status]" :id="'table-' + element.table_id" style="margin: 0.5rem;">
              <!-- 根據桌子的狀態設置樣式 -->
              <div class="tableNum">
                <div class="Num">桌號: {{ element.table_id }}</div>
              </div>
              <div class="staffId">
                <div>員工: {{ element.staff_name }}</div>
              </div>
              <div class="status">
                <div>{{ element.table_status == 0 ? "空位" : element.table_status == 1 ? "使用中" : element.table_status == 2
                  ? "已預約" : "帶位中" }}</div>
              </div>
              <div class="booking">
                <div>預訂: {{ element.booking_num }}</div>
              </div>
              <div class="childSeat">
                <div>兒童座: {{ element.has_priorityseat ? '是' : '否' }}</div>
              </div>
              <div class="Seat">
                <div>用餐人數: {{ element.guest_num }}</div>
              </div>
            </div>
          </div>
        </template>
      </draggable>
      <div v-else class="noEditTableArea">
        <!-- 當不處於編輯模式時，僅顯示桌子 -->
        <div style="display: flex;">
          <div v-for="table in add_table_list" :key="table.table_id" :class="['table', table.status]"
            :id="'table-' + table.table_id" @click="() => {
              selectTableHandler(table);
            }">
            <div class="tableNum">
              <div class="Num">桌號: {{ table.table_id }}</div>
            </div>
            <div class="staffId">
              <div>員工: {{ table.staff_name }}</div>
            </div>
            <div class="status">
              <div>{{ table.table_status == 0 ? "空位" : table.table_status == 1 ? "使用中" : table.table_status == 2 ? "已預約"
                : "帶位中" }}
              </div>
            </div>
            <div class="booking">
              <div>預訂: {{ table.booking_num }}</div>
            </div>
            <div class="childSeat">
              <div>兒童座: {{ table.has_priorityseat ? '有' : '無' }}</div>
            </div>
            <div class="Seat">
              <div>用餐人數: {{ table.guest_num }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import draggable from "vuedraggable";
import Swal from "sweetalert2";
// 導入 vuedraggable 用於實現拖曳功能
export default {
  components: {
    draggable // 將 draggable 組件套用在此vue上
  },
  props: {
    nav_item_list: [],
    selected_item: "",
  },
  data() {
    return {
      isTable_Change_count: 0,
      booking_list_today: [],
      tables: [],
      tables_list1: [],
      isreload: false,
      isEditTable: false,
      table_count: 0,
      input_table: { table_id: "#" },
      target_table: { table_id: "#" },
      isTargetEditing: false,
      isEditing: false, // 判斷是否為編輯模式的變數
      working_staff_list: [],//已上工的員工列表
      group_tables: {
        name: "site",
        pull: true,
        put: true
      },
      select_table: { table_id: "#" },
      tables_list2: [],
      group_tables_list2: {
        name: "site",
        pull: true,
        put: true
      },
      add_table_list: [],
      group_add_table_list: {
        name: "site",
        pull: true,
        put: true
      },
      tables_list3: [],
      group_tables_list3: {
        name: "site",
        pull: true,
        put: true
      },
      tables_list4: [],
      group_tables_list4: {
        name: "site",
        pull: true,
        put: true
      },
    };
  },
  methods: {
    cleanselectedTable() {
      this.select_table = { table_id: "#" };
      this.input_table = { table_id: "#" };
      this.target_table = { table_id: "#" };
      sessionStorage.removeItem("selected_table");
      sessionStorage.removeItem("selected_target_table");
      this.$emit("selected_table", this.select_table);
      this.$emit("selected_target_table", this.target_table);
    },
    cancelEditTable() {
      this.isEditTable = false;
    },
    async postTableHandler() {
      if (this.input_table.table_id == "#") {
        Swal.fire({
          title: "你沒有選擇桌位！請選擇桌位後再編輯", showConfirmButton: true,
          confirmButtonColor: "#00c5c8", confirmButtonText: "確定",
          icon: 'error', iconColor: "#00c5c8"
        })
        return;
      }
      this.input_table.status = (this.input_table.table_status === 0 ? "available" : this.input_table.table_status === 1 ? "in-use" : "reserved");
      let table_json = {};
      table_json["max_guest_num"] = this.input_table["max_guest_num"];
      table_json["staff_id"] = this.input_table["staff_id"];
      table_json["table_id"] = this.input_table["table_id"];
      table_json["lastmodified_staff_id"] = this.working_staff_list[0].staff_id;
      table_json["booking_num"] = this.input_table["booking_num"];
      table_json["has_priorityseat"] = this.input_table["has_priorityseat"];
      table_json["table_status"] = this.input_table["table_status"];
      table_json["table_area"] = this.input_table["table_area"];
      table_json["guest_name"] = this.input_table["guest_name"];
      table_json["guest_phone"] = this.input_table["guest_phone"];
      table_json["guest_num"] = this.input_table["guest_num"];
      if (this.input_table["table_id"] == 0) {
        //新增時使用POST
        table_json["table_id"] = 0;
        try {
          const response = await fetch(`http://localhost:8080/table`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(table_json)
          });
          if (response.status != 201) {
            throw new Error("Network response was not ok");
          } else {
            const data = await response.json();
            Swal.fire({
              title: `新增桌號： ${data["table_id"]} 成功！`, showConfirmButton: true,
              confirmButtonColor: "#00c5c8", confirmButtonText: "確定",
              icon: 'success', iconColor: "#00c5c8"
            }).then((res) => {
              if (res.isConfirmed) {
                window.location.reload();
              }
            })
          }
        } catch (error) {
          console.error("Error fetching table data:", error);
        }
      } else {
        //編輯桌位時使用PUT
        table_json["table_id"] = this.input_table["table_id"];
        try {
          const response = await fetch(`http://localhost:8080/table`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(table_json)
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          } else {
            Swal.fire({
              title: `編輯桌號： ${table_json["table_id"]} 成功！`, showConfirmButton: true,
              confirmButtonColor: "#00c5c8", confirmButtonText: "確定",
              icon: 'success', iconColor: "#00c5c8"
            }).then((res) => {
              if (res.isConfirmed) {
                window.location.reload();
              }
            })
          }
        } catch (error) {
          console.error("Error fetching table data:", error);
        }
      }
      this.input_table = {};
      this.select_table = {};
    },
    async deleteTableHandler() {
      try {
        const response = await fetch(`http://localhost:8080/table/${this.input_table.table_id}`, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          Swal.fire({
            title: `刪除桌號： ${this.input_table.table_id} 成功！`, showConfirmButton: true,
            confirmButtonColor: "#00c5c8", confirmButtonText: "確定",
            icon: 'success', iconColor: "#00c5c8"
          }).then((res) => {
            if (res.isConfirmed) {
              window.location.reload();
            }
          })
        }
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    },
    selectTableHandler(table) {
      this.isEditTable = true;
      if (this.isTargetEditing) {
        this.target_table = table;
        this.$emit("selected_target_table", this.target_table);
        sessionStorage.setItem("selected_target_table", JSON.stringify(this.target_table));
      } else {
        this.select_table = table;
        this.$emit("selected_table", this.select_table);
        sessionStorage.setItem("selected_table", JSON.stringify(this.select_table));
      }
      this.input_table = table;
      console.log(this.input_table);
    },
    async addTableHandler() {
      let add_table = {};
      add_table.staff_name = this.working_staff_list[0].staff_name;
      add_table.staff_id = this.working_staff_list[0].staff_id;
      add_table.max_guest_num = 1;
      add_table.guest_num = 0;
      add_table.booking_num = 0;
      add_table.has_priorityseat = false;
      add_table.max_guest_num = 4;
      add_table.table_status = 0;
      add_table.status = "available";
      add_table.guest_name = "";
      add_table.guest_phone = "";
      add_table.lastmodified_staff_id = this.working_staff_list[0].staff_id;
      add_table.table_area = "一般區";
      add_table.table_id = 0;
      this.add_table_list.push(add_table);
    },
    openEditTable() {

    },
    toggleEdit(e) {
      this.isEditing = !this.isEditing;
      console.log(this.isEditing);
      if (this.isEditing) {
        e.target.className = "btn_adjust_table";
      } else {
        e.target.className = "btn_not_adjust_table";
      }
    },
    toggleTarget(e) {
      this.isTargetEditing = !this.isTargetEditing;
      console.log(this.isTargetEditing);
      if (this.isTargetEditing) {
        e.target.className = "btn_target_table";
      } else {
        e.target.className = "btn_cancel_target_table";
      }

    },
    async getTables() {
      let selected_title_item = "一般區";
      if (sessionStorage.getItem("selected_item")) {
        selected_title_item = sessionStorage.getItem("selected_item");
      }
      try {
        const response = await fetch("http://localhost:8080/table");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        this.tables = data.map((table, i) => ({
          ...table,
          //0:空位、1:使用中、2:已預約、3:帶位中
          status:
            table.table_status === 0 ? "available" : table.table_status === 1 ? "in-use" : table.table_status === 2 ? "reserved" : "take"
        })).filter((item) => { return item["table_area"] == selected_title_item });
        this.tables_list1 = this.tables;
        this.$emit("tables", this.tables);
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    },
    async getBookingsToday() {
      try {
        const response = await fetch("http://localhost:8080/reserve/search");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const data_lists =
          data.reserveList.filter((item) => {
            const TIME = 24 * 60 * 60 * 1000;
            let duration = new Date().getTime() - new Date(item.date).getTime();
            if (duration < 0) {
              return false;
            }
            if (duration > TIME) {
              return false;
            }
            return true;
          })
        this.booking_list_today = data_lists;
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    },
    saveTableOrder() {
      // 保存新的桌子排序
      console.log("新的桌子順序:", this.tables);
    },
    async fetchWorkingStaffs() {
      try {
        const response = await fetch("http://localhost:8080/staff/isworking", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: "BBB@yahoo.com",
            password: "123"
          }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        this.working_staff_list = data;
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
  created() {
    if (sessionStorage.getItem("selected_table")) {
      this.select_table = JSON.parse(sessionStorage.getItem("selected_table"));
    };
    if (sessionStorage.getItem("selected_target_table")) {
      this.target_table = JSON.parse(sessionStorage.getItem("selected_target_table"));
    };
    this.fetchWorkingStaffs();
    this.getTables();
    this.getBookingsToday();
  },
};
</script>

<style scoped lang="scss">
.table {
  width: 136px;
  margin: 10px;
  text-align: center;
  line-height: 1.5em;
  /* 行高設置為1.5倍的字體大小 */
  border: 1px solid #ccc;
  padding: 10px;
  /* 添加內邊距 */
  border-radius: 8px;
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

.take {
  background-color: #ddce4a;
}

#tableTop {
  width: 100%;
  flex-direction: column;
  max-height: 80vh;
  padding: 1%;
  margin: 1rem;
  border: 2px solid #7b90da;
  border-radius: 8px;
  overflow: scroll;
  background-color: rgba(116, 140, 211, 0.1);

  * {
    box-sizing: content-box;
  }

  .tableNum {
    width: 100%;
    font-size: 25px;
    display: flex;
    justify-content: baseline;
    color: white;
  }

  .status {
    width: 100%;
    display: flex;
    font-size: 2rem;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 1.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .staffId,
  .booking,
  .time,
  .childSeat,
  .Seat,
  .bill {
    font-size: 1rem;
    width: 100%;
    display: flex;
    justify-content: start;
    color: white;
  }

  button {
    background: #7b90da;
    color: white;
  }
}

#add_app {
  flex-direction: column;
  width: 100%;
  padding: 1%;
  max-height: 30vh;
  margin: 1rem;
  border: 2px solid #748cdd;
  overflow: scroll;
  border-radius: 5px;

  .tableNum {
    width: 100%;
    font-size: 25px;
    display: flex;
    justify-content: baseline;
    color: white;
  }

  .status {
    width: 100%;
    display: flex;
    align-items: center;
    color: white;
    font-size: 1.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .staffId,
  .booking,
  .time,
  .childSeat,
  .Seat {
    width: 100%;
    display: flex;
    justify-content: start;
    color: white;
  }
}

.input_add_table {
  max-height: 80vh;
  margin: 1rem;
  width: 70%;
  // overflow-y: scroll;
  padding: 1rem 2.5dvw;
  display: flex;
  flex-direction: column;
  color: #7b90da;
  border: 2px solid #7b90da;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

  div {
    margin-top: 0.5rem;
    height: 8vh;

    select,
    input {
      width: 25%;
      font-size: 2.5dvh;
      background-color:rgba(116 , 140, 211,0.2);
      border: none;
      border-radius: 5px;
      height: 4dvh;
    }

    h5 {
      font-size: 2.25dvh;
      font-weight: bold;
      width: 12dvw;
    }
  }
}

.full-screen-form {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.noEditTableArea {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 200px;

  .tableNum {
    width: 100%;
    min-width: 200px;
    display: flex;
    justify-content: baseline;
  }

  .status {
    width: 100%;
    display: flex;
    align-items: center;
    color: white;
    font-size: 1.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .staffId,
  .booking,
  .time,
  .childSeat,
  .Seat {
    width: 100%;
    display: flex;
    justify-content: start;
    color: white;
  }
}

.boxBtn {
  // margin-top: 1rem;
  width: 9dvw;
  background: #FFFFFF;
  border: 2px solid #7b90da;
  border-radius: 8px;
  transform: translate3d(0px, 0%, 0px);
  font-size: 2.25dvh;
  // font-weight: bold;
  text-align: center;
  text-decoration: none;
  transition-delay: 0.6s;
  overflow: hidden;
  height: 6dvh;
  padding-top: 1dvh;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    transition: all 0.6s ease;
  }

  &:before {
    background: #7b90da;
    border-radius: 50% 50% 0 0;
    transform: translateY(100%) scaleY(0.5);
  }

  &:after {
    background: #FFFFFF;
    border-radius: 0;
    transform: translateY(0) scaleY(1);
  }

  div {
    position: relative;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 32px;
    text-transform: uppercase;
    overflow: hidden;
  }

  span {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    z-index: 1;
    text-align: center;
    transition: transform 0.5s ease;

    &:first-child {
      color: #FFFFFF;
      transform: translateY(24px);
    }

    &:last-child {
      color: #7b90da;
      transform: translateY(0);
    }
  }

  &:hover {
    background: #7b90da;
    transition: #7b90da 0.2s linear;
    transition-delay: 0.6s;
    color: #FFFFFF;
  }

  &:hover::after {
    border-radius: 0 0 50% 50%;
    transform: translateY(-100%) scaleY(0.5);
    transition-delay: 0;
  }

  &:hover:before {
    border-radius: 0;
    transform: translateY(0) scaleY(1);
    transition-delay: 0;
  }
}

.btn:hover span:first-child {
  transform: translateY(0);
}

.btn:hover span:last-child {
  transform: translateY(-32px);
}

.btn_adjust_table {
  background-color: #e76f51;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 18px;
  font-family: monospace;
  color: white;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  cursor: pointer;
}

.btn_not_adjust_table {
  background-color: #3AD2D0;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 18px;
  font-family: monospace;
  color: white;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  cursor: pointer;
}

.btn_clear_select_table {
  background-color: #3AD2D0;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 18px;
  font-family: monospace;
  color: white;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  cursor: pointer;
}

.btn_target_table {
  background-color: #e76f51;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 18px;
  font-family: monospace;
  color: white;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  cursor: pointer;
}

.btn_cancel_target_table {
  background-color: #3AD2D0;
  background-color: #3AD2D0;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 18px;
  font-family: monospace;
  color: white;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  cursor: pointer;
}

.swal_selected_table {
  color: #00c5c8;
  font-size: 5rem;
}
</style>