<template>
    <div>
        <Calendar></Calendar>
    </div>
</template>

<script>
import Calendar from '../components/WenQi/Calendar.vue'

export default{
    onMounted(){
        if(!JSON.parse(sessionStorage.getItem("token"))){
        alert("你還沒有登入，將轉向登入頁面！")
        window.location.replace("/");
    }},
    components:{
        Calendar,
    }
}
</script>