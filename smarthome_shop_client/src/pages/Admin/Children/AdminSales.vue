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
        :filters="[{ text: '待付款', value: '待付款' }, { text: '待发货', value: '待发货' }, { text: '已发货', value: '已发货' }]"
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
          <el-tag
            v-else-if="scope.row.status === '已发货'"
            type="warning"
            disable-transitions
          >{{scope.row.status}}</el-tag>
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

      <!-- 订单状态操作 -->

      <el-table-column label="操作" min-width="150">
        <!-- 订单搜索框 -->
        <template slot="header">
          <el-input v-model="searchKey" size="mini" placeholder="输入关键字搜索" />
        </template>
        <!-- 订单操作按钮 -->
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === '待发货'" size="small" @click="deliverGoods(scope.row)">发货</el-button>
          <el-button
            v-else-if="scope.row.status === '已发货'"
            size="small"
            @click="getLogistics(scope.row)"
            type="warning"
          >物流</el-button>
          <el-button v-else type="primary" size="small" @click="toogleExpandCargo(scope.row)">详情</el-button>
          <el-button type="danger" size="small" @click="handleClick(scope.row)">修改地址</el-button>

          <!-- 对话框 -->
          <!-- 修改地址对话框 -->
          <el-dialog :visible.sync="editAddress" title="收货地址">
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
          <!-- 发货物流对话框 -->
          <el-dialog title="发货" :visible.sync="shipments" width="40%">
            <el-form>
              <el-form-item label="发货类型" :label-width="formLabelWidth">
                <el-select v-model="shipType" placeholder="请选择发货类型">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="shipments = false">取 消</el-button>
              <el-button type="primary" @click="changeStatus()">确 定</el-button>
            </div>
          </el-dialog>
          <!-- 查看物流 -->
          <el-dialog title="物流信息" :visible.sync="deliver">
            <div>物流类型：{{shipping_name}}</div>
            <div>物流号：{{shipping_code}}</div>
            <div class="block">
              <el-timeline>
                <el-timeline-item
                  v-for="(activity, index) in activities"
                  :key="index"
                  :icon="activity.icon"
                  :type="activity.type"
                  :color="activity.color"
                  :size="activity.size"
                  :timestamp="activity.timestamp"
                >{{activity.content}}</el-timeline-item>
              </el-timeline>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="deliver = false">取 消</el-button>
              <el-button type="primary" @click="deliver = false">确 定</el-button>
            </span>
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
import fomat from "../../../plugins/date.format.js"
export default {
  data() {
    return {
      options: [
        {
          value: "顺丰快递",
          label: "顺丰快递"
        },
        {
          value: "圆通快递",
          label: "圆通快递"
        },
        {
          value: "申通快递",
          label: "申通快递"
        },
        {
          value: "中通快递",
          label: "中通快递"
        },
        {
          value: "韵达快递",
          label: "韵达快递"
        }
      ],
      shipType: "顺丰快递",
      shipping_name:"",
      shipping_code:"",
      orderData: [],
      activeIndex: 1, // 当前页码
      pageSize: 10,
      orderCounts: 0,
      editAddress: false,
      shipments: false,
      deliver: false,
      select: [],
      dialogInfo: {},
      order_id: "",
      formLabelWidth: "100px",
      activities: [{
          content: '您的包裹已从仓库发出',
          timestamp: '2020-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: '#0bbd87'
        }, {
          content: '快递已到达',
          timestamp: '2020-04-03 20:46',
          color: '#0bbd87'
        }, {
          content: '快递已到达',
          timestamp: '2020-04-03 20:46',
          color: '#0bbd87'
        },{
          content: '已签收',
          timestamp: '2020-04-03 20:46',
          size: 'large'
        }]
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
    deliverGoods(row) {
      this.shipments = true;
      this.order_id = row.order_id;
    },
    changeStatus() {
      this.shipments = false;
      let status = `status=2&order_id=${this.order_id}&shipping_name=${this.shipType}`;
      console.log('row.order_id: ', this.order_id);
      this.$store.dispatch("updateOrder", status).then(res => {
        if (res.data.success_code === 200) {
          this.getOrderData();
          this.$message({
            type: "success",
            message: "发货成功!"
          });
        } else {
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
      this.dialogInfo.receiver_city = val.province.value;
      this.dialogInfo.receiver_district = val.city.value;
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
    // 物流
    getLogistics(row) {
      this.deliver = true;
      this.shipping_name= row.shipping_name;
      this.shipping_code=row.shipping_code;

      this.activities[1].content="快递已到达"+row.addressInfo.receiver_city+" "+row.addressInfo.receiver_district + "中转部";
      this.activities[2].content="快递已到达"+row.addressInfo.receiver_address+",正在派送中";
      // 发货时间
      let fir_time = new Date(row.update_time).format("yy-m-d h:i:s");
      // 途中时间
      let sec_time = new Date(fir_time);
      sec_time = sec_time.setDate(sec_time.getDate()+1);
      sec_time=new Date(sec_time).format("yy-m-d h:i:s");
      // 派送时间
      let thr_time = new Date(sec_time);
      thr_time = thr_time.setHours(thr_time.getHours()+18);
      thr_time = new Date(thr_time).format("yy-m-d h:i:s");
      // 签收时间
      let cosign_time = new Date(thr_time);
      cosign_time = cosign_time.setHours(cosign_time.getHours()+5);
      cosign_time = new Date(cosign_time);
      cosign_time = cosign_time.setMinutes(cosign_time.getMinutes()+21);
      cosign_time = new Date(cosign_time);
      cosign_time = cosign_time.setSeconds(cosign_time.getSeconds()+21);
      cosign_time = new Date(cosign_time).format("yy-m-d h:i:s");

      this.activities[0].timestamp=fir_time;
      this.activities[1].timestamp=sec_time;
      this.activities[2].timestamp=thr_time;
      this.activities[3].timestamp=cosign_time;

      

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
.block{
  margin-top: 20px;
}
</style>
