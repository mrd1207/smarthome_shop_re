<template>
  <div class="user-detail">
    <el-form ref="form" label-width="80px">
      <el-form-item label="头像">

        <el-upload
          v-if="editUserInfo"
          class="avatar-uploader"
          action
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-change="handleAvatarChange"
        >
          <img v-if="user_avatar" :src="userInfo.user_avatar" class="avatar" />
          <img v-else src="../images/no_login.jpg" class="avatar" />
        </el-upload>
        <img v-else-if="userInfo.user_avatar" :src="userInfo.user_avatar" class="avatar" />
        <img v-else src="../images/no_login.jpg" class="avatar" />
      </el-form-item>
      <el-form-item label="用户名">
        <span>{{userInfo.user_name}}</span>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-if="editUserInfo" v-model="user_nickname"></el-input>
        <span v-else>{{userInfo.user_nickname||"暂无填写"}}</span>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-if="editUserInfo" v-model="user_phone"></el-input>
        <span v-else>{{userInfo.user_phone||"暂无填写"}}</span>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          v-if="editUserInfo"
          v-model="user_birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
        <span v-else>{{userInfo.user_birthday||"暂无填写"}}</span>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-if="editUserInfo" v-model="user_sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
        <span v-else>{{userInfo.user_sex||"暂无填写"}}</span>
      </el-form-item>
      <el-form-item label="常住地">
        <div v-if="editUserInfo">
          <v-distpicker @selected="onSelected"></v-distpicker>
          <el-input v-model="user_address"></el-input>
        </div>
        <span v-else>{{userInfo.user_address||"暂无填写"}}</span>
      </el-form-item>
      <el-form-item label="个性签名">
        <el-input v-if="editUserInfo" v-model="user_sign"></el-input>
        <span v-else>{{userInfo.user_sign||"暂无填写"}}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">编辑个人资料</el-button>
        <el-button v-show="editUserInfo" @click="finished">完成</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";
import VDistpicker from "v-distpicker";

export default {
  data() {
    return {
      user_sign: "",
      select: { province: 130000, city: 130300, area: 130321 },
      user_address: "",
      user_nickname: "",
      user_sex: "",
      user_phone: "",
      user_birthday: "",
      user_avatar: null,
      editUserInfo: false
    };
  },
  components: { VDistpicker },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {},
  methods: {
    onSelected(val) {
      let area_address = `${val.province.value} ${val.city.value} ${val.area.value} `;
      // console.log('address: ', address);
      this.user_address = area_address;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleAvatarChange(file, fileList) {
      this.userInfo.user_avatar = URL.createObjectURL(file.raw);
      this.user_avatar = file.raw;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 点击编辑按钮
    onSubmit() {
      this.editUserInfo = true;
      this.user_avatar = this.userInfo.user_avatar;
      this.user_nickname = this.userInfo.user_nickname;
      this.user_phone = this.userInfo.user_phone;//mark
      this.user_sex = this.userInfo.user_sex;
      this.user_address = this.userInfo.user_address;
      this.user_sign = this.userInfo.user_sign;
      this.user_birthday=this.userInfo.user_birthday;
      // 把后端的时间给日期插件
    },
    // 编辑完成
    finished() {
      this.editUserInfo = false;
      let formData = new FormData();
      formData.append("id", this.userInfo.id);
      formData.append("user_nickname", this.user_nickname);
      formData.append("user_sex", this.user_sex);
      formData.append("user_address", this.user_address);
      formData.append("user_birthday", this.user_birthday);
      formData.append("user_sign", this.user_sign);
      formData.append("user_phone", this.user_phone);
      if (this.user_avatar) {
        formData.append("user_avatar", this.user_avatar);
      }
      let userId = {
        user_id: this.userInfo.id
      };
      this.$store.dispatch("updateUserInfo", formData).then(rescode => {
        console.log('rescode: ', rescode.data);
        this.$store.dispatch("getUserInfo", userId).then(res => {
          console.log('res: ', res.data);
          if (rescode.success_code === 200) {
            // 更新vuex中的用户数据
            this.$store.commit("setUserInfo", res.message);
            // 更新浏览器中localstorage中的用户数据
            window.localStorage.setItem(
              "userInfo",
              JSON.stringify(res.message)
            );
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.avatar-uploader {
  position: relative;
  width: 60px;
  height: 60px;
}

.avatar-uploader /deep/ .el-upload.el-upload--text {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
}

.el-form-item__content img,
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
</style>

