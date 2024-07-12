<script>
import draggable from 'vuedraggable'; // 導入 vuedraggable 用於實現拖曳功能

export default {
    components: {
        draggable, // 將 draggable 組件套用在此vue上
    },
    data() {
        return {
            isEditing: false, // 判斷是否為編輯模式的變數
            tables: Array.from({ length: 22 }, (v, i) => ({
                // 每張桌子的標示代號
                id: i + 1, 
                // 每張桌子的標籤
                label: `1F${String(i + 1).padStart(2, '0')}`,  
                // 根據索引決定桌子的狀態
                status: i % 3 === 0 ? 'available' : i % 3 === 1 ? 'in-use' : 'reserved',  
            })),
        };
    },
    methods: {
        toggleEdit() {
            this.isEditing = !this.isEditing; 
        },
        saveTableOrder() {
            // 保存新的桌子排序
            console.log('新的桌子順序:', this.tables); 
        },
    },
};
</script>

<template>
    <div id="app">
        <button @click="toggleEdit">調整桌位</button>
        <!-- 當進入編輯模式時，啟用拖曳功能 -->
        <draggable v-if="isEditing" v-model="tables" @end="saveTableOrder">
            <!-- 顯示每張桌子的內容 -->
            <template #item="{ element }">
                <div :class="['table', element.status]"> <!-- 根據桌子的狀態設置樣式 -->
                    {{ element.label }} <!-- 顯示桌子的標籤 -->
                </div>
            </template>
        </draggable>
        <div v-else> <!-- 當不處於編輯模式時，僅顯示桌子 -->
            <div v-for="table in tables" :key="table.id" :class="['table', table.status]">
                {{ table.label }}
            </div>
        </div>
    </div>
</template>



<style scoped lang="scss">
.table {
    width: 100px;
    height: 100px;
    margin: 10px;
    display: inline-block;
    text-align: center;
    line-height: 100px;
    border: 1px solid #ccc;
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
</style>