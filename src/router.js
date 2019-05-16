import Vue from "vue";
import VueRouter from "vue-router";
// 引入组件
import Goods from "./components/goods/goods.vue";
import Ratings from "./components/ratings/ratings.vue";
import Seller from "./components/seller/seller.vue";

Vue.use(VueRouter);

export default new VueRouter({
  routes:[
    {
      path: "/",
      // 重定向
      redirect: "/goods"
    },
    {
      path: "/goods",
      component: Goods
    },
    {
      path: "/ratings",
      component: Ratings
    },
    {
      path: "/seller",
      component: Seller
    },
  ]
})