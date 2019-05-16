<template>
  <div id="app">
    <myHeader :seller="seller"></myHeader>
    <div class="tab">
      <ul>
        <li>
          <router-link to="/goods">商品</router-link>
        </li>
        <li>
          <router-link to="ratings">评价</router-link>
        </li>
        <li>
          <router-link to="/seller">商家</router-link>
        </li>
      </ul>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
    <div id="main"></div>
  </div>
</template>


<script>
import urlParse from "./common/js/util.js";
import myHeader from "./components/header/header.vue";

export default {
  components: {
    myHeader
  },
  data() {
    return {
      seller: {
        id: (() => {
          return urlParse().id;
        })()
      }
    };
  },
  created() {
    this.$axios
      .get("/api/seller")
      .then(res => {
        // this.seller = res.data.seller;
        this.seller = Object.assign(res.data.seller,this.seller);
        console.log(this.seller);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>


<style lang="scss" scoped>
@import url(common/css/reset.css);
@import url(common/css/style.css);
.tab {
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  background-color: #f3f5f7;
  ul {
    display: flex;
    font-size: 14px;
    height: 40px;
    color: rgb(77, 85, 93);
    li {
      flex: auto;
      text-align: center;
      align-self: center;
      a {
        color: rgb(77, 85, 93);
        text-decoration: none;
        &.router-link-active {
          color: rgb(240, 20, 20);
        }
      }
    }
  }
}
</style>
