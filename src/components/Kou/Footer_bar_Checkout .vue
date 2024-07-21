<template>
  <div>
    <v-dialog max-width="50%" style="z-index: 2;">
      <template v-slot:activator="{ props: activatorProps }">
        <button v-bind="activatorProps" class="template_dialog_btn">合併結帳</button>
      </template>

      <template v-slot:default="{ isActive }" class="template_dialog">
        <v-card>
          <template v-slot:text>
            <div class="dialog">
              <h2>確定合併結帳？</h2>
              <div class="tables">
                <div class="tables_body">
                  <h2>選擇桌位</h2>
                  <div v-if='this.selected_table.table_id !== "#"'>
                    <p>桌號：{{ this.selected_table.table_id }}</p>
                    <p>客人姓名：{{ this.selected_table.guest_name }}</p>
                    <p>客人電話：{{ this.selected_table.guest_phone }}</p>
                    <p>訂位編號：{{ this.selected_table.booking_num == 0 ? "未訂位" : this.selected_table.booking_num }}</p>
                    <p>用餐人數：{{ this.selected_table.guest_num }} 人</p>
                    <p>桌位狀態：{{ this.selected_table.table_status == 0 ? "空位" : this.selected_table.table_status == 1 ?
                      "使用中":"已預約"}}</p>
                    <p>用餐區域：{{ this.selected_table.table_area }}</p>
                    <p>孩童座：{{ this.selected_table.has_priorityseat ? "有" : "無" }}</p>
                  </div>
                  <div v-else>
                    <p>桌號：尚未未選擇</p>
                    <p>請先選擇有桌號的座位</p>
                  </div>
                </div>
                <div class="tables_plus"><i class="fa-solid fa-plus fa-2xl" style="color: #7b90da;"></i></div>
                <div class="tables_body">
                  <h2>目標桌位</h2>
                  <div v-if='this.selected_target_table.table_id !== "#"'>
                    <p>桌號：{{ this.selected_target_table.table_id }}</p>
                    <p>客人姓名：{{ this.selected_target_table.guest_name }}</p>
                    <p>客人電話：{{ this.selected_target_table.guest_phone }}</p>
                    <p>訂位編號：{{ this.selected_target_table.booking_num == 0 ? "未訂位" : this.selected_target_table.booking_num }}
                    </p>
                    <p>用餐人數：{{ this.selected_target_table.guest_num }} 人</p>
                    <p>桌位狀態：{{ this.selected_target_table.table_status == 0 ? "空位" :
                      this.selected_target_table.table_status == 1? "使用中":"已預約"}}</p>
                    <p>用餐區域：{{ this.selected_target_table.table_area }}</p>
                    <p>孩童座：{{ this.selected_target_table.has_priorityseat ? "有" : "無" }}</p>
                  </div>
                  <div v-else>
                    <p>桌號：尚未未選擇</p>
                    <p>請先選擇有桌號的座位</p>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <v-card-actions>
            <v-spacer></v-spacer>
            <button @click="btnHandler" class="click_btn">確認</button>
            <button @click="isActive.value = false" class="cancel_btn">返回</button>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>
<style lang="scss" scoped>
.template_dialog_btn {
  border: none;
  font-size: 1.5rem;
  color: white;
  background-color: unset;

  &:hover {
    background-color: #a8afc9;
    cursor: pointer;
    border-radius: 8px;
  }
}

.click_btn {
  border: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 0.5rem;
  background-color: #748cdd;

  &:hover {
    background-color: #a8afc9;
    cursor: pointer;
    border-radius: 8px;
  }
}

.cancel_btn {
  border: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  margin-left: 1rem;
  color: black;
  background-color: rgb(211, 211, 211);

  &:hover {
    background-color: #e0e0e0;
    cursor: pointer;
  }
}

div.dialog {
  display: flex;
  flex-direction: column;
  color: #748cdd;

  h2 {
    margin-left: 1rem;
    margin-bottom: 1rem;
  }

  .tables {
    display: flex;
    min-width: 100%;
    align-items: center;

    .tables_body {
      min-width: 40%;
      min-height: 40vh;
      border: 2px solid #748cdd;
      padding: 1rem;
      border-radius: 1rem;

      p {
        font-size: 1.2rem;
        margin-left: 1rem;
      }
    }

    .tables_plus {
      text-align: center;
      margin: 0 1dvw;
    }
  }
}
</style>
<script>
import Swal from "sweetalert2";
export default {
  data() {
    return {
    }
  },
  props: {
    selected_table: Object,
    selected_target_table: Object
  },
  methods: {
    btnHandler() {
      if (this.selected_table.table_id == "#" || this.selected_target_table.table_id == "#") {
        Swal.fire({
          title: "你尚未選擇桌位！請重新選擇桌位或是提交桌位再合併結帳", showConfirmButton: true,
          confirmButtonColor: "#00c5c8", confirmButtonText: "確定",
          icon: 'error', iconColor: "#00c5c8"
        })
        return;
      } else {
        this.$router.push({
          name: "OrderPage",
          query: {
            selected_table: JSON.stringify(this.selected_table),
            selected_target_table: JSON.stringify(this.selected_target_table),
          }
        });
      }
    }
  }
}
</script>