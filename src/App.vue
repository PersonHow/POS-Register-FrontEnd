<script setup>
import { RouterLink, RouterView } from 'vue-router'
import OrderPage from './views/OrderPage.vue';
import BillPage from './views/BillPage.vue';
import Sidebar from "./components/Sidebar.vue";

</script>

<template>
<div class="routerViewArea">
    <!-- <RouterView /> -->
    <!-- <OrderPage /> -->
    <!-- <BillPage /> -->
    <Sidebar />
</div>
</template>

<style scoped>

</style>
