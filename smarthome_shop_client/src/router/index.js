import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = ()=> import('../pages/Home/Home');
const Login = ()=> import('../pages/Login/Login');
const Category = ()=> import('../pages/Category/Category');
const Goods = ()=> import('../pages/Goods/Goods');

const Me = ()=> import('../pages/Me/Me');
const Profile = ()=> import('./../pages/Me/Children/Profile');
const EditPwd = ()=> import('./../pages/Me/Children/EditPwd');
const Sales = ()=> import('./../pages/Me/Children/Sales');
const Collection = ()=> import('./../pages/Me/Children/Collection');
const AdminAddress= ()=>import('./../pages/Me/Children/AdminAddress')

const ShopCar = ()=> import('../pages/ShopCar/ShopCar');
const AdminLogin = ()=> import('../pages/AdminLogin/AdminLogin');
const Admin = ()=> import('../pages/Admin/Admin');
const SearchDetail = ()=> import('../pages/SearchDetail/SearchDetail');

const AdminSales = ()=> import('./../pages/Admin/Children/AdminSales');
const AddGoods = ()=> import('./../pages/Admin/Children/AddGoods');
const AdminGoods = ()=> import('./../pages/Admin/Children/AdminGoods');
const AdminUpdate = ()=> import('./../pages/Admin/Children/AdminUpdate');
const AdminUsers = ()=> import('./../pages/Admin/Children/AdminUsers');
const AdminStatus=()=>import('./../pages/Admin/Children/AdminStatus');
const AdminMsg=()=>import('./../pages/Admin/Children/AdminMsg');

const ConfirmOrder=()=>import('./../pages/order/ConfirmOrder');
const Pay=()=>import('./../pages/order/Pay');
const finishPay=()=>import('./../pages/order/finishPay');

// 解决点击两次跳转链接报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


Vue.use(VueRouter)

  const routes = [
    
   {
		path: '/home',
	  component: Home,
	  meta: {showHeaderTop: true, showHeaderSearch: true,showFooterDetail:true}
  },
  {
	  path: '/',
	  redirect: '/home'
  },
  {
	  path: '/login',
	  component: Login
	},
	{
	  path: '/category/:id/:pageNo',
	  component: Category,
	  meta: {showHeaderTop: true, showHeaderSearch: true,showFooterDetail:true}
  },
  {
	  path: '/goods/:id',
	  component: Goods,
	  meta: {showHeaderTop: true,showFooterDetail:true}
  },
  {
	  path: '/me',
		component: Me,
		children: [
      {path: 'profile', component: Profile},
      {path: 'editpwd', component: EditPwd},
      {path: 'collection', component: Collection},
      {path: 'adminaddress', component: AdminAddress},
      {path: '/me',redirect: '/me/profile'},
      {path: 'sales', component: Sales}
    ]
  },


  {
	  path: '/shopcar',
	  component: ShopCar,
	  meta: {showHeaderTop: true,showFooterDetail:true}
	},
	{
	  path: '/adminlogin',
	  component: AdminLogin
  },
  {
	  path: '/admin',
    component: Admin,
    children: [
      {path: 'adminsales/:pageNum', component: AdminSales},
      {path: 'adminusers', component: AdminUsers},
      {path: 'addgoods', component: AddGoods},
      {path: 'admingoods', component: AdminGoods},
      {path: 'adminupdate', component: AdminUpdate},
      {path: 'adminstatus', component: AdminStatus},
      {path: 'adminmsg', component: AdminMsg},
      {path: '/admin',redirect: '/admin/admingoods'}
    ],
  },
  {
	  path: '/searchdetail',
    component: SearchDetail,
	  meta: {showHeaderTop: true, showHeaderSearch: true}
  },
  {
	  path: '/confirm_order',
	  component: ConfirmOrder,
	  meta: {showHeaderTop: true,showFooterDetail:true}
  },
  {
	  path: '/pay/:order_id',
	  component: Pay,
	  meta: {showHeaderTop: true,showFooterDetail:true}
  },
  {
	  path: '/finish_pay',
	  component: finishPay,
	}

  ]

const router = new VueRouter({
  routes
})

export default router
