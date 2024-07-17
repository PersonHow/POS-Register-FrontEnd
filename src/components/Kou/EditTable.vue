<template>
    <div style="width: 50%;">
      <form class="input_add_table" >
        <h2>你編輯的桌位如下：</h2>
        <h2>桌號：{{ input_table.table_id == "#"? "未選擇": input_table.table_id }}</h2>
        <div style="display: flex; justify-content: space-between;align-items: center">
          <h5>員工：</h5>
          <select v-model="input_table.staff_id">
            <option v-for="working_staff in working_staff_list" :key="working_staff_list.staff_id" :value="working_staff.staff_id">{{ working_staff.staff_name }}</option>
          </select>
        </div>
        <div style="display: flex; justify-content: space-between;align-items: center">
          <h5>兒童座：</h5>
          <select v-model="input_table.has_priorityseat">
            <option :value="true">有</option>
            <option :value="false">無</option>
          </select>
        </div>
        <div style="display: flex; justify-content: space-between;align-items: center">
          <h5>客人姓名：</h5>
          <input v-model="input_table.guest_name" type="text" maxlength="10">
        </div>
        <div style="display: flex; justify-content: space-between;align-items: center">
        <h5>客人電話：</h5>
        <input v-model="input_table.guest_phone" type='text' maxlength="10"/>
        </div>
        <div style="display: flex; justify-content: space-between;align-items: center">
        <h5>訂位：<br>(0:未訂位)</h5>
          <input v-model="input_table.booking_num" type="text">
        </div>
        <div style="display: flex; justify-content: space-between;align-items: center">
        <h5>桌位狀態：</h5>
          <select v-model="input_table.table_status">
            <option :value="0">空位</option>
            <option :value="1">使用中</option>
            <option :value="2">已預約</option>
            <option :value="3">帶位中</option>
          </select>
        </div>
        <div style="display: flex; justify-content: space-between;align-items: center">
          <h5>最大容納人數：</h5>
          <input v-model="input_table.max_guest_num" type="number" min="0" max="10">
        </div>
        <div style="display: flex; justify-content: space-between;align-items: center">
          <h5>用餐人數：</h5>
          <input v-model="input_table.guest_num" type="number" min="0" max="10">
        </div>
        <div style="display: flex; justify-content: space-between;align-items: center">
          <h5>用餐區：</h5>
          <select v-model="input_table.table_area">
            <option v-for="table_area in this.nav_item_list" :value="table_area">{{table_area}}</option>
          </select>
        </div>
        <div style="display: flex; width: 100%; justify-content: space-between">
          <a href="javascript: void(0)" class="btn" @click="postTableHandler">
            <div>
                <span>提交</span>
                <span>提交</span>
            </div>
          </a>
          <a href="javascript: void(0)" class="btn" @click="deleteTableHandler">
            <div>
                <span>刪除</span>
                <span>刪除</span>
            </div>
          </a>
        </div>
      </form>
    </div>
</template>