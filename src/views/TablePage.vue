<script>
import TablePage from "@/components/Kou/Table.vue";
import ChangeTableArea from "@/components/Kou/ChangeTableArea.vue";
import Footer_bar_ChangeTable from "@/components/Kou/Footer_bar_ChangeTable.vue";
import Footer_bar_Checkout from "@/components/Kou/Footer_bar_Checkout .vue";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      selected_table:{table_id:"#"},
      selected_item:"",
      selected_target_table:{table_id:"#"},
      menuOpen: false,
      tables: [],
      selectedtable_id:0,
      nav_item_list:[],
    };
  },
  methods: {
    async cleanTablesHander(){
      Swal.fire({title: '是否清除桌位狀態？：',
        showConfirmButton:true,
        showCancelButton:true,
        confirmButtonColor:"#00c5c8",
        confirmButtonText:"確定",
        cancelButtonText:"取消"}).then(async(res)=>{
          if(res.isConfirmed){
            for(let i=0;i<this.tables.length;i++){
                let table_json = {};
                table_json["max_guest_num"] = this.tables[i]["max_guest_num"];
                table_json["staff_id"] = this.tables[i]["staff_id"];
                table_json["table_id"] = this.tables[i]["table_id"];
                table_json["lastmodified_staff_id"] = this.tables[i]["lastmodified_staff_id"]
                table_json["booking_num"] = this.tables[i]["booking_num"];
                table_json["has_priorityseat"] = this.tables[i]["has_priorityseat"];
                table_json["table_status"]=0;
                table_json["table_area"] = this.tables[i]["table_area"];
                table_json["guest_name"] =this.tables[i]["guest_name"];
                table_json["guest_phone"] =this.tables[i]["guest_phone"];
                table_json["guest_num"] = this.tables[i]["guest_num"];
                try {
                    const response = await fetch(`http://localhost:8080/table`,{
                      method:"PUT",
                      headers: {
                      'Content-Type': 'application/json',
                      },
                      body:JSON.stringify(table_json)
                    });
                    if (response.status !=200) {
                      throw new Error("Network response was not ok");
                    }
                  } catch (error) {
                    console.error("Error fetching table data:", error);
                  } 
            }
            Swal.fire({title:"清除桌位狀態成功！",showConfirmButton:true,
            confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
            icon:'success',iconColor:"#00c5c8"}).then((res)=>{
              if(res.isConfirmed){
                window.location.reload();
              }
            })
            
          }else{
            return
          }
        })
    },
    GetSelected_item(item){
      this.selected_item = item;
    },
    GetSelected_target_table(table){
      this.selected_target_table = table;
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    orderHandler(){
      this.$router.push("OrderPage");
    },
    GetSelected_table(table){
      this.selected_table =table;
    },
    GetTables(tables){
      this.tables = tables;
    },
    Getnav_item_list(nav_item_list){
      this.nav_item_list=nav_item_list;
    },
    async TakeTableHandler(){
      if(this.selected_table.table_id == "#"){
        Swal.fire({title:"你還沒有選取桌位，請重新選擇！",showConfirmButton:true,
            confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
            icon:'error',iconColor:"#00c5c8"})
            return;
      }else if(this.selected_table.table_status==0){
        let table_json = {};
        table_json["max_guest_num"] = this.selected_table["max_guest_num"];
        table_json["staff_id"] = this.selected_table["staff_id"];
        table_json["table_id"] = this.selected_table["table_id"];
        table_json["lastmodified_staff_id"] = this.selected_table["lastmodified_staff_id"];
        table_json["booking_num"] = this.selected_table["booking_num"];
        table_json["has_priorityseat"] = this.selected_table["has_priorityseat"];
        table_json["table_status"]=3;
        table_json["table_area"] = this.selected_table["table_area"];
        table_json["guest_name"] =this.selected_table["guest_name"];
        table_json["guest_phone"] =this.selected_table["guest_phone"];
        table_json["guest_num"] = this.selected_table["guest_num"];
        try {
            const response = await fetch(`http://localhost:8080/table`,{
              method:"PUT",
              headers: {
              'Content-Type': 'application/json',
              },
              body:JSON.stringify(table_json)
            });
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }else{
              Swal.fire({title:`桌號：${table_json["table_id"]} 帶位成功！`,showConfirmButton:true,
              confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
              icon:'success',iconColor:"#00c5c8"}).then((res)=>{
                if(res.isConfirmed){
                  this.selected_table ={table_id:"#"};
                  window.location.reload();
                }
            })
            }
          } catch (error) {
            console.error("Error fetching table data:", error);
        }     
      }
      else{
        Swal.fire({title:"該桌位須為空位才能選擇，請重新選擇！",showConfirmButton:true,
            confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
            icon:'error',iconColor:"#00c5c8"})
            return;
      }
    }
  },
  created() {
    if(sessionStorage.getItem("token") == null){
        Swal.fire({title:"你還沒有登入，將轉向登入頁面！",showConfirmButton:true,
            confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
            icon:'error',iconColor:"#00c5c8"}).then((res)=>{
              if(res.isConfirmed){
                this.$router.push({name: 'home'});
              }
            })
    }
  },
  components: {
    TablePage,
    ChangeTableArea,
    Footer_bar_ChangeTable,
    Footer_bar_Checkout
  },
};
</script>
<template>
  <!-- body = 包住全部東西的最大div -->
  <div class="body">
    <div class="header">
      <h2 style="margin-left: 40%;color:#00c5c8;font-size: 2rem;font-weight: bold;">{{this.selected_item}}</h2>
      <ChangeTableArea style="margin-right:2rem" v-on:selected_item_list="GetSelected_item" v-on:nav_item_list="Getnav_item_list"></ChangeTableArea>
    </div>
    <!-- second Area = 中間桌子的區塊 -->
    <div class="second">
      <TablePage v-on:tables="GetTables" :nav_item_list="nav_item_list" v-on:selected_table="GetSelected_table" v-on:selected_target_table="GetSelected_target_table"/>
    </div>
    <div class="footer Area">
      <!-- footerHam = footer裡面的漢堡圖區塊 -->
      <div class="footerHam">
        <div id="app">
          <div class="menu">
            <div class="hamburger" @click="toggleMenu">
              <div :class="{ bar: true, bar1: true, open: menuOpen }"></div>
              <div :class="{ bar: true, bar2: true, open: menuOpen }"></div>
              <div :class="{ bar: true, bar3: true, open: menuOpen }"></div>
            </div>
            <transition name="slide">
              <div v-if="menuOpen" class="menu-content">
                <button class="menu-item" href="#">開錢櫃</button>
                <Footer_bar_ChangeTable :selected_table="selected_table" :selected_target_table="selected_target_table"/>
                <Footer_bar_Checkout :selected_table="selected_table" :selected_target_table="selected_target_table"/>
                <button class="menu-item" @click="TakeTableHandler">帶位</button>
                <button class="menu-item"@click="cleanTablesHander">清除狀態</button>
                <a class="menu-item" @click="orderHandler">點餐</a>
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
*{
  box-sizing: border-box;
  background-color: unset;
  color:unset;
  border:unset;
}
:active{
  background-color: unset;
  color:unset;
  border:unset;
}
.body {
  width: 100%;
  height: 80vh; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
  /* align-items: center; */
}
.header {
  margin-left: 2rem;
  width: 95%;
  height: 10%;
  border: 1px solid #00c5c8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* header的"訂位" */
  /* header的漢堡圖區塊 */
  a{
    display: block;
    text-decoration: none;
    h1 {
    color: #00c5c8;
    /* margin-right: 2%; */
  }
  }
 
}
/* 中間的桌子區塊 */
.second {
  width: 95%;
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

  .menu {
    position: fixed;
    bottom: 1%;
    right: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4rem;
    padding: 0 0.5rem;
    border-radius: 50%;
    background: linear-gradient(90deg, #00c1ca, #01e1c5);
  }

  .hamburger {
    width: 5vh;
    padding: 0.5rem;
    cursor: pointer;
  }

  .bar {
    width: 110%;
    height: 6px;
    background-color: white;
    margin: 5px 0;
    transition: 0.4s;
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
    background: linear-gradient(90deg, #00c1ca, #01e1c5);
    border-radius: 20px;
    padding: 10px 20px;
    z-index: 10;
    *.menu-item {
      cursor: pointer;
      color: white;
      margin: 0 10px;
      text-decoration: none;
      padding: 0.1rem 0.15rem;
      font-size: 1.4rem;
      &:hover{
        background-color: #6ebab281;
      }
    }
}
  .footerHam {
    margin-right: 2%;
  }
}
</style>
