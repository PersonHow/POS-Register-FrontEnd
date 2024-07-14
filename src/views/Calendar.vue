<template>
    <div>
        <Calendar></Calendar>
    </div>
</template>

<script>
import Calendar from '../components/WenQi/Calendar.vue'

export default{
    created(){
        if(sessionStorage.getItem("token") == null){
        alert("你還沒有登入，將轉向登入頁面！")
        this.$router.push({name: 'home'})
    }},
    components:{
        Calendar,
    }
}
</script>