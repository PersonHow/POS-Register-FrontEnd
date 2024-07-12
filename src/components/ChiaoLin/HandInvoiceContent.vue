<script>
// import { useBillstore } from '@/stores/BillStore';

export default {

    data() {
        return {
        };
    },
    methods: {
        closeComponent() {
            this.$emit('close');
        },
    }
}
</script>

<template>
    <div class="allleftArea" @click="closeComponent">
        <div class="handInvoiceBox" @click.stop>
            <p>手開發票</p>
            <span>發票號碼：</span>{{ invoceTestNum }}
            <input type="text" >
            <button @click="">確認</button>
            <button @click="closeComponent">Close</button>
            <!-- <Calculator @add-to-display="addToDisplay" @clear-display="clearDisplay" @backspace="backspace" /> -->
        </div>
    </div>
</template>

<style scoped lang="scss">
.allleftArea {
    position: fixed;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}

.handInvoiceBox {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1001;
}
</style>
