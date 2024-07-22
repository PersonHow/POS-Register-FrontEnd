<script>
// import { useBillstore } from '@/stores/BillStore';

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

.handInvoiceBox {
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
        text-align: center;
    }

    .butArea {
        display: flex;
        line-height: 8dvh;
        justify-content: space-between;

        button {
            width: 9dvw;
            height: 6dvh;
            margin: 0 1dvw;
            margin-top: 1dvh;
            background: #00c1ca;
            color: white;
            font-family: "Chocolate Classical Sans", sans-serif;
            font-size: 2.25dvh;
            border-radius: 5px;
            border: none;
        }
    }

    .inputArea {
        width: 100%;
        margin: 1dvh 0;
        P{
            line-height: 3dvh;
            padding-left: 1dvw;
        }

        input {
            width: 89%;
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

