<script setup>
import { RouterLink, RouterView } from 'vue-router';
import TestHeader from './components/ChiaoLin/TestHeader.vue';
</script>

<template>
<div>
    <TestHeader />
    <RouterView />
</div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Work+Sans:400,600');
div.container {
	margin-bottom: 1.5rem;
  width: 100%;
  height: 8vh;
	font-family: 'Work Sans', sans-serif;
	font-weight: 800;
  background-color: white;
  ul{       
  margin: 0;
  padding: 0;
  list-style: none; 
  li{
      display: inline-block;
      margin-left: 60px;
      padding-top: 10px;
      position: relative;
        a{
          color: #01e1c5;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 14px;
          &:hover{
            color: #01e1c5;
          
          }
          &:hover::before{
            width: 100%;
          }
          &::before{
            display: block;
            vertical-align:middle;
            height: 5px;
            background-color: #01e1c5;
            position: absolute;
            top: 0;
            width: 0%;
            transition: all ease-in-out 250ms;
          }
        }
    }                
  }
}
.logo {
  float: top;
  padding: 10px 0;
  nav {
  float: top;
  height: 5vh;
        
  }
}
</style>
