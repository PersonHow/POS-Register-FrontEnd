<template>
  <div>
    <v-dialog max-width="50%" style="z-index: 2;">
      <template v-slot:activator="{ props: activatorProps }">
        <button v-bind="activatorProps"class="template_dialog_btn">換桌</button>
      </template>

      <template v-slot:default="{ isActive }" class="template_dialog">
        <v-card >
          <template v-slot:text> 
            <div class="dialog">
              <h2>確定換桌？</h2>
              <div class="tables">
                <div class="tables_body">
                  <h2>選擇桌位</h2>
                  <div v-if='this.selected_table.table_id !== "#"'>
                    <p>桌號：{{this.selected_table.table_id}}</p>
                    <p>客人姓名：{{this.selected_table.guest_name}}</p>
                    <p>客人電話：{{this.selected_table.guest_phone}}</p>
                    <p>訂位編號：{{this.selected_table.booking_num== 0?"未訂位":this.selected_table.booking_num}}</p>
                    <p>用餐人數：{{this.selected_table.guest_num}} 人</p>
                    <p>桌位狀態：{{this.selected_table.table_status == 0? "空位": this.selected_table.table_status == 1? "使用中":this.selected_table.table_status == 2? "已預約":"帶位中"}}</p>
                    <p>用餐區域：{{this.selected_table.table_area}}</p>
                    <p>孩童座：{{this.selected_table.has_priorityseat? "有":"無"}}</p>
                  </div>
                  <div v-else><p>桌號：尚未未選擇</p><p>請先選擇有桌號的座位</p></div>
                </div>
                <div class="tables_exchange"><img src="../../assets/exchange.png"></div>
                <div class="tables_body"><h2>目標桌位</h2>
                  <div v-if='this.selected_target_table.table_id !== "#"'>
                    <p>桌號：{{this.selected_target_table.table_id}}</p>
                    <p>客人姓名：{{this.selected_target_table.guest_name}}</p>
                    <p>客人電話：{{this.selected_target_table.guest_phone}}</p>
                    <p>訂位編號：{{this.selected_target_table.booking_num== 0?"未訂位":this.selected_target_table.booking_num}}</p>
                    <p>用餐人數：{{this.selected_target_table.guest_num}} 人</p>
                    <p>桌位狀態：{{this.selected_target_table.table_status == 0? "空位": this.selected_target_table.table_status == 1? "使用中":this.selected_table.table_status == 2? "已預約":"帶位中"}}</p>
                    <p>用餐區域：{{this.selected_target_table.table_area}}</p>
                    <p>孩童座：{{this.selected_target_table.has_priorityseat? "有":"無"}}</p>
                  </div>
                  <div v-else><p>桌號：尚未未選擇</p><p>請先選擇有桌號的座位</p></div></div>
              </div>
            </div>
          </template>

          <v-card-actions>
            <v-spacer></v-spacer>
            <button
              @click="btnHandler"
              class="click_btn"
            >確認</button>
            <button
              @click="isActive.value = false"
              class="cancel_btn"
            >取消</button>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>
  <style lang="scss" scoped>
  .click_btn{
    border: none;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    color: white;
    border-radius: 0.5rem;
    background-color: #00c5c8;
    &:hover{
      background-color: #00a0a3;
      cursor: pointer;
    }
  }
  .cancel_btn{
    border: none;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    margin-left: 1rem;
    color: black;
    background-color: rgb(211, 211, 211);
    &:hover{
      background-color: #e0e0e0;
      cursor: pointer;
    }
  }
  .template_dialog_btn{
    border: none;
    font-size: 1.5rem;
    color: white;
    background-color: unset;
    &:hover{
      background-color: #00c5c8;
      cursor: pointer;
    }
  }
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
        min-width: 40%;
        min-height: 50vh;
        border: 2px solid #00c5c8;
        padding: 1rem;
        border-radius: 1rem;
        p{
          font-size: 1.2rem;
          margin-left: 1rem;
        }
      }
      .tables_exchange{
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
 import Swal from "sweetalert2";
export default{
  props:{
    selected_table:Object,
    selected_target_table:Object
  },
  methods:{
    async btnHandler(){
      if(this.selected_table.table_id =="#" || this.selected_target_table.table_id=="#"){
            Swal.fire({title:"你尚未選擇桌位！請重新選擇桌位再換桌",showConfirmButton:true,
            confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
            icon:'error',iconColor:"#00c5c8"})
            return;
      }else{
        let temp_selected_table_id = this.selected_table.table_id;
        this.selected_table.table_id = this.selected_target_table.table_id;
        this.selected_target_table.table_id = temp_selected_table_id;
        //編輯選擇跟目標桌位
        let table_json = {};
        table_json["max_guest_num"] = this.selected_table["max_guest_num"];
        table_json["staff_id"] = this.selected_table["staff_id"];
        table_json["table_id"] = this.selected_table["table_id"];
        table_json["lastmodified_staff_id"] = this.selected_table["lastmodified_staff_id"];
        table_json["booking_num"] = this.selected_table["booking_num"];
        table_json["has_priorityseat"] = this.selected_table["has_priorityseat"];
        table_json["table_status"]=this.selected_table["table_status"];
        table_json["table_area"] = this.selected_table["table_area"];
        table_json["guest_name"] =this.selected_table["guest_name"];
        table_json["guest_phone"] =this.selected_table["guest_phone"];
        table_json["guest_num"] = this.selected_table["guest_num"];
        try {
            const response = await fetch(`http://localhost:8080/table`,{
              method:"PUT",
              headers: {
              'Content-Type': 'application/json',
              },
              body:JSON.stringify(table_json)
            });
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
          } catch (error) {
            console.error("Error fetching table data:", error);
        }
        table_json ={};
        table_json["max_guest_num"] = this.selected_target_table["max_guest_num"];
        table_json["staff_id"] = this.selected_target_table["staff_id"];
        table_json["table_id"] = this.selected_target_table["table_id"];
        table_json["lastmodified_staff_id"] = this.selected_target_table["lastmodified_staff_id"];
        table_json["booking_num"] = this.selected_target_table["booking_num"];
        table_json["has_priorityseat"] = this.selected_target_table["has_priorityseat"];
        table_json["table_status"]=this.selected_target_table["table_status"];
        table_json["table_area"] = this.selected_target_table["table_area"];
        table_json["guest_name"] =this.selected_target_table["guest_name"];
        table_json["guest_phone"] =this.selected_target_table["guest_phone"];
        table_json["guest_num"] = this.selected_target_table["guest_num"];
        try {
            const response = await fetch(`http://localhost:8080/table`,{
              method:"PUT",
              headers: {
              'Content-Type': 'application/json',
              },
              body:JSON.stringify(table_json)
            });
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
          } catch (error) {
            console.error("Error fetching table data:", error);
        }
        Swal.fire({title:"換桌成功！",showConfirmButton:true,
            confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
            icon:'success',iconColor:"#00c5c8"}).then((res)=>{
              if(res.isConfirmed){
                window.location.reload();
              }
            })
        
      }
    }
  }
}
</script>