<template>
    <div class="mainArea">  
        <Calendar v-on:key="getKey" />
        <div v-if="isOpen" class="showBox">
            <button @click="toggleInputEvent" class="closeBoxbut" style="border: none;"><i
                class="fa-solid fa-xmark fa-2xl" style="color: #7b90da;font-size: 4dvh;"></i></button>
            <InputEvent :key="key" />
        </div>
        <button @click="toggleInputEvent" class="openBoxbut">
        <img src="../assets/add-OK.png" style="width: 5dvw;height: 6dvh; object-fit:contain;">
        </button>
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

* {
  font-family: "Chocolate Classical Sans", sans-serif;
  box-sizing: border-box;
}
::-webkit-scrollbar {
  width: 10px;
}
/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #7b90da;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #5b6aa0;
}
.mainArea {
    overflow-y: auto;
    position: relative;
    height: 94dvh;
    justify-content: center;
    font-family: "Chocolate Classical Sans", sans-serif;
    background-image: url(https://zh-tw.skyticket.com/guide/wp-content/uploads/2019/10/d8865e8083b38f7def13eb7d960ae0cf-e1570676456698.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-color: rgba(0, 0, 0, 0.3);
    background-blend-mode: multiply;
}

.openBoxbut {
    position: fixed;
    bottom: 3%;
    right: 0%;
    padding: 0 1dvw;
    opacity: 0.6;
    border: none;
    color: white;
    background:none;
    cursor: pointer;
    border-radius: 5px;
    height: 5dvh;
    // line-height: 0.5dvh;
    font-size: 2dvh;
    // box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    padding-top: 1dvh;
    transition: all 0.2s ease;
    &:hover{
        opacity: 1;
    }
}

.showBox {
    display: flex;
    flex-direction: column;
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
    position: relative;
    top:9.5%;
    left: 13%;
    padding: 10px 20px;
    background-color: rgba(116, 140, 211, 0.1);
    border: 2px solid #7b90da;
    cursor: pointer;
    border-radius: 5px;
}
</style>