import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import NewCar from "../components/NewCar.vue"
import Login from "../views/Login.vue"
import HomeN from "../views/HomeN.vue"
import BuyGoods from "../views/BuyGoods.vue"

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/home",
  //   name: "Home",
  //   component: Home
  // },
  {
    path: "/newhome",
    name: "newhome",
    component: HomeN,
    children: [
      {
        path: "buygoods",
        name: "buygoods",
        component: BuyGoods
      },
      {
        path: "buycar",
        name: "buycar",
        component: NewCar
      }

    ]
  },

  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // },
  {
    path: "/car",
    name: "car",
    component: NewCar
  },
  {
    path: "/",
    name: "Login",
    component: Login
  }
];

const router = new VueRouter({
  routes
});

export default router;
