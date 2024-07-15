<script setup>
import { RouterLink, RouterView } from 'vue-router'
import OrderPage from './views/OrderPage.vue';
import BillPage from './views/BillPage.vue';
import Home from './views/Home.vue';
import TestHeader from '../src/components/ChiaoLin/TestHeader.vue';

</script>

<template>

    <div class="routerViewArea">
        <Home />
        <!-- <RouterView /> -->
        <!-- <BillPage /> -->
        <!-- <OrderPage /> -->
    </div>
    <div class="headerArea">
        <TestHeader />
    </div>
</template>

<style scoped lang="scss">

</style>
