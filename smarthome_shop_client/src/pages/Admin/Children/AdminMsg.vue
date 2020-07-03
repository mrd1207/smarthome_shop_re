<template>
  <div id="adminMsg">
    <h1>消息提醒</h1>
    <el-card class="box-card" v-for="(item,index) in msg" :key="index">
      <div slot="header" class="clearfix">
        <span style="font-weight:500;">订单号：{{item.order_id}}</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="confirmRemind(item.order_id)"
        >确定</el-button>
      </div>
      <div class="msgbottom">
        <div>
          用户
          <span style="color:red;font-weight:500;">{{item.buyer_nick}}</span>提醒您发货！
        </div>
        <div class="timeStyle">{{item.remind_time}}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import fomat from "../../../plugins/date.format.js";
export default {
inject: ["reload"],

  data() {
    return {
      msg: []
    };
  },
  created() {
    this.$store.dispatch("receive_msg").then(res => {
      console.log(res.data.message);
      this.msg = res.data.message;
      for (let i = 0; i < this.msg.length; i++) {
        this.msg[i].remind_time = new Date(this.msg[i].remind_time).format(
          "yy-m-d H:i:s"
        );
      }
    });
  },
  methods: {
     confirmRemind(orderId) {

      let obj={
        order_id: orderId
      }
      
      this.$store
        .dispatch("confirmToRemind", obj)
        .then(res => {
          if (res.data.success_code === 200) {
            this.$message({
              type: "success",
              message: "已接受买家成功!"
            });
            this.reload();
          } else {
            this.$message({
              type: "success",
              message: "确认失败!"
            });
          }
        });
    }
  }
};
</script>

<style scoped>
.msgbottom {
  display: flex;
  justify-content: space-between;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  margin-top: 12px;
  width: 95%;
}
.timeStyle {
  color: #c0c4cc;
  font-size: 14px;
}
</style>