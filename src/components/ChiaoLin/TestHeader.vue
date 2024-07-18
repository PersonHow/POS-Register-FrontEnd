<script>
import { useBillstore } from '@/stores/BillStore'
import { inject } from 'vue';
import { RouterLink } from 'vue-router';
import { RouterView, useRoute } from 'vue-router';
export default {
  data() {
    return {
      staff: null,
    }
  },
  created() {
    this.staff = JSON.parse(sessionStorage.getItem("token"));
  },
  setup() {
    const route = useRoute();
  }
}
</script>
<template>
  <div class="container">
    <h1 class="logo"></h1>
    <nav>
      <ul>
        <li><a><router-link to="/calendar" active-class="active">行事曆</router-link></a></li>
        <li><a><router-link to="/table" active-class="active">桌位</router-link></a></li>
        <li><a><router-link to="/OrderPage" active-class="active">點餐(外帶)</router-link></a></li>
        <li><a><router-link to="/workingarea" active-class="active">工作台</router-link></a></li>
        <li><a><router-link to="/reserve" active-class="active">訂位</router-link></a></li>
        <li><a><router-link to="/AllBillPage" active-class="active">帳務</router-link></a></li>
        <li><a><router-link to="/MenuManage" active-class="active">菜單</router-link></a></li>
        <li v-if="this.staff"><a>
            <RouterLink to="/logout">登出</RouterLink>
          </a></li>
      </ul>
    </nav>

  </div>
  <!-- <RouterLink to="/BillPage">BillPage</RouterLink> -->
</template>
<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Work+Sans:400,600');

* {
  box-sizing: border-box;
  background-color: unset;
  color: unset;
  border: unset;
}

:active {
  background-color: unset;
  color: unset;
  border: unset;
}

div.container {
  width: 100%;
  max-width: 1360px;
  font-family: "Chocolate Classical Sans", sans-serif;
  display: flex;
  font-weight: 600;
  background-color: white;
  line-height: 5dvh;

  ul {
    margin: 0;
    padding: 0 3dvh;
    list-style: none;

    li {
      display: inline-block;
      padding-top: 1dvh;
      margin-right: 6dvw;
      position: relative;

      a {
        color: #01e1c5;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 2.25dvh;

        &.active {
          border-radius: 5px;
        }

        &:hover {
          color: #01e1c5;

        }

        &:hover::before {
          width: 100%;
        }

        &::before {
          content: '';
          display: block;
          vertical-align: middle;
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