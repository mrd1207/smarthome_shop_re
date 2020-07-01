<template>
  <div id="home">
    <!--轮播图-->
    <el-carousel v-if="homecasual.length > 0" :height="bannerHeight+'px'" type="card">
      <el-carousel-item v-for="(casual) in homecasual" :key="casual.id">
        <img :src="casual.imgurl" class="casualImg" />
      </el-carousel-item>
    </el-carousel>
    <!-- <el-divider>商品分类</el-divider> -->
    <div class="floortitle">
      <h3 class="floortitle_info">全屋智能</h3>
    </div>
    <div class="sub-title-wrap">
      <div class="line"></div>
      <p class="sub-title">智能家居，让AI充满你的家</p>
      <div class="line"></div>
    </div>
    <div class="cardcate">
      <div v-for="(item) in category" :key="item">
        <el-card :body-style="{ padding: '10px' }" class="cardStyle" shadow="hover">
          <img :src="item.cate_img" class="image" @click="goCate(item.cate_id)" />
          <div class="bottom">
            <el-button type="text" class="cateBtn" @click="goCate(item.cate_id)">{{item.cate_name}}</el-button>
          </div>
        </el-card>
      </div>
    </div>
    <div class="floortitle">
      <h3 class="floortitle_info">智能推荐</h3>
    </div>
    <div class="recommend">
      <div v-for="(item,index) in homeShopList" :key="index">
        <div class="cateTitle">
          <div class="cate_name">{{item.cate_name}}</div>
          <div class="more" @click="goCate(item.cate_id)">查看更多</div>
        </div>
        <div class="pro">
          <el-card
            v-for="(goodsItem,index) in item"
            :key="index"
            :body-style="{ padding: '0px'}"
            class="ccardStyle"
          >
            <img v-lazy="goodsItem.thumb_url" class="cimage" @click="goDetail(goodsItem.goods_id)" />
            <div class="shortName">{{ goodsItem.short_name }}</div>
            <div class="p_bottom">
              <div class="cart-bottom">
                <span class="price">{{ goodsItem.price | moneyFormat }}</span>
                <el-button type="text" class="button" @click="goDetail(goodsItem.goods_id)">查看详情</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      bannerHeight: 350,
      homeShopList: []
    };
  },
  created() {
    // dispatch调用action函数
    this.$store.dispatch("getHomecasual");
    this.$store.dispatch("getCategory").then(res => {
      // commit是将data传给mutations
      this.$store.commit("setCategory", res.data.message.slice(0, 5));
    });

    this.$store.dispatch("getHomeShopList").then(res => {
      if (res.data.success_code === 200) {
        this.homeShopList = res.data.message.slice(0, 5);
        for (let i = 0; i < this.homeShopList.length; i++) {
          this.homeShopList[i].cate_name = this.category[i].cate_name;
          this.homeShopList[i].cate_id = this.category[i].cate_id;
        }
      }
    });
  },
  computed: {
    ...mapState(["homecasual", "category"])
  },
  methods: {
    goCate(cate_id) {
      this.$router.replace("/category/" + cate_id + "/1");
    },
    goDetail(goods_id) {
      this.$router.replace("/goods/" + goods_id);
    }
  }
};
</script>
<style scoped>
.floortitle {
  width: 1000px;
  margin: 0 auto;
  height: 75px;
  line-height: 75px;
  background-image: url("//img30.360buyimg.com/aotucms/jfs/t30421/157/749163722/12685/aea3ed6f/5bfcf2d5Nb61021f1.png");
  background-size: 1050px;
  /* margin: 30px; */
  padding: 0px;
  background-color: rgb(255, 255, 255);
  /* text-align: center; */

}
.floortitle_info {
  font-size: 26px;
  font-weight: normal;
  margin-left: 470px;
}
.sub-title-wrap {
  margin: 0 auto;
  padding-top: 30px;
  padding-bottom: 30px;
  display: flex;
  align-items: center;
  margin-left: 450px;
}
.sub-title-wrap .line {
  -webkit-transform: translateY(-2px);
  -ms-transform: translateY(-2px);
  transform: translateY(-2px);
  width: 16px;
  height: 0;
  border-top: 0.5px solid #7f7f8e;
}
.sub-title-wrap .sub-title {
  margin: 0 8px;
  color: #7f7f8e;
  font-family: PingFangSC-Light;
  font-size: 16px;
  font-weight: 300;
  height: 22px;
  text-align: center;
}

/* 商品列表 */
.pro {
  width: 1020px;
  display: flex;
  justify-content: space-between;
  height: 350px;
  margin-top: 20px;
}
.ccardStyle {
  width: 220px;
  height: 310px;
  position: relative;
}
.price {
  font-size: 16px;
  color: #f40;
  font-weight: 700;
}
.shortName {
  width: 92%;
  padding: 10px 10px;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
}

.cimage {
  width: 100%;
}

.p_bottom {
  width: 100%;
  position: absolute;
  bottom: 0;
  margin-top: 10px;
}
.cart-bottom {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  padding-bottom: 0px;
}
.price {
  align-self: center;
}
.button {
  align-self: center;
}
/*  */
.cate_name {
  font-size: 20px;
  font-weight: 400;
  color: #2b2c3c;
}
.more {
  cursor: pointer;
  color: #7f7f8e;
  font-size: 16px;
  font-weight: 400;
  display: inline-block;
  width: 73px;
  background-image: url(https://du.hupucdn.com/FkRxEmJoG8CnCQAJPXtbMh4Oe2Yv);
  background-repeat: no-repeat;
  background-position: right 50%;
  background-size: 8px 12px;
  line-height: 1.5;
}
.recommend {
  width: 1020px;
  margin: 10px auto;
}
.cateTitle {
  display: flex;
  justify-content: space-between;
}
.el-carousel {
  margin: 0 auto;
  width: 999px;
}
.el-carousel__item {
  border-radius: 10px;
  box-shadow: 10px 10px 40px rgba(0, 0, 0, 0.2);
}
.cardcate {
  margin-top: 0px;
  padding: 50px;
  display: flex;
  justify-content: space-between;
}
.bottom {
  margin-top: 0px;
  line-height: 12px;
  padding: 0px;
  text-align: center;
}
.cateBtn {
  padding: 0;
  float: center;
  color: black;
  margin-top: 20px;
}
.el-button--text {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, PingFang SC, Noto Sans, Noto Sans CJK SC, Microsoft YaHei,
    微软雅黑, sans-serif;
  font-weight: 300;
}
.casualImg {
  width: 824px;
}
.cardStyle {
  margin-top: 0px;
  border: 0px solid white;
}
.image {
  width: 100%;
  width: 170px;
  height: 170px;
  display: block;
}
@media screen and (min-width: 992px) {
  .cateBtn {
    font-size: 21px;
  }
}
@media screen and (min-width: 768px) and (max-width: 991px) {
  .cateBtn {
    font-size: 14px;
  }
}
/*phone <=767px*/
@media screen and (max-width: 767px) {
  .cateBtn {
    font-size: 12px;
  }
}
</style>
