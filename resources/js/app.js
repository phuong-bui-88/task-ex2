import './bootstrap';

import { createApp } from "vue"
import { QuillEditor } from "@vueup/vue-quill";
import App from "./App.vue"
import route from "./routes/index"
import { setupQuill } from "./composables/vue_quill.js";
import { setupFilePond } from "./composables/file_pond.js";
import 'v-calendar/dist/style.css'
import { SetupCalendar, Calendar, DatePicker } from "v-calendar";
import GlobalConst from './consts/base.js'


setupQuill(QuillEditor)
const FilePond = setupFilePond()

const app = createApp(App).use(route)
app.use(SetupCalendar, {masks: {input: GlobalConst.DATE_FORMAT}})

app.component('QuillEditor', QuillEditor)
app.component('FilePond', FilePond)
app.component('VCalendar', Calendar)
app.component('DatePicker', DatePicker)

app.mount("#app");
