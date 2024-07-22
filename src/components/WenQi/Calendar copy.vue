<template>
  <div class="calendarMainArea">
    <div class="upArea">
      <div class="notice">
          <h3>公告</h3>
        <ul style="text-align: left; ">
          <li>7/19起，因應物價成本，牛排類餐點將不提供免費加麵服務</li>
        </ul>
      </div>
      <div class="rspace">
        <div class="timecontainer">
          <div class="app">
            <div v-if="filteredWeatherData.length > 0">
              <div>

                <div class="temperature">
                  <p>{{ filteredWeatherData[0].WeatherElement.AirTemperature }}°C</p>
                </div>

                <div class="timeweth">
                  <div class="time">{{ formatNumber(hours) }}:{{ formatNumber(minutes) }}</div>
                  <div class="weth">
                    <p>{{ filteredWeatherData[0].WeatherElement.Weather }}</p>

                    <i v-if="filteredWeatherData[0].WeatherElement.Weather === '陰'" class="fa-solid fa-cloud"></i>


                  </div>
                </div>

                <div class="datecity">
                  <div class="date">{{ year }} / {{ month }} / {{ day }}</div>

                  <div class="city">
                    <div v-if="location">
                      <p v-if="addressSubstring">{{ addressSubstring }}</p>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="containerArea">
      <div class="topcalendar">
        <section class="month-names"> 
          <span class="month-names2" @click="handlePreMonth">＜{{ prevMonthName }}</span>
          <span class="month-names1">{{ currentMonthName }}</span>
          <span class="month-names3" @click="handleNextMonth">{{ nextMonthName }}＞</span>
        </section>

        <div class="calendar">
          <section class="header">
            {{ selectData.year }}年{{ selectData.month }}月{{ selectData.day }}日
          </section>
          <ul class="week-area">
            <li class="week-item" v-for="(item, index) in weekArr" :key="index" :class="[
              'week-font',
              { 'highlight-sun': index === 0 },  // 星期日
              { 'highlight-sat': index === 6 },  // 星期六
            ]">
              {{ item }}</li>
          </ul>
          <section ref="calendar" class="data-container" :style="{
            height: isWeekView ? `${itemHeight + touchAreaHeight}px` : `${lineNum * itemHeight + touchAreaHeight}px`,
            transitionDuration: `${needHeightAnimation ? transitionDuration : 0}s`,
          }" @touchstart="touchStart" @touchmove.stop.prevent="touchMove" @touchend="touchEnd">
            <section class="month-area" :style="{
              transform: `translateX(${-(translateIndex + 1) * 100}%)`,
              transitionDuration: `${needAnimation ? transitionDuration : 0}s`
            }">
              <div class="banner-area" :style="{
                transform: `translateY(${offsetY}px)`,
                transitionDuration: `${needHeightAnimation ? transitionDuration : 0}s`
              }">
                <ul v-for="(monthItem, monthIndex) in allDataArr" :key="monthIndex" class="data-area" :style="{
                  transform: `translateX(${(translateIndex + isTouching ? touch.x : 0) * 100}%)`,
                  transitionDuration: `${isTouching ? 0 : transitionDuration}s`
                }">
                  <li v-for="(item, index) in monthItem" :key="index" :class="[
                    'data-item',
                    { 'selected': item.isSelected },
                    { 'other-item': item.type !== 'normal' && !isWeekView },
                    { 'current-month': item.month === selectData.month && item.type === 'normal' },
                  ]" :style="`height: ${itemHeight}px`" @click="checkoutDate(item)">
                    <span class="data-font calendar-item">{{ item.day }}</span>
                  </li>
                </ul>
              </div>
            </section>
          </section>
        </div>
      </div>
      <div class="grid">
        <div v-for="(info, index) in calendarInfo" :key="index" :class="['cardItem', `cardItem-${index + 1}`]"
          @click="() => { selectHandler(info) }">
          <div :style="{ background: info.is_holiday ? '#880e4f' : '#748cdd' }"
            class="date-circle">
            <div :class="['date', `date-color-${index + 1}`]">{{ info.day }}</div>
          </div>
          <div :class="['content', `text-color-${index + 1}`]">
            <div class="event"> {{ !info.is_holiday ? `${info.special_events}` : '' }}</div>
            <div class="info">
              {{ info.is_holiday ? '公休日' :  `預約客數 ${info.booking_count}組` }}
            </div>
            <div class="staff" v-if="info.manager && !info.is_holiday">值班 {{ info.manager }}</div>
          </div>
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
      key: 0,
      selected_calendar: { calendar_id: "#" },
      calendar_data_list: null,
      calendarData: [],
      selectData: {}, // 選中日期資訊 -> year, month, day
      weekArr: ['日', '一', '二', '三', '四', '五', '六'], // 星期数组
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
      bookinglist: '',
      // 新增的時間變量
      year: new Date().getFullYear(),//年
      month: new Date().getMonth() + 1,//月
      day: new Date().getDate(),//日
      hours: new Date().getHours(),//時
      minutes: new Date().getMinutes(),//分
      location: null,
      address: null,
      addressSubstring: null,
      error: null,
      weatherData: [],
      filteredWeatherData: [],
    }
  },
  mounted() {
    this.checkoutCurrentDate();
    this.fetchCalendarData();
    this.updateTime(); // 新增時間
    this.getLocation();
  },
  created() {
    this.checkoutCurrentDate()
  },
  watch: {
    dataArr: {
      handler(val) {
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

    async getLocation() {//地理定位
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            this.location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            this.error = null;
            await this.getAddress();
            await this.getWeatherData();
            this.filterWeatherData();
          },
          error => {
            this.error = error.message;
            this.location = null;
            this.address = null;
            this.addressSubstring = null;
            this.weatherData = [];
            this.filteredWeatherData = [];
          }
        );
      } else {
        this.error = "Geolocation is not supported by this browser.";
      }
    },
    async getAddress() {
      const apiKey = 'AIzaSyAmgcyo6PBWjIr8GaIjX5i9apsPB5bPk_M';
      const { latitude, longitude } = this.location;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'OK') {
          this.address = data.results[0].formatted_address;
          this.extractSubstring();
        } else {
          this.error = 'Unable to retrieve address.';
          this.address = null;
          this.addressSubstring = null;
        }
      } catch (error) {
        this.error = error.message;
        this.address = null;
        this.addressSubstring = null;
      }
    },
    extractSubstring() {
      if (this.address && this.address.length >= 7) {
        this.addressSubstring = this.address.substring(5, 8).replace('台', '臺');
      } else {
        this.addressSubstring = null;
      }
    },
    async getWeatherData() {
      const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWA-78CD1DF9-2A03-4A80-87D4-BD899350ABF4&WeatherElement=&GeoInfo=`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.success === 'true') {
          this.weatherData = data.records.Station;
        } else {
          this.error = 'Unable to retrieve weather data.';
          this.weatherData = [];
        }
      } catch (error) {
        this.error = error.message;
        this.weatherData = [];
      }
    },
    filterWeatherData() {
      if (this.addressSubstring) {
        const filtered = this.weatherData.filter(station =>
          station.GeoInfo.CountyName.includes(this.addressSubstring) ||
          station.StationName.includes(this.addressSubstring)
        );
        this.filteredWeatherData = filtered.slice(0, 1); // 保留第一筆數據
      } else {
        this.filteredWeatherData = [];
      }
    },
    formatNumber(number) {
      return number < 10 ? '0' + number : number;
    },//當時跟分小於十位時，前面會自動加0
    updateTime() {
      setInterval(() => {
        const now = new Date();
        this.year = now.getFullYear();
        this.month = now.getMonth() + 1;
        this.day = now.getDate();
        this.hours = now.getHours();
        this.minutes = now.getMinutes();
        this.seconds = now.getSeconds();
      }, 1000);
    },

    selectHandler(calendar) {
      this.selected_calendar = this.calendar_data_list.filter((item) => { return item.calendar_id == calendar.calendar_id });
      sessionStorage.setItem("selected_calendar", JSON.stringify(this.selected_calendar[0]));
      this.key++;
      this.$emit("key", this.key);
    },
    fetchCalendarData() {
      fetch('http://localhost:8080/calendar')
        .then(response => response.json())
        .then(data => {
          this.calendar_data_list = data;
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
            calendar_id: item.calendar_id,
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
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
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

      switch (type) {
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

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Work+Sans:400,600');

* {
  font-family: "Chocolate Classical Sans", sans-serif;
  box-sizing: border-box;
}
::-webkit-scrollbar {
  width: 10px;
}
/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #7b90da;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #5b6aa0;
}
.rspace {
  display: flex;
  justify-content: space-between;
  /* Adjusts spacing between items */
  align-items: flex-start;
  /* Align items at the top */
}

.temperature {
  font-size: 53px;
  color: white;
  // text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: -63px;
  margin-right: -17px;
}

.timeweth {
  display: flex;
  color: white;
}

.datecity {
  display: flex;
  margin-top: -25px;


  .date {
    font-size: 24px;
    color: white;
    // text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    margin: 28px;
    // position:absolute;
    // right: 1px;
    // bottom: 1px;
  }

  .city {
    font-size: 24px;
    color: white;
    // text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    margin-bottom: auto;
  }
}

.app {
  text-align: center;
  // margin-top: 60px;
}

.topcalendar {
  max-width: 40%;
  max-height: 55vh;
  // box-shadow: -3px 3px 3px 3px #949494, 1px 0px 5px 1px #7b7b7b;
  background-color: rgb(248, 248, 248);
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

}

.month-names {
  height: 5dvh;
  background: #7b90da;
  color: #fff;
  /* border-radius: 10px; */
  text-align: center;
  justify-content: space-between;
  padding: 0.5rem;
  display: flex;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  span{
    font-size: 2dvh;
    line-height: 4dvh;
  }

  .month-names1,.month-names2,.month-names3 {
    color: white;
    font-size: 1.3rem;
    font-weight: 600;
  }

  :hover {
    transform: scale(1.05)
  }

  :active {
    transform: scale(0.9)
  }
}

.header {
  font-size: 1rem;
  font-weight: 500;
  color: #2b4450;
  line-height: 2rem;
  margin-left: 2rem;
  margin-top: 1rem;
}

.calendar-item {
  display: block;
  width: 2.5rem;
  height: 2.5rem;
  text-align: center;
  line-height: 2.5rem;
}

.selected .calendar-item {
  background: #2b4450;
  border-radius: 50%;
  color: #fff;
}

.week-area {
  width: 88%;
  display: flex;
  justify-content: space-between;
}

.week-item {
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.highlight-sun {
  color: red;
  /* 設置星期日的文字顏色 */
}

.highlight-sat {
  color: blue;
  /* 設置星期六的文字顏色 */
}

.week-font {
  font-size: 1rem;
  color: #2b4450;
  font-weight: 500;
}

.data-container {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 35vh;
}

.banner-area {
  display: flex;
  width: 290%;
}

.data-area {
  display: flex;
  flex-flow: row wrap;
  width: 100%;
}

.data-item {
  flex: 0 0 14.285%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  :hover {
    transform: scale(1.05)
  }

  :active {
    transform: scale(0.9);
  }
}

.data-font {
  color: #2b4450;
  font-size: 1rem;
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

// 上半部
.upArea {
  display: flex;
  justify-content: space-between;
  padding: 0 3dvw;
  padding-right: 7dvw;
  margin-top: 13dvh;
}

.notice {
  font-weight: bold;
  text-align: center;
  display: flex;
  flex-direction: column;
  // margin-left: 1rem;
  // margin-top: 1rem;
  // margin-bottom: 1rem;
  width: 60%;
  // height: 20vh;
  // box-shadow: 0px 5px 5px 0px gray;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  background: rgb(248, 248, 248);
  margin-bottom: 2dvh;
  border-radius: 5px;

  h3 {
    height: 5dvh;
    line-height: 5dvh;
    margin-top: 0;
    font-size: 1.5rem;
    margin-bottom: 0;
    // font-weight: 500;
    background-color: #7b90da;
    color: white;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  ul {
    margin-right: 1rem;
    margin-top: 1dvh;
    li{
      font-size: 1.2rem;
    }
  }
}

.timecontainer {
  flex: 1;
  text-align: left;
  // padding: 4dvh;


  .time {
    font-size: 96px;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
}

.calendarMainArea {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
}

/* 全局樣式 */
.containerArea {
  display: flex;
  padding-left: 3dvw;
  padding-top: 3dvh;
}

.grid {
  margin-top: 2.5dvh;
  margin-left: 0.5rem;
  display: grid;
  padding: 2rem;
  padding-bottom: 0;
  grid-template-columns: repeat(2, 1fr);
  /* 兩列佈局 */
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  /* 控制訊息框之間的距離 */
  transition: background-color 0.5s ease;
  transition: transform 0.3s ease;

  :hover {
    background-color: rgb(221, 229, 251);
    transform: scale(1.05)
  }

  :active {
    transform: scale(0.9);
  }

}

/* 訊息框樣式 */
.cardItem {
  display: flex;
  /* 使用 flex 布局 */
  align-items: center;
  /* 垂直居中 */
  padding: 15px;
  min-width: 26dvw;
  // height: 13dvh;
  /* 訊息框寬度 */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 陰影效果 */
  background-color: rgb(248,248,248);
  cursor: pointer;
}

/* 圓形日期樣式 */
.date-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  /* 圓形效果 */
  margin-right: 15px;
  /* 與文字之間的間隔 */
}

/* 日期數字樣式 */
.date {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  /* 預設白色文字 */
}

.date-color-1 {
  color: #ffffff;
}

/* 日期數字 1 顏色 */
.date-color-2 {
  color: #ffffff;
}

/* 日期數字 2 顏色 */
.date-color-3 {
  color: #ffffff;
}

/* 日期數字 3 顏色 */
.date-color-4 {
  color: #ffffff;
}

/* 日期數字 4 顏色 */
.date-color-5 {
  color: #ffffff;
}

/* 日期數字 5 顏色 */
.date-color-6 {
  color: #ffffff;
}

/* 日期數字 6 顏色 */
.date-color-7 {
  color: #ffffff;
}

/* 日期數字 7 顏色 */

/* 內容樣式 */
.content {
  display: flex;
  flex-direction: column;
  /* 垂直排列文字 */
  color: black;
  /* 預設文字顏色 */
}

.text-color-1 {
  color: black;
}

.text-color-2 {
  color: black;
}

.text-color-3 {
  color: #880e4f;
}

.text-color-4 {
  color: black;
}

.text-color-5 {
  color: black;
}

.text-color-6 {
  color: black;
}

/* 內容文字 6 顏色 */
.text-color-7 {
  color: black;
}

.info {
  font-size: 1rem;
}
.event{
  font-size: 1.2rem;
  font-weight: bold;
}

.staff {
  margin-top: 5px;
  font-size: 16px;
}
</style>