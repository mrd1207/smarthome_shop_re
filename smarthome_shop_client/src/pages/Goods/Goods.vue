<template>
  <div id="container" v-if="goodsDetail[0]">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/category/1/1' }">商品分类</el-breadcrumb-item>
        <el-breadcrumb-item>商品详情</el-breadcrumb-item>
      </el-breadcrumb>
    <div class="pro_detail">
      <div class="pro_img">
        <div class="tb_booth">
          <img :src="goodsDetail[0].image_url" class="pro_middle_img" />
        </div>
      </div>
      <div class="pro_meg">
        <div class="pro_meg_hd">
          <h1>{{goodsDetail[0].goods_name}}</h1>
        </div>
        <div class="pro_meg_price">
          <dl>
            <dt>促销价</dt>
            <dd>
              <div class="promo_price">
                <span class="tm-price">{{goodsDetail[0].price | moneyFormat}}</span>
                <b>优惠促销</b>
              </div>
            </dd>
          </dl>
          <dl>
            <dt>市场价</dt>
            <dd class="nor_price">{{goodsDetail[0].normal_price | moneyFormat }}</dd>
          </dl>
          <dl>
            <dt>本店优惠</dt>
            <dd>包邮</dd>
          </dl>
          <dl>
            <dt class="sale_tip">{{goodsDetail[0].sales_tip}}</dt>
          </dl>
          <dl>
            <dt>服务承诺</dt>
            <dd>
              <span>正品保证</span>
              <span>极速退货</span>
            </dd>
          </dl>
        </div>
        <div class="pro_meg_deliver">
          <dl>
            <dt>运费</dt>
            <dd>浙江杭州&nbsp;&nbsp;至&nbsp;&nbsp;浙江杭州&nbsp;&nbsp;&nbsp;快递:0.00</dd>
          </dl>
        </div>
        <div class="pro_meg_console">
          <dl class="tb-sku">
            <dt>数量</dt>
            <dd>
              <div class="item-amout">
                <el-input-number v-model="shopNum" :min="1" :max="goodsDetail[0].counts"></el-input-number>
              </div>
              <span>库存</span>
              <em>{{goodsDetail[0].counts}}</em>
              <span>件</span>
            </dd>
          </dl>
          <div class="shopping_car">
            <el-button type="danger" @click.prevent="dealWithCellBtnClick(goodsDetail[0])">加入购物车</el-button>
            <el-button
              v-if="isColl"
              type="warning"
              icon="el-icon-star-off"
              @click="collect"
            >收藏</el-button>
            <el-button
              v-else
              type="warning"
              icon="el-icon-star-off"
              @click="cancelCollect"
            >已收藏</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="pro_judge" v-if="userInfo.user_name">
      <h3>评价该商品</h3>
      <span>为该商品评分</span>
      <el-rate v-model="rating" :colors="colors" show-score text-color="#ff9900"></el-rate>
      <el-input type="textarea" autosize placeholder="请输入内容" v-model="textarea"></el-input>
      <el-button type="primary" @click="post()">
        发布
        <i class="el-icon-edit el-icon--right"></i>
      </el-button>
    </div>
    <div class="pro_judge" v-else>
      <h3>评价该商品</h3>
      <span class="judge_erro_tip">登录后才可发表评论</span>
    </div>
    <div class="pro_comment">
      <h3>商品评价</h3>
      <div v-if="goodsDetail[0].comments_count">
        <div class="media" v-for="(comment, index) in goodsComment" :key="index">
          <div class="media-body">
            <h6
              class="media-heading"
              v-if="comment.user_nickname"
            >用户:&nbsp;{{ comment.user_nickname }}</h6>
            <h6 class="media-heading" v-else>用户:&nbsp;{{ comment.user_name | nameFormat }}</h6>
            <span>评论:</span>
            &nbsp;{{comment.comment_detail}}
            <el-rate v-model="comment.comment_rating" disabled show-score text-color="#ff9900"></el-rate>
          </div>
        </div>
      </div>
      <div class="media" v-else>
        <div class="media-body">本商品暂无评论</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import qs from "qs";
export default {
  data() {
    return {
      textarea: "",
      rating: 0,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      currentGoodsId: 0,
      shopNum: 1,
      isColl: true
    };
  },
  computed: {
    ...mapState(["goodsDetail", "userInfo", "goodsComment"])
  },
  created() {
    this.currentGoodsId = Number(this.$route.params.id);
    this.$store.dispatch("getGoodsDetail", {
      goodsNo: this.currentGoodsId
    });
    this.$store.dispatch("getGoodsComment", {
      goodsId: this.currentGoodsId
    });
    console.log(this.currentGoodsId);
    this.$store
      .dispatch("getCollState", {
        goods_id: this.currentGoodsId,
        user_id: this.userInfo.id
      })
      .then(res => {
        console.log(res.data);
        if (res.data.success_code == 200) {
          this.isColl=false;
          console.log("收藏了，显示已收藏");
        } else {
          this.isColl=true;
          console.log("没有收藏，显示收藏");
        }
      });
  },
  watch: {
    $route() {
      this.currentGoodsId = Number(this.$route.params.id);
      this.$store.dispatch("getGoodsDetail", {
        goodsNo: this.currentGoodsId
      });
      this.$store.dispatch("getGoodsComment", {
        goodsId: this.currentGoodsId
      });
      // 请求当前用户信息
      this.$store.dispatch("getLoginPwd");
    }
  },
  methods: {
    collect() {
        this.$store
          .dispatch("addCollection", {
            goods_id: this.currentGoodsId,
            user_id: this.userInfo.id,
            goods_name: this.goodsDetail[0].short_name,
            goods_pic: this.goodsDetail[0].thumb_url,
            goods_price: this.goodsDetail[0].price
          })
          .then(res => {
            console.log('es.data: ', res.data);
            if(res.data.err_code===0){
              
              alert("请先登录");
            }
            if (res.data.success_code === 200) {
              this.isColl=false;
            } else {
              this.$message({
                message: "收藏失败",
                type: "warning"
              });
            }
          });
    },
    cancelCollect(){
        this.$store.dispatch("delCollection", {
          goods_id: this.currentGoodsId,
          user_id: this.userInfo.id
        }).then(res=>{
          if (res.data.success_code === 200) {
              this.isColl=true;
            } else {
              this.$message({
                message: "取消收藏失败",
                type: "warning"
              });
            }
        });
    },
    post() {
      if (!this.textarea) {
        this.$message({
          message: "评论内容不能为空",
          type: "warning"
        });
        return;
      }
      let commentObj = {
        goods_id: this.goodsDetail[0].goods_id,
        comment_detail: this.textarea,
        comment_rating: this.rating,
        user_id: this.userInfo.id,
        isComment:1
      };
      console.log("commentObj: ", commentObj);
      this.$store.dispatch("postComment", commentObj).then(res => {
        if (res.success_code === 200) {
          this.textarea = "";
          this.rating = 0;
          this.$store.dispatch("getGoodsComment", {
            goodsId: this.currentGoodsId
          });
          this.$message({
            message: "评论成功",
            type: "success"
          });
        } else {
          this.$message.error("评论失败");
        }
      });
    },
    // 监听商品点击
    async dealWithCellBtnClick(goods) {
      // 1. 发送请求
      if (this.userInfo.user_name) {
        let goodsObj = {
          user_id: this.userInfo.id,
          goods_id: goods.goods_id,
          goods_name: goods.short_name,
          thumb_url: goods.thumb_url,
          price: goods.price,
          buy_count: this.shopNum,
          counts: goods.counts
        };
        this.$store.dispatch("addGoodsToCart", goodsObj).then(res => {
          if (res.success_code === 200) {
            this.$message({
              message: "添加购物车成功",
              type: "success"
            });
            //mark
            // let user_id = this.userInfo.id;
            // // 请求商品数据
            // this.$store.dispatch("getCartsGoods", { user_id });
            this.shopNum = 1;
          } else {
            this.$message.error("添加购物车失败");
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.el-breadcrumb{
  margin-left: 50px;
  margin-top: 30px;
}
#container > .pro_detail {
  width: 990px;
  position: relative;
  z-index: 100;
  margin: 20px auto;
}
#container > .pro_comment {
  width: 73%;
  position: relative;
  margin: 40px auto 0;
  padding: 20px;
  border: 1px solid #ccc;
  border-bottom: none;
}
#container > .pro_judge {
  width: 73%;
  position: relative;
  margin: 0 auto 60px;
  padding: 20px;
  border-top: none;
  border: 1px solid #ccc;
}
.pro_judge > span {
  font-size: 12px;
  color: #ccc;
}
.pro_judge > .el-rate {
  display: inline-block;
}
.pro_judge .el-textarea {
  width: 50%;
  display: block;
  margin: 20px 0;
}
.pro_comment > h3 {
  font-weight: bold;
  margin-bottom: 20px;
}
.pro_comment .media {
  border-top: 1px dashed #ccc;
  padding: 10px 0;
}
.pro_comment .media .media-heading {
  margin-bottom: 10px;
  font-weight: bolder;
}
.pro_comment .media .media-body {
  font-size: 14px;
}
.pro_comment .media .media-body span {
  font-weight: bolder;
}
.pro_comment .el-rate {
  display: inline-block;
  margin-left: 20px;
}
.pro_judge > h3 {
  font-weight: bold;
  margin-bottom: 20px;
}
.pro_judge .judge_erro_tip {
  font-size: 15px;
  font-weight: bolder;
  color: #000;
}
.pro_detail > .pro_img {
  float: left;
  position: relative;
  padding: 0 0;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;
}
.pro_img > .tb_booth {
  position: relative;
  z-index: 1;
}
.tb_booth > .pro_middle_img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.pro_detail > .pro_meg {
  margin: 0 0 0 520px;
  color: #666;
  padding: 0 0 3px;
}
.pro_meg > .pro_meg_hd {
  padding: 0 10px 12px;
  color: #000;
}
.pro_meg_hd > h1 {
  font-size: 16px;
  font-weight: 700;
  color: #000;
}
.pro_meg > .pro_meg_price {
  padding: 5px 20px;
  height: 200px;
  background-color: rgba(247, 244, 244, 0.6);

  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.pro_meg_price dl {
  display: flex;
  align-items: center;

  margin-bottom: 0 !important;
  cursor: pointer;
}
.pro_meg_price dl dt {
  width: 70px;
  color: #999;
  font-size: 12px;
}
.pro_meg_price dl dd {
  margin-bottom: 0 !important;
  font-family: Arial;
}
.pro_meg_price dl dd div {
  display: flex;
  align-items: center;
}
.pro_meg_price dl:last-child dd {
  color: #ff0036;
  font-weight: bold;
  font-size: 12px;
}
.promo_price {
  line-height: 24px;
  vertical-align: middle;
  color: #ff0036;
  font-size: 18px;
  font-family: Arial;
  -webkit-font-smoothing: antialiased;
}
.promo_price b {
  display: inline-block;
  font-weight: normal;
}
.promo_price b:last-child {
  font-size: 12px;
  background: #f47a86;
  color: white;
  padding: 0 6px;
}
.promo_price > .tm-price {
  font-size: 20px;
  display: inline-block;
  margin-right: 12px;
  font-weight: bold;
}
.nor_price {
  text-decoration: line-through;
}
.sale_tip {
  color: #ff0036 !important;
  font-weight: bolder;
  width: 80px !important;
}
.pro_meg_deliver {
  margin: 5px 20px -15px 0;
  padding: 5px;
}
.pro_meg_deliver dl {
  padding: 5px;
  font-size: 14px;
  color: black;
  cursor: pointer;
}
.pro_meg_deliver dl dt {
  color: #999;
  font-size: 14px;
  text-align: left;
  width: 69px;
  margin: 0 0 0 8px;
  float: left;
}
.pro_meg_deliver dl dd {
  font-size: 13px;
}
.pro_meg_console {
  margin: 5px 20px 5px 0;
  padding: 5px;
}
.tb-sku {
  padding: 5px;
  font-size: 14px;
  color: black;
  cursor: pointer;
}
.tb-sku dt {
  color: #999;
  font-size: 14px;
  text-align: left;
  width: 69px;
  margin: 0 0 0 8px;
  float: left;
}
.tb-sku dd {
  font-size: 13px;
}
.tb-sku dd div {
  display: inline-block;
  margin-right: 20px;
}
.item-amout {
  height: 25px;
}
.item-amout a {
  display: inline-block;
  height: 23px;
  width: 17px;
  border: 1px solid #e5e5e5;
  background: #f0f0f0;
  text-align: center;
  line-height: 23px;
  color: #444;
  cursor: pointer;
}
.item-amout a:hover {
  color: #f50;
  border-color: #f60;
}
.item-amout > .text_amount {
  width: 40px;
  height: 20px;
  text-align: center;
  display: inline-block;
}
.shopping_car {
  margin: 20px auto 0;

  display: flex;
  justify-content: center;
}
.shopping_car button {
  outline: none;
}
</style>
