<template>
  <div>
    <v-menu>
      <template v-slot:activator="{ props }">
        <button
          v-bind="props"
          class="nav_header_btn"
          >
          <img src="../../assets/bars.png"/>
      </button>
      </template>
      <v-list width="200px">
        <p
        class="nav_item"
          v-for="(item, index) in nav_item_list"
          :key="index"
          :value="index"
          @click="()=>{Select_itemHandler(index)}"
        >
          {{ item }}
      </p>
      <p class="nav_item" @click="addTableAreaHandler">+新增用餐區</p>
      <p class="nav_item" @click="deleteTableAreaHandler">+刪除用餐區</p>
      </v-list>
    </v-menu>
  </div>
</template>
<style lang="scss" scoped>
*{
  box-sizing: border-box;
  color:unset;
  border:unset;
  overflow: hidden;
}
.nav_header_btn{
  background-color: #00c5c8;
  border-radius: 10%;
  &:hover{
    cursor: pointer;
    background-color: #00b5b8;
  }
  img{
    width: 2vw;
    height: 2.5vw;
  }
}
.nav_item{
  padding: 0.5rem 1.2rem;
  font-size: 1.2rem;
  height: 5vh;
  margin-top: 0;
  font-weight: bold;
  cursor: pointer;
  color: #00c5c8;
  border-bottom: 1px solid #00c5c8;
  &:hover{
    background-color: rgb(236, 236, 236);
  }
}
</style>
<script>
 import Swal from "sweetalert2";
  export default {
    created(){
      this.getAllTableAreas();
    },
    data(){
      return {
        selected_item_list:"",
        nav_item_list:[]
      }
    },
    methods:{
     async getAllTableAreas(){
        try {
          const response = await fetch("http://localhost:8080/tablearea");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          this.nav_item_list = data;
          this.selected_item_list = this.nav_item_list[0];
          this.$emit("nav_item_list",this.nav_item_list);
          this.$emit("selected_item_list",this.selected_item_list);
        } catch (error) {
          console.error("Error fetching table data:", error);
        }
      },
      Select_itemHandler(index){
          this.selected_item_list = this.nav_item_list[index];
          sessionStorage.setItem("selected_item",this.selected_item_list);
          window.location.reload();
      },
      async addTableAreaHandler(){
        Swal.fire({title: '請輸入要新增的用餐區域：',
        input: 'text',
        showConfirmButton:true,
        showCancelButton:true,
        confirmButtonColor:"#00c5c8",
        confirmButtonText:"確定",
        cancelButtonText:"取消"}).then(async function(result){
          if(result.isConfirmed){
          if(!result['value']){
            Swal.fire({title:"用餐區域不得為空！",showConfirmButton:true,
            confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
            icon:'error',iconColor:"#00c5c8"})
            return;
          }
          let table_area_json ={"table_area_name":result['value']};
            try {
            const response = await fetch(`http://localhost:8080/tablearea`,{
              method:"POST",
              headers: {
              'Content-Type': 'application/json',
              },
              body:JSON.stringify(table_area_json)
            });
            if (response.status !=201) {
              throw new Error("Network response was not ok");
            }else{
              Swal.fire({title:"新增用餐區域成功！",showConfirmButton:true,
              confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
              icon:'success',iconColor:"#00c5c8"}).then((res)=>{
              if(res.isConfirmed){ 
                  //window.location.reload();
              }
            })
            }
          } catch (error) {
            console.error("Error fetching table data:", error);
          }
          }

        })

      },
      createDeleteTableArea(){
        let tableAreaOption ="";
        this.nav_item_list.map((item,index)=>{if(index !=0){
           tableAreaOption=tableAreaOption.concat(`<option value=${item}>${item}</option>`)}})
        return `<select id="TableAreaSelect" style="width:60%;font-size:2rem;">${tableAreaOption}</select>`;   
      },
      async deleteTableAreaHandler(){
        Swal.fire({title: '請輸入要刪除的用餐區域：',
        html:this.createDeleteTableArea(),
        showConfirmButton:true,
        showCancelButton:true,
        confirmButtonColor:"#00c5c8",
        confirmButtonText:"確定",
        cancelButtonText:"取消"}).then(async function(result){
          if(result.isConfirmed){
        
            let selectTaleArea = document.querySelector("#TableAreaSelect").options[document.querySelector("#TableAreaSelect").selectedIndex].value;
            try {
            const response = await fetch(`http://localhost:8080/tablearea/${selectTaleArea}`,{
              method:"DELETE",
              headers: {
              'Content-Type': 'application/json',
              },
            });
            if (response.status !=200) {
              throw new Error("Network response was not ok");
            }else{
              Swal.fire({title:"刪除用餐區域成功！",showConfirmButton:true,
              confirmButtonColor:"#00c5c8",confirmButtonText:"確定",
              icon:'success',iconColor:"#00c5c8"}).then((res)=>{
              if(res.isConfirmed){ 
                  window.location.reload();
              }
            })
            }
          } catch (error) {
            console.error("Error fetching table data:", error);
          }
          }
        })
      }
    }
  }
</script>