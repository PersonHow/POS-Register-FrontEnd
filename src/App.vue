<script setup>
import { RouterView } from 'vue-router';
import TestHeader from './components/ChiaoLin/TestHeader.vue';
import { useBillstore } from '@/stores/BillStore';

const billStore = useBillstore();
</script>

<template>
    <div class="allArea">
        <button v-if="billStore.isLoggedIn" style="cursor: pointer; font-size: 2.25dvh;" @click="billStore.closeTopbar">
            <i class="fa-solid fa-house-chimney"></i>
        </button>
        
            <div :class="['headerArea', { hidden: billStore.isTopBarHidden }]">
                <TestHeader />
            </div>
        
        <div :class="['routerArea', { expanded: billStore.isTopBarHidden }]">
            <RouterView />
        </div>
    </div>
</template>

<style scoped lang="scss">
.allArea {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;

    .headerArea {
        height: 6dvh;
        transition: height 0.3s ease;
        overflow: hidden;

        &.hidden {
            height: 0;
        }
    }

    .routerArea {
        flex: 1; // 使 routerArea 佔滿剩餘空間
        transition: transform 0.3s ease; // 使用 transform 來實現滑動效果
        height: 100%;

        &.expanded {
            transform: translateY(-1dvh); // 向上移動 headerArea 的高度
        }
    }
}
</style>
