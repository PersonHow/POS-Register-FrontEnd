<script>
import { RouterLink } from "vue-router";

export default {
  components: {
    RouterLink, // 在這裡使用 RouterLink 組件
  },
};
</script>

<template>
  <input type="checkbox" name="" id="check" />
  <label for="check">
    <i class="fas fa-bars" id="btn"></i>
    <i class="fas fa-times" id="cancel"></i>
  </label>

  <div class="sidebar">
    <header>My App</header>
    <ul>
      <li>
        <RouterLink class="routerItem" to="/Reserve"><i class="fas fa-qrcode"></i>Booking</RouterLink>
      </li>
      <li>
        <RouterLink class="routerItem" to="/ReserveList"><i class="fas fa-link"></i>Booking List</RouterLink>
      </li>
      <li>
        <RouterLink class="routerItem" to="/Login"><i class="fas fa-stream"></i>Login</RouterLink>
      </li>
      <li>
        <RouterLink class="routerItem" to="/OrderPage"><i class="fas fa-question-circle"></i>OrderPage</RouterLink>
      </li>
      <li>
        <RouterLink class="routerItem" to="/BillPage"><i class="fas fa-envelope"></i>BillPage</RouterLink>
      </li>
    </ul>
  </div>

  <section>
    <RouterView />
  </section>
</template>

<style scoped lang="scss">
/* 側邊欄的樣式 */
.sidebar {
  position: fixed; /* 固定位置，不隨畫面滾動 */
  left: -250px; /* 初始時側邊欄隱藏在畫面左側 */
  width: 250px; /* 側邊欄寬度 */
  height: 100%; /* 側邊欄高度，充滿整個視窗 */
  background: #264653; /* 背景色：柔和的藍綠色 */
  color: #f0f0f0; /* 文字顏色：柔和的字體顏色 */
  transition: left 0.5s ease; /* 左側位置變化的動畫效果，持續時間0.5秒 */
  z-index: 100; /* 堆疊順序，確保側邊欄顯示在其他元素之上 */

  /* 側邊欄標題 */
  header {
    font-size: 24px; /* 文字大小 */
    font-weight: bold; /* 文字粗細 */
    color: #f0f0f0; /* 文字顏色 */
    background: #2a9d8f; /* 背景色：柔和的綠色 */
    text-align: center; /* 文字置中 */
    line-height: 70px; /* 行高 */
    user-select: none; /* 禁止用戶選擇文字 */
  }

  /* 列表樣式 */
  ul {
    list-style: none; /* 移除列表項目點 */
    padding: 0; /* 去除內邊距 */
    margin: 0; /* 去除外邊距 */
  }

  /* 列表項目 */
  ul li {
    border-top: 1px solid rgba(255, 255, 255, 0.1); /* 上邊框：淺色半透明白 */
    border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* 下邊框：深色半透明黑 */
  }

  /* 鏈接 */
  ul a {
    display: block; /* 塊級元素，使整個區域可點擊 */
    height: 100%; /* 高度100%，填充父元素 */
    width: 100%; /* 寬度100%，填充父元素 */
    line-height: 65px; /* 行高 */
    font-size: 20px; /* 文字大小 */
    color: #f0f0f0; /* 文字顏色 */
    padding-left: 40px; /* 左邊距 */
    box-sizing: border-box; /* 盒模型：包含內邊距和邊框在內的寬度 */
    text-decoration: none; /* 移除下劃線 */
    transition: padding-left 0.5s, color 0.5s; /* 過渡效果：左邊距和文字顏色 */
  }

  /* 鏈接懸停時 */
  ul a:hover {
    padding-left: 50px; /* 懸停時的左邊距 */
    color: #e9c46a; /* 懸停時的文字顏色：柔和的黃色 */
  }

  /* 圖示 */
  ul a i {
    font-size: 24px; /* 圖示大小 */
    margin-right: 20px; /* 圖示與文字的間距 */
  }
}

/* 隱藏的checkbox */
#check {
  display: none; /* 隱藏checkbox */
}

/* 開關按鈕樣式 */
label #btn,
label #cancel {
  position: absolute; /* 絕對定位 */
  cursor: pointer; /* 鼠標指針 */
  background: #264653; /* 背景色：柔和的藍綠色 */
  border-radius: 3px; /* 圓角 */
}

/* 開關按鈕 - 開啟狀態 */
label #btn {
  left: 40px; /* 左側距離 */
  top: 16px; /* 上側距離 */
  padding: 5px; /* 內邊距 */
  font-size: 30px; /* 文字大小 */
  color: #f0f0f0; /* 文字顏色 */
  transition: all 0.5s; /* 所有屬性的過渡效果 */
}

/* 開關按鈕 - 關閉狀態 */
label #cancel {
  z-index: 1111; /* 堆疊順序 */
  left: -195px; /* 左側距離 */
  top: 17px; /* 上側距離 */
  font-size: 30px; /* 文字大小 */
  color: #e9c46a; /* 文字顏色：柔和的黃色 */
  padding: 4px 9px; /* 內邊距 */
  transition: all 0.5s ease; /* 所有屬性的過渡效果 */
}

/* checkbox被選中時，顯示側邊欄 */
#check:checked ~ .sidebar {
  left: 0; /* 顯示側邊欄 */
}

/* checkbox被選中時，修改開啟按鈕的位置和透明度 */
#check:checked ~ label #btn {
  left: 250px; /* 開啟按鈕的左側距離 */
  opacity: 0; /* 透明度 */
  pointer-events: none; /* 鼠標事件不可用 */
}

/* checkbox被選中時，修改關閉按鈕的位置 */
#check:checked ~ label #cancel {
  left: 195px; /* 關閉按鈕的左側距離 */
}

/* checkbox被選中時，調整section的margin-left，使內容向右移動 */
#check:checked ~ section {
  margin-left: 250px; /* 內容區塊的左側距離 */
}

/* 內容區塊 */
section {
  background-position: center; /* 背景圖片位置 */
  background-size: cover; /* 背景圖片大小 */
  height: 100vh; /* 高度100%視窗高度 */
  transition: all 0.5s; /* 所有屬性的過渡效果 */
}
</style>