<script>
import { RouterLink, RouterView } from 'vue-router'
export default {
  data(){
    return {
      staff:null
    }
  },
  created(){
    this.staff  = JSON.parse(sessionStorage.getItem("token"));
  }
}
</script>
<template>
    <RouterLink to="/BillPage">BillPage</RouterLink>
    <RouterLink to="/OrderPage">OrderPage</RouterLink>
</template>