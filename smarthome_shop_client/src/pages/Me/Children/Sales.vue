<template>
  <div id="sales">
    <el-tabs v-model="tabName" style="height: 200px;" @tab-click="selTab">
      <el-tab-pane name="1" :label="orderToPay">
        <orderTitle></orderTitle>
        <payOrder
          v-for="(item,index) in orderToPayOrder"
          :key="index"
          :orderId="item.order_id"
          :payment="item.payment"
          :ctime="item.ctime"
          :goodsInfo="item.goodsInfo"
          :addressInfo="item.addressInfo"
        ></payOrder>
      </el-tab-pane>
      <el-tab-pane name="2" :label="payToReceive">
        <orderTitle></orderTitle>
        <payOrder
          v-for="(item,index) in payToReceiveOrder"
          :key="index"
          :orderId="item.order_id"
          :payment="item.payment"
          :ctime="item.ctime"
          :goodsInfo="item.goodsInfo"
          :addressInfo="item.addressInfo"
        ></payOrder>
      </el-tab-pane>
      <el-tab-pane name="3" :label="received">
        <orderTitle></orderTitle>
        <payOrder
          v-for="(item,index) in receivedOrder"
          :key="index"
          :orderId="item.order_id"
          :payment="item.payment"
          :ctime="item.ctime"
          :goodsInfo="item.goodsInfo"
          :addressInfo="item.addressInfo"
        ></payOrder>
      </el-tab-pane>
      <el-tab-pane name="4" :label="comment">
        <orderTitle></orderTitle>
        <payOrder
          v-for="(item,index) in commentOrder"
          :key="index"
          :orderId="item.order_id"
          :payment="item.payment"
          :ctime="item.ctime"
          :goodsInfo="item.goodsInfo"
          :addressInfo="item.addressInfo"
        ></payOrder>
      </el-tab-pane>
      <el-tab-pane name="5" :label="finishedOrder">
        <orderTitle></orderTitle>
        <payOrder
          v-for="(item,index) in order"
          :key="index"
          :orderId="item.order_id"
          :payment="item.payment"
          :ctime="item.ctime"
          :goodsInfo="item.goodsInfo"
          :addressInfo="item.addressInfo"
        ></payOrder>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";
import orderTitle from "../../../components/saleTitle/saleTitle.vue";
import payOrder from "../../../components/saleItem/pay-order.vue";

export default {
  created() {
    this.getOrder();
  },
  components: {
    orderTitle,
    payOrder
  },
  data() {
    return {
      tabName: "1",
      orderToPay: "待付款 (0)",
      payToReceive: "待发货 (0)",
      received: "已收货 (0)",
      comment: "待评价 (0)",
      finishedOrder: "全部订单 (0)",
      order: [],
      orderToPayOrder: [],
      payToReceiveOrder: [],
      receivedOrder: [],
      commentOrder: [],
      finishedOrder: [],
      addressInfo: {}
    };
  },
  methods: {
    getOrder() {
      let user_id = {
        user_id: JSON.parse(window.localStorage.getItem("userInfo")).id
      };
      this.$store.dispatch("getOrder", user_id).then(res => {
        console.log(res.data);
        let year = "";
        let time = "";
        let ctime = "";
        if (res.data.success_code === 200) {
          this.order = res.data.message;
          let orderToPayCount = 0;
          let payToReceiveCount = 0;
          let receivedCount = 0;
          let commentCount = 0;
          let finishedOrderCount = 0;
          for (let i = 0; i < this.order.length; i++) {
            // 根据订单号获取商品
            let order_id = {
              order_id: this.order[i].order_id
            };
            this.$store.dispatch("getAddressOrder", order_id).then(res => {
                console.log(res.data.message);
                this.order[i].addressInfo = res.data.message[0];
              });
            this.$store.dispatch("getItemOrder", order_id).then(res => {
              console.log("res.data.message: ", res.data.message);
              year = this.order[i].create_time.split("T")[0];
              time = this.order[i].create_time.split("T")[1].split(".")[0];
              ctime = year + " " + time;
              this.order[i].ctime = ctime;
              this.order[i].goodsInfo = res.data.message;

              
              console.log("this.order[i]: ", this.order[i]);
              // 分类
              if (this.order[i].status === 0) {
                orderToPayCount++;
                this.orderToPayOrder.push(this.order[i]);
                console.log("this.orderToPayOrder: ", this.orderToPayOrder);
              } else if (this.order[i].status === 1) {
                payToReceiveCount++;
                console.log("payToReceiveCount: ", payToReceiveCount);
                this.payToReceiveOrder.push(this.order[i]);
              } else if (this.order[i].status === 2) {
                receivedCount++;
                this.receivedOrder.push(this.order[i]);
              } else if (this.order[i].status === 3) {
                commentCount++;
                this.commentOrder.push(this.order[i]);
              } else if (this.order[i].status === 4) {
                finishedOrderCount++;
                this.finishedOrder.push(this.order[i]);
              }
              // 状态数量
              this.orderToPay = `待付款 (${orderToPayCount})`;
              this.payToReceive = `待发货 (${payToReceiveCount})`;
              this.received = `已收货 (${receivedCount})`;
              this.comment = `待评价 (${commentCount})`;
              this.finishedOrder = `全部订单 (${this.order.length})`;
            });
          }
        }
      });
    },
    selTab(tab, event) {
      // this.$router.push("/me/sales/" + tab.name);
    }
  }
};
</script>

<style scoped>
#sales {
  padding: 0px;
  width: 100%;
  height: 100%;
}
</style>
