<template>
  <div id="sales">
    <el-tabs v-model="tabName" style="height: 200px;" @tab-click="selTab">
      <!-- 待付款 -->
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
          :status="item.status"
          @orderChangeLeft="goPay($event)"
          @orderChangeRight="cancelOrder($event)"
        ></payOrder>
      </el-tab-pane>
      <!-- 待发货 -->
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
          :status="item.status"
          :pushGoods="item.pushGoods"
          v-model="item.disable"
          @orderChangeLeft="remindPush($event,index)"
        ></payOrder>
      </el-tab-pane>
      <!-- 待收货 -->
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
          :status="item.status"
          @orderChangeLeft="confirmReceive($event)"
          @orderChangeRight="getShippments($event)"
        ></payOrder>
        <el-dialog title="物流信息" :visible.sync="deliver" class="shipping">
          <div>物流类型：{{shiping_name}}</div>
          <div>物流号：{{shiping_code}}</div>
          <div class="block">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :color="activity.color"
                :timestamp="activity.timestamp"
              >{{activity.content}}</el-timeline-item>
            </el-timeline>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deliver = false">取 消</el-button>
            <el-button type="primary" @click="deliver = false">确 定</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
      <!-- 去评价 -->
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
          :status="item.status"
          :commentGoodsId="commentGoodsId"
          @orderChangeLeft="goToComment($event,index)"
        ></payOrder>
        <el-dialog title="评论" :visible.sync="isComment" class="shipping">
          <el-input type="textarea" :rows="2" placeholder="评论..." v-model="commentContent"></el-input>
          <el-rate v-model="rating" :colors="colors" show-score text-color="#ff9900"></el-rate>
          <span slot="footer" class="dialog-footer">
            <el-button @click="isComment = false">取 消</el-button>
            <el-button type="primary" @click="commented">确 定</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
      <!-- 所有订单 -->
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
          :status="item.status"
          @orderChangeLeft="viewDetails($event)"
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
  inject: ["reload"],
  created() {
    this.tabName = window.localStorage.getItem("activeTag");
    this.getOrder();
  },
  components: {
    orderTitle,
    payOrder
  },
  data() {
    return {
      shiping_name: "",
      shiping_code: "",
      activities: [],
      deliver: false,
      tabName: "1",
      orderToPay: "待付款 (0)",
      payToReceive: "待发货 (0)",
      received: "已发货 (0)",
      comment: "待评价 (0)",
      finishedOrder: "全部订单 (0)",
      order: [],
      orderToPayOrder: [],
      payToReceiveOrder: [],
      receivedOrder: [],
      commentOrder: [],
      finishedOrder: [],
      addressInfo: {},
      timeCount: [],
      countDown: 0,
      isComment: false,
      commentContent: "",
      rating: 0,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      order_id: "",
      tempIndex: 0,
      goodsIndex: 0,
      commentGoodsId: ""
    };
  },
  methods: {
    // 获取所有订单
    getOrder() {
      let user_id = {
        user_id: JSON.parse(window.localStorage.getItem("userInfo")).id
      };
      this.$store.dispatch("getOrder", user_id).then(res => {
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
              this.order[i].addressInfo = res.data.message[0];
            });
            this.$store.dispatch("getItemOrder", order_id).then(res => {
              year = this.order[i].create_time.split("T")[0];
              time = this.order[i].create_time.split("T")[1].split(".")[0];
              ctime = year + " " + time;
              this.order[i].ctime = ctime;
              this.order[i].goodsInfo = res.data.message;

              // 分类
              if (this.order[i].status === 0) {
                // 待付款
                orderToPayCount++;
                this.orderToPayOrder.push(this.order[i]);
              } else if (this.order[i].status === 1) {
                // 待发货
                payToReceiveCount++;
                // this.order[i].hasremind_time
                if (this.order[i].hasremind_time) {
                  this.order[i].hasremind_time = new Date(
                    this.order[i].hasremind_time
                  ).getTime();
                }
                let now_time = new Date().getTime();
                if (now_time - this.order[i].hasremind_time >= 0) {
                  this.order[i].pushGoods = "提醒发货";
                  this.order[i].disable = false;
                } else {
                  this.order[i].pushGoods = "已提醒发货,1小时后可再次提醒";
                  this.order[i].disable = true;
                }

                this.payToReceiveOrder.push(this.order[i]);
              } else if (this.order[i].status === 2) {
                // 已发货
                receivedCount++;
                this.receivedOrder.push(this.order[i]);
              } else if (this.order[i].status === 3) {
                // 待评价
                commentCount++;
                this.commentOrder.push(this.order[i]);
              } else if (this.order[i].status === 4) {
                // 全部订单
                finishedOrderCount++;
                this.finishedOrder.push(this.order[i]);
              }

              // 状态数量
              this.orderToPay = `待付款 (${orderToPayCount})`;
              this.payToReceive = `待发货 (${payToReceiveCount})`;
              this.received = `已发货 (${receivedCount})`;
              this.comment = `待评价 (${commentCount})`;
              this.finishedOrder = `全部订单 (${this.order.length})`;
            });
          }
          this.$store.commit("setOrderDetail", this.order);
        }
      });
    },
    selTab(tab) {
      window.localStorage.setItem("activeTag", tab.name);
    },
    // 去付款
    goPay(orderId) {
      this.$router.push("/pay/" + orderId);
    },
    // 取消订单
    cancelOrder(orderId) {
      this.$confirm("是否取消订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let status = `status=5&order_id=${orderId}`;
        this.$store.dispatch("updateOrder", status).then(res => {
          if (res.data.success_code === 200) {
            this.$message({
              type: "success",
              message: "取消订单成功!"
            });
            this.reload();
          } else {
            this.$message({
              type: "success",
              message: "取消订单失败!"
            });
          }
        });
      });
    },
    // 查看物流
    getShippments(orderId) {
      let order_id = {
        order_id: orderId
      };
      this.$store.dispatch("getOrderShipments", order_id).then(res => {
        this.activities = res.data.message;
      });
      this.$store.dispatch("getOrderShipmentsNum", order_id).then(res => {
        this.shiping_name = res.data.message[0].shipping_name;
        this.shiping_code = res.data.message[0].shipping_code;
      });
      this.deliver = true;
    },
    // 确认收货
    confirmReceive(order_id) {
      this.$confirm("是否确认收货?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let status = `status=3&order_id=${order_id}`;
        this.$store.dispatch("updateOrder", status).then(res => {
          if (res.data.success_code === 200) {
            this.$message({
              type: "success",
              message: "确认收货成功!"
            });
            this.reload();
          } else {
            this.$message({
              type: "success",
              message: "确认收货失败!"
            });
          }
        });
      });
    },
    // 提醒发货
    remindPush(order_id, index) {
      this.getRemind(order_id);
      this.payToReceiveOrder[index].disable = true;
      this.payToReceiveOrder[index].pushGoods = `已提醒发货,1小时后可再次提醒`;
      // 刷新el-tag
      this.tabName = "";
      this.tabName = "2";

      this.countDown = 60;
      this.intervalId = setInterval(() => {
        this.countDown--;
        // 判断
        if (this.countDown <= 0) {
          this.payToReceiveOrder[index].disable = false;
          this.payToReceiveOrder[index].pushGoods = `提醒发货`;
          this.tabName = "";
          this.tabName = "2";
          clearInterval(this.intervalId);
        }
      }, 1000);
    },
    getRemind(order_id) {
      let remindStatus = {
        order_id: order_id,
        buyer_message: 1
      };
      this.$store.dispatch("remindToPush", remindStatus).then(res => {
        if (res.data.success_code === 200) {
          let orderId = {
            order_id: order_id
          };
          this.$store.dispatch("hasRemindTime", orderId).then(res => {
            this.msg = res.data.message;
          });

          this.$message({
            type: "success",
            message: "提醒买家发货成功!"
          });
        } else {
          this.$message({
            type: "success",
            message: "提醒买家发货失败!"
          });
        }
      });
    },
    // 去评价
    goToComment(goodsObj, index) {
      this.isComment = true;
      this.order_id = goodsObj.orderId;
      this.tempIndex = index;
      this.goodsIndex = goodsObj.index;
    },
    // 已评价
    commented() {
      // 发送评价内容
      if (!this.commentContent) {
        this.$message({
          message: "评论内容不能为空",
          type: "warning"
        });
        return;
      }

      let commentObj = {
        goods_id: this.commentOrder[this.tempIndex].goodsInfo[this.goodsIndex]
          .item_id,
        comment_detail: this.commentContent,
        comment_rating: this.rating,
        user_id: JSON.parse(window.localStorage.getItem("userInfo")).id
      };
      this.$store.dispatch("postComment", commentObj).then(res => {
        if (res.success_code === 200) {
          this.commentContent = "";
          this.rating = 0;
          this.commentGoodsId = commentObj.goods_id;
          let isComment = 1;
          let commentStateObj = {
            order_id: this.order_id,
            goods_id: commentObj.goods_id,
            isComment: isComment
          };
          this.$store
            .dispatch("updateCommentState", commentStateObj)
            .then(res => {
              this.$message({
                message: "评论成功",
                type: "success"
              });
            });
          let commentCount = 1;
          for (
            let i = 0;
            i < this.commentOrder[this.tempIndex].goodsInfo.length;
            i++
          ) {
            if (
              this.commentOrder[this.tempIndex].goodsInfo[i].is_comment === 1
            ) {
              commentCount++;
            }
          }
          if (
            commentCount === this.commentOrder[this.tempIndex].goodsInfo.length
          ) {
            let status = `status=4&order_id=${this.order_id}`;
            this.$store.dispatch("updateOrder", status).then(res => {
              if (res.data.success_code === 200) {
                this.$message({
                message: "订单已完成",
                type: "success"
              });
              }
            });
          }
          this.isComment = false;
          this.reload();
          // 按钮变灰色
        } else {
          this.$message.error("评论失败");
        }
      });
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
.shipping div {
  padding: 10px;
}
.block {
  margin-top: 20px;
}
</style>
