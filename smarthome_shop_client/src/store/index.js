import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
// 1. 基础路径
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 首页轮播图
    homecasual: [],
    // 分类
    category: [],
    userInfo: {},
    recommendshoplist: [],
    goodsDetail: [],
    goodsComment: [],
    cartsGoods: [],
    searchResults:[],
    userAddress:[],
    cartToOrder:[],
    orderDetail:[]

  },
  mutations: {
    setOrderDetail(state,orderDetail){
      state.orderDetail=orderDetail;
      console.log('state.orderDetail: ', state.orderDetail);
    },
    // 订单状态
    setHomecasual(state, homecasual) {
      state.homecasual = homecasual;
    },
    // 分类
    setCategory(state, category) {
      state.category = category;
      return category;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;


    },
    setRecommendShopList(state, recommendshoplist) {
      state.recommendshoplist = recommendshoplist;
    },
    setGoodsDetail(state, goodsDetail) {
      state.goodsDetail = goodsDetail;
    },
    setGoodsComment(state, goodsComment) {
      state.goodsComment = goodsComment;
    },
    // 获取购物车列表
    setCartsGoods(state, cartsGoods) {
      state.cartsGoods = cartsGoods;
    },
    // 搜索结果
    setSearchResults(state,searchResults){
      state.searchResults=searchResults;
    },
    // 收货地址
    setUserAddress(state,userAddress){
      state.userAddress=userAddress;
    },
    // 购物车=>订单确认
    setCartToOrder(state,cartToOrder){
      state.cartToOrder=cartToOrder;
    }
  },
  actions: {
    // 首页轮播图
    getHomecasual(context) {
      axios.get('homecasual').then(res => {
        // commit是将data传给mutations
        context.commit('setHomecasual', res.data.message);
      })
    },
    // 分类
    async getCategory(context) {
      return await axios.get('category');
    },
    // 用户信息
    getLoginPwd(context, params) {
      return new Promise((resolve) => {
        axios.post('login_pwd', params).then(res => {
          // commit是将data传给mutations
          console.log('res.data_action: ', res.data);
          context.commit('setUserInfo', res.data);
          resolve(res.data);
        })
      })
    },
    //退出登录
    reqLogOut() {
      return new Promise((resolve) => {
        axios.get('logout').then(res => {
          resolve(res.data.success_code);
        })
      })
    },
    // 多页面同步用户数据，判断登录状态
    syncUserInfo(context, userInfo) {
      context.commit('setUserInfo', userInfo);
    },
    //分类商品列表
    getRecommendShopList(context, cateObj) {
      console.log('cateObj: ', cateObj);
      axios.get('recommendshoplist', {
        params: cateObj
      }).then(res => {
        // commit是将data传给mutations
        context.commit('setRecommendShopList', res.data.message);
        console.log('res.data: ', res.data);
      })
    },
    // 商品详情
    getGoodsDetail(context, goodId) {
      axios.get('goodsdetail', {
        params: goodId
      }).then(res => {
        // commit是将data传给mutations
        context.commit('setGoodsDetail', res.data.message);
        console.log('res.data: ', res.data);
      })
    },
    //商品评论
    getGoodsComment(context, goodId) {
      axios.get('goodscomment', {
        params: goodId
      }).then(res => {
        // commit是将data传给mutations
        context.commit('setGoodsComment', res.data.message);
        console.log('res.data: ', res.data);
      })
    },
    // 添加商品评论
    postComment(context, commentObj) {
      return new Promise((resolve) => {
        axios.post('postcomment', commentObj).then(res => {
          resolve(res.data);
        })
      })
    },
    // 添加物品至上架商品详情页
    addGoodsToCart(context, goodsObj) {
      return new Promise((resolve) => {
        axios.post('add_shop_cart', goodsObj).then(res => {
          resolve(res.data);
        })
      })
    },
    // 获取购物车列表
    getCartsGoods(context, userId) {

      axios.get('cart_goods', {
        params: userId
      }).then(res => {
        // 给购物车列表加上属性
        res.data.message.forEach(checkB => {
          checkB.check = false;
        });
        // commit是将data传给mutations
        context.commit('setCartsGoods', res.data.message);
      })
    },
    // 删除单间购物车
    delSingleGoods(context, delSingCartParams) {
      return new Promise(resolve => {
        axios.post('delete_goods', delSingCartParams).then(res => {
          resolve(res.data);
        })
      })
    },
    // 清空购物车
    delAllGoods(context, delCartParams) {
      return new Promise(resolve => {
        axios.post('delete_all_goods', delCartParams).then(res => {
          resolve(res.data);
        })
      })
    },
    // 更新商品数量
    updateGoodsCount(context, cartCountParams) {
      return new Promise(resolve => {
        axios.post('change_goods_count', cartCountParams).then(res => {
          resolve(res.data);
        })
      })
    },
    // 获取用户信息
    getUserInfo(context, userId) {
      return new Promise(resolve => {
        axios.get('user_info', {
          params: userId
        }).then(res => {
          resolve(res.data);
          console.log('res.data: ', res.data);
        })
      })
    },
    // 更新用户信息
    updateUserInfo(context, userInfoParams) {
      return new Promise(resolve => {
        axios.post('change_user_msg', userInfoParams).then(res => {
          resolve(res.data);
        })
      })
    },
    // 修改密码
    async changeUserPwd(context, updatePwd) {
      return await axios.post('change_user_pwd', updatePwd);
      
    },
    //搜索内容
    async reqSearch(context,keywordsParam){
      return await axios.post('searchgoods',keywordsParam);
    },
    // 收货地址
    async getAddress(context,userId){
      return await axios.get('user_address',{
        params: userId
      });
    },
    async updateAddress(context,addressParams){
      return await axios.post('update_address',addressParams);
    },
    async addAddress(context,newAddress){
      return await axios.post('add_address',newAddress);
    },
    async delAddress(context,addressId){
      return await axios.post('delete_address',addressId);
    },
    //-----------------------------管理员登录-------------------------------
    async getAdminLogin(context,params){
      return await axios.post('admin_login',params);
    },
    async AdminLoginOut(context){
      return await axios.get('admin_logout');
    },
    async getAllUser(context){
      return await axios.get('admin_allusers');
    },
    async getAllGoods(context){
      return await axios.get('allgoods');
    },
    async delAllGoods(context,goodsId){
      return await axios.post('delete_recom_goods',goodsId);
    },
    async updateGoods(context,goodsInfo){
      return await axios.post('update_recom_goods',goodsInfo);
    },
    async addGoods(context,newGoodsInfo){
      return await axios.post('add_shop_recom',newGoodsInfo);
    },
    // 提交商品
    async submitOrder(context,params){
      return await axios.post('create_order',params);
    },
    // 获取总价
    async getTotal(context,order_id){
      return await axios.get('get_total',{
        params: order_id
      });
    },
    async confirmPayPwd(context,params){
      return await axios.post('pay_pwd',params);
    },
    async updateOrder(context,params){
      return await axios.post('update_order',params);
    },
    async getOrder(context,user_id){
      return await axios.get('get_order',{params: user_id});
    },
    async getItemOrder(context,order_id){
      return await axios.get('get_item_order',{params: order_id});
    },
    async getAddressOrder(context,order_id){
      return await axios.get('get_address_order',{params: order_id});
    },
    // 收藏状态
    async getCollState(context,colObj){
      return await axios.get('get_collection_state',{params: colObj});
    },
    async addCollection(context,colObj){
      return await axios.post('add_collection', colObj);
    },
    async delCollection(context,colObj){
      return await axios.post('del_collection', colObj);
    },
    // 收藏状态
    async getCollection(context,colObj){
      return await axios.get('get_collection',{params: colObj});
    },
    // 首页商品
    async getHomeShopList(context){
      return await axios.get('homeshoplist');
    },
    async getUserOrder(context,obj){
      return await axios.get('user_order_list',{params: obj});
    },
    async updateOrderAddress(context,obj){
      return await axios.post('update_order_address',obj);
    },
    async insertShipments(context,obj){
      console.log('obj: ', obj);
      return await axios.post('insert_order_shipments',obj);
    },
    async getOrderShipments(context,obj){
      return await axios.get('get_order_shipments',{params: obj});
    },
    async getOrderShipmentsNum(context,obj){
      return await axios.get('get_order_shipments_num',{params: obj});
    },
    // 提醒发货
    async remindToPush(context,obj){
      return await axios.post('remind_push_goods',obj);
    },
    async receive_msg(context,obj){
      return await axios.get('receive_msg',obj);
    },
    async confirmToRemind(context,obj){
      return await axios.post('confirm_remind',obj);
    },
    async hasRemindTime(context,obj){
      return await axios.post('has_remind_time',obj);
    },
    
    async updateCommentState(context,obj){
      return await axios.post('update_comment_state',obj);
    },
  },
  modules: {

  }
})