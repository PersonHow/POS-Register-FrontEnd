<template>
  <div>
    <v-dialog max-width="50%">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps" color="#00c5c8" variant="flat"><p style="color: white;font-size: 1.4rem;vertical-align:center;text-align: center;">合併結帳</p></v-btn>
      </template>

      <template v-slot:default="{ isActive }" class="template_dialog">
        <v-card >
          <template v-slot:text> 
            <div class="dialog">
              <h2>確定合併結帳？</h2>
              <div class="tables">
                <div class="tables_body">
                  <h2>選擇桌位</h2>
                  <div v-if='this.selected_table.table_id !== "#"'>
                    <p>桌號：{{this.selected_table.table_id}}</p>
                    <p>客人姓名：{{this.selected_table.guest_name}}</p>
                    <p>客人電話：{{this.selected_table.guest_phone}}</p>
                    <p>訂位編號：{{this.selected_table.booking_num== 0?"未訂位":this.selected_table.booking_num}}</p>
                    <p>用餐人數：{{this.selected_table.guest_num}} 人</p>
                    <p>桌位狀態：{{this.selected_table.table_status == 0? "空位": this.selected_table.table_status == 1? "使用中":"已預約"}}</p>
                    <p>用餐區域：{{this.selected_table.table_area}}</p>
                    <p>孩童座：{{this.selected_table.has_priorityseat? "有":"無"}}</p>
                  </div>
                  <div v-else><p>桌號：尚未未選擇</p><p>請先選擇有桌號的座位</p></div>
                </div>
                <div class="tables_plus"><img src="../../assets/plus.png"></div>
                <div class="tables_body"><h2>目標桌位</h2>
                  <div v-if='this.selected_target_table.table_id !== "#"'>
                    <p>桌號：{{this.selected_target_table.table_id}}</p>
                    <p>客人姓名：{{this.selected_target_table.guest_name}}</p>
                    <p>客人電話：{{this.selected_target_table.guest_phone}}</p>
                    <p>訂位編號：{{this.selected_target_table.booking_num== 0?"未訂位":this.selected_target_table.booking_num}}</p>
                    <p>用餐人數：{{this.selected_target_table.guest_num}} 人</p>
                    <p>桌位狀態：{{this.selected_target_table.table_status == 0? "空位": this.selected_target_table.table_status == 1? "使用中":"已預約"}}</p>
                    <p>用餐區域：{{this.selected_target_table.table_area}}</p>
                    <p>孩童座：{{this.selected_target_table.has_priorityseat? "有":"無"}}</p>
                  </div>
                  <div v-else><p>桌號：尚未未選擇</p><p>請先選擇有桌號的座位</p></div></div>
              </div>
            </div>
          </template>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="#00c5c8"
              variant="flat"
              @click="btnHandler"
              style="font-size: 1rem;color: white;"
            >確認</v-btn>
            <v-btn
              text="返回"
              variant="text"
              @click="isActive.value = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>
  <style lang="scss">
  div.dialog{
    display: flex;
    flex-direction: column;
    color: #00c5c8;
    h2{
      margin-left: 1rem;
      margin-bottom: 1rem;
    }
    .tables{
    display: flex;
    min-width: 100%;
    align-items: center;
      .tables_body{
        min-width: 45%;
        min-height: 40vh;
        border: 2px solid #00c5c8;
        padding: 1rem;
        border-radius: 1rem;
        p{
          font-size: 1.2rem;
          margin-left: 1rem;
        }
      }
      .tables_plus{
        text-align: center;
       img{
        width: 50%;
        height: 50%;
       }
      }
    }
  }
 
</style>
<script>
export default{
  data(){
    return {
    }
  },
  props:{
    selected_table:Object,
    selected_target_table:Object
  },
  methods:{
    btnHandler(){
      if(this.selected_table.table_id =="#" || this.selected_target_table.table_id=="#"){
        alert("你尚未選擇桌位！請重新選擇桌位或是提交桌位再換桌");
      }else{
        alert("換桌成功！");
      }
    }
  }
}
</script>