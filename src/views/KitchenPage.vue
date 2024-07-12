<template>
  <div class="container" @wheel.prevent="handleScroll" @touchstart="handleTouchStart" @touchmove="handleTouchMove">
    <!-- Off-Canvas Menu -->
    <div class="off-canvas-menu" :class="{ open: isMenuOpen }">
      <div class="menu-header">
        <button class="close-button" @click="toggleMenu">×</button>
      </div>
      <ul class="menu-list">
        <li class="menu-item" v-for="station in stations" :key="station" @click="selectStation(station)">{{ station }}</li>
        <li class="menu-item" @click="selectAllStations">所有廚台</li> <!-- 新增的選項 -->
      </ul>
    </div>

    <div class="order-list">
      <div class="order-row" v-for="(row, rowIndex) in filteredRows" :key="rowIndex">
        <div class="order-column" v-for="(column, columnIndex) in row" :key="column.id" :class="{ collapsed: isCollapsed[rowIndex], shrinking: column.shrinking }">
          <div class="column-header">
            <div class="column-header-left">
              <button class="icon-button" @click="showModal(column.id)">
                <div class="square"></div>
              </button>
            </div>
            <div class="column-header-middle">
              <span class="table_num">{{ column.table_num }}</span>
            </div>
            <div class="column-header-right">
              <div class="dropdown" @click="toggleDropdown(column.id)">
                <button class="menu-icon">≡</button>
                <div v-if="column.showMenu" class="dropdown-menu">
                  <option value="option1">選項1</option>
                  <option value="option2">選項2</option>
                  <option value="option3">選項3</option>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!column.collapsed" class="order-item" v-for="item in column.items" :key="item.id">
            <span class="icon">
              <div class="square"></div>
            </span>
            <span class="quantity">{{ item.quantities }}</span>
            <span class="name">{{ item.order_detail }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <button class="footer-button">{{ currentTime }}</button>
      <button class="footer-button">{{ selectedStation }}</button>
      <button class="footer-button" @click="toggleMenu">切換站台</button>
      <button class="footer-button">已出料理</button>
      <button class="footer-button" @click="refreshOrders">立即刷新</button>
      <button class="menu-icon">≡</button>
      <button class="footer-button" @click="resetIsFill">重置所有 IsFill</button>
    </div>

    <!-- Custom Modal -->
    <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <p>確定送餐?</p>
        <button @click="confirmIsFill(modalOrderId)">確定</button>
        <button @click="closeModal">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const currentTime = ref('');
const isCollapsed = ref([]);
const lastScrollTop = ref(0);
const touchStartY = ref(0);
const scrollThreshold = ref(10);
const modalVisible = ref(false);
const modalOrderId = ref(null);
const isMenuOpen = ref(false);
const selectedStation = ref('所有廚台');  // 初始化為"所有廚台"

const stations = ["煎台", "油炸台", "煮制台", "飲料台", "烤爐台", "冷盤台"];

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('zh-TW', { hour12: false });
};

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
  fetchOrders();
});

const columns = ref([]);
const working_area_list = new Set();
const rows = ref([]);
const collapseIndex = ref(0);

const getStoredIsFillState = () => {
  const storedState = localStorage.getItem('isFillState');
  return storedState ? JSON.parse(storedState) : {};
};

const saveIsFillState = (state) => {
  localStorage.setItem('isFillState', JSON.stringify(state));
};

const isFillState = ref(getStoredIsFillState());

const toggleDropdown = (id) => {
  const column = columns.value.find(col => col.id === id);
  if (column) {
    column.showMenu = !column.showMenu;
  }
};

const toggleCollapse = (id) => {
  const column = columns.value.find(col => col.id === id);
  if (column) {
    column.collapsed = !column.collapsed;
  }
};


const fetchOrders = async () => {
  try {
    const response = await fetch('http://localhost:8080/order_info');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    const today = new Date().toISOString().split('T')[0];
    console.log("Today's date:", today); // 调试信息

    const storedIsFillState = getStoredIsFillState();

    columns.value = data
      .filter(order => {
        const orderDate = order.create_time.split(' ')[0];
        console.log("Order date:", orderDate); // 调试信息
        return orderDate === today && !storedIsFillState[order.order_id];
      })
      .map(order => ({
        id: order.order_id,
        table_num: order.table_num,
        create_time: order.create_time, // 添加 create_time 数据
        items: order.order_detail.map(detail => ({
          id: detail.meal_name,
          quantities: detail.quantities,
          order_detail: ` ${detail.meal_name} - ${detail.custom_option} - ${detail.other_request}`,
        })),
        showMenu: false,
        collapsed: false,
        shrinking: false,
        isfill: storedIsFillState[order.order_id] || false,
        working_area: order.order_detail.map(detail => detail.working_area),
      }));

    console.log("Filtered orders:", columns.value); // 调试信息

    data.map((order) => order.order_detail)
        .forEach(item_list => item_list.forEach(item => working_area_list.add(item["working_area"])));

    rows.value = [];
    for (let i = 0; i < columns.value.length; i += 3) {
      rows.value.push(columns.value.slice(i, i + 3));
      isCollapsed.value.push(false);
    }

    collapseIndex.value = 0;
    isCollapsed.value = isCollapsed.value.map(() => false);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

const refreshOrders = () => {
  fetchOrders();
};

const showModal = (id) => {
  modalOrderId.value = id;
  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
};

const confirmIsFill = (id) => {
  toggleIsFill(id);
  closeModal();
};

const toggleIsFill = (id) => {
  const columnIndex = columns.value.findIndex(col => col.id === id);
  if (columnIndex !== -1) {
    columns.value[columnIndex].shrinking = true;
    setTimeout(() => {
      columns.value.splice(columnIndex, 1);
      isFillState.value[id] = true;
      saveIsFillState(isFillState.value);
    }, 500); // 與動畫時長一致
  }
};

const resetIsFill = () => {
  columns.value.forEach(column => {
    column.isfill = false;
  });
  isFillState.value = columns.value.reduce((acc, column) => {
    acc[column.id] = false;
    return acc;
  }, {});
  saveIsFillState(isFillState.value);
};

const handleScroll = (event) => {
  const delta = event.deltaY;

  if (delta > scrollThreshold.value && collapseIndex.value < rows.value.length) {
    rows.value[collapseIndex.value].forEach((column) => {
      if (!column.collapsed) {
        toggleCollapse(column.id);
      }
    });
    isCollapsed.value[collapseIndex.value] = true;
    collapseIndex.value += 1;
  } else if (delta < -scrollThreshold.value && collapseIndex.value > 0) {
    collapseIndex.value -= 1;
    rows.value[collapseIndex.value].forEach((column) => {
      if (column.collapsed) {
        toggleCollapse(column.id);
      }
    });
    isCollapsed.value[collapseIndex.value] = false;
  }
};

const handleTouchStart = (event) => {
  touchStartY.value = event.touches[0].clientY;
};

const handleTouchMove = (event) => {
  const touchEndY = event.touches[0].clientY;
  const deltaY = touchStartY.value - touchEndY;

  if (deltaY > scrollThreshold.value && collapseIndex.value < rows.value.length) {
    rows.value[collapseIndex.value].forEach((column) => {
      if (!column.collapsed) {
        toggleCollapse(column.id);
      }
    });
    isCollapsed.value[collapseIndex.value] = true;
    collapseIndex.value += 1;
  } else if (deltaY < -scrollThreshold.value && collapseIndex.value > 0) {
    collapseIndex.value -= 1;
    rows.value[collapseIndex.value].forEach((column) => {
      if (column.collapsed) {
        toggleCollapse(column.id);
      }
    });
    isCollapsed.value[collapseIndex.value] = false;
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const selectStation = (station) => {
  selectedStation.value = station;
  isMenuOpen.value = false;
};

const selectAllStations = () => {
  selectedStation.value = '所有廚台';
  isMenuOpen.value = false;
};

const filteredRows = computed(() => {
  if (selectedStation.value === '所有廚台') {
    return rows.value;
  } else {
    return rows.value.map(row =>
      row.filter(column =>
        column.items.some(item =>
          item.order_detail.includes(selectedStation.value)
        )
      )
    ).filter(row => row.length > 0);
  }
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 80vh;
  overflow: hidden;
}

.order-list {
  min-width: 80%;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  flex: 1;
  padding: 2%;
}

.order-list::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.order-list {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.order-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-bottom: 10px;
}

.order-column {
  flex: 0 0 calc(33.33% - 10px);
  margin-right: 10px;
  height: 75dvh;
  transition: height 0.3s ease, transform 0.5s ease, opacity 0.5s ease;

  &.collapsed {
    height: 8dvh;
  }
  &.shrinking {
    transform: scale(0);
    opacity: 0;
  }
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #00c1ca, #01e1c5);
  color: #fff;
  padding: 20px;
  font-size: 30px;
  border: 1px solid #ccc;

  .column-header-left,
  .column-header-middle,
  .column-header-right {
    display: flex;
    align-items: center;
  }

  .column-header-left {
    justify-content: flex-start;

    .icon-button {
      width: 40px;
      height: 40px;
      background-color: white;
      border-radius: 50%;
      display: inline-block;
      color: #00c3c3;
      text-align: center;
      line-height: 45px;
      position: relative;
      border: none;
      cursor: pointer;

      .square {
        width: 30px;
        height: 5px;
        background-color: #00c3c3;
        position: absolute;
        left: 10%;
        top: 43%;
      }
    }
  }

  .column-header-middle {
    justify-content: flex-start;
    flex-grow: 1;
    padding-left: 20px;
  }

  .column-header-right {
    justify-content: flex-end;
  }

  .dropdown {
    position: relative;

    .menu-icon {
      cursor: pointer;
      color: white;
      background-color: transparent;
      border: none;
      font-size: 50px;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: #00c3c3;
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }
  }
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #cccccc92;
  font-size: 25px;

  .icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(90deg, #00c1ca, #01e1c5);
    color: #fff;
    border-radius: 50%;
    display: inline-block;
    text-align: center;
    line-height: 45px;
    position: relative;

    .square {
      width: 30px;
      height: 5px;
      background-color: white;
      position: absolute;
      left: 10%;
      top: 43%;
    }
  }

  .quantity {
    width: 10%;
  }

  .name {
    width: 66%;
  }
}

.footer {
  height: 7%;
  width: 70%;
  display: flex;
  justify-content: space-around;
  background: linear-gradient(90deg, #00c1ca, #01e1c5);
  color: #fff;
  padding: 10px;
  border-radius: 20px;
  position: fixed;
  bottom: 50px;
  right: 50px;

  .footer-button {
    background-color: transparent;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 20px;
  }

  .menu-icon {
    cursor: pointer;
    color: white;
    background-color: transparent;
    border: none;
    font-size: 30px;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-content button {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.off-canvas-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 15%;
  height: 100vh;
  background: linear-gradient(90deg, #00c1ca, #01e1c5);
  color: white;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 10;
}

.off-canvas-menu.open {
  transform: translateX(0);
}

.menu-header {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.close-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
}

.menu-list {
  list-style: none;
  padding: 0;
}

.menu-item {
  padding: 15px 0;
  cursor: pointer;
  font-size: 20px;
  width: 100%;
  text-align: center;
}
</style>
