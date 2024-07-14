<script>
export default {
  data() {
    return {
      currentForm: "login",
      loginPasswordType: "password",
      registerPasswordType: "password",
      loginPasswordIcon: "fa-solid fa-eye",
      registerPasswordIcon: "fa-solid fa-eye",
    };
  },
  methods: {
    showLoginForm() {
      this.currentForm = "login";
    },
    showRegisterForm() {
      this.currentForm = "register";
    },
    toggleLoginPasswordVisibility() {
      this.loginPasswordType = this.loginPasswordType === "password" ? "text" : "password";
      this.loginPasswordIcon = this.loginPasswordIcon === "fa-solid fa-eye" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    },
    toggleRegisterPasswordVisibility() {
      this.registerPasswordType = this.registerPasswordType === "password" ? "text" : "password";
      this.registerPasswordIcon = this.registerPasswordIcon === "fa-solid fa-eye" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    },
  },
};
</script>

<template>
  <div class="form-container">
    <div class="form-col">
      <div class="btn-box">
        <button class="btn btn-1" @click="showLoginForm">Sign In</button>
        <button class="btn btn-2" @click="showRegisterForm">Sign Up</button>
      </div>

      <!-- 登入表單 -->
      <form v-if="currentForm === 'login'" class="form-box login-form">
        <div class="form-title">
          <span>Sign In</span>
        </div>

        <div class="form-inputs">
          <div class="input-box">
            <input
              type="text"
              class="input input-field"
              placeholder="Username"
              required
            />
            <i class="fa-solid fa-user"></i>
          </div>

          <div class="input-box">
            <input
              :type="loginPasswordType"
              class="input input-field"
              placeholder="Password"
              required
            />
            <i
              class="fa-solid fa-lock"
              :class="loginPasswordIcon"
              @click="toggleLoginPasswordVisibility"
            ></i>
          </div>

          <div class="forgot-pass">
            <a href="#">Forgot Password?</a>
          </div>

          <div class="input-box">
            <button class="input submit-btn">
              <span>Sign In</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div class="social-login">
            <div class="socail-login-box">
              <i class="fa-brands fa-google"></i>
            </div>
            <div class="socail-login-box">
              <i class="fa-brands fa-facebook"></i>
            </div>
            <div class="socail-login-box">
              <i class="fa-brands fa-x-twitter"></i>
            </div>
            <div class="socail-login-box">
              <i class="fa-brands fa-github"></i>
            </div>
          </div>
        </div>
      </form>

      <!-- 註冊表單 -->
      <form v-else class="form-box register-form">
        <div class="form-title">
          <span>Sign Up</span>
        </div>

        <div class="form-inputs">
          <div class="input-box">
            <input
              type="text"
              class="input input-field"
              placeholder="Email"
              required
            />
            <i class="fa-solid fa-envelope"></i>
          </div>

          <div class="input-box">
            <input
              type="text"
              class="input input-field"
              placeholder="Username"
              required
            />
            <i class="fa-solid fa-user"></i>
          </div>

          <div class="input-box">
            <input
              :type="registerPasswordType"
              class="input input-field"
              placeholder="Password"
              required
            />
            <i
              class="fa-solid fa-lock"
              :class="registerPasswordIcon"
              @click="toggleRegisterPasswordVisibility"
            ></i>
          </div>

          <div class="remember-me">
            <input type="checkbox" id="remember-me-check" />
            <label for="remember-me-check">Remember me</label>
          </div>

          <div class="input-box">
            <button class="input submit-btn">
              <span>Sign Up</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div class="social-login">
            <div class="socail-login-box">
              <i class="fa-brands fa-google"></i>
            </div>
            <div class="socail-login-box">
              <i class="fa-brands fa-facebook"></i>
            </div>
            <div class="socail-login-box">
              <i class="fa-brands fa-x-twitter"></i>
            </div>
            <div class="socail-login-box">
              <i class="fa-brands fa-github"></i>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 主容器樣式 */
.form-container {
  display: flex; /* 使用 Flexbox 來對齊子元素 */
  width: 450px; /* 設定容器寬度 */
  height: 600px; /* 設定容器高度 */
  border: 3px solid #b0bec5; /* 柔和藍灰色邊框 */
  border-radius: 30px; /* 圓角邊框 */
  background-color: #eceff1; /* 柔和藍灰色背景 */
  margin-top: 3rem; /* 上邊距 */

  /* 子元素設定 */
  .form-col {
    position: relative; /* 相對定位，以便子元素使用絕對定位 */
    width: 100%; /* 設定寬度為父容器的 100% */

    /* 登入和註冊按鈕樣式 */
    .btn-box {
      display: flex; /* 使用 Flexbox 來對齊按鈕 */
      justify-content: center; /* 置中對齊按鈕 */
      gap: 10px; /* 按鈕之間的間距 */
      margin-top: 30px; /* 上邊距 */

      /* 按鈕樣式 */
      .btn {
        font-weight: 500; /* 設定字體粗細 */
        padding: 8px 30px; /* 按鈕內邊距 */
        border: 2px solid #b0bec5; /* 柔和藍灰色邊框 */
        border-radius: 30px; /* 圓角邊框 */
        background: transparent; /* 背景透明 */
        color: #b0bec5; /* 柔和藍灰色文字 */
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15); /* 較輕的陰影效果 */
        cursor: pointer; /* 鼠標懸停時顯示手形光標 */
        transition: 0.2s; /* 變化過渡時間 */

        /* 按鈕 1 的樣式 */
        &.btn-1 {
          background: #cfd8dc; /* 柔和藍灰色背景 */
          color: #003087; /* 深藍色文字 */
        }

        /* 按鈕懸停樣式 */
        &:hover {
          background: #b0bec5; /* 更深的柔和藍灰色背景 */
          color: #ffffff; /* 白色文字 */
        }
      }
    }

    /* 表單樣式 */
    .form-box {
      position: absolute; /* 絕對定位，用於在容器內部居中 */
      transform: translateX(-50%); /* 水平居中對齊 */
      display: flex; /* 使用 Flexbox 來對齊子元素 */
      flex-direction: column; /* 垂直排列子元素 */
      align-items: center; /* 置中對齊子元素 */
      width: 100%; /* 設定寬度為父容器的 100% */
      padding: 0 30px; /* 左右內邊距 */
      transition: 0.3s; /* 變化過渡時間 */

      /* 表單標題樣式 */
      .form-title {
        margin: 40px 0; /* 上下邊距 */
        color: #003087; /* 深藍色文字 */
        font-size: 28px; /* 字體大小 */
        font-weight: 600; /* 字體粗細 */
      }

      /* 登入表單樣式 */
      &.login-form {
        left: 50%; /* 向右偏移 50% */
      }
    }

    /* 表單輸入區域樣式 */
    .form-inputs {
      width: 100%; /* 設定寬度為父容器的 100% */

      /* 輸入框容器樣式 */
      .input-box {
        position: relative; /* 相對定位，用於內部元素的絕對定位 */

        /* 圖示樣式 */
        i {
          position: absolute; /* 絕對定位 */
          top: 50%; /* 垂直居中 */
          right: 20px; /* 右邊距 */
          transform: translate(-50%, -50%); /* 垂直水平居中對齊 */
          color: #003087; /* 深藍色圖示 */
          width: 17px; /* 圖示寬度 */
          height: 17px; /* 圖示高度 */
        }

        /* 輸入框樣式 */
        input {
          width: 100%; /* 設定寬度為父容器的 100% */
          height: 55px; /* 高度 */
          margin: 10px 0; /* 上下邊距 */
          color: #003087; /* 深藍色文字 */
          border: none; /* 無邊框 */
          border-radius: 50px; /* 圓角邊框 */
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 較輕的陰影效果 */
          font-size: 16px; /* 字體大小 */
          padding: 0 40px 0 20px; /* 內邊距 */
          background: rgba(0, 0, 0, 0.05); /* 淺灰色背景 */
          outline: none; /* 無外框 */
          backdrop-filter: blur(10px); /* 背景模糊效果 */
          caret-color: #003087; /* 深藍色光標 */

          /* 輸入框占位符樣式 */
          &::placeholder {
            color: #b0bec5; /* 柔和藍灰色占位符文字 */
            font-size: 15px; /* 字體大小 */
          }
        }

        /* 提交按鈕樣式 */
        button {
          width: 100%; /* 設定寬度為父容器的 100% */
          height: 55px; /* 高度 */
          margin: 10px 0; /* 上下邊距 */
          color: #ffffff; /* 白色文字 */
          border: none; /* 無邊框 */
          border-radius: 50px; /* 圓角邊框 */
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 較輕的陰影效果 */
          font-size: 16px; /* 字體大小 */
          padding: 0 40px; /* 內邊距 */
          background: #003087; /* 深藍色背景 */
          outline: none; /* 無外框 */
          cursor: pointer; /* 鼠標懸停時顯示手形光標 */
          display: flex; /* 使用 Flexbox 來對齊按鈕內容 */
          justify-content: space-between; /* 內容水平對齊 */
          align-items: center; /* 內容垂直對齊 */
          transition: 0.2s; /* 變化過渡時間 */

          /* 提交按鈕內部文字樣式 */
          span {
            flex: 1; /* 設定為彈性項目，以便中心對齊 */
            text-align: center; /* 文字置中對齊 */
          }

          /* 提交按鈕內部圖示樣式 */
          i {
            width: 17px; /* 圖示寬度 */
            height: 17px; /* 圖示高度 */
            margin-left: 10px; /* 左邊距 */
          }

          /* 提交按鈕懸停樣式 */
          &:hover {
            opacity: 0.85; /* 透明度 */
            transform: translateY(-1px); /* 上移 1px */
          }
        }

        /* 提交按鈕額外樣式 */
        .submit-btn {
          display: flex; /* 使用 Flexbox 來對齊內容 */
          align-items: center; /* 垂直對齊內容 */
          justify-content: center; /* 水平對齊內容 */
          gap: 10px; /* 內容間距 */
          background: #003087; /* 深藍色背景 */
          transition: 0.3s; /* 變化過渡時間 */

          /* 提交按鈕懸停樣式 */
          &:hover {
            gap: 15px; /* 懸停時內容間距增加 */
          }
        }
      }

      /* 忘記密碼和記住我選項樣式 */
      .forgot-pass,
      .remember-me {
        display: flex; /* 使用 Flexbox 來對齊內容 */
        justify-content: right; /* 內容右對齊 */
        gap: 5px; /* 內容間距 */

        /* 忘記密碼連結樣式 */
        a {
          color: #003087; /* 深藍色文字 */
          text-decoration: none; /* 無下劃線 */
          font-size: 14px; /* 字體大小 */
        }

        /* 忘記密碼連結懸停樣式 */
        &:hover {
          text-decoration: underline; /* 懸停時顯示下劃線 */
        }
      }

      /* 記住我選項標籤樣式 */
      .remember-me label {
        color: #003087; /* 深藍色文字 */
        font-size: 14px; /* 字體大小 */
      }
    }

    /* 社交媒體登入按鈕樣式 */
    .social-login {
      display: flex; /* 使用 Flexbox 來對齊內容 */
      gap: 20px; /* 內容間距 */
      margin-top: 20px; /* 上邊距 */
      justify-content: center; /* 內容置中對齊 */
      align-items: center; /* 內容垂直對齊 */

      /* 社交媒體登入按鈕樣式 */
      .socail-login-box {
        display: flex; /* 使用 Flexbox 來對齊內容 */
        align-items: center; /* 垂直對齊內容 */
        justify-content: center; /* 水平對齊內容 */
        height: 40px; /* 高度 */
        width: 40px; /* 寬度 */
        background: rgba(0, 0, 0, 0.1); /* 更淺的半透明背景 */
        border-radius: 50%; /* 圓形邊框 */
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 較輕的陰影效果 */
        color: #003087; /* 深藍色文字 */
        cursor: pointer; /* 鼠標懸停時顯示手形光標 */
        transition: 0.3s; /* 變化過渡時間 */

        /* 社交媒體登入按鈕懸停樣式 */
        &:hover {
          transform: scale(0.9); /* 縮小按鈕大小 */
          color: #003087; /* 深藍色文字 */
        }
      }
    }

    /* 註冊表單樣式 */
    .register-form {
      left: 50%;
    }

    /* 註冊表單標題樣式 */
    .register-form .form-title {
      margin-block: 40px 20px; /* 上下邊距 */
    }
  }
}
</style>