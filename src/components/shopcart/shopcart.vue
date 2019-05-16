/* eslint-disable */
<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <span class="cart" @click="showCartList">
          <span class="icon" :class="{active:foodList.length}">
            <i class="icon-shopping_cart"></i>
          </span>
        </span>
        <span v-show="totalNumber>0" class="count">{{totalNumber}}</span>
        <span class="price">￥{{totalPrice}}</span>
        <span class="delivery-price">另需配送费￥{{deliveryPrice}}元</span>
      </div>
      <div class="content-right">
        <span v-if="totalPrice === 0">￥20元起送</span>
        <span v-else-if="totalPrice < minPrice ">还差￥{{minPrice - totalPrice}}起送</span>
        <span v-else class="active" @click="toPay">去结算</span>
      </div>
    </div>

    <div class="ball-wrapper">
      <transition-group name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
        <div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>

    <transition name="fold">
      <div class="cart-list" v-show="show">
        <div class="cart-content">
          <div class="cart-title">
            <span class="name">购物车</span>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="food-list" ref="foodContent">
            <ul>
              <li
                class="food-item"
                v-for="(food,index) in foodList"
                :key="index"
                v-show="food.count>0"
              >
                <span class="food-name">{{food.name}}</span>
                <span>
                  <span class="price">
                    <span class="icon">￥</span>
                    {{food.price}}
                  </span>
                  <span class="count">{{food.count}}</span>
                  <cartControl :food="food"></cartControl>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="mask" v-show="show" @click="showCartList"></div>
    </transition>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import cartControl from "../cartControl/cartControl.vue";

export default {
  props: {
    minPrice: {
      type: Number,
      default: 20
    },
    deliveryPrice: {
      type: Number,
      default: 4
    },
    foodList: {
      type: Array,
      default() {
        return [
          {
            name: "鱼香肉丝",
            count: 1,
            price: 2
          }
        ];
      }
    }
  },
  components: {
    cartControl
  },
  data() {
    return {
      showList: false,
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
      ],
      dropBalls: []
    };
  },
  computed: {
    totalPrice() {
      let totalPri = 0;
      for (let i = 0; i < this.foodList.length; i++) {
        totalPri += this.foodList[i].price * this.foodList[i].count;
      }
      return totalPri;
    },
    totalNumber() {
      let totalNum = 0;
      for (let i = 0; i < this.foodList.length; i++) {
        totalNum += this.foodList[i].count;
      }
      return totalNum;
    },
    show() {
      let flag = this.showList;
      if (flag) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodContent, { click: true });
          } else {
            this.scroll.refresh();
          }
        });
        if(this.totalNumber === 0) {
          this.showList = false;
          return false;
        }
      }
      return flag;
    }
  },
  methods: {
    toPay() {
      alert(this.totalPrice)
    },
    showCartList() {
      if (this.totalNumber > 0) {
        this.showList = !this.showList;
      }
    },
    empty() {
      this.foodList.forEach((food) => {
        food.count = 0;
      });
      this.showList = false;
    },
    drop(el) {
      // el   dom对象
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    beforeEnter(el) {
      let count = this.balls.length;
      while(count--) {
        let ball = this.balls[count];
        if(ball.show) {
          let pos = ball.el.getBoundingClientRect();
          let x = pos.left + 20;
          let y = -(window.innerHeight - pos.top - 40);
          // el.style.display = "block";
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.querySelector(".inner-hook");
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    enter(el,done) {
      let rf = el.offsetwidth; // 在钩子函数里面el.offsetWidth去刷新元素的大小，才能实现过渡效果;
      this.$nextTick(() => {
        let inner = el.querySelector(".inner-hook");
        inner.style.transform = `translate3d(0,0,0)`;
        el.style.transform = `translate3d(0,0,0)`;
      })
      setTimeout(function(){
        done();
      },400)
    },
    afterEnter(el) {
      let ball = this.dropBalls.shift();
      if(ball) {
        ball.show = false;
        // el.style.display = "none";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.shopcart {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 48px;
  color: rgba(255, 255, 255, 0.4);
  background-color: #141d27;
  z-index: 10;
  .content {
    position: relative;
    display: flex;
    z-index: 999;
    .content-left {
      position: relative;
      z-index: 999;
      flex: 1;
      background-color: #141d27;
      .cart {
        display: inline-block;
        position: relative;
        top: -10px;
        left: 12px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: #141d27;
        .icon {
          display: block;
          margin: 6px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
          text-align: center;
          line-height: 44px;
          font-size: 24px;
          &.active {
            background-color: rgb(0, 160, 220);
            color: #fff;
          }
        }
      }
      .count {
        position: absolute;
        left: 44px;
        top: -8px;
        width: 24px;
        font-size: 9px;
        color: #fff;
        line-height: 16px;
        text-align: center;
        border-radius: 7px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
        background-color: rgb(240, 20, 20);
      }
      .price {
        display: inline-block;
        margin-top: 12px;
        margin-left: 6px;
        padding: 0 12px 0;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 16px;
        line-height: 24px;
        vertical-align: top;
        font-weight: 700;
      }
      .delivery-price {
        display: inline-block;
        margin-top: 12px;
        padding-left: 12px;
        font-size: 12px;
        font-weight: 200;
        line-height: 24px;
        vertical-align: top;
      }
    }
    .content-right {
      flex: 0 0 105px;
      width: 105px;
      span {
        display: block;
        padding: 12px;
        font-size: 12px;
        font-weight: 700;
        line-height: 24px;
        text-align: center;
        background-color: #2b343b;
        &.active {
          color: #fff;
          background-color: #00b43c;
        }
      }
    }
  }
  .cart-list {
    position: fixed;
    // top: 0;
    left: 0;
    right: 0;
    bottom: 48px;
    z-index: 9;
    // display: none;
    // overflow: hidden;
    // background-color: rgba(7, 17, 27, 0.6);
    .cart-content {
      position: absolute;
      bottom: 0;
      width: 100%;
      max-height: 260px;
      .cart-title {
        height: 40px;
        font-size: 14px;
        font-weight: 200;
        line-height: 40px;
        color: rgb(7, 17, 27);
        padding: 0 18px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        background-color: #f3f5f7;
        display: flex;
        justify-content: space-between;
        .empty {
          font-size: 12px;
          color: rgb(0, 160, 220);
        }
      }
      .food-list {
        background-color: #fff;
        padding: 0 18px;
        max-height: 219px;
        overflow: hidden;
        .food-item {
          display: flex;
          justify-content: space-between;
          height: 48px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(7, 17, 27, 0.1);
          box-sizing: border-box;
          .food-name {
            color: rgb(7, 17, 27);
            font-size: 14px;
            line-height: 24px;
          }
          .price {
            color: rgb(240, 20, 20);
            font-size: 14px;
            font-weight: 700;
            line-height: 24px;
            .icon {
              font-size: 10px;
              font-weight: normal;
            }
          }
        }
      }
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(7, 17, 27, 0.6);
    z-index: -1;
    filter: blur(10px);
  }
  .ball-wrapper {
    .ball {
      position: fixed;
      left: 30px;
      bottom: 20px;
      z-index: 9999;
      &.drop-enter-active {
        transition: all 0.4s cubic-bezier(.15,-0.41,.74,.57);
      }
      .inner {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgb(0, 160, 220);
        transition: all 0.4s;
      }
    }
  }
}

.fold-enter-active,
.fold-leave-active {
  transition: all 0.5s;
}
.fold-enter, .fold-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(260px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>