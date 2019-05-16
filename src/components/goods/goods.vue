<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li
          v-for="(item,index) in goods"
          :key="index"
          :class="{current:currentIndex===index}"
          @click="selectFood(index)"
        >
          <span class="text">
            <span v-show="item.type>=0" class="icon" :class="classMap[item.type]"></span>
            <span class="titlex">{{item.name}}</span>
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="foods-list foods-list-hook">
          <h2 class="title">{{item.name}}</h2>
          <div v-for="(food,index) in item.foods" :key="index" class="foods-item">
            <div @click="detaile(food)" class style="display:flex;flex:1">
              <div class="item-left">
                <img :src="food.icon" alt>
              </div>
              <div class="item-right">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <p class="desc">
                  <span class="count">月售{{food.sellCount}}</span>
                  <span class="rating">好评率{{food.rating}}%</span>
                </p>
                <p class="price">
                  <span class="now">
                    <span>￥</span>
                    {{food.price}}
                  </span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </p>
              </div>
            </div>
            <div class="cart-control">
              <cartControl :food="food"></cartControl>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <shopcart
      ref="shopCart"
      :minPrice="seller.minPrice"
      :deliveryPrice="seller.deliveryPrice"
      :foodList="selectFoods"
    ></shopcart>
    <food :food="foodDetaile" ref="food"></food>
  </div>
</template>

<script >
import shopcart from "../shopcart/shopcart.vue";
import BScroll from "better-scroll";
import cartControl from "../cartControl/cartControl.vue";
import bus from "../../bus.js";
import food from "../food/food.vue";

export default {
  props: ["seller"],
  components: {
    shopcart,
    cartControl,
    food
  },
  data() {
    return {
      goods: null,
      classMap: ["decrease", "discount", "special", "invoice", "guarantee"],
      heightScroll: [],
      scrollY: 0,
      foodDetaile: {},
    };
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.heightScroll.length; i++) {
        let height1 = this.heightScroll[i];
        let height2 = this.heightScroll[i + 1];
        if (!height2 || (this.scrollY < height2 && this.scrollY >= height1)) {
          return i;
        }
      }
    },
    selectFoods() {
      let foods = [];
      if (this.goods) {
        this.goods.forEach(good => {
          good.foods.forEach(food => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
      }
      return foods;
    }
  },
  created() {
    this.$axios
      .get("api/goods")
      .then(res => {
        if (res.data.errno === 0) {
          this.goods = res.data.goods;
          this.$nextTick(() => {
            this._initScroll();
            this._caicHeight();
            // console.log(this.heightScroll);
          });
        }
        // console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
    bus.$on("cart-add", target => {
      // console.log(target);
      this._drop(target);
    });
  },
  methods: {
    selectFood(index) {
      // let element = (this.$refs.foodsWrapper.querySelectorAll(".foods-list-hook"))[index];
      // this.currentIndex = index;
      // this.foodsScroll.scrollToElement(element,300);
      let foodList = this.$refs.foodsWrapper.querySelectorAll(
        ".foods-list-hook"
      );
      this.foodsScroll.scrollToElement(foodList[index], 200);
    },
    detaile(food) {
      this.foodDetaile = food;
      this.$refs.food.show();
    },
    _drop(target) {
      this.$nextTick(() => {
        this.$refs.shopCart.drop(target);
      });
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, { click: true });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      });
      this.foodsScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.floor(pos.y));
        // console.log(this.currentIndex);
      });
    },
    _caicHeight() {
      //拿到所有商品分类的元素
      let foodList = this.$refs.foodsWrapper.querySelectorAll(
        ".foods-list-hook"
      );
      let height = 0;
      this.heightScroll.push(height);
      for (let i = 0; i < foodList.length; i++) {
        height += foodList[i].clientHeight;
        this.heightScroll.push(height);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/css/mixins.scss";
.goods {
  display: flex;
  width: 100%;
  position: absolute;
  top: 177px;
  bottom: 48px;
  overflow: hidden;
  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background-color: #f3f5f7;

    ul {
      li {
        display: table;
        height: 54px;
        width: 56px;
        padding: 0 12px;
        font-size: 0;
        font-weight: 200;
        line-height: 14px;
        &.current {
          background-color: #fff;
          font-weight: 700;
          margin-top: -1px;
          .text {
            border-bottom: none;
          }
        }
        .text {
          height: 54px;
          width: 56px;
          font-size: 12px;
          display: table-cell;
          vertical-align: middle;
          border-bottom: 1px solid rgba(7, 17, 20, 0.1);

          .icon {
            display: inline-block;
            width: 12px;
            height: 12px;
            background-size: 12px 12px;
            background-repeat: no-repeat;
            vertical-align: top;
            margin-right: 2px;
            margin-top: 1px;
          }
          .decrease {
            @include bgimg(images/decrease_3);
          }
          .discount {
            @include bgimg(images/discount_3);
          }
          .guarantee {
            @include bgimg(images/guarantee_3);
          }
          .invoice {
            @include bgimg(images/invoice_3);
          }
          .special {
            @include bgimg(images/special_3);
          }
        }
      }
    }
  }
  .foods-wrapper {
    flex: 1;
    .foods-list {
      .title {
        background-color: #f3f5f7;
        font-size: 12px;
        line-height: 26px;
        color: rgb(147, 153, 159);
        padding-left: 14px;
        border-left: 2px solid #d9ddd1;
      }
      .foods-item {
        position: relative;
        font-size: 0;
        margin: 18px 18px 0;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        &:last-child {
          border-bottom: none;
        }
        .item-left {
          flex: 0 0 57px;
          margin-right: 10px;
          vertical-align: top;
          img {
            width: 57px;
            height: 57px;
            border-radius: 3px;
          }
        }
        .item-right {
          position: relative;
          flex: 1;
          display: inline-block;
          font-size: 14px;
          vertical-align: top;
          .name {
            margin-top: 2px;
            line-height: 14px;
            color: rgb(7, 17, 27);
            font-weight: 700;
          }
          .desc {
            margin: 8px 0;
            font-size: 10px;
            line-height: 12px;
            color: rgb(147, 153, 159);
            .count {
              display: inline-block;
              margin-right: 12px;
            }
            .rating {
              display: inline-block;
            }
          }
          .price {
            line-height: 24px;
            .now {
              font-size: 14px;
              color: rgb(240, 20, 20);
              font-weight: 700;
              span {
                font-size: 10px;
                font-weight: normal;
              }
            }
            .old {
              font-size: 10px;
              font-weight: 700;
              text-decoration: line-through;
              color: rgb(147, 153, 159);

              span {
                font-size: 10px;
                font-weight: normal;
              }
            }
          }
        }
        .cart-control {
          position: absolute;
          right: 0;
          bottom: 24PX;
        }
        .food-content {
          display: flex;
        }
      }
    }
  }
}
</style>