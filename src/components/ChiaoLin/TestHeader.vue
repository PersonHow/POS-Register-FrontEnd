<script>
import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
    <div class="container">
      <h1 class="logo"></h1>
      <nav>
        <ul>
          <li><a><RouterLink to="/OrderPage">點餐</RouterLink></a></li>
          <li><a><RouterLink to="/logout">登出</RouterLink></a>
        </li>
        </ul>
      </nav>
    </div>
    <!-- <RouterLink to="/BillPage">BillPage</RouterLink> -->
</template>
<style>
@import url('https://fonts.googleapis.com/css?family=Work+Sans:400,600');
div.container {
	margin: 0;
  width: 100%;
  height: 5vh;
	font-family: 'Work Sans', sans-serif;
	font-weight: 800;
}

.logo {
  float: top;
  padding: 10px 0;
}

nav {
  float: top;
  height: 5vh;
}

nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav li {
  display: inline-block;
  margin-left: 70px;
  padding-top: 23px;

  position: relative;
}

nav a {
  color: #01e1c5;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 14px;
}

nav a:hover {
  color: #01e1c5;
}

nav a::before {
  content: '';
  display: block;
  vertical-align:middle;
  height: 5px;
  background-color: #01e1c5;

  position: absolute;
  top: 0;
  width: 0%;

  transition: all ease-in-out 250ms;
}

nav a:hover::before {
  width: 100%;
}
</style>