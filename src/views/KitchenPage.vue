<template>
    <div class="tcontainer" :style="backgroundStyle">
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
                                <span class="id bottom-right">#{{ getLastFourDigits(column.id) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="oi">
                        <div v-if="!column.collapsed" class="order-item" v-for="(item, itemIndex) in column.items"
                            :key="item.id">
                            <button class="icon" @click="decreaseQuantity(column.id, item.id)">
                                <div class="square"></div>
                            </button>
                            <span class="quantity">{{ item.quantities }}</span>
                            <span class="name">{{ item.order_detail }}</span>
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
                    <li class="menu-item" v-for="station in stations" :key="station" @click="selectStation(station)">{{
                        station }}</li>
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
                                <th>序號</th>
                                <th>出菜</th>
                                <th>餐點名稱</th>
                                <th>數量</th>
                                <th>桌號</th>
                                <th>訂單ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(order, index) in orderDetails" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td><button class="obutton" @click="restoreOrder(index)">還原</button></td>
                                <td>{{ order.mealName }}</td>
                                <td>{{ order.quantity }}</td>
                                <td>{{ order.tableNum }}</td>
                                <td>#{{ order.orderId }}</td>
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
const orderDetails = ref([]);
const columns = ref([]);
const working_area_list = new Set();
const rows = ref([]);


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

const getStoredIsFillState = () => {
    const storedState = localStorage.getItem('isFillState');
    return storedState ? JSON.parse(storedState) : {};
};


// item的資料
const isFillState = ref(getStoredIsFillState());

// item的資料存進已出餐點
const decreaseQuantity = (columnId, itemId) => {
    const column = columns.value.find(col => col.id === columnId);
    if (column) {
        const item = column.items.find(itm => itm.id === itemId);
        if (item && item.quantities > 0) {
            item.quantities -= 1;
            item.dining_out = true; // Set dining_out to true
            // Save the updated state to localStorage
            saveDiningOutState(columnId, itemId, true);

            if (item.quantities === 0) {
                const completedOrder = {
                    orderId: column.id.slice(-4),  // Include order_id here
                    mealName: item.order_detail,
                    quantity: 1,
                    tableNum: column.table_num || '外帶'
                };
                orderDetails.value.push(completedOrder);
                console.log(completedOrder);
                saveOrderDetails(orderDetails.value); // Save order details to localStorage
                column.items = column.items.filter(itm => itm.id !== itemId);
                if (column.items.length === 0) {
                    showModal(columnId);
                }
            }
        }
    }
};

const confirmIsFill = (orderId) => {
    const column = columns.value.find(column => column.id === orderId);
    if (column) {
        const orderDetailsToAdd = column.items.map(item => ({
            orderId: item.id.slice(-6, -2), // Extracting the substring from the ID
            mealName: item.order_detail,
            quantity: item.quantities,
            tableNum: column.table_num || '外帶',
        }));

        orderDetails.value = [...orderDetails.value, ...orderDetailsToAdd];
        saveOrderDetails(orderDetails.value);

        column.shrinking = true;
        setTimeout(() => {
            isFillState.value[orderId] = true;
            saveIsFillState(isFillState.value);
            columns.value = columns.value.filter(column => column.id !== orderId);
            rows.value = [];
            for (let i = 0; i < columns.value.length; i += 3) {
                rows.value.push(columns.value.slice(i, i + 3));
            }
            closeModal();
        }, 500); // 500ms 与 CSS 中的过渡时间保持一致
    }
};


const saveIsFillState = (state) => {
    localStorage.setItem('isFillState', JSON.stringify(state));
    console.log('isFillState saved:', state); // Log the saved state
};

const saveDiningOutState = (columnId, itemId, state) => {
    let diningOutState = JSON.parse(localStorage.getItem('diningOutState')) || {};
    if (!diningOutState[columnId]) {
        diningOutState[columnId] = {};
    }
    diningOutState[columnId][itemId] = state;
    localStorage.setItem('diningOutState', JSON.stringify(diningOutState));
    console.log('diningOutState saved:', diningOutState); // Log the saved state
};

// Load the dining_out state from localStorage
const loadDiningOutState = () => {
    const diningOutState = JSON.parse(localStorage.getItem('diningOutState')) || {};
    columns.value.forEach(column => {
        column.items = column.items.filter(item => {
            if (diningOutState[column.id] && diningOutState[column.id][item.id]) {
                return false; // Filter out items with dining_out: true
            }
            return true;
        });
    });
};

const restoreOrder = (index) => {
    const restoredOrder = orderDetails.value[index];
    const orderId = restoredOrder.orderId;

    // Find and remove the matching isFillState entry by ID or last four digits
    for (let key in isFillState.value) {
        if (key === orderId || key.slice(-4) === orderId) {
            delete isFillState.value[key];
        }
    }

    // Save the updated state to localStorage
    saveIsFillState(isFillState.value);

    // Find and remove the matching diningOutState entry by ID or last four digits
    let diningOutState = JSON.parse(localStorage.getItem('diningOutState')) || {};
    for (let columnKey in diningOutState) {
        if (columnKey === orderId || columnKey.slice(-4) === orderId) {
            delete diningOutState[columnKey];
        } else {
            for (let itemKey in diningOutState[columnKey]) {
                if (itemKey === orderId || itemKey.slice(-4) === orderId) {
                    delete diningOutState[columnKey][itemKey];
                }
            }
        }
    }

    // Save the updated diningOutState to localStorage
    localStorage.setItem('diningOutState', JSON.stringify(diningOutState));

    // Remove the order from orderDetails
    orderDetails.value.splice(index, 1);

    // Save the updated order details to localStorage
    saveOrderDetails(orderDetails.value);

    // Refresh columns data
    fetchOrders();
};

//确保在页面加载时初始化 largeModalVisible 状态，并在模态框打开时调用 fetchOrders：
onMounted(() => {
    updateTime();
    setInterval(updateTime, 1000);
    fetchOrders();
    loadOrderDetails(); // Load order details on page load

    if (largeModalVisible.value) {
        showLargeModal();
    }
});

// Ensure fetchOrders maintains showLargeModal state
const fetchOrders = async () => {
    try {
        console.log("Fetching orders...");
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
                elapsedTime: Date.now() - new Date(order.create_time).getTime(),
                items: order.order_detail
                    .map((detail, index) => {
                        // Process the custom_option to remove parts with "+" and following digits
                        let processedCustomOption = detail.custom_option.replace(/\+[^;]*/g, '').replace(/;+$/, '');
                        return {
                            id: `${order.order_id}-${index}`,
                            quantities: detail.quantities,
                            order_detail: `${detail.meal_name}
                  ${processedCustomOption !== 'null' ? '•' + processedCustomOption.replace(/;/g, ' • ') : ''}
                  ${(processedCustomOption !== 'null' && detail.other_request !== 'null') ? '•' : ''}
                  ${detail.other_request !== 'null' ? detail.other_request : ''}`,
                            dining_out: false,
                            working_area: detail.working_area
                        };
                    }),
                showMenu: false,
                collapsed: false,
                shrinking: false,
                isfill: storedIsFillState[order.order_id] || false,
                working_area: order.order_detail.map(detail => detail.working_area),
            }));
        console.log("Fetched columns:", columns.value);

        loadDiningOutState();

        data.map((order) => order.order_detail)
            .forEach(item_list => item_list.forEach(item => working_area_list.add(item["working_area"])));

        rows.value = [];
        for (let i = 0; i < columns.value.length; i += 3) {
            rows.value.push(columns.value.slice(i, i + 3));
        }
        console.log("Updated rows:", rows.value);
    } catch (error) {
        console.error('Fetch error:', error);
    }
    localStorage.setItem("columns", JSON.stringify(columns.value));

    // Maintain showLargeModal state after fetching orders
    if (largeModalVisible.value) {
        showLargeModal();
    }
};


const filteredRows = computed(() => {
    const filteredColumns = selectedStation.value === '所有廚台'
        ? columns.value
        : columns.value.filter(column =>
            column.items.some(item =>
                item.working_area === selectedStation.value // Correct filtering logic here
            )
        );

    // Sort the columns based on elapsed time in descending order (longest time first)
    const sortedColumns = filteredColumns.sort((a, b) => b.elapsedTime - a.elapsedTime);

    const groupedRows = [];
    for (let i = 0; i < sortedColumns.length; i += 3) {
        //每頁3筆資料一組
        groupedRows.push(sortedColumns.slice(i, i + 3));
    }
    return groupedRows;
});

const showModal = (columnId) => {
    modalVisible.value = true;
    modalOrderId.value = columnId;
};

const closeModal = () => {
    modalVisible.value = false;
    modalOrderId.value = null;
};

const stationImages = {
    "煎台": 'https://i.meee.com.tw/Jshw1QT.png',
    "油炸台": 'https://i.meee.com.tw/wBPSR1V.png',
    "煮制台": 'https://i.meee.com.tw/1PBhc1p.png',
    "飲料台": 'https://i.meee.com.tw/2kOiZB2.png',
    "烤爐台": 'https://i.meee.com.tw/cQi16Cb.png',
    "冷盤台": 'https://i.meee.com.tw/xqIiEWS.png',
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

const getLastFourDigits = (id) => {
    return id.slice(-4);
};

const saveOrderDetails = (details) => {
    localStorage.setItem('orderDetails', JSON.stringify(details));
};

const loadOrderDetails = () => {
    const storedOrderDetails = localStorage.getItem('orderDetails');
    if (storedOrderDetails) {
        orderDetails.value = JSON.parse(storedOrderDetails);
    }
};

const resetOrders = () => {
    localStorage.removeItem('isFillState');
    localStorage.removeItem('completedItems');
    localStorage.removeItem('orderDetails'); // Clear order details as well
    isFillState.value = {};
    orderDetails.value = [];
    resetDiningOutState(); // Reset dining_out state
    fetchOrders();
};
const refreshOrders = () => {
    location.reload(); // Reload the page
};
const resetDiningOutState = () => {
    localStorage.removeItem('diningOutState');
    columns.value.forEach(column => {
        column.items.forEach(item => {
            item.dining_out = false;
        });
    });
};

const backgroundStyle = computed(() => {
    const imageUrl = stationImages[selectedStation.value];
    return {
        backgroundImage: imageUrl ? `url(${imageUrl})` : '',
        backgroundSize: '400px 400px', // 調整圖片大小，這裡設置為200px x 200px
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    };
});

const showLargeModal = () => {
    largeModalVisible.value = true;
};

const closeLargeModal = () => {
    largeModalVisible.value = false;
};


</script>

<style scoped lang="scss">
.tcontainer {
    display: flex;
    flex-direction: column;
    height: 77vh;
    overflow: hidden;
}

.order-list {
    min-width: 100%;
    margin-top: -26px;
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    flex: 1;
    padding: 2%;
    -ms-overflow-style: none;
    // scrollbar-width: none;

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
    transition: height 0.3s ease, transform 0.5s ease, opacity 0.5s;

    &.collapsed {
        height: 8dvh;
    }

    &.shrinking {
        transform: scale(0);
        opacity: 0;
        height: 0;
        margin-right: 0;
    }

    .order-column .id.bottom-right[data-v-48f2c3d1] {
        position: absolute;
        bottom: -56px;
        right: -8px;
        margin: 8px;
        color: white;
        padding: 3px 0px;
        border-radius: 3px;
        font-size: 26px;
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
        font-size: 23px;

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
    padding: 76px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-size: 25px;
}

;

.modal-content button {
    margin: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #00c1ca;
    color: white;
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
        overflow-y: auto;
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

    .obutton {
        background-color: rgb(227, 226, 226);
        border: 1px solid #ccc;
        color: black;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        margin-left: -20px;
    }

}
</style>