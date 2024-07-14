<script setup>
import axios from 'axios';
let email = "";
let password ="";
let isLogin = true;
const loginbtnclick = async(e)=>{
    e.preventDefault();
    let response = await axios.post("http://localhost:8080/staff/login",{email,password}).catch((e)=>{
        console.log(e.response.status);
        alert("你輸入的員工帳號、密碼不存在，請重新輸入！");
    })
    if(response.status == 200){
        sessionStorage.setItem("token",JSON.stringify(response.data));
        alert("登入成功！");
        window.location.replace("/calendar");
    }
}
const enrollbtnClick = async(e)=>{
    
}
</script>

<template>
    <div class="main">
    <form v-if="isLogin">
        <p class="sign">點餐系統-員工登入</p>
        <input v-model="email" class="un" type="text" placeholder="你的email" required>
        <input v-model="password" class="pass" type="password" placeholder="你的密碼" required>
        <div>
        <button class="submit" @click="loginbtnclick">登入</button><button class="submit" style="margin-left:1rem" @click="enrollbtnClick">註冊</button></div>
    </form> 
    <form v-else>
        <p class="sign">點餐系統-註冊登入</p>
        <input v-model="email" class="un" type="text" placeholder="你的email" required>
        <input v-model="password" class="pass" type="password" placeholder="你的密碼" required>
        <div>
        <button class="submit" @click="loginbtnclick">登入</button><button class="submit" style="margin-left:1rem" @click="enrollbtnClick">註冊</button></div>
    </form>      
    </div>
    
</template>
<style>
    body {
        font-family: 'Ubuntu', sans-serif;
    }
    
    .main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: #FFFFFF;
        width: 400px;
        height: 400px;
        margin: 7em auto;
        border-radius: 1.5em;
        box-shadow: 0px 11px 35px 2px rgba(0, 0, 0, 0.14);
    }
    
    .sign {
        padding-top: 40px;
        color: #01e1c5;
        font-family: 'Ubuntu', sans-serif;
        font-weight: bold;
        font-size: 23px;
    }
    
    .un {
    margin-top: 2rem;
    width: 76%;
    color: rgb(38, 50, 56);
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1px;
    background: rgba(136, 126, 126, 0.04);
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    outline: none;
    box-sizing: border-box;
    border: 2px solid rgba(0, 0, 0, 0.02);
    margin-bottom: 50px;
    text-align: center;
    margin-bottom: 27px;
    font-family: 'Ubuntu', sans-serif;
    }
    
    form.form1 {
        padding-top: 40px;
    }
    
    .pass {
            width: 76%;
    color: rgb(38, 50, 56);
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1px;
    background: rgba(136, 126, 126, 0.04);
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    outline: none;
    box-sizing: border-box;
    border: 2px solid rgba(0, 0, 0, 0.02);
    margin-bottom: 50px;
    text-align: center;
    margin-bottom: 27px;
    font-family: 'Ubuntu', sans-serif;
    }
    
   
    .un:focus, .pass:focus {
        border: 2px solid rgba(0, 0, 0, 0.18) !important;
        
    }
    
    .submit {
        cursor: pointer;
        border-radius: 5em;
        background: linear-gradient(90deg, #00c1ca, #01e1c5);
        color: #fff;
        border: 0;
        padding-left: 40px;
        padding-right: 40px;
        padding-bottom: 10px;
        padding-top: 10px;
        font-family: 'Ubuntu', sans-serif;
        font-size: 13px;
        box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.04);
        transition: all 0.3s;
        &:hover{
            scale: 1.2;
        }
    }
    
    .forgot {
        text-shadow: 0px 0px 3px rgba(117, 117, 117, 0.12);
        color: #01e1c5;
        padding-top: 15px;
    }
    
    @media (max-width: 600px) {
        .main {
            border-radius: 0px;
        }
    }
</style>
