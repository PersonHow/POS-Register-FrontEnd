import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.scss";
import router from "./router";
import { createPinia } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import draggable from "vuedraggable";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
library.add(fas, far, fab);
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("draggable", draggable);
app.mount("#app");
