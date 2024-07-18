<script>
import Swal from "sweetalert2"; // 引入 SweetAlert2 庫

export default {
  data() {
    return {
      staff:null,
      booking_list_today:[],
      working_staff_list:[],
      booking_list:[],
      selected_booking_num:null,
      formData: {
        calendar_id:"#",
        booking_list:"",
        special_events:"",
         // 日期
        staff_name:"",
        staff_id:"#",
        lastmodified_staff_id:"#",
        isholiday:false,
        calendar_date: "",
      },
      currentTime: "", // 存放當前時間的資料
      tomorrowDate: "", // 存放明天日期的資料
    };
  },
  mounted() {
    this.staff = JSON.parse(sessionStorage.getItem("token"));
    this.fetchWorkingStaffs();
    this.setCurrentTime(); // 初始化當前時間
    this.setTomorrowDate(); // 設定明天的日期
    this.getBookingsToday();
  },
  methods: {
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
    setCurrentTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      this.currentTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    },
    setTomorrowDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // 取得明天的日期
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
      const day = String(tomorrow.getDate()).padStart(2, "0");
      this.tomorrowDate = `${year}-${month}-${day}`;
    },
    submitForm() {
    },
    async getBookingsToday(){
        try {
            const response = await fetch("http://localhost:8080/reserve/search");
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const data_lists =
            data.reserveList.filter((item)=>{
              const TIME = 24*60*60*1000;
              let duration= new Date().getTime()-new Date(item.date).getTime();
              if(duration<0){
                return false;
              }
              if(duration>TIME){
                return false;
              }
              return true;
            })
            this.booking_list_today = data_lists;
          } catch (error) {
            console.error("Error fetching table data:", error);
          }
      },
    resetForm() {
        this.formData.calendar_id="#";
        this.formData.booking_list=[];
        this.formData.special_events="";
        this.formData.staff_name="";
        this.formData.staff_id="#";
        this.formData.lastmodified_staff_id="#";
        this.formData.isholiday=false;
        this.formData.calendar_date="";
    },
    addSelected_booking_num(){
      if(this.selected_booking_num){
        this.booking_list =this.booking_list.filter((item)=>{
          if(item == this.selected_booking_num){
            return false;
          }
          return true;
        })
        this.booking_list.push(this.selected_booking_num);
        this.booking_list = this.booking_list.sort( (a,b) => {
                if(a<b){
                    return -1
                }else if(a>b){ 
                    return 1
                }else{
                    return 0
                }
        })
        this.selected_booking_num =null;
      }
    },
    postCalendarHandler(){
      console.log(this.formData);
    }
  },
};
</script>

<template>
  <div class="bf-container">
    <div class="bf-body">
      <div class="bf-body-box">
        <h1>活動設定</h1>
        <!-- 活動日期輸入欄 -->
        <div class="bf-row">
          <div class="bf-col-12">
            <p>活動日期</p>
            <input
              v-model="formData.date"
              type="date"
              :min="tomorrowDate"
            />
          </div>
        </div>
        <div class="bf-row">
          <div class="bf-col-6">
            <p>訂位編號：</p>
            <a style="width: 40%;font-size: 1rem;text-align: center;cursor: pointer;" @click="()=>{this.booking_list=[];}">清除</a>
            <p>{{ this.booking_list.join(",") }}</p>
          </div>
          <div class="bf-col-6">
            <p>當日訂位：</p>
            <select @click="addSelected_booking_num" v-model="this.selected_booking_num">
              <option v-for="booking in this.booking_list_today" :key="booking.bookingNum" :value="booking.bookingNum">{{ booking.bookingNum }}</option>
            </select>
          </div>
        </div>
        <!-- 人數和日期選擇欄 -->
        <div class="bf-row">
          <div class="bf-col-12">
            <p>活動類型</p>
            <select>
              <option>一般活動</option>
              <option>慶功活動</option>
              <option>生日活動</option>
            </select>
          </div>
        </div>
        <div class="bf-row">
          <div class="bf-col-12">
            <p>是否為公休日</p>
            <select v-model="this.formData.isholiday">
              <option :value=true>是</option>
              <option :value=false>否</option>
            </select>
          </div>
        </div>
        <div class="bf-row">
          <div class="bf-col-12">
            <p>值班員工</p>
            <select v-model="this.formData.staff_id">
              <option v-for="working_staff in working_staff_list" :key="working_staff_list.staff_id" :value="working_staff.staff_id">{{ working_staff.staff_name }}</option>
            </select>
          </div>
        </div>
        <!-- 提交按鈕 -->
        <div class="bf-row">
          <div class="bf-col-3">
            <input type="submit" value="提交" @click="postCalendarHandler"/>
          </div>
          <div class="bf-col-3">
            <input value="刪除" style="height: 100%;font-size: 1rem;text-align: center;cursor: pointer;"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
/* 表單元素樣式設定 */
input,
textarea,
select {
  width: 100%; /* 元素寬度為父元素寬度的100% */
  background-color: #f0f0f0; /* 淺灰色背景 */
  border: 2px solid black; /* 2px 寬度的深藍色邊框 */
  outline: none; /* 移除預設的外框 */
  padding: 10px; /* 內間距為10px */
  font-family: "Arial", sans-serif; /* 字體為Arial或sans-serif *//* 上邊距為5px */
  resize: none; /* 禁止調整大小 */
  font-size: 1rem;
  color: black; /* 文字顏色為深藍色 */
  transition: border-color 0.3s ease-in-out; /* 加入邊框顏色變化的過渡效果 */
}

input[type="text"]:hover,
input[type="number"]:hover,
input[type="date"]:hover,
textarea:hover {
  border-color: #00c5c8; /* 滑鼠懸停時邊框顏色變為橘色 */
}

/* 表單欄位佈局 */
.bf-col-12 {
  width: 100%; /* 寬度佔滿父元素的100% */
}

.bf-col-3 {
  width: 30%; /* 寬度佔滿父元素的30% */
}

.bf-col-6 {
  width: 48%; /* 寬度佔滿父元素的48% */
}

/* 表單頭部和尾部樣式 */
.bf-head,
.bf-footer {
  background-color: #f0f0f0; /* 淺灰色背景 */
  text-align: center; /* 文字置中 */
}

/* 整體表單容器樣式 */
.bf-container {
  min-width: 28vw;
  font-size: 1.2rem;
  margin-left: 2rem;
  border: 2px solid black;
  display: flex; /* 使用Flex布局 */ /* 水平置中 */ /* 垂直置中 */
  align-items: center;
  justify-content: center;
 /* 內間距為20px上下，16px左右 */

  /* 表單主體樣式 */
  .bf-body { /* 表單主體寬度為500px */
    background-color: white; /* 白色背景 */
    border-radius: 8px; /* 圓角為8px */
    /* 表單內容盒子樣式 */
    .bf-body-box {
      width: 25vw;
      max-height: 70vh;
      overflow-y: scroll;
      padding: 10px;
      display:flex;
      flex-direction: column;

      /* 表單行樣式 */
      .bf-row {
        display: flex; /* 使用Flex布局 */
        justify-content: space-between; /* 空間平均分配 */
        padding: 10px 0; /* 上下內間距為10px */
      }

      /* 設定必填提示文字樣式 */
      .required {
        color: red; /* 必填提示文字為紅色 */
        margin-left: 5px; /* 與標籤之間的間距為5px */
        font-size: 0.9em; /* 字體大小為0.9em */
      }
    }
  }
}

/* 送出按鈕樣式 */
.bf-col-3 input[type="submit"] {
  background-color: #00c5c8;/* 深藍色背景 */
  color: white; /* 文字顏色為白色 */
  border: none; /* 無邊框 */
  padding: 12px 20px; /* 內間距為12px上下，20px左右 */
  font-size: 1rem; /* 字體大小為16px */
  cursor: pointer; /* 游標為手型 */
  transition: background-color 0.3s ease-in-out; /* 加入背景色變化的過渡效果 */
}

.bf-col-3 input[type="submit"]:hover {
  background-color: #00aeb1;
}

/* 標題和段落樣式 */
h1 {
  font-size: 40px; /* 標題字體大小為40px */
  color: black; /* 文字顏色為深藍色 */
  margin-bottom: 10px; /* 下邊距為10px */
}

p {
  color: black; /* 文字顏色為深藍色 */
  margin-bottom: 10px; /* 下邊距為10px */
}

/* 連結樣式 */
a {
  text-decoration: none; /* 移除下劃線 */
  color:#00c5c8; /* 文字顏色為橘色 */
}

a:hover {
  color: #00aeb1; /* 滑鼠懸停時文字顏色變為深藍色 */
}

@media screen and (max-width: 768px) {
  .bf-row {
    flex-direction: column; /* 表單行的排列方式改為垂直 */
    padding: 10px 0; /* 上下內間距為10px */
  }

  .bf-col-12,
  .bf-col-6,
  .bf-col-3 {
    width: 100%; /* 寬度佔滿父元素的100% */
    padding: 10px 0; /* 上下內間距為10px */
  }

  .bf-container {
    padding: 50px 16px; /* 內間距為50px上下，16px左右 */
  }
}
</style>