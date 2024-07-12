<script>
import TablePage from "@/components/TablePage.vue";
export default {
  data() {
    return {
      menuOpen: false,
      tables: [],
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },
  created() {
    for (let i = 1; i <= 22; i++) {
      this.tables.push({ tableNumber: i, customerName: `顧客${i}` });
    }
  },
  components: {
    TablePage,
  },
};
</script>
<template>
  <!-- body = 包住全部東西的最大div -->
  <div class="body">
    <div class="header Area">
      <div class="booking">
        <h1>訂位</h1>
      </div>
      <h1 class="generally" style="margin-right: 4%">一般區</h1>
      <!-- ham = header的漢堡圖區塊 -->
      <div class="ham">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    </div>
    <!-- second Area = 中間桌子的區塊 -->
    <div class="second Area">
      <TablePage />
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
                <div class="menu-item">開錢櫃</div>
                <div class="menu-item">換桌</div>
                <div class="menu-item">合併結帳</div>
                <div class="menu-item">關閉桌面</div>
                <div class="menu-item">帶位</div>
                <div class="menu-item">清除狀態</div>
                <div class="menu-item">點餐</div>
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
.body {
  width: 100%;
  height: 100dvh;
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
  justify-content: space-between;
  /* header的"訂位" */
  .booking {
    width: 8%;
    height: 60%;
    border: 1px solid #00c5c8;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00c5c8;
    margin-left: 2%;
  }
  /* header的漢堡圖區塊 */
  .ham {
    width: 5%;
    height: 60%;
    // border: 1px solid #00c5c8;
    border-radius: 50%;
    background: linear-gradient(90deg, #00c1ca, #01e1c5);
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 2%;
    /* 漢堡圖的三條線 */
    .line {
      width: 50%;
      height: 10%;
      margin: 3% 0;
      background: #fff;
    }
  }
  h1 {
    color: #00c5c8;
    /* margin-right: 2%; */
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
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 61px;
    padding: 0 17px;
    border-radius: 50%;
    background: linear-gradient(90deg, #00c1ca, #01e1c5);
  }

  .hamburger {
    width: 30px;
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
    font-size: 25px;
  }

  .menu-item {
    color: white;
    margin: 0 10px;
  }

  .footerHam {
    margin-right: 2%;
  }
}
</style>
