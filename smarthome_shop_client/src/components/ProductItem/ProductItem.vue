<template>
  <div class="pro">
    <el-card :body-style="{ padding: '0px'}" class="cardStyle" shadow="hover">
      <img v-lazy="pro.thumb_url" class="image" @click="goDetail(pro.goods_id)"/>
      <div class="shortName">{{ pro.short_name }}</div>
      <div class="p_bottom">
        <div class="cart-bottom">
          <span class="price">{{ pro.price | moneyFormat }}</span>
          <el-button type="text" class="button" @click="goDetail(pro.goods_id)">查看详情</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    pro: {
      type: Object,
      required: true
    }
  },
  methods: {
    goDetail(id) {
      this.$router.replace("/goods/" + id);
    }
  }
};
</script>

<style scoped>

.cardStyle {
  height: 290px;
  position: relative;
}
.price {
  font-size: 16px;
	color: #F40;
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
.p_bottom{
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
