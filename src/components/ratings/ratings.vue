<template>
  <div class="ratings" ref="ratings">
    <div class="rating-content">
      <div class="overview">
        <div class="overview-left">
          <div class="score">{{seller.score}}</div>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <div>
              <span class="title">服务态度</span>
              <span class="star">
                <star :size="36" :score="seller.serviceScore"></star>
              </span>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div>
              <span class="title">商品评分</span>
              <span class="star">
                <star :size="36" :score="seller.foodScore"></star>
              </span>
              <span class="score">{{seller.foodScore}}</span>
            </div>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <selectRating
        :ratings="ratings"
        v-on:select-rating-type="selectRatingType"
        v-on:toggle-text="toggleText"
      ></selectRating>
      <div class="rating-wrapper">
        <ul v-if="ratings">
          <li
            class="rating-item"
            v-for="(rating,index) in ratings"
            :key="index"
            v-show="needshow(rating.rateType,rating.text)"
          >
            <div class="avatar">
              <span>
                <img :src="rating.avatar">
              </span>
            </div>
            <div class="content">
              <span class="name">{{rating.username}}</span>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
              </div>
              <div class="text">
                {{rating.text}}
              </div>
              <div class="recommend">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                <span v-for="(item,index) in rating.recommend" :key="index">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script >
import star from "../star/star.vue";
import split from "../split/split.vue";
import selectRating from "../selectRating/selectRating.vue";
import BScroll from "better-scroll";
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      ratings: null,
      selectType: 2,
      toggleContent: true
    };
  },
  components: {
    star,
    split,
    selectRating
  },
  created() {
    this.$axios.get("/api/ratings").then(res => {
      if (res.data.errno === 0) {
        this.$nextTick(() => {
          this.ratings = res.data.ratings;
          this.scroll = new BScroll(this.$refs.ratings, { click: true });
        });
      }
    });
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
    selectRatingType(type) {
      this.selectType = type;
      // this.$nextTick(() => {
      //   this.scroll.refresh();
      // });
    },
    toggleText(bool) {
      this.toggleContent = bool;
      // this.$nextTick(() => {
      //   this.scroll.refresh();
      // });
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
.ratings {
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  .overview {
    display: flex;
    padding: 18px 0;
    .overview-left {
      flex: 0 0 137px;
      padding: 6px 0;
      width: 137px;
      border-right: 1px solid rgba(7, 17, 27, 0.1);
      text-align: center;
      @media only screen and (max-width: 320px) {
        flex: 0 0 120px;
        width: 120px;
      }
      .score {
        margin-bottom: 6px;
        line-height: 28px;
        font-size: 24px;
        color: rgb(255, 153, 0);
      }
      .title {
        margin-bottom: 8px;
        line-height: 12px;
        font-size: 12px;
        color: rgb(7, 17, 27);
      }
      .rank {
        line-height: 10px;
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
    }
    .overview-right {
      flex: 1;
      padding: 6px 0 6px 24px;
      @media only screen and (max-width: 320px) {
        padding-left: 6px;
      }
      .score-wrapper {
        margin-bottom: 8px;
        font-size: 0;
        .title {
          display: inline-block;
          line-height: 18px;
          vertical-align: top;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }
        .star {
          display: inline-block;
          margin: 0 12px;
          vertical-align: top;
        }
        .score {
          display: inline-block;
          line-height: 18px;
          vertical-align: top;
          font-size: 12px;
          color: rgb(255, 153, 0);
        }
      }
      .delivery-wrapper {
        font-size: 0;
        .title {
          line-height: 18px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }
        .delivery {
          margin-left: 12px;
          font-size: 12px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }
  .rating-wrapper {
    padding: 0 18px;
    .rating-item {
      display: flex;
      padding: 18px 0;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      .avatar {
        flex: 0 0 28px;
        width: 28px;
        margin-right: 12px;
        img {
          width: 100%;
          border-radius: 50%;
        }
      }
      .content {
        position: relative;
        flex: 1;
        .name {
          margin-bottom: 4px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(7, 17, 27);
        }
        .star-wrapper {
          margin-bottom: 6px;
          font-size: 0;
          .star {
            display: inline-block;
            margin-right: 6px;
            vertical-align: top;
          }

          .delivery {
            display: inline-block;
            vertical-align: top;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
        .text {
          margin-bottom: 8px;
          line-height: 18px;
          color: rgb(7, 17, 27);
          font-size: 12px;
        }

        .recommend {
          line-height: 16px;
          font-size: 0;

          .icon-thumb_up,
          .icon-thumb_down,
          .item {
            display: inline-block;
            margin: 0 8px 4px 0;
            font-size: 9px;
          }

          .icon-thumb_up {
            color: rgb(0, 160, 220);
          }
          .icon-thumb_down {
            color: rgb(0, 160, 220);
          }

          .item {
            padding: 0 6px;
            border: 1px solid rgba(7, 17, 27, 0.1);
            border-radius: 1px;
            color: rgb(147, 153, 159);
            background: #fff;
          }
        }

        .time {
          position: absolute;
          top: 0;
          right: 0;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }
}
</style>