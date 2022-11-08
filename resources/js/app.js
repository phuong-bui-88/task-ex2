import './bootstrap';

import { createApp } from "vue"
import App from "./App.vue"
import route from "./routes/index"

const app = createApp(App).use(route)

app.mount("#app");
