<template>
    <div class="main">
        <Calendar/>
        <InputEvent/>
    </div>
</template>

<script>
import Calendar from '../components/WenQi/Calendar.vue'
import InputEvent from '@/components/WenQi/InputEvent.vue';
import Swal from 'sweetalert2';
export default{
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
    }
}
</script>
<style lang="scss" scoped>
.main{
    display: flex;
    flex-wrap: wrap;
}
</style>