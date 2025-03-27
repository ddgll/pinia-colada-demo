import 'water.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.use(createPinia())
app.use(PiniaColada, {})

app.use(Toast)

app.use(router)

app.mount('#app')
