<template>
  <div class="container">
    <div class="order-list">
      <div class="order-row" v-for="(row, rowIndex) in filteredRows" :key="rowIndex">
        <div class="order-column" v-for="(column, columnIndex) in row" :key="column.id"
          :class="{ collapsed: isCollapsed[rowIndex], shrinking: column.shrinking }">
          <div class="column-header">
            <div class="column-header-left">
              <button class="icon-button" @click="showModal(column.id)">
                <div class="square"></div>
              </button>
            </div>
            <div class="column-header-middle">
              <span class="table_num">{{ column.table_num || '外帶' }}</span>
              <div class="elapsed-time">{{ elapsedTime(column.create_time) }}</div>
            </div>

            <div class="column-header-right">
              <div class="dropdown" @click="toggleDropdown(column.id)">
                <button class="menu-icon">≡</button>
              </div>
            </div>
          </div>
          <div class="oi">
            <div v-if="!column.collapsed" class="order-item" v-for="(item, itemIndex) in column.items" :key="item.id">
              <button class="icon" @click="decreaseQuantity(column.id, item.id)">
                <div class="square"></div>
              </button>
              <span class="quantity">{{ item.quantities }}</span>
              <span class="name">{{ formatOrderDetail(item) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <button class="footer-button">{{ currentTime }}</button>
      <button class="footer-button">{{ selectedStation }}</button>
      <button class="footer-button" @click="toggleMenu">切換站台</button>
      <div class="off-canvas-menu" :class="{ open: isMenuOpen }">
        <div class="menu-header">
          <button class="close-button" @click="toggleMenu">×</button>
        </div>
        <ul class="menu-list">
          <li class="menu-item" v-for="station in stations" :key="station" @click="selectStation(station)">{{ station }}
          </li>
          <li class="menu-item" @click="selectAllStations">所有廚台</li>
        </ul>
      </div>
      <button class="footer-button" @click="showLargeModal">已出料理</button>
      <button class="footer-button" @click="refreshOrders">立即刷新</button>
      <button class="menu-icon">≡</button>
    </div>
    <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <p>確定送餐?</p>
        <button @click="confirmIsFill(modalOrderId)">確定</button>
        <button @click="closeModal">取消</button>
      </div>
    </div>
    <div v-if="largeModalVisible" class="large-modal-overlay" @click="closeLargeModal">
      <div class="large-modal-content" @click.stop>
        <div class="mh">
          <span class="mh-title">已出餐點</span>
          <button class="close-button-m" @click="closeLargeModal">
            <div class="close-button">×</div>
          </button>
        </div>
        <div class="order-details">
          <table>
            <thead>
              <tr>
                <th>序</th>
                <th>出菜</th>
                <th>餐點名稱</th>
                <th>數量</th>
                <th>桌號</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(order, index) in orderDetails" :key="index">
                <td>{{ index + 1 }}</td>
                <td><button class="menu-icon">還原</button></td>
                <td>{{ order.mealName }}</td>
                <td>{{ order.quantity }}</td>
                <td>{{ order.tableNum }}</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const currentTime = ref('');
const isCollapsed = ref([]);
const modalVisible = ref(false);
const modalOrderId = ref(null);
const isMenuOpen = ref(false);
const selectedStation = ref('所有廚台');
const stations = ["煎台", "油炸台", "煮制台", "飲料台", "烤爐台", "冷盤台"];
const largeModalVisible = ref(false);
const orderDetails = ref([
  {  mealName: '牛小排 - 3分熟;加辣', quantity: 1, tableNum: '外帶' },
  {  mealName: '羊小排', quantity: 1, tableNum: '外帶' },
]);

const elapsedTime = (createTime) => {
  const start = new Date(createTime).getTime();
  const now = Date.now();
  const diff = now - start;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const updateElapsedTimes = () => {
  columns.value.forEach(column => {
    column.elapsedTime = elapsedTime(column.create_time);
  });
};

onMounted(() => {
  setInterval(updateElapsedTimes, 1000);
});


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

const getStoredIsFillState = () => {
  const storedState = localStorage.getItem('isFillState');
  return storedState ? JSON.parse(storedState) : {};
};

const saveIsFillState = (state) => {
  localStorage.setItem('isFillState', JSON.stringify(state));
};

const isFillState = ref(getStoredIsFillState());

const fetchOrders = async () => {
  try {
    const response = await fetch('http://localhost:8080/order_info');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const today = new Date().toISOString().split('T')[0];

    const storedIsFillState = getStoredIsFillState();

    columns.value = data
      .filter(order => {
        const orderDate = order.create_time.split(' ')[0];
        return orderDate === today && !storedIsFillState[order.order_id];
      })
      .map(order => ({
        id: order.order_id,
        table_num: order.table_num,
        create_time: order.create_time,
        items: order.order_detail.map(detail => ({
          id: detail.meal_name,
          quantities: detail.quantities,
          order_detail: detail,
        })),
        showMenu: false,
        collapsed: false,
        shrinking: false,
        isfill: storedIsFillState[order.order_id] || false,
        working_area: order.order_detail.map(detail => detail.working_area),
      }));

    data.map((order) => order.order_detail)
      .forEach(item_list => item_list.forEach(item => working_area_list.add(item["working_area"])));

    rows.value = [];
    for (let i = 0; i < columns.value.length; i += 3) {
      rows.value.push(columns.value.slice(i, i + 3));
      isCollapsed.value.push(false);
    }
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
    }, 500);
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

const showLargeModal = () => {
  largeModalVisible.value = true;
};

const closeLargeModal = () => {
  largeModalVisible.value = false;
};

const filteredRows = computed(() => {
  let filteredColumns = [];

  if (selectedStation.value === '所有廚台') {
    filteredColumns = columns.value;
  } else {
    filteredColumns = columns.value.filter(column =>
      column.working_area.includes(selectedStation.value)
    );
  }

  const groupedRows = [];
  for (let i = 0; i < filteredColumns.length; i += 3) {
    groupedRows.push(filteredColumns.slice(i, i + 3));
  }

  return groupedRows;
});

const formatOrderDetail = (item) => {
  const { meal_name, custom_option, other_request } = item.order_detail;
  return `${meal_name}${custom_option !== 'null' ? ' - ' + custom_option : ''}${other_request !== 'null' ? ' - ' + other_request : ''}`;
};

const decreaseQuantity = (columnId, itemId) => {
  const column = columns.value.find(col => col.id === columnId);
  if (column) {
    const item = column.items.find(itm => itm.id === itemId);
    if (item && item.quantities > 0) {
      item.quantities -= 1;
      if (item.quantities === 0) {
        column.items = column.items.filter(itm => itm.id !== itemId);
        if (column.items.length === 0) {
          showModal(columnId);
        }
      }
    }
  }
};
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
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
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
  transition: height 0.3s ease, transform 0.5s ease, opacity 0;

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
    position: relative;
    justify-content: flex-start;
    flex-direction: column;
    align-items: flex-start;
    flex-grow: 1;
    padding-left: 20px;

    .table_num {
      font-size: 33px;
    }

    .elapsed-time {
      font-size: 20px;
      color: white;
      margin-top: 1px;
    }
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

.oi {
  overflow-y: auto;
  height: 86%;

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
      color: #fff;
      background: linear-gradient(90deg, #00c1ca, #01e1c5);
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

  button {
    margin: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
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

  &.open {
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
}

.large-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;

  .large-modal-content {
    background: white;
    width: 80%;
    height: 80%;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .mh {
    height: 10%;
    width: 100%;
    background: linear-gradient(90deg, #00c1ca, #01e1c5);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .mh-title {
      color: white;
      font-size: 24px;
      font-weight: bold;
    }
  }

  .large-modal-content .close-button {
    position: absolute;
    top: -3px;
    right: 5px;
    background: transparent;
    border: none;
    // color: black;
    font-size: 30px;
    cursor: pointer;
  }

  .close-button-m {
    position: absolute;
    top: 23px;
    right: 42px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    color: linear-gradient(90deg, #00c1ca, #01e1c5);
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    font-size: 20px;
  }

  .order-details {
    margin-top: 20px;
  }

  .order-details table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  .order-details th,
  .order-details td {
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }

  .order-details th {
    background-color: #f8f8f8;
    font-weight: bold;
  }
}
</style>