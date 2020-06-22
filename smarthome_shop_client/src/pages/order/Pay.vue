<template>
  <div id="pay">
    <div class="headerInfo">
      <div class="headerdemo">
        <img src="../../../static/image/alicode.jpg" alt />
        <div class="headerleft">
          <div class="subTitle">订单提交成功，请尽快付款！</div>
          <div class="subnum">您的订单号为：{{currentOrderId}}</div>
        </div>
      </div>
      <div class="totalCss">
        应付金额:
        <span><strong>{{total}}元</strong></span>
      </div>
    </div>

    <el-steps :active="2" finish-status="success">
      <el-step class="elstep" title="购物车"></el-step>
      <el-step title="确认订单"></el-step>
      <el-step title="支付"></el-step>
    </el-steps>
    <div class="timeCss">
      请您在
      <span class="timeSty">{{CountDown}}</span>内完成支付，否则订单会被自动取消
    </div>
    <div class="posBot">
      <div class="pay-type">
        <div class="payimg">
          <div class="p-title">支付方式 :</div>
          <img src="../../../static/image/alipay@2x.png" alt />
          <img src="../../../static/image/weixinpay@2x.png" alt />
        </div>
        <el-button type="primary" @click="confirmPay">确认支付</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.currentOrderId = Number(this.$route.params.order_id);
    // 获取总价和更新状态
    let order_id = {
      order_id: this.currentOrderId
    };
    console.log("order_id: ", order_id);

    this.$store.dispatch("getTotal", order_id).then(res => {
      this.total = res.data.message.payment;
      console.log('sddwres.data.message: ', res.data.message);
    });
  },
  mounted() {    
    this.time();
    
  },
  data() {
    return {
      payType: 1,
      currentOrderId: "",
      CountDown: "",
      total: 0,
      timeFlag:true
    };
  },
  methods: {
    time() {
      let time = 1800;
      console.log(`xxsxssxaa:`,window.sessionStorage.getItem('time'));
      if(window.sessionStorage.getItem('time')){
        time=window.sessionStorage.getItem('time');
      }
      let count = setInterval(() => {

        if(!this.timeFlag){
          clearInterval(count);
          console.log("出去了吗");
        }else{
          window.sessionStorage.setItem('time',time);
        }
        time--;

        let minute = parseInt(time / 60);
        let second = parseInt(time % 60);
        let mt = "";
        let st = "";
        if (minute < 10) {
          mt = "0";
        }
        if (second < 10) {
          st = "0";
        } 
        this.CountDown = mt + minute + "分" + st + second + "秒";
        if (time === 0) {

          window.sessionStorage.removeItem('time');
          clearInterval(count);
            this.$alert("订单已过期", "提示", {
            confirmButtonText: "返回首页"
          })
            .then(() => {
              this.$router.replace("/home");
            })
            .catch(() => {
              this.$router.replace("/home");
            });
          
        }
      }, 1000);
    },
    confirmPay() {
      let userId = JSON.parse(window.localStorage.getItem("userInfo")).id;
      console.log('userId: ', userId);
      console.log("userId: ", userId);
      this.$prompt("请输入密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "密码格式不正确"
      }).then(({ value }) => {
        let confirmPwdParams = {
          user_id: userId,
          input_Pwd: value
        };
        this.$store.dispatch("confirmPayPwd", confirmPwdParams).then(res => {
          if (res.data.success_code === 200) {
            if(window.sessionStorage.getItem('time')){
              window.sessionStorage.removeItem("time");
              this.timeFlag=false;
            }
            this.$message({
              type: "success",
              message: "成功"
            });
            let status = `status=1&order_id=${this.currentOrderId}`;
            this.$store.dispatch("updateOrder", status).then(res => {
              if (res.data.success_code === 200) {
                this.$router.replace("/finish_pay");
              }
            });
          }
        });
      });
    }
  }
};
</script>

<style scoped>
#pay {
  width: 666px;
  height: 350px;
  background-color: seashell;
  position: relative;
  margin: 0 auto;
  margin-top: 30px;
  padding: 16px;
  border: solid 1px red;
}
.headerInfo {
  display: flex;
  justify-content: space-between;
}
.headerdemo img {
  width: 100px;
}
.headerdemo {
  display: flex;
}
.subTitle {
  font-size: 21px;
  font-weight: 500;
}
.subnum {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 350;
  font: 14px/1.3 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
}
.totalCss span {
  font-weight: 700;
  font-size: 18px;
  color: #f40;
  font: 18px/1.3 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
}
.totalCss{
font: 18px/1.3 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;

}
.pay-type {
  width: 650px;
  display: flex;
  justify-content: space-between;
}
.headerleft {
  margin-left: 21px;
  line-height: 30px;
}

.timeCss {
  margin-top: 50px;
  font: 13px/1.3 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
}
.timeSty {
  color: red;
  font: 13px/1.3 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
  
}
.posBot {
  position: absolute;
  bottom: 35px;
  /* padding: 10px; */
}
.p-title {
  align-self: center;
  font: 16px/1.3 tahoma, arial, Hiragino Sans GB, \\5b8b\4f53, sans-serif;
  color: #666;
}
.payimg {
  display: flex;
}
/*支付类型*/
.payimg img {
  width: 170px;
}
.el-steps{
  margin-top: 40px;
}
</style>