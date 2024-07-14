<script>
import TablePage from "@/components/Kou/Table.vue";
import ChangeTableArea from "@/components/Kou/ChangeTableArea.vue";
export default {
  data() {
    return {
      selected_item:"",
      menuOpen: false,
      tables: [],
      selectedtable_id:0,
    };
  },
  methods: {
    GetSelected_item(item){
      this.selected_item = item;
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    orderHandler(){
      window.location.replace("/OrderPage");
    }  
  },
  created() {
    if(sessionStorage.getItem("token") == null){
        alert("你還沒有登入，將轉向登入頁面！")
        this.$router.push({name: 'home'})
    }
    for (let i = 1; i <= 22; i++) {
      this.tables.push({ tableNumber: i, customerName: `顧客${i}` });
    }
  },
  components: {
    TablePage,
    ChangeTableArea
  },
};
</script>
<template>
  <!-- body = 包住全部東西的最大div -->
  <div class="body">
    <div class="header">
      <h2 style="margin-left:40%;width: 100%;color:#00c5c8;font-size: 2rem;font-weight: bold;">{{this.selected_item}}</h2>
      <ChangeTableArea style="margin-left: 30%;" v-on:selected_item_list="GetSelected_item" v-on:nav_item_list="Getnav_item_list"></ChangeTableArea>
    </div>
    <!-- second Area = 中間桌子的區塊 -->
    <div class="second">
      <TablePage/>
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
                <a class="menu-item" href="#">開錢櫃</a>
                <a class="menu-item" href="#">換桌</a>
                <a class="menu-item" ref="#">合併結帳</a>
                <a class="menu-item" href="#">關閉桌面</a>
                <a class="menu-item" href="#">帶位</a>
                <a class="menu-item" href="#">清除狀態</a>
                <a class="menu-item" @click="orderHandler">點餐</a>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
/* body = 包住全部內容的最大div */
*{
  box-sizing: border-box;
}
.body {
  width: 100%;
  height: 80vh; 
  display: flex;
  flex-wrap: wrap;
  /* align-items: center; */
  justify-content: center;
}
.header {
  width: 95%;
  height: 10%;
  border: 1px solid #00c5c8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
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
    // display: flex;
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
    font-size: 1.5rem;
  }

  .menu-item {
    cursor: pointer;
    color: white;
    margin: 0 10px;
    text-decoration: none;
  }

  .footerHam {
    margin-right: 2%;
  }
}
</style>
