<script>
import { useBillstore } from '../../stores/BillStore';

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
    <div class="showBack" @click="closeShow">
        <div class="showBox" @click.stop>
            <div class="titleArea">
                <p>手開發票</p>
            </div>
            <div class="inputArea">
                <p>發票號碼：</p>
                <input type="text" placeholder="請輸入手開發票號碼" v-model="this.Billstore.handInvoiceInput">
                <p>統一編號：</p>
                <input type="text" placeholder="請輸入統編" v-model="this.Billstore.handUniformNum">
            </div>
            <div class="butArea">
                <button @click="closeShow">確認</button>
                <button @click="closeShow">Close</button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.modal-overlay {
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

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1001;
}
</style>
