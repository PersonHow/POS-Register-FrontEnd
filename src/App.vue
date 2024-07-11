<script setup>
import { RouterLink, RouterView } from 'vue-router'
import OrderPage from './views/OrderPage.vue';
import BillPage from './views/BillPage.vue';
import KitchenPage from './views/KitchenPage.vue';

</script>

<template>
    <div class="routerViewArea">
        <!-- <RouterView /> -->
        <!-- <OrderPage /> -->
        <!-- <BillPage /> -->
        <KitchenPage />
        
    </div>
</template>

<style scoped></style>
