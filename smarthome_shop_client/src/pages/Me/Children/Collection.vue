<template>
  <div class="pro">
    <el-card
      v-for="(item,index) in collist"
      :key="index"
      :body-style="{ padding: '0px'}"
      class="cardStyle"
      shadow="hover"
    >
      <img v-lazy="item.goods_pic" class="image" @click="goDetail(item.goods_id)" />
      <div class="shortName">{{ item.goods_name }}</div>
      <div class="p_bottom">
        <div class="cart-bottom">
          <span class="price">{{ item.goods_price | moneyFormat }}</span>
          <el-button type="text" class="button" @click="goDetail(item.goods_id)">查看详情</el-button>
          <el-button type="text" class="button" @click="delColl(item.goods_id)">删除</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      collist: []
    };
  },
  created() {
    this.getCollectionInfo();
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    getCollectionInfo() {
      let userId = {
        user_id: this.userInfo.id
      };
      this.$store.dispatch("getCollection", userId).then(res => {
        console.log(res.data.message);
        if (res.data.success_code === 200) {
          this.collist = res.data.message;
        }
      });
    },
    goDetail(id) {
      this.$router.replace("/goods/" + id);
    },
    delColl(goods_id) {
      this.$store
        .dispatch("delCollection", {
          goods_id: goods_id,
          user_id: this.userInfo.id
        })
        .then(res => {
          if (res.data.success_code === 200) {
            this.$message({
              message: "取消收藏成功",
              type: "sucess"
            });
          } else {
            this.$message({
              message: "取消收藏失败",
              type: "warning"
            });
          }
        });
    }
  }
};
</script>

<style scoped>
.pro {
  width: 1000px;
  /* margin: 20px auto; */
  /* margin-top: 20px; */
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 320px;
}
.cardStyle {
  width: 220px;
  height: 290px;
  position: relative;
  /* padding: 10px; */
  margin-top: 30px;
}
.price {
  font-size: 16px;
  color: #f40;
  font-weight: 700;
}
.shortName {
  width: 92%;
  padding: 5px 10px;
  font-size: 13px;
}

.image {
  width: 100%;
}
.p_bottom {
  width: 100%;
  position: absolute;
  bottom: 0;
}
.cart-bottom {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  padding-bottom: 0px;
}
.price {
  align-self: center;
}
.button {
  align-self: center;
}
</style>
