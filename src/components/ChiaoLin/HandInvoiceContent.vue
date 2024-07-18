<script>
import { useBillstore } from '@/stores/BillStore';
import { mapState, mapActions } from 'pinia';
export default {
    setup(){
        const Billstore = useBillstore();
        return {Billstore}
    },
    data() {
        return {
        };
    },
    methods: {
        closeShow() {
        closeShow() {
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
                <p>抬&nbsp;&nbsp;&nbsp;頭：</p>
                <input type="text" placeholder="請輸入抬頭">
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
.showBack {
.showBack {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    font-weight: 500;
}

.showBox {
.showBox {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
    font-size: 2.5dvh;
    line-height: 5dvh;

    .titleArea {
        width: 100%;
        height: 5dvh;
        color: black;
    }

    .butArea {
        display: flex;
        line-height: 8dvh;
        justify-content: space-between;

        button {
            width: 9dvw;
            height: 7dvh;
            margin: 0 1dvw;
            margin-top: 1dvh;
            background: none;
            color: gray;
            font-weight: 600;
            font-family: "Chocolate Classical Sans", sans-serif;
            font-size: 2dvh;
            border: 2px solid #00c1ca;
            border-radius: 5px;
        }
    }

    .inputArea {
        width: 100%;
        margin: 1dvh 0;

        input {
            height: 6dvh;
            margin: 1dvh 1dvw;
            padding: 0 1dvw;
            border-radius: 5px;
            border: 2px solid gray;
            font-size: 2.25dvh;
        }
    }

}
</style>

