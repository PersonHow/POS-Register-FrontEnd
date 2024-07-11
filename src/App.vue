<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BillPage from './views/BillPage.vue';
import OrderPage from './views/OrderPage.vue';
import TestHeader from './components/ChiaoLin/TestHeader.vue';

</script>

<template>

    <div class="routerViewArea">
        <RouterView />
        <!-- <BillPage /> -->
        <!-- <OrderPage /> -->
    </div>
    <div class="headerArea">
        <TestHeader />
    </div>
</template>

<style scoped lang="scss">

</style>
