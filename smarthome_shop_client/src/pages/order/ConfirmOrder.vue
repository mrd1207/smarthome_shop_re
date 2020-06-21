<template>
  <div id="confirm_order">
    <!-- <div class="header"> -->
      <el-steps :active="1" finish-status="success">
      <h1>确认订单</h1>

        <el-step class="elstep" title="购物车"></el-step>
        <el-step title="确认订单"></el-step>
        <el-step title="支付"></el-step>
      </el-steps>
    
    <span class="header-title">选择收货地址</span>
    <div class="address_list clearfix" v-if="address">
      <div
        class="address_item"
        :class="{ address_itemsel:changeLeftBackground == index}"
        v-for="(item,index) in address"
        :key="index"
        @click="selAddress(index)"
      >
        <div>
          <strong>{{ select[index].province }}{{select[index].city}}({{ item.real_name }}收)</strong>
        </div>
        <hr />
        {{select[index].area}}{{ item.street_name }}{{ item.tel }}
      </div>
    </div>
    <span class="header-title">确认订单信息</span>
    <div class="confirm_orderInfo">
      <div class="orderittle">
        <div class="goodsTitle">商品图片</div>
        <div class="priceTitle">商品名称</div>
        <div class="countTitle">商品单价</div>
        <div class="countTitle">商品数量</div>
        <div class="paymentTitle">商品价格</div>
      </div>
      <div class="goodsitem" v-for="(item,index) in cartToOrder" :key="index">
        <img :src="item.thumb_url" alt />
        <div class="shortname">{{item.goods_name}}</div>
        <div class="goodscount">{{item.prices| moneyFormat}}</div>
        <div class="goodscount">x{{item.buy_count}}</div>
        <div class="goodspirce">{{item.price | moneyFormat}}</div>
      </div>
    </div>
    <div class="confirm_end">
      <div class="confirm_address">
        <div class="total">
          <span>实付款：</span>
          {{confirmTotal | moneyFormat}}
        </div>
        <div>
          <strong>寄送至：</strong>
          {{address[addressIndex].area_name}}{{address[addressIndex].street_name}}
        </div>
        <div>
          <strong>收货人：</strong>
          {{address[addressIndex].real_name}}{{address[addressIndex].tel}}
        </div>
      </div>
      <div class="confirm_btn">
        <el-button type="text" @click="goTocart('/shopcar')">返回购物车</el-button>
        <el-button type="danger" @click="goToPay('/pay')">确认订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";
import orderAddress from "../Me/Children/AdminAddress";
import qs from "qs";
// import
export default {
  data() {
    return {
      count: 10,
      address: [],
      changeLeftBackground: 0,
      select: [],
      addressIndex: 0
    };
  },
  computed: {
    ...mapState(["userInfo", "cartToOrder"]),
    confirmTotal() {
      let total = 0;
      for (let i = 0; i < this.cartToOrder.length; i++) {
        total += this.cartToOrder[i].buy_count * this.cartToOrder[i].price;
        this.cartToOrder[i].prices = total;
      }
      return total;
    }
  },
  components: {
    orderAddress
  },
  created() {
    this.getAddressInfo();
    this.$store.commit(
      "setCartToOrder",
      JSON.parse(window.localStorage.getItem("goodsOrder"))
    );
  },
  methods: {
    // 获取后端收货地址
    getAddressInfo() {
      let userId = {
        user_id: this.userInfo.id
      };

      this.$store.dispatch("getAddress", userId).then(res => {
        if (res.data.success_code === 200) {
          this.$store.commit("setUserAddress", res.data.message);
          this.address = res.data.message;
          for (let i = 0; i < this.address.length; i++) {
            let selectArea = new Object();
            selectArea.province = this.address[i].area_name
              .split(" ")[0]
              .slice(0, -1);
            selectArea.city = this.address[i].area_name
              .split(" ")[1]
              .slice(0, -1);
            selectArea.area = this.address[i].area_name.split(" ")[2];
            this.select[i] = selectArea;
          }
        }
      });
    },
    selAddress(index) {
      this.changeLeftBackground = index;
      this.addressIndex = index;
    },
    goTocart(path) {
      // 返回时清空数组
      window.localStorage.removeItem("goodsOrder");
      this.cartToOrder.length = 0;
      this.$router.replace(path);
    },
    goToPay(path) {
      let params = {
        cartToOrder: this.cartToOrder,
        address: this.address[this.addressIndex],
        user_id: this.userInfo.id,
        buyer_nick: this.userInfo.user_name,
        payment: this.confirmTotal
      };

      this.$store.dispatch("submitOrder", params).then(res => {
        if (res.data.success_code === 200) {
          window.localStorage.removeItem("goodsOrder");
          this.$router.replace(path + "/" + res.data.message);
        }
      });
    }
  }
};
</script>

<style scoped>
.header{
  
  display: flex;
  
  
}
.el-steps{
  display: flex;
  margin-top: 30px;
  width: 1040px;
}
.el-steps .el-step{
  margin-top: 22px;
}
.elstep{
  margin-left: 210px;

}
.orderittle {
  padding: 10px;
  width: 1030px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
.orderittle div {
  float: left;
  font-weight: 400;
  color: #666;
  font: 14px/1.3 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
  font-style: normal;
  text-align: center;
}
.goodsTitle {
  width: 100px;
}
.priceTitle {
  width: 400px;
  text-align: left;
}
.countTitle,
.paymentTitle {
  width: 160px;
}
.orderittle table {
  clear: both;
}
/*  */
.header-title {
  display: block;
  line-height: 25px;
  color: #333;
  font-weight: 700;
  font-size: 14px;
  margin-top: 21px;
}
#confirm_order {
  width: 90%;
  margin: 0 auto;
}
.address_list {
  margin-top: 10px;
  padding: 10px;
  width: 1020px;
  /* border: #dddddd 1px solid; */
  background-color: #f3f3f3;
}
.address_list div {
  font: 13px/1.5 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
  color: #666;
}
.address_item {
  float: left;
  padding: 5px;
  width: 230px;
  height: 130px;
  margin: 6px;
  border: #e2e2e2 1px solid;
  border: 1px solid #ccc;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  background-color: white;
}
.address_itemsel {
  height: 128px;
  width: 226px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border: 2px solid salmon;
}
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
.confirm_orderInfo {
  margin-top: 10px;
  /* padding: 10px; */
  width: 1050px;
  /* border: gray 1px solid; */
}
.goodsitem {
  margin: 0 auto;
  height: 80px;
  width: 100%;
  border: #f5f5f5 1px solid;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  position: relative;
}
.goodsitem img {
  width: 70px;
  height: 70px;
  float: left;
  padding: 10px;
}
.shortname {
  text-align: center;
  padding: 10px;
  width: 300px;
  /* margin-left: 50px; */
  font: 13px/1.5 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
  color: #666;
  width: 400px;
}
.goodscount {
  text-align: center;
  width: 160px;
  padding: 10px;
  font: 13px/1.5 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
  color: #666;
}
.goodspirce {
  width: 160px;
  text-align: center;
  padding: 10px;
  font: 14px/1.5 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
  color: #666;

  font-weight: 700;
}
.confirm_end {
  width: 320px;
  height: 200px;
  margin-left: 720px;
  padding: 5px;
  border: 1px solid #f5f5f5;
}
.confirm_address {
  padding: 10px;
}
.confirm_address div {
  font: 14px/1.5 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
  color: #666;
  padding: 5px;
}
.confirm_btn {
  display: flex;
  justify-content: space-between;
}
.confirm_address .total {
  font-size: 16px;
  color: #f40;
  font-weight: 700;
}
.total span {
  font-weight: 600;
  color: #333;
}
</style>
