import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'



const app = createApp(App)
const pinia = createPinia()

library.add(fas, far, fab)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)
app.use(pinia)

app.mount('#app')