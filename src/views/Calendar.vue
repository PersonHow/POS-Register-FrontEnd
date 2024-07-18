<template>
    <div class="main">
        <Calendar v-on:key="getKey"/>
        <button @click="this.isOpen = !this.isOpen" style="border: none;background-color: unset; cursor: pointer;"><img v-if="!this.isOpen" src="../assets/next.png" width="100px" height="100px" /><img v-if="this.isOpen" src="../assets/back.png" width="100px" height="100px" /></button>
        <InputEvent v-if="this.isOpen" :key="this.key"/>
    </div>
</template>

<script>
import Calendar from '../components/WenQi/Calendar.vue'
import InputEvent from '@/components/WenQi/InputEvent.vue';
import Swal from 'sweetalert2';
export default{
    data(){
        return {
            isOpen:false,
            key:0,
        };
    },
    components:{
        Calendar,
        InputEvent
    },
    created(){
        if(sessionStorage.getItem("token") == null){
            this.$router.push({name: 'home'});
            Swal.fire({title:"你還沒有登入，將轉向登入頁面！",showConfirmButton:true,
                confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
                icon:'error',iconColor:"#00c5c8"});
        }
    },
    methods:{
        getKey(key){
            if(this.key != key){
                this.key++;
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.main{
    display: flex;
    align-items: center;
    justify-content: center
}
</style>