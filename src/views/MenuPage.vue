<script setup>
import { RouterLink, RouterView } from 'vue-router'
import MenuManage from '@/components/Yuhan/MenuManage.vue'
</script>

<template>
    <div class="view">
        <MenuManage />
    </div>
</template>

<style scoped lang="scss">
.view{
    display: flex;
    justify-content: space-between;
}
</style>
