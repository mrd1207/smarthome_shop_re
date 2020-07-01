<template>
  <div>
    <div class="orderittle">
      <div class="goodsTitle">商品</div>
      <div class="priceTitle">单价</div>
      <div class="countTitle">数量</div>
      <div class="paymentTitle">总价</div>
      <table></table>
    </div>
    <div class="order_item" v-if="goodsInfo">
      <div class="order_goods" v-for="(goodsItem,index) in goodsInfo" :key="index">
        <div class="goods">
          <img v-lazy="goodsItem.pic_path" alt />
          <div>{{goodsItem.title}}</div>
        </div>
        <div class="goods_price">¥{{goodsItem.price}}</div>
        <div class="buy_count">x{{goodsItem.num}}</div>
        <div class="payment">¥{{goodsItem.total_fee}}</div>
      </div>
      <div class="order_address_total">
        <div class="address">
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
        </div>
        <div class="total">
          实付款:
          <strong>¥{{payment}}</strong>
        </div>
      </div>
    </div>
    <table></table>
  </div>
</template>

<script>
export default {
  props: {
    goodsInfo: Array,
    addressInfo: Object,
        payment: Number,
  }
};
</script>

<style scoped>

.order_item {
  margin-top: 5px;
  width: 900px;
  border: 1px solid #e5e5e5;
  background-color: white;
  position: relative;
}

.order_goods {
  height: 65px;
  padding: 10px;
  width: 900px;
  border-bottom: 1px solid #e5e5e5;
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
  width: 50px;
  height: 50px;
  float: left;
}
.goods div {
  float: left;
  word-wrap: break-word;
  width: 220px;
  text-align: left;
}
.order_address_total {
  padding: 12px;
  align-items: center;
  background-color: #fafafa;
  /* width: 500px; */
  display: flex;
  justify-content: space-between;

}
.address{
  width: 600px;
}
.address div{
  padding: 5px;
}
.total {
  width: 200px;
  text-align: right;
  font-size: 18px;
}
/*  */
.orderittle {
  /* border-top: 1px solid rgb(189, 189, 189); */
  padding: 10px;
  width: 900px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
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
  width: 440px;
}
.priceTitle,
.countTitle,
.paymentTitle {
  width: 180px;
}
.orderittle table {
  clear: both;
}
</style>