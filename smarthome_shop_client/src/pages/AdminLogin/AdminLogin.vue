<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../../common/img/logo-round.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="80px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="account" label="用户名">
          <el-input v-model="loginForm.account" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        account: '',
        password: ''
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        account: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ]
      },
    }
  },
 
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      
    },

    login() {
       if (!this.loginForm.account) {

          this.$alert('请输入账号!', '提示', {
          confirmButtonText: '确定',
        });
          return;
        } else if (!this.loginForm.password) {
          this.$alert('请输入密码!', '提示', {
          confirmButtonText: '确定'
        });
          return;
        }
      let params=`account=${this.loginForm.account}&pwd=${this.loginForm.password}`   
     this.$store.dispatch('getAdminLogin',params).then(res=>{
       console.log(res.data);
       if(res.data.success_code==200){
        window.localStorage.setItem("adminInfo",JSON.stringify(this.loginForm));
        this.$router.replace('/admin');
      }else{
        this.$alert('用户名或密码不正确!', '提示', {
          confirmButtonText: '确定',
      })
      }
     })
      
    }
  }
}
</script>

<style scoped>
.login {
  height: 100%;
  background-color: black;
}
.login_box {
  width: 400px;
  height: 350px;
  background-color: #fff;
  border-radius: 3px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 100px;
  width: 100px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  overflow: hidden;
}
.avatar_box img {
  width: 100px;
  height: 100px;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.captchaStyle {
  display: flex;
  justify-content: space-between;
}
.captchaStyle img {
  height: 40px;
  width: 130px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
