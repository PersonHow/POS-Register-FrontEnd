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
        this.$router.push({name: 'home'});
        Swal.fire({title:"你還沒有登入，將轉向登入頁面！",showConfirmButton:true,
            confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
            icon:'error',iconColor:"#00c5c8"})
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
            <ReserveList/> 
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
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
    .second {
        width: 100%;
        height: 90vh; 
        display:flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
    }
}
</style>