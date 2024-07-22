<script>
import Table from "@/components/Kou/Table.vue";
import ChangeTableArea from "@/components/Kou/ChangeTableArea.vue";
import Footer_bar_ChangeTable from "@/components/Kou/Footer_bar_ChangeTable.vue";
import Footer_bar_Checkout from "@/components/Kou/Footer_bar_Checkout .vue";
import Footer_bar_Order from "@/components/Kou/Footer_bar_Order.vue";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      selected_item: "一般區",
      selected_table: { table_id: "#" },
      selected_target_table: { table_id: "#" },
      menuOpen: false,
      selectedtable_id: 0,
      nav_item_list: [],
      tables: []
    };
  },
  methods: {
    async cleanTablesHander() {
      Swal.fire({
        title: '是否清除桌位狀態？',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonColor: "#748cdd",
        confirmButtonText: "確定",
        cancelButtonText: "取消"
      }).then(async (res) => {
        if (res.isConfirmed) {
          for (let i = 0; i < this.tables.length; i++) {
            let table_json = {};
            table_json["max_guest_num"] = this.tables[i]["max_guest_num"];
            table_json["staff_id"] = this.tables[i]["staff_id"];
            table_json["table_id"] = this.tables[i]["table_id"];
            table_json["lastmodified_staff_id"] = this.tables[i]["lastmodified_staff_id"]
            table_json["booking_num"] = this.tables[i]["booking_num"];
            table_json["has_priorityseat"] = this.tables[i]["has_priorityseat"];
            table_json["table_status"] = 0;
            table_json["table_area"] = this.tables[i]["table_area"];
            table_json["guest_name"] = this.tables[i]["guest_name"];
            table_json["guest_phone"] = this.tables[i]["guest_phone"];
            table_json["guest_num"] = this.tables[i]["guest_num"];
            try {
              const response = await fetch(`http://localhost:8080/table`, {
                method: "PUT",
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(table_json)
              });
              if (response.status != 200) {
                throw new Error("Network response was not ok");
              }
            } catch (error) {
              console.error("Error fetching table data:", error);
            }
          }
          Swal.fire({
            title: "清除桌位狀態成功！", showConfirmButton: true,
            confirmButtonColor: "#748cdd", confirmButtonText: "確定",
            icon: 'success', iconColor: "#748cdd"
          }).then((res) => {
            if (res.isConfirmed) {
              window.location.reload();
            }
          })
        } else {
          return
        }
      })
    },
    TakeBillHandler() {
      if (this.selected_table.table_id == "#") {
        Swal.fire({
          title: "你還沒有選取桌位，請重新選擇！", showConfirmButton: true,
          confirmButtonColor: "#748cdd", confirmButtonText: "確定",
          icon: 'error', iconColor: "#748cdd"
        })
        return;
      } else {

      }
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    GetTables(tables) {
      this.tables = tables;
    },
    orderHandler() {
      this.$router.push("OrderPage");
    },
    Getselected_table(selected_table) {
      this.selected_table = selected_table;
    },
    Getselected_target_table(selected_target_table) {
      this.selected_target_table = selected_target_table;
    },
    Getnav_item_list(nav_item_list) {
      this.nav_item_list = nav_item_list;
    },
    async TakeTableHandler() {
      if (this.selected_table.table_id == "#") {
        Swal.fire({
          title: "你還沒有選取桌位，請重新選擇！", showConfirmButton: true,
          confirmButtonColor: "#748cdd", confirmButtonText: "確定",
          icon: 'error', iconColor: "#748cdd"
        })
        return;
      } else if (this.selected_table.table_status == 0) {
        let table_json = {};
        table_json["max_guest_num"] = this.selected_table["max_guest_num"];
        table_json["staff_id"] = this.selected_table["staff_id"];
        table_json["table_id"] = this.selected_table["table_id"];
        table_json["lastmodified_staff_id"] = this.selected_table["lastmodified_staff_id"];
        table_json["booking_num"] = this.selected_table["booking_num"];
        table_json["has_priorityseat"] = this.selected_table["has_priorityseat"];
        table_json["table_status"] = 3;
        table_json["table_area"] = this.selected_table["table_area"];
        table_json["guest_name"] = this.selected_table["guest_name"];
        table_json["guest_phone"] = this.selected_table["guest_phone"];
        table_json["guest_num"] = this.selected_table["guest_num"];
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
              title: `桌號：${table_json["table_id"]} 帶位成功！`, showConfirmButton: true,
              confirmButtonColor: "#748cdd", confirmButtonText: "確定",
              icon: 'success', iconColor: "#748cdd"
            }).then((res) => {
              if (res.isConfirmed) {
                this.selected_table = { table_id: "#" };
                window.location.reload();
              }
            })
          }
        } catch (error) {
          console.error("Error fetching table data:", error);
        }
      }
      else {
        Swal.fire({
          title: "該桌位須為空位才能選擇，請重新選擇！", showConfirmButton: true,
          confirmButtonColor: "#748cdd", confirmButtonText: "確定",
          icon: 'error', iconColor: "#748cdd"
        })
        return;
      }
    }
  },
  created() {
    if (sessionStorage.getItem("token") == null) {
      this.$router.push({ name: 'home' });
      Swal.fire({
        title: "你還沒有登入，將轉向登入頁面！", showConfirmButton: true,
        confirmButtonColor: "#748cdd", confirmButtonText: "確定",
        icon: 'error', iconColor: "#748cdd"
      });
    }
    if (sessionStorage.getItem("selected_table")) {
      this.selected_table = JSON.parse(sessionStorage.getItem("selected_table"));
    }
    if (sessionStorage.getItem("selected_target_table")) {
      this.selected_target_table = JSON.parse(sessionStorage.getItem("selected_target_table"));
    }
    if (sessionStorage.getItem("selected_item")) {
      this.selected_item = sessionStorage.getItem("selected_item");
    }
  },
  components: {
    Table,
    ChangeTableArea,
    Footer_bar_ChangeTable,
    Footer_bar_Checkout,
    Footer_bar_Order
  },
};
</script>
<template>
  <!-- body = 包住全部東西的最大div -->
  <div class="body">
    <div class="headerArea">
      <h2>{{ this.selected_item }}</h2>
      <ChangeTableArea class="areaBtn" v-on:nav_item_list="Getnav_item_list"></ChangeTableArea>
    </div>
    <!-- second Area = 中間桌子的區塊 -->
    <div class="second">
      <Table v-on:tables="GetTables" :nav_item_list="nav_item_list" v-on:selected_table="Getselected_table"
        v-on:selected_target_table="Getselected_target_table" />
    </div>
    <div class="footer Area">
      <!-- footerHam = footer裡面的漢堡圖區塊 -->
      <div class="footerHam">
        <div id="app">
          <div class="menuBar">
            <div class="hamburgerArea" @click="toggleMenu">
              <i class="fa-solid fa-bars fa-2xl" style="color: #ffffff;"></i>
            </div>
            <transition name="slide">
              <div v-if="menuOpen" class="menu-content">
                <button class="menu-item" href="#">開錢櫃</button>
                <button class="menu-item" @click="TakeBillHandler">結帳</button>
                <Footer_bar_ChangeTable :selected_table="selected_table"
                  :selected_target_table="selected_target_table" />
                <Footer_bar_Checkout :selected_table="selected_table" :selected_target_table="selected_target_table" />
                <button class="menu-item" @click="TakeTableHandler">帶位</button>
                <button class="menu-item" @click="cleanTablesHander">清除狀態</button>
                <Footer_bar_Order :selected_table="selected_table" :selected_target_table="selected_target_table" />
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
/* body = 包住全部內容的最大div */
:active {
  background-color: unset;
  color: unset;
  border: unset;
}

.body {
  width: 100%;
  height: 90vh;
  display: flex;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
  // padding: 0 2%
  /* align-items: center; */
}

.headerArea {
  width: 97%;
  margin: 0 auto;
  height: 60px;
  border: 2px solid #748cdd;
  border-radius: 10px;
  padding-top: 10px;
  position: relative;
  line-height: 10px;

  /* header的"訂位" */
  /* header的漢堡圖區塊 */
  h2 {
    color: #748cdd;
    text-align: center;
    font-weight: bold;
  }

  .areaBtn {
    position: absolute;
    right: 30px;
    top: 12px;
  }
}

/* 中間的桌子區塊 */
.second {
  width: 100%;
  height: 80%;

  // border: 1px solid black;
  // padding-top: 1%;
  .square {
    width: 150px;
    height: 150px;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px;

  }

  .container {
    display: flex;
    flex-wrap: wrap;
  }
}

.footer {
  width: 95%;
  height: 10%;
  /* border: 1px solid black; */
  display: flex;
  justify-content: right;
  align-items: center;

  /* 最底下的漢堡圖區塊 */
  #app {
    text-align: center;
  }

  .menuBar {
    position: fixed;
    bottom: 1%;
    right: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4rem;
    width: 4dvw;
    border-radius: 50%;
    background:  rgb(123, 144, 218);
  }

  .hamburgerArea {
    // width: 2vh;
    // padding: 1rem;
    cursor: pointer;
  }

  .menu-content {
    position: absolute;
    height: 42px;
    width: 1605%;
    top: 0px;
    right: 68px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background: linear-gradient(90deg, rgb(123, 144, 218), #a8afc9);
    background:  rgb(123, 144, 218);
    border-radius: 20px;
    padding: 10px 20px;
    z-index: 10;

    button {
      background: none;
      border: none;
      color: #748cdd;
    }

    *.menu-item {
      cursor: pointer;
      color: white;
      margin: 0 10px;
      text-decoration: none;
      padding: 0.1rem 0.15rem;
      font-size: 1.4rem;

      &:hover {
        background-color: #a8afc9;
        border-radius: 8px
      }
    }
  }

  .footerHam {
    margin-right: 2%;
  }
}
</style>
