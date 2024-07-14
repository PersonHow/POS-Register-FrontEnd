<template>
  <div>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          width="5%"
          height="6vh"
          color="#01e1c5"
          v-bind="props"
          rounded="circle">
          <img src="../../assets/bars.png" width="100%">
        </v-btn>
      </template>
      <v-list width="200px">
        <v-list-item
        class="nav_item"
          v-for="(item, index) in nav_item_list"
          :key="index"
          :value="index"
          @click="()=>{Select_itemHandler(index)}"
        >
          <v-list-item-title>{{ item }}</v-list-item-title>
        </v-list-item>
        <v-list-item
        class="nav_item">
          <v-list-item-title>+新增其他區域</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<style>
.nav_item{
  color: #00c5c8;
  border-bottom: 1px solid #00c5c8;
}
</style>
<script>
  export default {
    created(){
      this.outputSelected_item();
    },
    data(){
      return {
        selected_item_list:"一般區",
        nav_item_list:["一般區","貴賓區"]
      }
    },
    methods:{
      Select_itemHandler(index){
          this.selected_item_list = this.nav_item_list[index];
          this.outputSelected_item();
      },
      outputSelected_item(){
        this.$emit("selected_item_list",this.selected_item_list);
      }
    }
  }
</script>