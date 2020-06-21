<template>
  <div id="adminaddress">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="avatar-uploader-icon el-icon-plus" @click="addAddress"></div>
      </el-col>
      <el-col :span="8" v-for="(item,index) in address" :key="item">
        <el-card class="box-card" :body-style="{ padding: '20px' }" shadow="hover">
          <div slot="header" class="clearfix">
            <span>收货地址{{index+1}}</span>
            <el-button
              style="float: right; padding: 3px 0;margin-left:5px;"
              type="text"
              @click="onRead(item.real_name,item.tel,item.street_name,item.address_id,index)"
            >编辑</el-button>
            <el-button
              style="float: right; padding: 3px 0; color:#F56C6C;"
              type="text"
              @click="delAddress(item.address_id)"
            >删除</el-button>
          </div>
          <div class="text item">收件人：{{item.real_name}}</div>
          <div class="text item">联系电话：{{item.tel}}</div>
          <div class="text item">地址：{{item.area_name}}{{item.street_name}}</div>
        </el-card>
        <el-dialog :visible.sync="editAddress" title="收货地址">
          <el-form>
            <el-form-item label="收件人" :label-width="formLabelWidth">
              <el-input v-model="dialogInfo.real_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" :label-width="formLabelWidth">
              <el-input v-model="dialogInfo.tel" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="地址" :label-width="formLabelWidth">
              <v-distpicker
                @selected="onSelected"
                :province="select[dialogInfo.i].province"
                :city="select[dialogInfo.i].city"
                :area="select[dialogInfo.i].area"
              ></v-distpicker>
              <el-input v-model="dialogInfo.street_name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editAddress = false">取 消</el-button>
            <el-button type="primary" @click="editAddressInfo()">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VDistpicker from "v-distpicker";
import { mapState } from "vuex";
export default {
  data() {
    return {
      editAddress: false,
      area_address: "",
      address: [],
      select: [],
      formLabelWidth: "100px",
      dialogInfo: {
        real_name: "",
        tel: "",
        street_name: "",
        address_id: 1,
        i: 1
      },
      isAdd: false
    };
  },
  created() {
    this.getAddressInfo();
  },
  components: { VDistpicker },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    // 获取后端收货地址
    getAddressInfo() {
      let userId = {
        user_id: this.userInfo.id
      };
      this.$store.dispatch("getAddress", userId).then(res => {
        console.log(res.data.message);
        if (res.data.success_code === 200) {
          this.$store.commit("setUserAddress", res.data.message);
          this.address = res.data.message;
          this.select[0] = { province: "", city: "", area: "" };
          for (let i = 0; i < this.address.length; i++) {
            let selectArea = new Object();
            selectArea.province = this.address[i].area_name.split(" ")[0];
            selectArea.city = this.address[i].area_name.split(" ")[1];
            selectArea.area = this.address[i].area_name.split(" ")[2];
            this.select[i + 1] = selectArea;
          }
        }
      });
    },
    // 将对应卡片的值保存到data，可以在对话框中取得相应的值
    onRead(real_name, tel, street_name, address_id, index) {
      this.dialogInfo.real_name = real_name;
      this.dialogInfo.tel = tel;
      this.dialogInfo.street_name = street_name;
      this.dialogInfo.i = index + 1;
      this.dialogInfo.address_id = address_id;
      this.editAddress = true;
    },
    onSelected(val) {
      this.area_address = `${val.province.value} ${val.city.value} ${val.area.value} `;
    },
    editAddressInfo() {
      if (this.isAdd) {
        this.isAdd = false;
        let addAddressParams = `id=${this.userInfo.id}&real_name=${this.dialogInfo.real_name}&tel=${this.dialogInfo.tel}&area_name=${this.area_address}&street_name=${this.dialogInfo.street_name}`;
        this.$store.dispatch("addAddress", addAddressParams).then(res => {
          if (res.data.success_code === 200) {
            this.getAddressInfo();
            this.editAddress = false;
          }
        });
      } else {
        let addressParams = `real_name=${this.dialogInfo.real_name}&tel=${this.dialogInfo.tel}&street_name=${this.dialogInfo.street_name}&address_id=${this.dialogInfo.address_id}`;
        this.$store.dispatch("updateAddress", addressParams).then(res => {
          if (res.data.success_code === 200) {
            this.getAddressInfo();
            this.editAddress = false;
          }
        });
      }
    },
    // 删除地址
    delAddress(address_id) {
      let addressParams = `address_id=${address_id}`;
      this.$store.dispatch("delAddress", addressParams).then(res => {
        if (res.data.success_code === 200) {
          this.getAddressInfo();
        }
      });
    },
    // 添加地址
    addAddress() {
      // 初始化
      this.dialogInfo = {
        real_name: "",
        tel: "",
        street_name: "",
        address_id: 1,
        i: 0
      };
      this.select[0].province = "";
      this.select[0].city = "";
      this.select[0].area = "";
      this.editAddress = true;
      this.isAdd = true;
    }
  }
};
</script>

<style scoped>
.text {
  font-size: 14px;
  color: #606266;
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
  margin-top: 10px;
  min-height: 229px;
}
.avatar-uploader-icon {
  margin-top: 12px;
  font-size: 50px;
  color: #8c939d;
  width: 100%;
  min-height: 226px;
  line-height: 215px;
  text-align: center;
  border-radius: 5px;
  border: dashed 1px #8c939d;
}
</style>

