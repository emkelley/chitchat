import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import Markdown from "vue3-markdown-it";
import "highlight.js/styles/tokyo-night-dark.css";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(Markdown);
app.mount("#app");
