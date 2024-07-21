<template>
    <div class="mainArea">
        <Calendar v-on:key="getKey" />
        <button @click="toggleInputEvent" class="openBoxbut">
            <img src="../assets/add-OK.png" style="width: 3dvw;height: 4dvh;">
        </button>
        <div v-if="isOpen" class="showBox">
            <InputEvent :key="key" />
            <button @click="toggleInputEvent" class="closeBoxbut" style="border: none;background: none;"><i
                class="fa-solid fa-xmark fa-2xl" style="color: #7b90da;font-size: 4dvh;"></i></button>
        </div>
    </div>
</template>

<script>
import Calendar from '../components/WenQi/Calendar.vue'
import InputEvent from '@/components/WenQi/InputEvent.vue';
import Swal from 'sweetalert2';
export default {
    data() {
        return {
            isOpen: false,
            key: 0,
        };
    },
    components: {
        Calendar,
        InputEvent
    },
    created() {
        if (sessionStorage.getItem("token") == null) {
            this.$router.push({ name: 'home' });
            Swal.fire({
                title: "你還沒有登入，將轉向登入頁面！", showConfirmButton: true,
                confirmButtonColor: "#00c5c8", confirmButtonText: "確定",
                icon: 'error', iconColor: "#00c5c8"
            });
        }
    },
    methods: {
        getKey(key) {
            if (this.key != key) {
                this.key++;
            }
        },
        toggleInputEvent() {
            this.isOpen = !this.isOpen;
            this.key++;
        }
    }
}
</script>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Work+Sans:400,600');

.mainArea {
    height: 94dvh;
    position: relative;
    justify-content: center;
    font-family: "Chocolate Classical Sans", sans-serif;
    background-image: url(https://zh-tw.skyticket.com/guide/wp-content/uploads/2019/10/d8865e8083b38f7def13eb7d960ae0cf-e1570676456698.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-color: rgba(0, 0, 0, 0.3);
    background-blend-mode: multiply;
}

.openBoxbut {
    padding: 0 1dvw;
    position: absolute;
    top: 42%;
    right: 51%;
    border: none;
    // border: 2px solid #7b90da;
    color: white;
    background:none;
    cursor: pointer;
    border-radius: 5px;
    height: 5dvh;
    // line-height: 0.5dvh;
    font-size: 2dvh;
    // box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    padding-top: 1dvh
    
}

.showBox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.closeBoxbut {
    position: absolute;
    top: 20dvh;
    right: 27.5dvw;
    padding: 10px 20px;
    background-color: rgba(116, 140, 211, 0.1);
    border: 2px solid #7b90da;
    cursor: pointer;
    border-radius: 5px;
}
</style>