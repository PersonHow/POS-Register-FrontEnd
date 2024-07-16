<script>
import Reserve from "@/components/TsaiChunHao/Reserve.vue";
import ReserveList from "@/components/TsaiChunHao/ReserveList.vue";
import Swal from "sweetalert2";
export default {
    data() {
    return {};
    },
    methods: {},
    created() {
    if(sessionStorage.getItem("token") == null){
        Swal.fire({title:"你還沒有登入，將轉向登入頁面！",showConfirmButton:true,
            confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
            icon:'error',iconColor:"#00c5c8"}).then((res)=>{
              if(res.isConfirmed){
                this.$router.push({name: 'home'});
              }
            })
        }
    },
components: {
    Reserve,
    ReserveList
  },
};
</script>
<template>
  <!-- body = 包住全部東西的最大div -->
  <div class="body">
    <!-- second Area = 中間桌子的區塊 -->
        <div class="second">
            <ReserveList style="width:70%"/>
            <Reserve/>
        </div>
  </div>
</template>
<style lang="scss" scoped>
/* body = 包住全部內容的最大div */
*{
  box-sizing: border-box;
  background-color: unset;
  color:unset;
  border:unset;
}
:active{
  background-color: unset;
  color:unset;
  border:unset;
}
.body {
  width: 100%;
  height: 90vh; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
    .second {
        display:flex;
        overflow-y: scroll;
        justify-content: space-between;
    }
}
</style>