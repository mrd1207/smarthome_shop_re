<template>
  <div class="header_nav">
    <div class="malltitle">O(∩_∩)O~ 欢迎来到智能家居商城！</div>

    <div class="linkStyle">
      <div class="disp">
        <div v-if="userInfo.user_name" class="userInfoo">
          <img class="user_avatar" :src="userInfo.user_avatar" alt />
          <el-link :underline="false" @click="goTo('/me')">{{userInfo.user_name}}</el-link>
        </div>
        <el-link v-else :underline="false" @click="goTo('/login')">去登录</el-link>

        <div class="gocate">
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link">
              智能分类
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="goTo('/category/1/1')">智能客厅</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="goTo('/category/2/1')">智能卧室</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="goTo('/category/3/1')">智能厨房</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="goTo('/category/4/1')">智能卫浴</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="goTo('/category/5/1')">智能门厅</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="gofast">
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link">
              快速通道
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="goCart">我的购物车</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="goTo('/home')">首页</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="goTo('/adminlogin')">管理员</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="goTo('/login')">重新登录</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="myinfo">
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link">
              个人信息
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="goTo('/me')">个人资料</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="goTo('/me/editpwd')">修改密码</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="goTo('/me/collection')">我的收藏</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="goTo('/me/sales')">我的订单</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="logout">退出登录</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
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
    goTo(path) {
      this.$router.replace(path);
    },
    goCart() {
      if (!this.userInfo.user_name) {
        this.$confirm("您还没登录，是否去登录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }).then(() => {
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
  width: 100%;
  background-color: #f5f5f5;
  height: 35px;
  position: fixed;
  top: 0;
  z-index: 1000;
}
.disp {
  display: flex;
  justify-content: space-between;
}
.disp  *{
  margin-right: 3px;
}
.linkStyle {
  width: 360px;
  position: absolute;
  right: 3px;
  bottom: 52%;
  transform: translate(0, 50%);
  display: flex;
  justify-content: space-between;
}
.el-link {
  color: black;
  font-weight: 400;
}
.malltitle {
  width: 260px;
  position: absolute;
  left: 10px;
  bottom: 52%;
  transform: translate(0, 50%);
  font-weight: 300;
  font-size: 15px;
}
.userInfoo {
  display: flex;
  line-height: 3px;
  margin-right: 10px;
}
.user_avatar {
  margin-right: 5px;
  width: 21px;
  height: 21px;
  border-radius: 50%;
}
.el-dropdown-link {
  cursor: pointer;
  font-weight: 400;
  font-size: 14px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
