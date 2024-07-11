<template>
    <div class="container">
    
    <div class="topcalendar">
          <section class="month-names">
            <span class="month-names2" @click="handlePreMonth">{{ prevMonthName }}</span>
            <span class="month-names1">{{ currentMonthName }}</span>
            <span class="month-names3" @click="handleNextMonth">{{ nextMonthName }}</span>
          </section>
    
        <div class="calendar">
          <section class="header">
            {{ selectData.year }}年{{ selectData.month }}月{{ selectData.day }}日
          </section>
    
          <ul class="week-area">
            <li
          class="week-item"
            v-for="(item, index) in weekArr"
            :key="index"
            :class="[
              'week-font',
              { 'highlight-sun': index === 0 },  // 星期日
              { 'highlight-sat': index === 6 },  // 星期六
            ]"
    >
      {{ item }}
    </li>
          </ul>
          <section
            ref="calendar"
            class="data-container"
            :style="{
              height: isWeekView ? `${itemHeight + touchAreaHeight}px` : `${lineNum * itemHeight + touchAreaHeight}px`,
              transitionDuration: `${needHeightAnimation ? transitionDuration : 0}s`,
            }"
            @touchstart="touchStart"
            @touchmove.stop.prevent="touchMove"
            @touchend="touchEnd"
          >
            <section
              class="month-area"
              :style="{
                transform: `translateX(${-(translateIndex + 1) * 100}%)`,
                transitionDuration: `${needAnimation ? transitionDuration : 0}s`
              }">
              <div
                class="banner-area"
                :style="{
                  transform: `translateY(${offsetY}px)`,
                  transitionDuration: `${needHeightAnimation ? transitionDuration : 0}s`
                }">
                <ul
                  v-for="(monthItem, monthIndex) in allDataArr"
                  :key="monthIndex"
                  class="data-area"
                  :style="{
                    transform: `translateX(${(translateIndex + isTouching ? touch.x : 0) * 100}%)`,
                    transitionDuration: `${isTouching ? 0 : transitionDuration}s`
                  }">
                  <li
                    v-for="(item, index) in monthItem"
                    :key="index"
                    :class="[
                      'data-item',
                      { 'selected': item.isSelected },
                      { 'other-item': item.type !== 'normal' && !isWeekView },
                      { 'current-month': item.month === selectData.month && item.type === 'normal' },
                    ]"
                    :style="`height: ${itemHeight}px`"
                    @click="checkoutDate(item)">
                    <span class="data-font calendar-item">{{ item.day }}</span>
                  </li>
                </ul>
              </div>
            </section>
            <section
              class="touch-area"
              :style="`height: ${touchAreaHeight}px; padding-top: ${touchAreaPadding}px;`">
              <div
                class="touch-container" 
                :style="`height: ${touchAreaHeight - touchAreaPadding}px`">
                <div class="touch-item"></div>
              </div>
            </section>
          </section>
        </div>
      </div>
    
      <!--CalendarInfo  -->
    
      <div class="grid">
          <div
            v-for="(info, index) in calendarInfo"
            :key="index"
            :class="['card', `card-${index + 1}`]"
          >
            <div 
              :style="{ background: info.is_holiday ? '#880e4f' : 'linear-gradient(90deg, #00c1ca, #01e1c5)' }"
              class="date-circle"
            >
              <div :class="['date', `date-color-${index + 1}`]">{{ info.day }}</div>
            </div>
            <div :class="['content', `text-color-${index + 1}`]">
              <div class="info">
                {{ info.is_holiday ? '公休日' : (info.booking_count ? `預約客數 ${info.booking_count}組` : info.special_events) }}
              </div>
              <div class="staff" v-if="info.manager && !info.is_holiday">值班 {{ info.manager }}</div>
            </div>
          </div>
        </div>
      </div>
      </template>
      
      <script>
      export default {
        name: 'calender',
        data() {
          return {
            calendarData: [],
            selectData: {}, // 選中日期資訊 -> year, month, day
            weekArr: ['S', 'M', 'T', 'W', 'T', 'F', 'S'], // 星期数组
            dataArr: [], // 当前可视区域数据
            allDataArr: [], // 轮播数组
            isSelectedCurrentDate: false, // 是否点选当前月份信息 (配合月视图减少点击切换时的数组更新)
            translateIndex: 0, // 轮播所在位置
            transitionDuration: 0.3, // 动画持续时间
            needAnimation: true, // 左右滑动是否需要动画
            isTouching: false, // 是否为touch状态
            touchStartPositionX: null, // 初始滑动 X的值
            touchStartPositionY: null, // 初始滑动 Y的值
            touch: { // 本次touch事件，横向，纵向滑动的距离
              x: 0,
              y: 0
            },
            isWeekView: false, // 周视图还是月视图
            itemHeight: 50, // 子元素行高
            needHeightAnimation: false, // 高度变化是否需要动画
            offsetY: 0, // 周视图 Y轴偏移量
            lineNum: 0, // 当前视图总行数
            lastWeek: [], // 周视图 前一周数据
            nextWeek: [], // 周视图 后一周数据
            isDelay: true, // 是否延迟 (动画结束在处理数据)
            touchAreaHeight: 40, // 底部区域高度
            touchAreaPadding: 10, // 底部区域padding
            isClicked: false, // 点选元素 (去除周视图切换月份时的动画延迟)
            calendarInfo: [], // 用於儲存從API獲取的日曆資料
            bookinglist:'',
          }
        },
    
        mounted() {
        this.checkoutCurrentDate();
        this.fetchCalendarData();
      },
    
        created() {
          this.checkoutCurrentDate()
        },
        watch: {
          dataArr: {
            handler (val) {
              this.changeAllData(val)
            },
            deep: true,
          },
          isWeekView(val) {
            if (!val) {
              this.isSelectedCurrentDate = false
              this.changeAllData(this.dataArr)
            }
          },
        },
        computed: {
          prevMonthName() {
            const prevDate = this.getPreMonth();
          return this.getMonthName(prevDate.month);
          },
          currentMonthName() {
         return this.getMonthName(this.selectData.month);
          },
          nextMonthName() {
            const nextDate = this.getNextMonth();
          return this.getMonthName(nextDate.month);
          },
          limitedCalendarInfo() {
          return this.calendarInfo.slice(0, 8);
        },
        },
        methods: {
    
          fetchCalendarData() {
          fetch('http://localhost:8080/calendar')
            .then(response => response.json())
            .then(data => {
              console.log(data); // 在主控台顯示取得的資料
              this.processCalendarData(data);
            })
            .catch(error => {
              console.error('Error fetching calendar data:', error);
            });
        },
        processCalendarData(data) {
        const selectedDate = new Date(this.selectData.year, this.selectData.month - 1, this.selectData.day);
        const selectedWeek = this.getWeekRange(selectedDate);
    
        const calendarInfo = data
          .filter(item => {
            const itemDate = new Date(item.calendar_date);
            return itemDate >= selectedWeek.start && itemDate <= selectedWeek.end;
          })
          .map(item => {
            const itemDate = new Date(item.calendar_date);
            const bookingCount = item.booking_list ? item.booking_list.split(';').length : 0;
            return {
              day: itemDate.getDate(),
              booking_count: bookingCount,
              special_events: item.special_events,
              manager: item.staff_name,
              is_holiday: item.isholiday,
              specialevents: item.special_events
            };
          });
          this.calendarInfo = calendarInfo.slice(0, 8); // 只顯示前八筆資料
        },
      
        getWeekRange(date) {
        const dayOfWeek = date.getDay();
        const start = new Date(date);
        const end = new Date(date);
    
        start.setDate(date.getDate() - dayOfWeek);
        end.setDate(date.getDate() + (6 - dayOfWeek));
    
        return { start, end };
      },
    
          // 更新轮播数组
          changeAllData(val) {
            if (this.isSelectedCurrentDate && !this.isWeekView) return
      
            const preDate = this.getPreMonth()
            const preDataArr = this.getMonthData(preDate, true)
            const nextDate = this.getNextMonth()
            const nextDataArr = this.getMonthData(nextDate, true)
      
            if (this.isWeekView) {
              const sliceStart = this.dealWeekViewSliceStart()
              preDataArr.splice(sliceStart, 7, ...this.lastWeek)
              nextDataArr.splice(sliceStart, 7, ...this.nextWeek)
            }
      
            const delayHandle = (isDelay) => {
              this.allDataArr = [preDataArr, val, nextDataArr]
              this.needAnimation = false
              this.translateIndex = 0
              if (isDelay) this.isDelay = false
            }
      
            if (this.isDelay) {
              delayHandle(this.isDelay)
              return
            }
      
            setTimeout(() => {
              delayHandle()
            }, this.isClicked && this.isWeekView ? 0 : this.transitionDuration * 1000)
          },
          // 获取当前日期
          getCurrentDate() {
            this.selectData = {
              year: new Date().getFullYear(),
              month: new Date().getMonth() + 1,
              day: new Date().getDate(),
            }
          },
    
          getMonthName(month) {
          const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return monthNames[month - 1]; // month 是從 1 開始的，所以要減去 1
          },
    
          // 获取指定月份数据
          getMonthData(date, unSelected = false) {
            const { year, month, day } = date
            let dataArr = []
            let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
              daysInMonth[1] = 29
            }
      
            const monthStartWeekDay = new Date(year, month - 1, 1).getDay()
            const monthEndWeekDay = new Date(year, month, 1).getDay() || 7
      
            const preInfo = this.getPreMonth(date)
            const nextInfo = this.getNextMonth()
      
            for (let i = 0; i < monthStartWeekDay; i++) {
              let preObj = {
                type: 'pre',
                day: daysInMonth[preInfo.month - 1] - (monthStartWeekDay - i - 1),
                month: preInfo.month,
                year: preInfo.year,
              }
              dataArr.push(preObj)
            }
      
            for (let i = 0; i < daysInMonth[month - 1]; i++) {
              let itemObj = {
                type: 'normal',
                day: i + 1,
                month,
                year,
                isSelected: day === i + 1 && !unSelected,
              }
              dataArr.push(itemObj)
            }
      
            for (let i = 0; i < 7 - monthEndWeekDay; i++) {
              let nextObj = {
                type: 'next',
                day: i + 1,
                month: nextInfo.month,
                year: nextInfo.year,
              }
              dataArr.push(nextObj)
            }
      
            return dataArr
          },
          // 点选切换日期
          checkoutDate(selectData) {
            this.isSelectedCurrentDate = true
            this.isClicked = true
      
            if (this.isWeekView && selectData.type !== 'normal') {
              this.needAnimation = false
              this.needHeightAnimation = false
            }
      
            if (selectData.type === 'next') {
              this.translateIndex += 1
              this.dealMonthData('NEXT_MONTH', selectData.day)
              return
            }
      
            if (selectData.type === 'pre') {
              this.translateIndex -= 1
              this.dealMonthData('PRE_MONTH', selectData.day)
              return
            }
      
            this.selectData.day = selectData.day
            const oldSelectIndex = this.dataArr.findIndex(item => item.isSelected && item.type === 'normal')
            const newSelectIndex = this.dataArr.findIndex(item => item.day === selectData.day && item.type === 'normal')
      
            if (oldSelectIndex !== -1) {
        this.dataArr[oldSelectIndex].isSelected = false;
      }
      if (newSelectIndex !== -1) {
        this.dataArr[newSelectIndex].isSelected = true;
      }
      this.fetchCalendarData();
          },
          // 获取前(后)一个月的年月日信息
          getPreMonth(date, appointDay = 1) {
            let { year, month } = date || this.selectData
            if (month === 1) {
              year -= 1
              month = 12
            } else {
              month -= 1
            }
      
            return { year, month, day: appointDay }
          },
          getNextMonth(appointDay = 1) {
            let { year, month } = this.selectData
            if (month === 12) {
              year += 1
              month = 1
            } else {
              month += 1
            }
      
            return { year, month, day: appointDay }
          },
          // 切换上(下)一月
          handlePreMonth() {
            this.dealMonthData('PRE_MONTH')
            this.selectData = this.getPreMonth();
            this.updateCalendarData();
          },
          handleNextMonth() {
            this.dealMonthData('NEXT_MONTH')
            this.selectData = this.getNextMonth();
            this.updateCalendarData();
          },
          // 处理月数据
          dealMonthData(type, appointDay = 1) {
            this.isSelectedCurrentDate = false
      
            switch(type) {
              case 'PRE_MONTH':
                this.selectData = this.getPreMonth('', appointDay)
                break
              case 'NEXT_MONTH':
                this.selectData = this.getNextMonth(appointDay)
                break
              default:
                break
            }
      
            this.dataArr = this.getMonthData(this.selectData)
            this.lineNum = Math.ceil(this.dataArr.length / 7)
          },
          // 今日
          checkoutCurrentDate() {
            this.isDelay = true
            this.getCurrentDate()
            this.dealMonthData()
          },
          // touch事件
          touchStart(event) {
            this.isTouching = true
            this.needAnimation = true
            this.isClicked = false
      
            this.touchStartPositionX = event.touches[0].clientX
            this.touchStartPositionY = event.touches[0].clientY
            this.touch = {
              x: 0
            }
          },
          touchMove(event) {
            const moveX = event.touches[0].clientX - this.touchStartPositionX
            const moveY = event.touches[0].clientY - this.touchStartPositionY
            
            if (Math.abs(moveX) > Math.abs(moveY)) { // 左右
              this.needHeightAnimation = false
              this.touch = {
                x: moveX / this.$refs.calendar.offsetWidth,
                y: 0
              }
            } else { // 上下
              this.needHeightAnimation = true
              this.touch = {
                x: 0,
                y: moveY / this.$refs.calendar.offsetHeight
              }
            }
          },
          touchEnd() {
            this.isTouching = false
            const { x, y } = this.touch
      
            // 月视图
            if (Math.abs(x) > Math.abs(y) && Math.abs(x) > 0.3) {
              if (x > 0) { // 左
                this.translateIndex -= 1
                this.isWeekView ? this.handlePreWeek() : this.handlePreMonth()
              }
              else if (x < 0) { // 右
                this.translateIndex += 1
                this.isWeekView ? this.handleNextWeek() : this.handleNextMonth()
              }
            }
      
            // 周视图
            if (Math.abs(y) > Math.abs(x) && Math.abs(y * this.$refs.calendar.offsetHeight) > 50) {
              if (y > 0) { // 下
                this.isWeekView = false
                this.offsetY = 0
              }
              else if (y < 0) { // 上
                this.isWeekView = true
                this.dealWeekViewData()
              }
            }
      
            this.touch = {
              x: 0,
              y: 0
            }
          },
          // 周视图的位置信息
          getInfoOfWeekView(selectedIndex, length) {
            const indexOfLine = Math.ceil((selectedIndex + 1) / 7)
            const totalLine = Math.ceil(length / 7)
            const sliceStart = (indexOfLine - 1) * 7
            const sliceEnd = sliceStart + 7
      
            return { indexOfLine, totalLine, sliceStart, sliceEnd }
          },
          // 生成前(后)一周数据
          dealWeekViewSliceStart() {
            const selectedIndex = this.dataArr.findIndex(item => item.isSelected)
            const {
              indexOfLine,
              totalLine,
              sliceStart,
              sliceEnd
            } = this.getInfoOfWeekView(selectedIndex, this.dataArr.length)
      
            this.offsetY = -((indexOfLine - 1) * this.itemHeight)
      
            // 前一周数据
            if (indexOfLine === 1) {
              const preInfo = this.getPreMonth()
              const preDataArr = this.getMonthData(preInfo, true)
              const preDay = this.dataArr[0].day - 1 || preDataArr[preDataArr.length - 1].day
              const preIndex = preDataArr.findIndex(item => item.day === preDay && item.type === 'normal')
              const { sliceStart: preSliceStart, sliceEnd: preSliceEnd } = this.getInfoOfWeekView(preIndex, preDataArr.length)
              this.lastWeek = preDataArr.slice(preSliceStart, preSliceEnd)
            } else {
              this.lastWeek = this.dataArr.slice(sliceStart - 7, sliceEnd - 7)
            }
      
            // 后一周数据
            if (indexOfLine >= totalLine) {
              const nextInfo = this.getNextMonth()
              const nextDataArr = this.getMonthData(nextInfo, true)
              const nextDay = this.dataArr[this.dataArr.length - 1].type === 'normal' ? 1 : this.dataArr[this.dataArr.length - 1].day + 1
              const nextIndex = nextDataArr.findIndex(item => item.day === nextDay)
              const { sliceStart: nextSliceStart, sliceEnd: nextSliceEnd } = this.getInfoOfWeekView(nextIndex, nextDataArr.length)
              this.nextWeek = nextDataArr.slice(nextSliceStart, nextSliceEnd)
            } else {
              this.nextWeek = this.dataArr.slice(sliceStart + 7, sliceEnd + 7)
            }
      
            return sliceStart
          },
          // 切换上(下)一周
          handlePreWeek() {
            this.dealWeekData('PRE_WEEK')
          },
          handleNextWeek() {
            this.dealWeekData('NEXT_WEEK')
          },
          // 处理周数据
          dealWeekData(type) {
            const { year, month, day } = type === 'PRE_WEEK' ? this.lastWeek.find(item => item.type === 'normal') : this.nextWeek[0]
            this.selectData = { year, month, day }
            this.dataArr = this.getMonthData(this.selectData)
            this.lineNum = Math.ceil(this.dataArr.length / 7)
            this.offsetY -= this.itemHeight
            this.dealWeekViewData()
          },
          // 处理上(下)一周数据 
          dealWeekViewData() {
            const sliceStart = this.dealWeekViewSliceStart()
            this.allDataArr[0].splice(sliceStart, 7, ...this.lastWeek)
            this.allDataArr[2].splice(sliceStart, 7, ...this.nextWeek)
          },
        }
      }
      </script>
      
      <style>
      *{
        font-family: "Chocolate Classical Sans", sans-serif;
      }
      .topcalendar{ 
        width: 500px;
        box-shadow: -3px 3px 3px 3px #949494, 1px 0px 5px 1px #7b7b7b;
        background-color: #ffffff;
      }
      .calendar {
        overflow-x: hidden;
      }
      .month-names{
        background: linear-gradient(90deg, #00c1ca, #01e1c5);
        color: #fff;
        /* border-radius: 10px; */
        text-align: center;
        position: relative;
        font-size: 30px;
        transition: transform 0.3s ease;
        .month-names1{
          color: gold;
        }
        .month-names2{
          position: absolute;
          left: 5%;
        }
        .month-names3{
          position: absolute;
          right: 5%;
        }
        :hover{
          transform: scale(1.05)
        }
        :active{
          transform: scale(0.9)
        }
      }
      
      .header {
        padding: 0 5px; 
        font-size: 18px;
        font-weight: 500;
        color: #2b4450;
        line-height: 44px;
        margin: 0 calc((14.285% - 40px) / 2 + 6px);
      }
      .calendar-item {
        display: block;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
      }
      .selected .calendar-item {
        background: #2b4450;
        border-radius: 50%;
        color: #fff;
      }
      .week-area {
        width: 92%;
        display: flex;
      }
      .week-item {
        height: 45px;
        flex: 0 0 14.285%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .highlight-sun {
        color: red; /* 設置星期日的文字顏色 */
        }
    
      .highlight-sat {
        color: blue; /* 設置星期六的文字顏色 */
        }
    
      .week-font {
        font-size: 15px;
        color: #2b4450;
        font-weight: 500;
      }
      .data-container {
        overflow: hidden;
        position: relative;
      }
      .banner-area {
        width: 300%;
        display: flex;
      }
      .data-area {
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: row wrap;
      }
      .data-item {
        flex: 0 0 14.285%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
        :hover{
          transform: scale(1.05)
        }
        :active{
        transform: scale(0.9);
      }
      }
      .data-font {
        color: #2b4450;
        font-size: 18px;
        font-weight: 400;
      }
      .other-item .data-font {
        color: #ccc;
      }
      .touch-area {
        width: 100%;
        box-sizing: border-box;
        background-color: #fff;
        position: absolute;
        left: 0;
        bottom: 0;
      }
      .touch-container {
        width: 100%;
        box-sizing: border-box;
        border-top: .5px solid #EEE;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .touch-item {
        width: 40px;
        height: 5px;
        background: #2b4450;
        border-radius: 100px;
        opacity: 0.6;
      }
    
      /* CalendarInfo */
    
      /* 全局樣式 */
    .container {
      padding-left: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #ececec; /* 灰色背景 */
    }
    
    .grid {
      display: grid;
      margin: auto;
      grid-template-columns: repeat(2, 1fr); /* 兩列佈局 */
      gap: 20px; /* 控制訊息框之間的距離 */
      transition: background-color 0.5s ease;
      transition: transform 0.3s ease;
      :hover{
        background-color: #e0f7fa;
        transform: scale(1.05)
      }
      :active{
        transform: scale(0.9);
      }
    }
    
    /* 訊息框樣式 */
    .card {
      display: flex; /* 使用 flex 布局 */
      align-items: center; /* 垂直居中 */
      padding: 15px;
      width: 400px; /* 訊息框寬度 */
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 陰影效果 */
      background-color: white; 
    }
    /*
    .card-1 { background-color: #ffffff; }
    .card-2 { background-color: #ffffff; }
    .card-3 { background-color: #ffffff; }
    .card-4 { background-color: #ffffff; }
    .card-5 { background-color: #e0f7fa; }
    .card-6 { background-color: #ffffff; }
    .card-7 { background-color: #ffffff; } */
    
    /* 圓形日期樣式 */
    .date-circle {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
      border-radius: 50%; /* 圓形效果 */
      margin-right: 15px; /* 與文字之間的間隔 */
    }
    
    /* .date-circle-1 { background: linear-gradient(90deg, #00c1ca, #01e1c5); } 
    .date-circle-2 { background: linear-gradient(90deg, #00c1ca, #01e1c5); } 
    .date-circle-3 { background-color: #880e4f; }
    .date-circle-4 { background: linear-gradient(90deg, #00c1ca, #01e1c5); } 
    .date-circle-5 { background: linear-gradient(90deg, #00c1ca, #01e1c5);}
    .date-circle-6 { background: linear-gradient(90deg, #00c1ca, #01e1c5); } 
    .date-circle-7 { background: linear-gradient(90deg, #00c1ca, #01e1c5);} */
    
    /* 日期數字樣式 */
    .date {
      font-size: 24px;
      font-weight: bold;
      color: white; /* 預設白色文字 */
    }
    
    .date-color-1 { color: #ffffff; } /* 日期數字 1 顏色 */
    .date-color-2 { color: #ffffff; } /* 日期數字 2 顏色 */
    .date-color-3 { color: #ffffff; } /* 日期數字 3 顏色 */
    .date-color-4 { color: #ffffff; } /* 日期數字 4 顏色 */
    .date-color-5 { color: #ffffff; } /* 日期數字 5 顏色 */
    .date-color-6 { color: #ffffff; } /* 日期數字 6 顏色 */
    .date-color-7 { color: #ffffff; } /* 日期數字 7 顏色 */
    
    /* 內容樣式 */
    .content {
      display: flex;
      flex-direction: column; /* 垂直排列文字 */
      color: black; /* 預設文字顏色 */
    }
      
    .text-color-1 { color: black; } 
    .text-color-2 { color: black; } 
    .text-color-3 { color: #880e4f; } 
    .text-color-4 { color: black; } 
    .text-color-5 { color: black; } 
    .text-color-6 { color: black; .info {
      color: #880e4f;
    }} /* 內容文字 6 顏色 */
    .text-color-7 { color: black; } 
    
    .info {
      font-size: 18px;
    }
    
    .staff {
      margin-top: 5px;
      font-size: 16px;
    }
      </style>