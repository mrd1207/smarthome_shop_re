<template>
  <div class="header_nav">
    <div class="linkStyle">
      <el-link type="primary" :underline="false" @click="goHome">返回首页</el-link>&nbsp;&nbsp;&nbsp;&emsp;
      <el-link
        v-if="userInfo.user_name"
        type="primary"
        :underline="false"
        @click="goMe"
      >{{userInfo.user_name}}</el-link>
      <el-link v-else type="primary" :underline="false" @click="goLogin">去登录</el-link>&nbsp;&nbsp;&nbsp;&emsp;
      <el-link type="primary" :underline="false" @click="logout">退出登录</el-link>&nbsp;&nbsp;&nbsp;&emsp;
      <el-link type="primary" :underline="false" @click="goCart">我的购物车</el-link>&nbsp;&nbsp;&nbsp;&emsp;
      <el-link type="primary" :underline="false"  @click="goAdmin">管理员通道</el-link>
    </div>
    <div class="myinfo">
      <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
          个人信息
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>查看个人资料</el-dropdown-item>
          <el-dropdown-item>修改密码</el-dropdown-item>
          <el-dropdown-item>修改个人信息</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    goLogin() {
      this.$router.replace("/login");
    },
    goMe() {
      this.$router.replace("/me");
    },
    goHome(){
      this.$router.push("/home");
    },
    goAdmin(){
      this.$router.push("/adminlogin");
    },
    goCart() {
      if (!this.userInfo.user_name) {
        this.$confirm("您还没登录，是否去登录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this.$router.replace("/login");
          });
      } else {
        this.$router.replace("/shopcar");
        
      }
    },
    logout() {
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("reqLogOut").then(code => {
          if (code == 200) {
            // let result = this.logOut({});
            window.localStorage.removeItem("userInfo");
            this.$message({
              type: "success",
              message: "已退出登录!"
            });
            this.$router.go(0);
          } else {
            this.$message.error("退出失败");
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.header_nav {
  margin-top: 0px;
  width: 100%;
  background-color: #f5f5f5;
  height: 35px;
  position: relative;
}
.myinfo {
  position: absolute;
  right: 1%;
  bottom: 50%;
  transform: translate(0, 50%);
}
.linkStyle {
  position: absolute;
  right: 10%;
  bottom: 50%;
  transform: translate(0, 50%);
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
/*头部导航*/
/* .header_nav {
  width: 100%;
  height: 30px;
  background: #f2f2f2;
  font-family: "Microsoft YaHei";

  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header_nav > div {
  display: flex;
  align-items: center;
}
.header_nav > div p {
  margin: 0 30px 0 20px;
  color: #999;
  font-size: 15px;
}
.locationWrapper {
  position: relative;
  max-width: 100px;

  display: flex;
  align-items: center;
}
.locationWrapper .el-cascader {
  position: absolute;
  opacity: 0;
}
.locationWrapper .address {
  max-width: 58px;
  font-size: 12px;
  color: #999;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.locationWrapper .icon {
  margin: 0 3px;
  width: 15px;
  height: 15px;
  vertical-align: middle;
}
.locationWrapper .icon path {
  fill: #dd6161;
}
.header_nav > ul {
  margin: 0 50px;
  list-style: none;

  display: flex;
  align-items: center;
}
.header_nav > ul > li:first-child {
  font-size: 14px;
  color: red;
  line-height: 20px;
  cursor: pointer;
}
.header_nav > ul > li > a {
  display: inline-block;
  padding: 5px 15px;
  font-size: 12px;
  line-height: 20px;
  color: #999;
  text-decoration: none;
  cursor: pointer;
}
.header_nav > ul > li > a:hover {
  color: red;
}
.header_nav > ul > li:first-child > a:nth-child(2) {
  padding-left: 0;
  color: red;
} */
</style>
