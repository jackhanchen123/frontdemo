import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios"

Vue.prototype.$http=axios
Vue.prototype.$server="http://localhost:8888"
// Vue.prototype.$pay="http://localhost:9001"
Vue.prototype.$pay="http://localhost:8040"


Vue.config.productionTip = false;
axios.defaults.withCredentials = true //前端允许携带cookie 

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
