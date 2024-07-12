<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import axios from "axios";
const default_email="BBB@yahoo.com";
const default_password = "123"
onMounted(async()=>{
    let response = await axios.post("http://localhost:8080/staff/login",{email:default_email,password:default_password});
    sessionStorage.setItem("token",JSON.stringify(response.data));
})
</script>

<template>
    <RouterView/>
</template>

<style scoped>

</style>
