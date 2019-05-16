<template>
  <transition name="move">
    <div class="food" v-show="showList" ref="food" v-if="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt width="100%">
          <div class="back">
            <span class="icon-arrow_lift" @click="hide"></span>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detailfood">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">{{food.oldPrice}}</span>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
            <transition name="fade">
              <div class="buy" @click="showCartControl" v-show="!food.count">加入购物车</div>
            </transition>
          </div>
        </div>
        <split></split>
        <div class="food-info">
          <h2>商品介绍</h2>
          <p>{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h2 class="title">商品评价</h2>
          <selectRating
            :ratings="food.ratings"
            v-on:select-rating-type="selectRatingType"
            v-on:toggle-text="toggleText"
          ></selectRating>
          <div class="rating-wrapper">
            <ul>
              <li
                class="rating-item"
                v-for="(rating,index) in food.ratings"
                :key="index"
                v-show="needshow(rating.rateType,rating.text)"
              >
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" alt width="12px" height="12px" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <div class="text">
                  <span
                    :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"
                  ></span>
                  {{rating.text}}
                </div>
              </li>
            </ul>
            <div class="no-rating" v-if="!food.ratings ||!food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import cartcontrol from "../cartControl/cartControl.vue";
import split from "../split/split.vue";
import BScroll from "better-scroll";
import selectRating from "../selectRating/selectRating.vue";

export default {
  components: {
    cartcontrol,
    split,
    selectRating
  },
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showList: false,
      selectType: 2,
      toggleContent: true
    };
  },
  methods: {
    needshow(type, text) {
      if (!text && this.toggleContent) {
        return false;
      }
      if (this.selectType === 2) {
        return true;
      } else {
        return type === this.selectType;
      }
    },
    show() {
      this.showList = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, { click: true });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showList = false;
    },
    showCartControl() {
      this.$set(this.food, "count", 1);
    },
    selectRatingType(type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    toggleText(bool) {
      this.toggleContent = bool;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    }
  },
  filters: {
    // 过滤器
    formatDate(date) {
      let time = new Date(date);
      let o = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate(),
        hour: time.getHours(),
        minute: time.getMinutes()
      };
      let str = `${o.year}-${o.month}-${o.day}-${o.hour}:${o.minute}`;
      return str;
    }
  }
};
</script>

<style lang="scss" scoped>
.food {
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 48px;
  // z-index: 30;
  width: 100%;
  background: #fff;
  &.move-enter-active,
  &.move-leave-active {
    transition: all 0.5s ease-out;
  }
  &.move-enter-active {
    transform: translateX(0);
  }
  &.move-enter,
  &.move-leave-to {
    transform: translateX(100%);
  }
  .food-content {
    position: relative;
    .image-header {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .back {
        position: absolute;
        top: 10px;
        left: 10px;
        background-color: rgba(110, 120, 119, 0.5);
        border-radius: 50%;
        .icon-arrow_lift {
          display: block;
          padding: 5px;
          font-size: 20px;
          color: #fff;
        }
      }
    }
    .content {
      position: relative;
      padding: 18px;
      .title {
        line-height: 14px;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(7, 17, 27);
      }
      .detailfood {
        margin-bottom: 18px;
        line-height: 10px;
        font-size: 0;
        height: 10px;
        .sell-count,
        .rating {
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
        .sell-count {
          margin-right: 12px;
        }
      }
      .price {
        font-weight: 700;
        line-height: 24px;
        .now {
          margin-right: 8px;
          font-size: 14px;
          color: rgb(240, 20, 20);
        }
        .old {
          text-decoration: line-through;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
      }
      .cartcontrol-wrapper {
        position: absolute;
        right: 18px;
        bottom: 18px;
      }
      .buy {
        position: absolute;
        right: 18px;
        bottom: 18px;
        z-index: 10;
        height: 24px;
        line-height: 24px;
        padding: 0 12px;
        box-sizing: border-box;
        font-size: 10px;
        border-radius: 12px;
        color: #fff;
        background: rgb(0, 160, 220);
        &.fade-enter-active,
        &.fade-leave-active {
          transition: all 0.5s ease-out;
        }
        &.fade-enter-active {
          opacity: 1;
        }
        &.fade-enter,
        &.fade-leave-to {
          opacity: 0;
        }
      }
    }
    .food-info {
      padding: 18px;
      h2 {
        line-height: 14px;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 700;
        color: #07111b;
      }
      p {
        font-size: 12px;
        font-weight: 200;
        line-height: 24px;
      }
    }
    .rating {
      padding-top: 18px;
      .title {
        line-height: 14px;
        margin-left: 18px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(7, 17, 27);
      }
      .rating-wrapper {
        padding: 0 18px;
        .rating-item {
          position: relative;
          padding: 16px 0;
          border-bottom: 1px solid rgba(7, 17, 27, 0.1);
          .user {
            position: absolute;
            right: 0;
            top: 16px;
            font-size: 0;
            line-height: 12px;
            .name {
              display: inline-block;
              vertical-align: top;
              font-size: 10px;
              color: rgb(147, 153, 159);
              margin-right: 6px;
            }
            .avatar {
              border-radius: 50%;
            }
          }
          .time {
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
            margin-bottom: 6px;
          }
          .text {
            line-height: 16px;
            font-size: 12px;
            color: rgb(7, 17, 27);
            .icon-thumb_up,
            .icon-thumb_down {
              margin-right: 4px;
              line-height: 16px;
              font-size: 12px;
            }
            .icon-thumb_up {
              color: rgb(0, 160, 220);
            }
            .icon-thumb_down {
              color: rgb(147, 153, 159);
            }
          }
        }
        .no-rating {
          padding: 16px 0;
          font-size: 12px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }
}
</style>