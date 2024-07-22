<script>
import axios from 'axios';
import Swal from "sweetalert2";
import { useBillstore } from '@/stores/BillStore'
import { mapState } from 'pinia';
import { onMounted } from 'vue';
export default{
    setup(){
        const Billstore = useBillstore();

        onMounted(() => {
            Billstore.isTopBarHidden = true;
        })
        
        return{Billstore,...mapState(Billstore,['isTopBarHidden']),}
    },
    data(){
        return {
            email:"",
            password:"",
            isLogin:true,
            position:"",
            staff_name:"",
            isworking:true
        };
        
    },
    methods:{
        async loginbtnclick(){
            let login_json = {email:this.email,password:this.password};
            let response = await axios.post("http://localhost:8080/staff/login",login_json).catch((e)=>{
                Swal.fire({title:"你輸入的員工帳號、密碼不存在，請重新輸入！",showConfirmButton:true,
                confirmButtonColor:"#7b90da",confirmButtonText:"確定",
                icon:'error',iconColor:"#748cdd"})
                return;
            })
            if(response.status == 200){
                sessionStorage.setItem("token",JSON.stringify(response.data));
                Swal.fire({title:"登入成功！",showConfirmButton:true,
                confirmButtonColor:"#7b90da",confirmButtonText:"確定",
                icon:'success',iconColor:"#748cdd"}).then((res)=>{
                    if(res.isConfirmed){
                        this.Billstore.isTopBarHidden = false;
                        window.location.replace("/calendar");
                    }
                })
            }
        },
        toenrollHandler(){
            this.isLogin = false;
        },
        tologinHandler(){
            this.isLogin =true;
        },
        async enrollbtnclick(){
            let enroll_json = {email:this.email,password:this.password,staff_name:this.staff_name,position:this.position};
            let response = await axios.post("http://localhost:8080/staff/register",enroll_json).catch((e)=>{
                Swal.fire({title:"你輸入的員工帳號、密碼、姓名、職位為空或是不正確，請重新輸入！",showConfirmButton:true,
                confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
                icon:'error',iconColor:"#00c5c8"})
                return;
            })
            if(response.status == 201){
                Swal.fire({title:"註冊成功！",showConfirmButton:true,
                confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
                icon:'success',iconColor:"#00c5c8"}).then((res)=>{
                    this.email="";
                    this.password="";
                    this.isLogin=true;
                    this.position="";
                    this.staff_name="";
                    this.isworking=true;
                    this.isLogin = true;
                })
            }
        }
    }
}
</script>

<template>
        <div v-if="isLogin" class="main">
            <p class="sign">點餐系統-員工登入</p>
            <input v-model="this.email" class="un" type="email" placeholder="你的email">
            <input v-model="this.password" class="pass" type="password" placeholder="你的密碼">
            <div>
                <button class="submit" @click="loginbtnclick">登入</button><button class="submit" style="margin-left:1rem" @click="toenrollHandler">去註冊</button>
            </div>    
        </div>
        <div v-else class="enroll_main">
                <p class="sign">點餐系統-註冊登入</p>
                <input v-model="this.staff_name" class="un" type="text" placeholder="你的姓名">
                <input v-model="this.email" class="un" type="email" placeholder="你的email">
                <input v-model="this.password" class="pass" type="password" placeholder="你的密碼">
                <div class="position">
                    <p>你的職位：</p>
                    <select class="un" v-model="this.position">
                        <option value="員工">員工</option>
                        <option value="主管">主管</option>
                    </select>
                </div>
            <div>
                <button class="submit" @click="tologinHandler">回登入頁面</button><button class="submit" style="margin-left:1rem" @click="enrollbtnclick">註冊</button>
            </div>
        </div>
    
</template>
<style lang="scss" scoped>
    body {
        font-family: "Chocolate Classical Sans", sans-serif;
    }
    
    .main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: #FFFFFF;
        width: 400px;
        height: 500px;
        margin: 7em auto;
        border-radius: 1.5em;
        box-shadow: 0px 11px 35px 2px rgba(0, 0, 0, 0.14);
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
    }
    .enroll_main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: #FFFFFF;
        width: 400px;
        height: 600px;
        margin: 7em auto;
        border-radius: 1.5em;
        box-shadow: 0px 11px 35px 2px rgba(0, 0, 0, 0.14);
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
        text-align: center;
        font-family: 'Ubuntu', sans-serif;
        }
        div.position{
                display: flex; width: 70%;align-items: center;justify-content: center;
                p{
                    color: #748cdd;
                    font-weight: bold;
                    padding-top: 1.6rem;
                    font-size: 1.2rem;
                }
                select{
                    margin-left: 2rem;
                    width: 50%;
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
                    text-align: center;
                    font-family: 'Ubuntu', sans-serif; 
                    option{font-size: 1.5rem;}
                }
         }  
        }
        .pass {
        margin-top: 30px;
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
        text-align: center;
        font-family: 'Ubuntu', sans-serif;
        }
        .submit{
            margin-top: 2rem;
        }
    .sign {
        padding-top: 40px;
        color: #7b90da;
        font-family: 'Ubuntu', sans-serif;
        font-weight: bold;
        font-size: 23px;
    } 
    .un:focus, .pass:focus {
        border: 2px solid rgba(0, 0, 0, 0.18) !important;
        
    }
    
    .submit {
        cursor: pointer;
        border-radius: 5em;
        background: linear-gradient(90deg, #7b90da, #a8afc9);
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
        color: #748cdd;
        padding-top: 15px;
    }
    
    @media (max-width: 600px) {
        .main {
            border-radius: 0px;
        }
    }
</style>
