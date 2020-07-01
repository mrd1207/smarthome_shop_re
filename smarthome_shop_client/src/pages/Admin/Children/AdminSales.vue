<template>
  <div class="sale">
    <el-table :data="orderData" border style="width: 100%" ref="cargoTable">
      <el-table-column prop="date" width="50" type="selection"></el-table-column>
      <el-table-column type="expand" label="详情" width="50">
        <template slot-scope="props">
          <orderDetail
            :goodsInfo="props.row.goodsInfo"
            :addressInfo="props.row.addressInfo"
            :payment="props.row.payment"
          ></orderDetail>
        </template>
      </el-table-column>
      <el-table-column prop="order_id" label="订单号" width="145" sortable></el-table-column>
      <el-table-column prop="buyer_nick" label="用户名" width="100" sortable></el-table-column>
      <el-table-column prop="create_time" label="下单时间" width="165" sortable></el-table-column>
      <el-table-column prop="payment" label="订单金额" width="105" sortable></el-table-column>
      <el-table-column prop="payment" label="支付金额" width="105" sortable></el-table-column>
      <el-table-column
        prop="status"
        label="订单状态"
        width="105"
        :filters="[{ text: '待付款', value: '待付款' }, { text: '待发货', value: '待发货' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.status === '待付款'"
            type="danger"
            disable-transitions
          >{{scope.row.status}}</el-tag>
          <el-tag v-else-if="scope.row.status === '待发货'" disable-transitions>{{scope.row.status}}</el-tag>
          <el-tag v-else-if="scope.row.status === '已发货'" type="warning" disable-transitions>{{scope.row.status}}</el-tag>
          <el-tag
            v-else-if="scope.row.status === '已签收'"
            type="warning"
            disable-transitions
          >{{scope.row.status}}</el-tag>
          <el-tag
            v-else-if="scope.row.status === '交易完成'"
            type="success"
            disable-transitions
          >{{scope.row.status}}</el-tag>
          <el-tag
            v-else-if="scope.row.status === '交易关闭'"
            type="info"
            disable-transitions
          >{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot="header">
          <el-input v-model="searchKey" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === '待发货'"
            size="small"
            @click="changeStatus(scope.row)"
          >发货</el-button>
          <el-button v-else type="primary" size="small" @click="toogleExpandCargo(scope.row)">详情</el-button>
          <el-button type="primary" size="small" @click="handleClick(scope.row)">修改地址</el-button>
          <el-dialog :visible.sync="editAddress" title="收货地址">
            <!-- {{scope.row.addressInfo.receiver_name}} -->
            <el-form>
              <el-form-item label="收件人" :label-width="formLabelWidth">
                <el-input v-model="dialogInfo.receiver_name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" :label-width="formLabelWidth">
                <el-input v-model="dialogInfo.receiver_phone" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="地址" :label-width="formLabelWidth">
                <v-distpicker
                  hide-area
                  @selected="onSelected"
                  :province="dialogInfo.receiver_city"
                  :city="dialogInfo.receiver_district"
                ></v-distpicker>
                <el-input v-model="dialogInfo.receiver_address" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editAddress = false">取 消</el-button>
              <el-button type="primary" @click="editAddressInfo()">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->

    <div class="footer">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="activeIndex"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="orderCounts"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import VDistpicker from "v-distpicker";
import orderDetail from "../../../components/orderDetail/orderDetail.vue";
export default {
  data() {
    return {
      orderData: [],
      activeIndex: 1, // 当前页码
      pageSize: 10,
      orderCounts: 0,
      editAddress: false,
      dialogFormVisible: false,
      select: [],
      dialogInfo: {},
      order_id: "",
      formLabelWidth: "100px"
    };
  },

  components: {
    orderDetail,
    VDistpicker
  },
  created() {
    this.activeIndex = Number(this.$route.params.pageNum);
    this.getOrderData();
  },
  methods: {
    getOrderData() {
      this.$store
        .dispatch("getUserOrder", {
          pageNo: this.activeIndex,
          count: this.pageSize
        })
        .then(res => {
          console.log(res.data);
          this.orderData = res.data.message;

          this.orderCounts = res.data.counts;
          for (let i = 0; i < this.orderData.length; i++) {
            let order_id = {
              order_id: this.orderData[i].order_id
            };

            this.$store.dispatch("getItemOrder", order_id).then(res => {
              console.log("res.data.message: ", res.data.message);
              this.orderData[i].goodsInfo = res.data.message;
            });
            this.$store.dispatch("getAddressOrder", order_id).then(res => {
              console.log(res.data.message);
              this.orderData[i].addressInfo = res.data.message[0];
            });
            let time = this.orderData[i].create_time.split("T");
            this.orderData[i].create_time =
              time[0] + " " + time[1].split(".")[0];
            switch (this.orderData[i].status) {
              case 0:
                this.orderData[i].status = "待付款";
                break;
              case 1:
                this.orderData[i].status = "待发货";
                break;
              case 2:
                this.orderData[i].status = "已发货";
                break;
              case 3:
                this.orderData[i].status = "已签收";
                break;
              case 4:
                this.orderData[i].status = "交易完成";
                break;
              case 5:
                this.orderData[i].status = "交易关闭";
                break;
            }
            this.orderData[i].check = false;
          }
          console.log("this.orderData: ", this.orderData);
        });
    },
    handleClick(row) {
      console.log(row);
      this.editAddress = true;
      this.dialogInfo = row.addressInfo;
      this.order_id = row.order_id;
    },
    changeStatus(row) {
      let status = `status=2&order_id=${row.order_id}`;
        this.$store.dispatch("updateOrder", status).then(res => {
          if (res.data.success_code === 200) {
            this.getOrderData();
            this.$message({
              type: "success",
              message: "发货成功!"
            });
            // this.getOrder();
            // this.reload();
          }else{
            this.$message({
              type: "success",
              message: "发货失败!"
            });
          }
        });
    },
    handleCurrentChange(index) {
      this.$store.dispatch("getUserOrder", {
        pageNo: index
      });
      this.activeIndex = index;
      this.getOrderData();
      this.$router.replace("/admin/adminsales/" + this.activeIndex);
    },
    filterTag(value, row) {
      return row.status === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    onSelected(val) {
      this.dialogInfo.receiver_city=val.province.value;
      this.dialogInfo.receiver_district=val.city.value;
    },
    editAddressInfo() {
      let addressParams = {
        address: this.dialogInfo,
        order_id: this.order_id
      };
      this.$store.dispatch("updateOrderAddress", addressParams).then(res => {
        console.log("res.data: ", res.data);
        if (res.data.success_code === 200) {
          this.editAddress = false;
        } else {
        }
      });
    },
    // 详情按钮展开
    toogleExpandCargo(row) {
      let $table = this.$refs.cargoTable;
      this.orderData.map(item => {
        if (row.id != item.id) {
          $table.toggleRowExpansion(item, false);
        }
      });
      $table.toggleRowExpansion(row);
    },
    searchKey() {}
  }
};
</script>
<style scoped>
.demo-table-expand {
  font-size: 0;
  font-weight: 500;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.footer {
  /* margin-top: 21px;
  margin-bottom: 21px; */
  padding: 21px;
  position: relative;
}
.el-pagination {
  position: absolute;
  right: 1%;
  bottom: 5%;
}
</style>
