<template>
  <div id="shopcar">
    <div id="content">
      <div class="header">
        <img src="./../../common/img/logo-round.png" class="header_logo" />
        <span>购物车</span>
      </div>
      <div class="cont_title">
        <span>全部商品</span>
      </div>
      <div class="cont_op">
        <div class="con_selet">
          <input
            type="checkbox"
            class="con_selectAll"
            :checked="isSelectedAll"
            @change="isSelected"
          />
          <label for="con_selectAll">全选</label>
        </div>
        <div>商品信息</div>
        <div>单价</div>
        <div>数量</div>
        <div>金额</div>
        <div>操作</div>
      </div>
      <div class="pro_box" v-if="cartsGoods.length">
        <div class="goods" v-for="(goods, index) in cartsGoods" :key="index">
          <ul class="item_content">
            <li class="td td-chk">
              <div>
                <input class="checkBox" type="checkbox" v-model="goods.check" />
              </div>
            </li>
            <li class="td td-item">
              <div class="td-item-pic">
                <img :src="goods.thumb_url" />
              </div>
              <div class="td-item-info">{{ goods.goods_name }}</div>
            </li>
            <li class="td td-price">
              <strong>{{ (goods.price / 100) | moneyFormat }}</strong>
            </li>
            <li class="td td-amount">
              <div class="item-amout">
                <el-input-number
                  v-model="goods.buy_count"
                  :min="1"
                  :max="goods.counts"
                  size="small"
                  @change="updateGoodsCount(goods.goods_id, goods.buy_count)"
                ></el-input-number>
              </div>
            </li>
            <li class="td td-sum">
              <strong>
                {{
                ((goods.buy_count * goods.price) / 100) | moneyFormat
                }}
              </strong>
            </li>
            <li class="td td-op">
              <a @click="clickTrash(goods.goods_id)">删除</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="pro_box" v-else>购物车里空空如也</div>
    </div>
    <div id="footer">
      <div class="foot_select">
        <input
          type="checkbox"
          class="foot_selectAll"
          name="foot_selectAll"
          :checked="isSelectedAll"
          @change="isSelected"
        />
        <label for="foot_selectAll">全选</label>
      </div>
      <div class="foot_op">
        <a class="foot_remove" @click.prevent="emptyCart">清空购物车</a>
      </div>
      <div class="foot_total">
        <div class="amout-sum">
          <span class="txt">已选商品</span>
          <strong id="selected_amout">{{ totalCount }}</strong>
          <span class="txt">件</span>
        </div>
        <div class="price-sum">
          <span class="txt">合计（不含运费）：</span>
          <strong class="selected_price">
            {{
            totalPrice | moneyFormat(totalPrice)
            }}
          </strong>
        </div>
        <div class="btn-area">
          <a
            class="btn-sumbit"
            :class="{ 'btn-allow': totalAmount }"
            @click="goOrder('/confirm_order')"
          >结&nbsp;算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      shopsNum: [],
      isSelectedAll: false,
      currentDelGoods: {}, // 当前删除的商品
      totalAmount: 0,
      toOrderGoods: []
    };
  },
  computed: {
    ...mapState(["userInfo", "cartsGoods"]),
    totalPrice() {
      let total = 0;
      for (let i = 0; i < this.cartsGoods.length; i++) {
        if (this.cartsGoods[i].check) {
          total +=
            this.cartsGoods[i].buy_count * (this.cartsGoods[i].price / 100);
        }
      }
      this.totalAmount = total;
      return total;
    },
    totalCount() {
      let counts = 0;
      for (let i = 0; i < this.cartsGoods.length; i++) {
        if (this.cartsGoods[i].check) {
          counts++;
        }
        if (counts === this.cartsGoods.length) {
          this.isSelectedAll = true;
        }else{
          this.isSelectedAll = false;
        }

      }

      return counts;
    }
  },
  created() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  methods: {
    // 请求商品数据
    getList() {
      let user_id = {
        user_id: this.userInfo.id
      };
      // 请求商品数据
      this.$store.dispatch("getCartsGoods", user_id);
    },
    // 1.更新单个商品数量
    updateGoodsCount(goods_id, count) {
      let user_id = this.userInfo.id;
      let delSingCartParams = `goods_id=${goods_id}&count=${count}&user_id=${this.userInfo.id}`;
      this.$store
        .dispatch("updateGoodsCount", delSingCartParams)
        .then(res => {});
    },
    // 2.是否选中所有商品
    isSelected() {
      this.isSelectedAll = !this.isSelectedAll;
      for (let cb of this.cartsGoods) {
        if (this.isSelectedAll) {
          cb.check = true;
        } else {
          cb.check = false;
        }
      }
    },

    // 6.删除单个商品
    clickTrash(goods_id) {
      this.$confirm("您确定删除该商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let user_id = this.userInfo.id;
        this.currentDelGoods = goods_id;
        let delSingCartParams = `goods_id=${goods_id}&user_id=${this.userInfo.id}`;
        this.$store.dispatch("delSingleGoods", delSingCartParams).then(res => {
          if (res.success_code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList();
          } else {
            this.$message.error("删除失败");
          }
        });
        this.getAllGoodsPrice();
      });
    },
    // 7.删除所有商品
    emptyCart() {
      this.$confirm("您确定删除所有商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let delCartParams = `user_id=${this.userInfo.id}`;

        this.$store.dispatch("delAllGoods", delCartParams).then(res => {
          if (res.success_code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList();
          } else {
            this.$message.error("删除失败");
          }
        });
      });
    },
    goOrder(path) {
      let goodsNum = 0;
      for (let i = 0; i < this.cartsGoods.length; i++) {
        if (this.cartsGoods[i].check) {

          this.toOrderGoods.push(this.cartsGoods[i]);
          this.$store.commit("setCartToOrder", this.toOrderGoods);
          window.localStorage.setItem(
            "goodsOrder",
            JSON.stringify(this.toOrderGoods)
          );
          goodsNum++;
        }
      }
      if (!goodsNum) {
        this.$alert("请选择商品", "提示", {
          confirmButtonText: "确定"
        });
      } else {
        this.$router.replace(path);
      }
    }
  }
};
</script>

<style scoped>
#content > .header {
  width: 100%;
  height: 90px;
  margin-top: 10px;
  position: relative;
}
.header > img {
  width: 80px;
  height: 80px;
  border: 1px solid gray;
  border-radius: 50%;
  cursor: pointer;
}
.header > span {
  display: inline-block;
  font-size: 25px;
  height: 35px;
  font-weight: 700;
  position: absolute;
  top: 30%;
  margin-left: 20px;
  cursor: pointer;
}
#content > .cont_title {
  margin: 10px auto;
  width: 80%;
  height: 35px;
  border-bottom: 2px solid #e6e6e6;
}
.cont_title > span {
  display: inline-block;
  font-weight: 700;
  font-size: 17px;
  height: 100%;
  width: 100px;
  text-align: center;
  line-height: 25px;
  cursor: pointer;
  color: #f40;
  border-bottom: 2px solid #f40;
}
#content > .cont_op {
  width: 80%;
  margin: 0 auto;
  height: 40px;
  display: flex;
  justify-content: space-around;
}
.cont_op > div {
  line-height: 40px;
}
.cont_op > div:nth-child(2) {
  width: 120px;
}
#content > .pro_box {
  margin: 0 auto;
  width: 80%;
}
.pro_box > .goods {
  background: #fcfcfc;
  width: 100%;
  height: 130px;
  border: 1px solid #cccccc;
}
.goods > .item_content {
  padding: 15px;
  list-style: none;

  display: flex;
  justify-content: space-around;
}
.item_content > .td-item {
  width: 180px;
  position: relative;
}
.td-item > div {
  display: inline-block;
}
.td-item > .td-item-pic > img {
  width: 80px;
  height: 80px;
}
.td-item > .td-item-info {
  position: absolute;
  width: 80px;
  line-height: 15px;
  font-size: 12px;
  top: 0;
  margin-left: 20px;
}
.item_content > .td-sum {
  color: #f40;
}
.td-amount > .item-amout {
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
.td-op a {
  color: black;
}
.td-op a:hover {
  cursor: pointer;
  color: #f40;
}
#footer {
  width: 80%;
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 10%;
  background: #e5e5e5;
  z-index: 9999;
}
#footer div {
  display: inline-block;
}
#footer > .foot_select {
  width: 50px;
  height: 50px;
  line-height: 50px;
  padding-left: 5px;
  cursor: pointer;
  font-size: 14px;
}
.foot_select input,
.foot_select label {
  cursor: pointer;
}
.foot_op {
  line-height: 50px;
  height: 50px;
}
.foot_op > .foot_remove {
  margin-left: 25px;
  font-size: 14px;
  cursor: pointer;
}
.foot_remove:hover {
  color: #f40;
}
.foot_total {
  float: right;
}
.foot_total > .amout-sum {
  cursor: pointer;
  height: 50px;
  color: #3c3c3c;
}
.foot_total .txt {
  line-height: 50px;
  font-size: 14px;
}
.amout-sum > #selected_amout {
  padding: 0 5px;
  color: #f40;
  font-weight: 700;
  font-size: 18px;
}
.price-sum {
  margin-left: 50px;
}
.price-sum > .selected_price {
  color: #f40;
  font-weight: 700;
  font-size: 20px;
  line-height: 50px;
}
.btn-area > .btn-sumbit {
  display: inline-block;
  background: #b0b0b0;
  color: #fff;
  border-left: 1px solid #e7e7e7;
  width: 119px;
  height: 50px;
  cursor: not-allowed;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
}
.btn-area > .btn-sumbit.btn-allow {
  background: #f22d00;
  cursor: pointer;
}
</style>
