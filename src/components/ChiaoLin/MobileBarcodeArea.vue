<script>
import { useBillstore } from '@/stores/BillStore';
import { mapState, mapActions } from 'pinia';

export default {
    setup(){
        const Billstore = useBillstore();
        return {
            Billstore,
            ...mapState(Billstore, ['mobileBarcode']),
        }
    },
    data() {
        return {
            
        };
    },
    methods: {
        closeArea(){
            this.$emit('close');
        }
    }
}
</script>

<template>
    <div class="showBack" @click="closeArea()">
        <div class="showBox" @click.stop>
            <div class="titleArea">
                <p>載&nbsp;&nbsp;&nbsp;&nbsp;具</p>
            </div>
            <div class="inputArea">
                <input type="text" placeholder="請輸入載具號碼" v-model="this.Billstore.mobileBarcode">
            </div>
            <div class="butArea">
                <button @click="closeArea">確認</button>
                <button @click="closeArea">關閉</button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.showBack {
    position: fixed;
    top: 0;
    left: 0;
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
        margin: 0 1dvw;
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
