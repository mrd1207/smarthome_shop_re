<template>
  <div>
    <div class="order_item">
      <div class="order_id_time">
        <div>{{ctime}}</div>
        <div>
          <strong>订单号:</strong>
          {{orderId}}
        </div>
      </div>
      <div v-if="goodsInfo">
        <div class="order_goods" v-for="(goodsItem,index) in goodsInfo" :key="index">
          <div class="goods">
            <img :src="goodsItem.pic_path" @click="goDetail(goodsItem.item_id)" alt />
            <div>{{goodsItem.title}}</div>
          </div>
          <div class="goods_price">¥{{goodsItem.price}}</div>
          <div class="buy_count">x{{goodsItem.num}}</div>
          <div class="payment">¥{{goodsItem.total_fee}}</div>
          <div class="order_operation">
            <el-button type="text">提醒发货</el-button>
            <el-button type="text" class="outpay">退款</el-button>
          </div>
        </div>
        <div class="order_address_total">
          <div v-if="addressInfo">
            <el-popover placement="top-start" title="收货地址" width="200" trigger="hover">
              <hr />
              <div>
                <strong>收件人：</strong>
                {{addressInfo.receiver_name}}
              </div>
              <div>
                <strong>地址：</strong>
                {{addressInfo.receiver_city}}{{addressInfo.receiver_district}}{{addressInfo.receiver_address}}
              </div>
              <div>
                <strong>电话：</strong>
                {{addressInfo.receiver_phone}}
              </div>
              <el-button slot="reference" type="text">收货地址</el-button>
            </el-popover>
          </div>
          <div v-else >
            <el-button type="text">收货地址</el-button>
          </div>
          <div class="total">
            实付款:
            <strong>¥{{payment}}</strong>
          </div>
        </div>
      </div>
      <table></table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsInfo: Array,
    addressInfo: Object,
    orderId: String,
    payment: Number,
    ctime: String
  },
  methods: {
    goDetail(id) {
      this.$router.replace("/goods/" + id);
    }
  }
};
</script>

<style scoped>
.order_item {
  width: 882px;
  margin-top: 20px;
  border: 1px solid #e5e5e5;
  background-color: white;
}
.order_id_time {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  background-color: #f5f5f5;
  font: 14px/150% tahoma, arial, Microsoft YaHei, Hiragino Sans GB,
    "\u5b8b\u4f53", sans-serif;
  color: #666;
}
.order_goods {
  height: 65px;
  padding: 10px;
  width: 860px;
  /* background-color: blueviolet; */
  border-bottom: 1px solid #e5e5e5;
  /* margin-top: 5px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order_goods div {
  text-align: center;
}
.goods {
  width: 330px;
  font: 13px/1.5 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.goods_price,
.buy_count,
.payment {
  width: 95px;
  font: 12px/150% tahoma, arial, Microsoft YaHei, Hiragino Sans GB,
    "\u5b8b\u4f53", sans-serif;
}
.goods_price {
  color: #3c3c3c;
  font: verdana;
}
.payment {
  font: 12px/1.5 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
  font-weight: 500;
}
.order_operation {
  width: 225px;
}
.order_operation .el-button {
  padding: 10px;
  margin-left: 50px;
}
.order_operation .outpay {
  margin-left: 10px;
}
.goods img {
  width: 80px;
  height: 80px;
  float: left;
}
.goods div {
  float: left;
  word-wrap: break-word;
  width: 220px;
  text-align: left;
}
.order_address_total {
  padding: 9px;
  position: relative;
  /* right: 10px; */
  align-items: center;
  height: 20px;
  background-color: #fafafa;
}
.order_address_total div {
  position: absolute;
  right: 10px;
}

.order_address_total .el-button {
  position: absolute;
  right: 120px;
  padding: 2px;
}
.total {
  font: 14px/150% tahoma, arial, Microsoft YaHei, Hiragino Sans GB,
    "\u5b8b\u4f53", sans-serif;
}
</style>