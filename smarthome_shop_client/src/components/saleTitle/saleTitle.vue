<template>
  <div class="orderittle">
    <div class="goodsTitle">商品</div>
    <div class="priceTitle">单价</div>
    <div class="countTitle">数量</div>
    <div class="paymentTitle">总价</div>
    <div class="tradeTitle">交易操作</div>
    <table></table>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.orderittle {
  /* border-top: 1px solid rgb(189, 189, 189); */
  padding: 10px;
  width: 860px;
  background-color: #f5f5f5;
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
  width: 335px;
}
.priceTitle,
.countTitle,
.paymentTitle {
  width: 100px;
}
.tradeTitle {
  width: 225px;
}
.orderittle table {
  clear: both;
}
</style>