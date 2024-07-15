<template>
  <div style="display: flex;">
  <div id="app">
    <div style="display: flex; align-items: center;">
      <button @click="toggleEdit" class="btn_not_adjust_table">調整桌位</button>
      <p v-if="this.isTargetEditing" style="display: flex;flex-direction: column;margin-left: 2rem;margin-right:2rem;color: #00c5c8;">
          你選擇的桌位：{{ select_table.table_id == "#" ?"尚未選擇":select_table.table_id }}<br/>
          ->目標桌位：{{ target_table.table_id == "#" ?"尚未選擇":target_table.table_id }}</p>
      <p v-else style="display: flex;flex-direction: column;margin-left: 2rem;margin-right:2rem;color: #00c5c8;">
        你選擇的桌位：{{ select_table.table_id == "#" ?"尚未選擇":select_table.table_id }}</p>
        
      <button @click='()=>{ this.select_table = {table_id:"#"};
                            this.input_table ={table_id:"#"};
                            this.target_table = {table_id:"#"};
                            this.$emit("selected_table",this.select_table);
                            this.$emit("selected_target_table",this.target_table);
                          }' class="btn_clear_select_table">清除桌位</button>
      <button @click="toggleTarget" class="btn_cancel_target_table">設定目標桌位</button>
    </div>
    <!-- 當進入編輯模式時，啟用拖曳功能 -->
    <div v-if="this.isEditing">
      <draggable
        v-model="tables"
        animation="300"
        @start="onStart"
        @end="onEnd"
        style="display: flex;flex-direction: row; min-height: 200px;min-width: 100%;"
        class="list-group"
        tag="ul"
        :group="group_tables"
        v-bind="dragOptions">
        <!-- 顯示每張桌子的內容 -->
          <template #item="{element}">
              <div>
                <div
                      :class="['table', element.status]"
                      :id="'table-' + element.table_id"
                      style="margin: 0.5rem;"
                      @click="()=>{
                        selectTableHandler(element);
                      }">
                      <!-- 根據桌子的狀態設置樣式 -->
                      <div class="tableNum">
                        <div class="Num">桌號: {{ element.table_id }}</div>
                      </div>
                      <div class="staffId">
                        <div>員工: {{ element.staff_name }}</div>
                      </div>
                      <div class="status">
                        <div>{{ element.table_status==0 ? "空位": element.table_status==1 ? "使用中": element.table_status == 2 ?"已預約" :"帶位中"}}</div>
                      </div>
                      <div class="booking">
                        <div>預訂: {{ element.booking_num }}</div>
                      </div>
                      <div class="childSeat">
                        <div>兒童座: {{ element.has_priorityseat ? '有' : '無' }}</div>
                      </div>
                      <div class="Seat">
                        <div>用餐人數: {{ element.guest_num }}</div>
                      </div>
                </div>
              </div>
          </template>
      </draggable>
      <div style="display: flex;flex-direction: row;">
        <draggable
          v-model="tables_list2"
          :group="group_tables_list2"
          animation="300"
          @start="onStart"
          @end="onEnd"
          style="display:flex;width:100%;flex-direction: column;justify-content: space-between;position: relative;min-height: 200px;min-width: 70%;"
          class="list-group"
          tag="ul"
          v-bind="dragOptions">
          <template #item="{element}">
                <div>
                  <div
                        :class="['table', element.status]"
                        :id="'table-' + element.table_id"
                        style="margin: 0.5rem;"
                        @click="()=>{
                          selectTableHandler(element);
                        }">
                        <!-- 根據桌子的狀態設置樣式 -->
                        <div class="tableNum">
                          <div class="Num">桌號: {{ element.table_id }}</div>
                        </div>
                        <div class="staffId">
                          <div>員工: {{ element.staff_name }}</div>
                        </div>
                        <div class="status">
                          <div>{{ element.table_status==0 ? "空位": element.table_status==1 ? "使用中": element.table_status == 2 ?"已預約" :"帶位中"}}</div>
                        </div>
                        <div class="booking">
                          <div>預訂: {{ element.booking_num }}</div>
                        </div>
                        <div class="childSeat">
                          <div>兒童座: {{ element.has_priorityseat ? '有' : '無' }}</div>
                        </div>
                        <div class="Seat">
                          <div>用餐人數: {{ element.guest_num }}</div>
                        </div>
                  </div>
                </div>
            </template>
          <!-- 顯示每張桌子的內容 -->
        </draggable>
        <draggable
          v-model="tables_list3"
          :group="group_tables_list3"
          animation="300"
          @start="onStart"
          @end="onEnd"
          style="display:flex;flex-direction: column;justify-content: space-between;width:100%;position: relative;min-height: 200px;min-width: 70%;"
          class="list-group"
          tag="ul"
          v-bind="dragOptions">
          <template #item="{element}">
                <div>
                  <div
                        :class="['table', element.status]"
                        :id="'table-' + element.table_id"
                        style="margin: 0.5rem;"
                        @click="()=>{
                          selectTableHandler(element);
                        }">
                        <!-- 根據桌子的狀態設置樣式 -->
                        <div class="tableNum">
                          <div class="Num">桌號: {{ element.table_id }}</div>
                        </div>
                        <div class="staffId">
                          <div>員工: {{ element.staff_name }}</div>
                        </div>
                        <div class="status">
                          <div>{{ element.table_status==0 ? "空位": element.table_status==1 ? "使用中": element.table_status == 2 ?"已預約" :"帶位中"}}</div>
                        </div>
                        <div class="booking">
                          <div>預訂: {{ element.booking_num }}</div>
                        </div>
                        <div class="childSeat">
                          <div>兒童座: {{ element.has_priorityseat ? '有' : '無' }}</div>
                        </div>
                        <div class="Seat">
                          <div>用餐人數: {{ element.guest_num }}</div>
                        </div>
                  </div>
                </div>
            </template>
          <!-- 顯示每張桌子的內容 -->
        </draggable>
      </div>
      <draggable
        v-model="tables_list4"
        :group="group_tables_list4"
        animation="300"
        @start="onStart"
        @end="onEnd"
        style="display:flex;flex-direction:row;width:100%;position: relative;min-height: 200px;min-width: 100%;"
        class="list-group"
        tag="ul"
        v-bind="dragOptions">
        <template #item="{element}">
              <div>
                <div
                      :class="['table', element.status]"
                      :id="'table-' + element.table_id"
                      style="margin: 0.5rem;"
                      @click="()=>{
                        selectTableHandler(element);
                      }">
                      <!-- 根據桌子的狀態設置樣式 -->
                      <div class="tableNum">
                        <div class="Num">桌號: {{ element.table_id }}</div>
                      </div>
                      <div class="staffId">
                        <div>員工: {{ element.staff_name }}</div>
                      </div>
                      <div class="status">
                        <div>{{ element.table_status==0 ? "空位": element.table_status==1 ? "使用中": element.table_status == 2 ?"已預約" :"帶位中"}}</div>
                      </div>
                      <div class="booking">
                        <div>預訂: {{ element.booking_num }}</div>
                      </div>
                      <div class="childSeat">
                        <div>兒童座: {{ element.has_priorityseat ? '有' : '無' }}</div>
                      </div>
                      <div class="Seat">
                        <div>用餐人數: {{ element.guest_num }}</div>
                      </div>
                </div>
              </div>
          </template>
        <!-- 顯示每張桌子的內容 -->
      </draggable>
    </div>
    <div v-else class="noEditTableArea">
      <!-- 當不處於編輯模式時，僅顯示桌子 -->
      <div style="display: flex;min-height: 200px;min-width: 100%;">
        <div
          v-for="table in tables"
          :key="table.table_id"
          :class="['table', table.status]"
          :id="'table-' + table.table_id"
          @click="()=>{
                      selectTableHandler(table);
                    }"
          >
          <div class="tableNum">
            <div class="Num">桌號: {{ table.table_id }}</div>
          </div>
          <div class="staffId">
            <div>員工: {{ table.staff_name }}</div>
          </div>
          <div class="status">
                      <div>{{ table.table_status==0 ? "空位": table.table_status==1 ? "使用中": table.table_status == 2 ?"已預約" :"帶位中"}}</div>
                    </div>
          <div class="booking">
            <div>預訂: {{ table.booking_num }}</div>
          </div>
          <div class="childSeat">
            <div>兒童座: {{ table.has_priorityseat ? '有' : '無' }}</div>
          </div>
          <div class="Seat">
            <div>用餐人數: {{ table.guest_num }}</div>
          </div>
        </div>
      </div>
      <div style="display: flex;flex-direction: row;">
        <div style="display: flex;flex-direction: column;justify-content: space-between;min-height: 200px;min-width: 70%;">
              <div
                v-for="table in tables_list2"
                :key="table.table_id"
                :class="['table', table.status]"
                :id="'table-' + table.table_id"
                @click="()=>{
                            selectTableHandler(table);
                          }"
                >
                <div class="tableNum">
                  <div class="Num">桌號: {{ table.table_id }}</div>
                </div>
                <div class="staffId">
                  <div>員工: {{ table.staff_name }}</div>
                </div>
                <div class="status">
                            <div>{{ table.table_status==0 ? "空位": table.table_status==1 ? "使用中": table.table_status == 2 ?"已預約" :"帶位中"}}</div>
                          </div>
                <div class="booking">
                  <div>預訂: {{ table.booking_num }}</div>
                </div>
                <div class="childSeat">
                  <div>兒童座: {{ table.has_priorityseat ? '有' : '無' }}</div>
                </div>
                <div class="Seat">
                  <div>用餐人數: {{ table.guest_num }}</div>
                </div>
              </div>
        </div>
        <div style="display: flex;flex-direction: column;justify-content: space-between;min-height: 200px;min-width: 70%;">
              <div
                v-for="table in tables_list3"
                :key="table.table_id"
                :class="['table', table.status]"
                :id="'table-' + table.table_id"
                @click="()=>{
                            selectTableHandler(table);
                          }"
                >
                <div class="tableNum">
                  <div class="Num">桌號: {{ table.table_id }}</div>
                </div>
                <div class="staffId">
                  <div>員工: {{ table.staff_name }}</div>
                </div>
                <div class="status">
                            <div>{{ table.table_status==0 ? "空位": table.table_status==1 ? "使用中": table.table_status == 2 ?"已預約" :"帶位中"}}</div>
                          </div>
                <div class="booking">
                  <div>預訂: {{ table.booking_num }}</div>
                </div>
                <div class="childSeat">
                  <div>兒童座: {{ table.has_priorityseat ? '有' : '無' }}</div>
                </div>
                <div class="Seat">
                  <div>用餐人數: {{ table.guest_num }}</div>
                </div>
              </div>
        </div>
      </div>
      <div style="display: flex;min-height: 200px;min-width: 100%;">
        <div
          v-for="table in tables_list4"
          :key="table.table_id"
          :class="['table', table.status]"
          :id="'table-' + table.table_id"
          @click="()=>{
                      selectTableHandler(table);
                    }"
          >
          <div class="tableNum">
            <div class="Num">桌號: {{ table.table_id }}</div>
          </div>
          <div class="staffId">
            <div>員工: {{ table.staff_name }}</div>
          </div>
          <div class="status">
                      <div>{{ table.table_status==0 ? "空位": table.table_status==1 ? "使用中": table.table_status == 2 ?"已預約" :"帶位中"}}</div>
                    </div>
          <div class="booking">
            <div>預訂: {{ table.booking_num }}</div>
          </div>
          <div class="childSeat">
            <div>兒童座: {{ table.has_priorityseat ? '有' : '無' }}</div>
          </div>
          <div class="Seat">
            <div>用餐人數: {{ table.guest_num }}</div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
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
            <option v-for="table_area in table_area_list" :value="table_area">{{table_area}}</option>
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
  </div>
  <div style="display: flex;align-items: center; justify-content: space-between;">
    <p style="color:#00c5c8;margin-left: 1rem;font-size: 1.5rem">你預計新增桌位如下：</p>
    <a @click="addTableHandler"><img src="../../assets/add.png" style="width: 50px;margin-right: 1rem;"></a>
  </div>
  <div style="display: flex;align-items:start;justify-content: space-between;">
    <div id="add_app">
    <draggable
      v-if="this.isEditing"
      v-model="add_table_list"
      animation="300"
      @start="onStart"
      @end="onEnd"
      style="display: flex;min-height: 200px;min-width: 200px;"
      class="list-group"
      tag="ul"
      :group="group_add_table_list"
      v-bind="dragOptions">
      <!-- 顯示每張桌子的內容 -->
        <template #item="{element}">
            <div>
              <div
                    :class="['table', element.status]"
                    :id="'table-' + element.table_id"
                    style="margin: 0.5rem;">
                    <!-- 根據桌子的狀態設置樣式 -->
                    <div class="tableNum">
                      <div class="Num">桌號: {{ element.table_id }}</div>
                    </div>
                    <div class="staffId">
                      <div>員工: {{ element.staff_name }}</div>
                    </div>
                    <div class="status">
                      <div>{{ element.table_status==0 ? "空位": element.table_status==1 ? "使用中": element.table_status == 2 ?"已預約" :"帶位中"}}</div>
                    </div>
                    <div class="booking">
                      <div>預訂: {{ element.booking_num }}</div>
                    </div>
                    <div class="childSeat">
                      <div>兒童座: {{ element.has_priorityseat ? '是' : '否' }}</div>
                    </div>
                    <div class="Seat">
                      <div>用餐人數: {{ element.guest_num }}</div>
                    </div>
              </div>
            </div>
        </template>
    </draggable>
    <div v-else class="noEditTableArea">
      <!-- 當不處於編輯模式時，僅顯示桌子 -->
      <div style="display: flex;">
        <div
          v-for="table in add_table_list"
          :key="table.table_id"
          :class="['table', table.status]"
          :id="'table-' + table.table_id"
          @click="()=>{
                      selectTableHandler(table);
                    }"
          >
          <div class="tableNum">
            <div class="Num">桌號: {{ table.table_id }}</div>
          </div>
          <div class="staffId">
            <div>員工: {{ table.staff_name }}</div>
          </div>
          <div class="status">
                      <div>{{ element.table_status==0 ? "空位": element.table_status==1 ? "使用中": element.table_status == 2 ?"已預約" :"帶位中"}}</div>
                    </div>
          <div class="booking">
            <div>預訂: {{ table.booking_num }}</div>
          </div>
          <div class="childSeat">
            <div>兒童座: {{ table.has_priorityseat ? '有' : '無' }}</div>
          </div>
          <div class="Seat">
            <div>用餐人數: {{ table.guest_num }}</div>
          </div>
        </div>
      </div>
    </div>
    </div>
</div>
  
</template>
  
  <script>
  import draggable from "vuedraggable";
  import { onMounted } from "vue"; // 導入 vuedraggable 用於實現拖曳功能
  export default {
    components: {
      draggable // 將 draggable 組件套用在此vue上
    },
    data() {
      return {
        isreload:false,
        table_count:0,
        table_area_list:["一般區","貴賓區"],
        input_table:{table_id:"#"},
        target_table:{table_id:"#"},
        isTargetEditing:false,
        isEditing: false, // 判斷是否為編輯模式的變數
        working_staff_list:[],//已上工的員工列表
        tables: [],
        group_tables:{
          name:"site",
          pull:true,
          put:true
        },
        select_table:{table_id:"#"},
        tables_list2: [],
        group_tables_list2:{
          name:"site",
          pull:true,
          put:true
        },
        add_table_list:[],
        group_add_table_list:{
          name:"site",
          pull:true,
          put:true
        },
        tables_list3:[],
        group_tables_list3:{
          name:"site",
          pull:true,
          put:true
        },
        tables_list4:[],
        group_tables_list4:{
          name:"site",
          pull:true,
          put:true
        },
      };
    },
    methods: {
      async postTableHandler(){
        if(this.input_table.table_id == 0){
          alert("你沒有選擇桌位!請選擇桌位後再編輯");
          return;
        }
        this.input_table.status = (this.input_table.table_status=== 0 ? "available":this.input_table.table_status=== 1 ? "in-use" :"reserved");
        let table_json = {};
        table_json["max_guest_num"] = this.input_table["max_guest_num"];
        table_json["staff_id"] = this.input_table["staff_id"];
        table_json["table_id"] = this.input_table["table_id"];
        table_json["lastmodified_staff_id"] = this.working_staff_list[0].staff_id;
        table_json["booking_num"] = this.input_table["booking_num"];
        table_json["has_priorityseat"] = this.input_table["has_priorityseat"];
        table_json["table_status"]=this.input_table["table_status"];
        table_json["table_area"] = this.input_table["table_area"];
        table_json["guest_name"] =this.input_table["guest_name"];
        table_json["guest_phone"] =this.input_table["guest_phone"];
        table_json["guest_num"] = this.input_table["guest_num"];
        
        console.log(table_json);
        if(this.input_table["table_id"] == "#"){
          //新增時使用POST
          table_json["table_id"] = 0;
          try {
            const response = await fetch(`http://localhost:8080/table`,{
              method:"POST",
              headers: {
              'Content-Type': 'application/json',
              },
              body:JSON.stringify(table_json)
            });
            if (response.status !=201) {
              throw new Error("Network response was not ok");
            }else{
              const data = await response.json();
              alert(`新增桌號：${data["table_id"]} 成功！`);
              window.location.reload();
            }
          } catch (error) {
            console.error("Error fetching table data:", error);
          }
        }else{
          //編輯桌位時使用PUT
          table_json["table_id"] = this.input_table["table_id"];
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
            }else{
              alert(`編輯桌號：${table_json["table_id"]} 成功！`);
              window.location.reload();
            }
          } catch (error) {
            console.error("Error fetching table data:", error);
          }
        }
        this.input_table = {};
        this.select_table ={};
      },
      async deleteTableHandler(){
        try {
          const response = await fetch(`http://localhost:8080/table/${this.input_table.table_id}`,{
            method:"DELETE",
            headers: {
            'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }else{
            alert("刪除成功！");
            window.location.reload();
          }
        } catch (error) {
          console.error("Error fetching table data:", error);
        }
      },
      selectTableHandler(table){
        if(this.isTargetEditing){
          this.target_table =table;
        }else{
          this.select_table =table;
        }
        this.input_table = table;
        console.log(this.input_table);
        this.$emit("selected_table",this.select_table);
        this.$emit("selected_target_table",this.target_table);
      },
     async addTableHandler(){
        let add_table = {};
        add_table.staff_name = this.working_staff_list[0].staff_name;
        add_table.staff_id = this.working_staff_list[0].staff_id;
        add_table.max_guest_num =1;
        add_table.guest_num =0;
        add_table.booking_num =0;
        add_table.has_priorityseat = false;
        add_table.max_guest_num = 4;
        add_table.table_status = 0;
        add_table.status = "available";
        add_table.guest_name="";
        add_table.guest_phone="";
        add_table.lastmodified_staff_id=this.working_staff_list[0].staff_id;
        add_table.table_area = "一般區";
        add_table.table_id = "#"
        this.add_table_list.push(add_table);
      },
      toggleEdit(e) {
        this.isEditing = !this.isEditing;
        console.log(this.isEditing);
        if(this.isEditing){
          e.target.className="btn_adjust_table";
        }else{
          e.target.className="btn_not_adjust_table";
        }
      },
      toggleTarget(e){
        this.isTargetEditing =!this.isTargetEditing;
        console.log(this.isTargetEditing);
        if(this.isTargetEditing){
          e.target.className="btn_target_table";
        }else{
          e.target.className="btn_cancel_target_table";
        }

      },
      saveTableOrder() {
        // 保存新的桌子排序
        console.log("新的桌子順序:", this.tables);
      },
      async fetchTables() {
        try {
          const response = await fetch("http://localhost:8080/table");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          this.tables = data.map((table, i) => ({
            ...table,
            //0:空位、1:使用中、2:已預約、3:帶位中
            status:
              table.table_status  === 0 ? "available" : table.table_status === 1 ? "in-use" :table.table_status === 2 ?"reserved":"take"
          }));
          this.table_count =this.tables.length;
        } catch (error) {
          console.error("Error fetching table data:", error);
        }
      },
      async fetchWorkingStaffs(){
        try {
          const response = await fetch("http://localhost:8080/staff/isworking",{
            method:"POST",
            headers: {
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
              email:"BBB@yahoo.com",
              password:"123"
            }),
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          this.working_staff_list = data;
        } catch (error) {
          console.error("Error fetching table data:", error);
        }
      },
      formatTime(timeString) {
        if (!timeString) return "";
        const date = new Date(timeString);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
      },
    },
    created() {
      this.fetchTables();
      this.fetchWorkingStaffs();
    },
  };
  </script>
  
  <style scoped lang="scss">
  .table {
    width: 136px;
    margin: 10px;
    text-align: center;
    line-height: 1.5em; /* 行高設置為1.5倍的字體大小 */
    border: 1px solid #ccc;
    padding: 10px; /* 添加內邊距 */
    
  }
  .available {
    background-color: #2a9d8f;
  }
  .in-use {
    background-color: #e76f51;
  }
  .reserved {
    background-color: #f4a261;
  }
  .take{
    background-color: #ddce4a;
  }

  #app {
    width: 100%;
    flex-direction: column;
    max-height: 80vh;
    padding:1%;
    margin: 1rem;
    border:2px solid #00c5c8;
    overflow: scroll;
    .tableNum{
      width: 100%;
      font-size: 25px;
      display: flex;
      justify-content:baseline;
      color: white;
    }
    .status{
      width: 100%;
      display: flex;
      align-items: center;
      color: white;
      font-size: 1.5rem;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .staffId,.booking,.time,.childSeat,.Seat{
      width: 100%;
      display: flex;
      justify-content: start;
      color: white;
    }
  }
  #add_app {
    flex-direction: column;
    width: 100%;
    padding:1%;
    max-height: 30vh;
    margin: 1rem;
    border:2px solid #00c5c8;
    overflow: scroll;
    .tableNum{
      width: 100%;
      font-size: 25px;
      display: flex;
      justify-content:baseline;
      color: white;
    }
    .status{
      width: 100%;
      display: flex;
      align-items: center;
      color: white;
      font-size: 1.5rem;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .staffId,.booking,.time,.childSeat,.Seat{
      width: 100%;
      display: flex;
      justify-content: start;
      color: white;
    }
  }
  .input_add_table{
    max-height: 80vh;
    margin: 1rem;
    width: 100%;
    overflow-y: scroll;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    color:#00c5c8;
    border:2px solid #00c5c8;
    div{
      margin-top:1rem;
      margin-bottom: 1rem;
      select,input{
        width:55%;
        font-size: 2rem;
        background-color: white;
        border: 1px solid black;
      }
      h5{
        font-size: 1.5rem;
        font-weight: 400;
      } 
    } 
  }
   
  .noEditTableArea {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 200px;
    .tableNum {
      width: 100%;
      min-width:200px;
      display: flex;
      justify-content: baseline;
    }
    .status{
      width: 100%;
      display: flex;
      align-items: center;
      color: white;
      font-size: 1.5rem;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .staffId,.booking,.time,.childSeat,.Seat{
      width: 100%;
      display: flex;
      justify-content: start;
      color: white;
    }
  }
  .btn {
    margin-top: 1rem;
    width: 100px;
    background: #FFFFFF;
    border: 2px solid #00c5c8;
    transform: translate3d(0px, 0%, 0px);
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    transition-delay: 0.6s;
    overflow: hidden;
    &:before,&:after 
    {
        content: '';
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        transition: all 0.6s ease;
    }
    &:before{
      background: #00c5c8;
      border-radius: 50% 50% 0 0;
      transform: translateY(100%) scaleY(0.5);
    }
    &:after{
      background: #FFFFFF;
    border-radius: 0;
    transform: translateY(0) scaleY(1);
    }
    div{
      position: relative;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 32px;
    text-transform: uppercase;
    overflow: hidden;
    }
    span{
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    z-index: 1;
    text-align: center;
    transition: transform 0.5s ease;
      &:first-child{
        color: #FFFFFF;
        transform: translateY(24px);
        } 
      &:last-child{
        color: #3AD2D0;
        transform: translateY(0);
      }
    }
  &:hover{
    background: #3AD2D0;
    transition: #3AD2D0 0.2s linear;
    transition-delay: 0.6s;
    color: #FFFFFF;
  }
  &:hover::after{
    border-radius: 0 0 50% 50%;
    transform: translateY(-100%) scaleY(0.5);
    transition-delay: 0;
  }
  &:hover:before{
    border-radius: 0;
    transform: translateY(0) scaleY(1);
    transition-delay: 0;
  }
}
.btn:hover span:first-child {
    transform: translateY(0);
}
.btn:hover span:last-child {
    transform: translateY(-32px);
}
.btn_adjust_table{
    background-color: #e76f51;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    font-size: 18px;
    font-family: monospace;
    color: white;
    padding: 10px;
    margin-left: 5px;
    text-align: center;
    cursor: pointer;
}
.btn_not_adjust_table{
    background-color: #3AD2D0;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    font-size: 18px;
    font-family: monospace;
    color: white;
    padding: 10px;
    margin-left: 5px;
    text-align: center;
    cursor: pointer;
}
.btn_clear_select_table{
    background-color: #3AD2D0;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    font-size: 18px;
    font-family: monospace;
    color: white;
    padding: 10px;
    margin-left: 5px;
    text-align: center;
    cursor: pointer;
}
.btn_target_table{
    background-color: #e76f51;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    font-size: 18px;
    font-family: monospace;
    color: white;
    padding: 10px;
    margin-left: 5px;
    text-align: center;
    cursor: pointer;
}
.btn_cancel_target_table{
  background-color: #3AD2D0;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    font-size: 18px;
    font-family: monospace;
    color: white;
    padding: 10px;
    margin-left: 5px;
    text-align: center;
    cursor: pointer;
}
  </style>
  