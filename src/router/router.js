import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
	path: '/login',
	name: 'login',
	meta: {
		title: 'Login - 登录'
	},
	component: resolve => {
		require(['@/views/login.vue'], resolve);
	}
};

export const page404 = {
	path: '/*',
	name: 'error-404',
	meta: {
		title: '404-页面不存在'
	},
	component: resolve => {
		require(['@/views/error-page/404.vue'], resolve);
	}
};

export const page403 = {
	path: '/403',
	meta: {
		title: '403-权限不足'
	},
	name: 'error-403',
	component: resolve => {
		require(['@//views/error-page/403.vue'], resolve);
	}
};

export const page500 = {
	path: '/500',
	meta: {
		title: '500-服务端错误'
	},
	name: 'error-500',
	component: resolve => {
		require(['@/views/error-page/500.vue'], resolve);
	}
};

export const preview = {
	path: '/preview',
	name: 'preview',
	component: resolve => {
		require(['@/views/form/article-publish/preview.vue'], resolve);
	}
};

export const locking = {
	path: '/locking',
	name: 'locking',
	component: resolve => {
		require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve);
	}
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
	path: '/',
	name: 'otherRouter',
	redirect: '/home',
	component: Main,
	children: [{
			path: 'home',
			title: {
				i18n: 'home'
			},
			name: 'home_index',
			component: resolve => {
				require(['@/views/home/centerPage.vue'], resolve);
			}
		},
		//{ path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['@/views/own-space/own-space.vue'], resolve); } },
		//{ path: 'order/:order_id', title: '订单详情', name: 'order-info', component: resolve => { require(['@/views/advanced-router/component/order-info.vue'], resolve); } }, // 用于展示动态路由
		//{ path: 'shopping', title: '购物详情', name: 'shopping', component: resolve => { require(['@/views/advanced-router/component/shopping-info.vue'], resolve); } }, // 用于展示带参路由
		{
			path: 'message',
			title: '消息中心',
			name: 'message_index',
			component: resolve => {
				require(['@/views/message/message.vue'], resolve);
			}
		},
		{
			path: 'job/:department_id',
			title: '职位管理',
			name: 'job-manage',
			component: () => import('@/views/staff-manage/obj-manage.vue')
		}, // 职位管理
	]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [

	
	
	{
		path: '/centerPage',
		icon: 'ios-filing',
		name: 'centerPage',
		title: '个人中心',
		access: 0,
		redirect: '/home',
		component: Main,
		children: [{
				path: '/centers',
				title: '个人中心',
				access: 0,
				icon: '',
				name: 'centerPage',
				component: resolve => {
					require(['@/views/home/home.vue'], resolve);
				}
			},
			
		]
	},
	{
		path: '/user',
		icon: 'person',
		name: 'user',
		title: '用户管理',
		component: Main,
		access: 0,
		children: [
			
			{
				path: 'centerPage',
				title: '个人中心',
				access: 0,
				icon: '',
				name: 'centerPage',
				component: resolve => {
					require(['@/views/home/home.vue'], resolve);
				}
			},
			{
				path: 'intention-apply',
				title: '意向申请',
				access: 0,
				icon: '',
				name: 'intention-apply',
				component: resolve => {
					require(['@/views/user-manage/intention-apply.vue'], resolve);
				}
			},
			{
				path: 'agency-structure',
				title: '代理结构图',
				access: 0,
				icon: '',
				name: 'agency-structure',
				component: resolve => {
					require(['@/views/user-manage/agent-structure.vue'], resolve);
				}
			},
			{
				path: 'recommend-structure',
				title: '团队推荐结构图',
				access: 0,
				icon: '',
				name: 'recommend-structure',
				component: resolve => {
					require(['@/views/user-manage/recommend-structure.vue'], resolve);
				}
			},
			{
				path: 'audit-authorization',
				title: '审核授权',
				access: 0,
				icon: '',
				name: 'audit-authorization',
				component: resolve => {
					require(['@/views/user-manage/audit-authorization.vue'], resolve);
				}
			},
			{
				path: 'audit-upgrade',
				title: '审核升级',
				access: 0,
				icon: '',
				name: 'audit-upgrade',
				component: resolve => {
					require(['@/views/user-manage/audit-upgrade.vue'], resolve);
				}
			},
			{
				path: 'agent-information',
				title: '代理资料',
				access: 0,
				icon: '',
				name: 'agent-information',
				component: resolve => {
					require(['@/views/user-manage/agent-information.vue'], resolve);
				}
			},
			{
				path: 'client-manage',
				title: '客户管理',
				access: 0,
				icon: '',
				name: 'client-manage',
				component: resolve => {
					require(['@/views/user-manage/client-manage.vue'], resolve);
				}
			},
			{
				path: 'agent-adds',
				title: '添加代理商',
				access: 0,
				icon: '',
				name: 'agent-adds',
				component: resolve => {
					require(['@/views/user-manage/agent-adds.vue'], resolve);
				}
			}
		]
	},
	{
		path: '/message',
		icon: 'information-circled',
		name: 'message',
		title: '信息管理',
		access: 0,
		component: Main,
		children: [{
				path: 'slider',
				title: '轮播图',
				access: 0,
				icon: '',
				name: 'slider',
				component: resolve => {
					require(['@/views/message-manage/slider.vue'], resolve);
				}
			},
			{
				path: 'goods-slider',
				title: '商品轮播图',
				access: 0,
				icon: '',
				name: 'goods-slider',
				component: resolve => {
					require(['@/views/message-manage/goods-slider.vue'], resolve);
				}
			},
			{
				path: 'notice-manage',
				title: '公告管理',
				access: 0,
				icon: '',
				name: 'notice-manage',
				component: resolve => {
					require(['@/views/message-manage/notice-manage.vue'], resolve);
				}
			},
			{
				path: 'company-brand-introduction',
				access: 0,
				title: '公司与品牌介绍',
				icon: '',
				name: 'company-brand-introduction',
				component: resolve => {
					require(['@/views/message-manage/company-brand-introduction.vue'], resolve);
				}
			},
			{
				path: 'news',
				title: '公司新闻',
				access: 0,
				icon: '',
				name: 'news',
				component: resolve => {
					require(['@/views/message-manage/news.vue'], resolve);
				}
			},
			{
				path: 'service-notice',
				title: '系统消息',
				access: 0,
				icon: '',
				name: 'service-notice',
				component: resolve => {
					require(['@/views/message-manage/service-notice.vue'], resolve);
				}
			},
			{
				path: 'customer-service',
				title: '客服问题管理',
				access: 0,
				icon: '',
				name: 'customer-service',
				component: resolve => {
					require(['@/views/message-manage/customerService.vue'], resolve);
				}
			},
		]
	},
	{
		path: '/product',
		icon: 'ios-filing',
		name: 'product',
		title: '产品管理',
		access: 0,
		component: Main,
		children: [{
				path: 'product-list',
				title: '产品列表',
				access: 0,
				icon: '',
				name: 'product-list',
				component: resolve => {
					require(['@/views/product-manage/product-list.vue'], resolve);
				}
			},
			{
				path: 'inventory-record',
				title: '产品库存记录',
				access: 0,
				icon: '',
				name: 'inventory-record',
				component: resolve => {
					require(['@/views/product-manage/inventory-record.vue'], resolve);
				}
			},
			{
				path: 'product-comment',
				title: '产品评论',
				access: 0,
				icon: '',
				name: 'product-comment',
				component: resolve => {
					require(['@/views/product-manage/product-comment.vue'], resolve);
				}
			},
			{
				path: 'freight-model',
				title: '运费模板',
				access: 0,
				icon: '',
				name: 'freight-model',
				component: resolve => {
					require(['@/views/product-manage/freight-model.vue'], resolve);
				}
			},
		]
	},
	{
		path: '/order',
		icon: 'ios-paper',
		name: 'order',
		title: '订单管理',
		access: 0,
		component: Main,
		children: [
			//{ path: 'pending-order', title: '待处理订单', icon:'', name: 'pending-order', component: resolve => { require(['@/views/order-manage/pending-order.vue'], resolve); } },
			{
				path: 'order-waitFor',
				title: '待处理订单',
				access: 0,
				icon: '',
				name: 'order-waitFor',
				component: resolve => {
					require(['@/views/order-manage/order-waitFor.vue'], resolve);
				}
			},
			{
				path: 'order-all',
				title: '全部订单',
				access: 0,
				icon: '',
				name: 'order-all',
				component: resolve => {
					require(['@/views/order-manage/order-all.vue'], resolve);
				}
			},
			// { path: 'saled-order', title: '售后订单', icon:'', name: 'saled-order', component: resolve => { require(['@/views/order-manage/saled-order.vue'], resolve); } },
		]
	},
	{
		path: '/finance',
		icon: 'social-yen',
		name: 'finance',
		title: '财务管理',
		access: 0,
		component: Main,
		children: [{
				path: 'balance-manage',
				title: '余额云仓管理',
				access: 0,
				icon: '',
				name: 'balance-manage',
				component: resolve => {
					require(['@/views/finance-manage/balance-manage.vue'], resolve);
				}
			},
			{
				path: 'balance-history',
				title: '余额云仓变动记录',
				access: 0,
				icon: '',
				name: 'balance-history',
				component: resolve => {
					require(['@/views/finance-manage/balance-history.vue'], resolve);
				}
			},
			{
				path: 'commission-manage',
				title: '佣金管理',
				access: 0,
				icon: '',
				name: 'commission-manage',
				component: resolve => {
					require(['@/views/finance-manage/commission-manage.vue'], resolve);
				}
			},
			{
				path: 'commission-history',
				title: '佣金变动记录',
				access: 0,
				icon: '',
				name: 'commission-history',
				component: resolve => {
					require(['@/views/finance-manage/commission-history.vue'], resolve);
				}
			},
			{
				path: 'withdrawals-manage',
				title: '提现管理',
				access: 0,
				icon: '',
				name: 'withdrawals-manage',
				component: resolve => {
					require(['@/views/finance-manage/withdrawals-manage.vue'], resolve);
				}
			},
			{
				path: 'threshold-manage',
				title: '门槛设置',
				access: 0,
				icon: '',
				name: 'threshold-manage',
				component: resolve => {
					require(['@/views/finance-manage/threshold-manage.vue'], resolve);
				}
			},
		]
	},
	{
		path: '/statistics',
		icon: 'stats-bars',
		name: 'statistics',
		title: '统计管理',
		access: 0,
		component: Main,
		children: [{
				path: 'sell-statistics',
				title: '出货统计',
				access: 0,
				icon: '',
				name: 'sell-statistics',
				component: resolve => {
					require(['@/views/statistics-manage/sell-statistics.vue'], resolve);
				}
			},
			{
				path: 'member-statistics',
				title: '代理奖励统计',
				access: 0,
				icon: '',
				name: 'member-statistics',
				component: resolve => {
					require(['@/views/statistics-manage/member-statistics.vue'], resolve);
				}
			},
			{
				path: 'agencyData-statistics',
				title: '用户数据统计',
				access: 0,
				icon: '',
				name: 'agencyData-statistics',
				component: resolve => {
					require(['@/views/statistics-manage/agencyData-statistics.vue'], resolve);
				}
			},
			{
				path: 'agencyArea-statistics',
				title: '用户地域统计',
				access: 0,
				icon: '',
				name: 'agencyArea-statistics',
				component: resolve => {
					require(['@/views/statistics-manage/agencyArea-statistics.vue'], resolve);
				}
			},
			{
				path: 'product-shipment-statistics',
				title: '产品出货统计',
				access: 0,
				icon: '',
				name: 'product-shipment-statistics',
				component: resolve => {
					require(['@/views/statistics-manage/product-shipment-statistics.vue'], resolve);
				}
			},
			{
				path: 'proxy-recharge-statistics',
				title: '代理充值统计',
				access: 0,
				icon: '',
				name: 'proxy-recharge-statistics',
				component: resolve => {
					require(['@/views/statistics-manage/proxy-recharge-statistics.vue'], resolve);
				}
			},
		]
	},
	{
		path: '/staff',
		icon: 'person-stalker',
		name: 'staff',
		title: '人员管理',
		access: 0,
		component: Main,
		children: [{
			path: 'department-manage',
			access: 0,
			icon: '',
			name: 'department-manage',
			title: '部门管理',
			component: () => import('@/views/staff-manage/department-manage.vue')
		}, {
			path: 'staff-manage',
			access: 0,
			icon: '',
			name: 'staff-manage',
			title: '员工管理',
			component: () => import('@/views/staff-manage/staff-manage.vue')
		}]
	},

	{
		path: '/networkManagement',
		icon: 'android-globe',
		name: 'networkManagement',
		title: '官网管理',
		access: 0,
		component: Main,
		children: [{
				path: 'headIntroduce',
				access: 0,
				icon: '',
				name: 'headIntroduce',
				title: '首页介绍',
				component: () => import('@/views/network-management/network-management')
			},
			{
				path: 'mzy-slider',
				access: 0,
				icon: '',
				name: 'mzy-slider',
				title: '轮播图',
				component: () => import('@/views/network-management/slider')
			},
			{
				path: 'speacilproductSort',
				access: 0,
				icon: '',
				name: 'speacilproductSort',
				title: '专业线产品分类',
				component: () => import('@/views/network-management/speacil-product-sort')
			},
			{
				path: 'specialtyProduct',
				access: 0,
				icon: '',
				name: 'specialtyProduct',
				title: '专业线产品列表',
				component: () => import('@/views/network-management/specialty-product')
			},
			{
				path: 'productType',
				access: 0,
				icon: '',
				name: 'productType',
				title: '产品分类',
				component: () => import('@/views/network-management/product-type')
			}, {
				path: 'product-sort',
				access: 0,
				icon: '',
				name: 'product-sort',
				title: '产品分类',
				component: () => import('@/views/network-management/product-sort.vue')
			},
			{
				path: 'networkProduct',
				access: 0,
				icon: '',
				name: 'networkProduct',
				title: '产品列表',
				component: () => import('@/views/network-management/network-product')
			},

			{
				path: 'goin-mzy',
				access: 0,
				icon: '',
				name: 'goin-mzy',
				title: '走进蔓之研',
				component: () => import('@/views/network-management/goin-mzy')
			}, {
				path: 'certification-page',
				access: 0,
				icon: '',
				name: 'certification-page',
				title: '资质认证一级分组',
				component: () => import('@/views/network-management/certification-page')
			}, {
				path: 'certification-page-two',
				access: 0,
				icon: '',
				name: 'certification-page-two',
				title: '资质认证二级分组',
				component: () => import('@/views/network-management/certification-page-two')
			},

			// {
			//  path: 'careColumn',
			//  access: 0,
			//  icon: '',
			//  name: 'careColumn',
			//  title: '洗护专栏',
			//  component: () => import ('@/views/network-management/care-column.vue')
			// },
			{
				path: 'mzy-certification',
				access: 0,
				icon: '',
				name: 'mzy-certification',
				title: '资质认证',
				component: () => import('@/views/network-management/mzy-certification.vue')
			}, {
				path: 'applay-manage',
				access: 0,
				icon: '',
				name: 'applay-manage',
				title: '申请管理',
				component: () => import('@/views/network-management/applay-manage')
			}, {
				path: 'noticeJoining',
				access: 0,
				icon: '',
				name: 'noticeJoining',
				title: '加盟须知',
				component: () => import('@/views/network-management/notice-joining')
			}, {
				path: 'networkStorePolicy',
				access: 0,
				icon: '',
				name: 'networkStorePolicy',
				title: '实体店政策',
				component: () => import('@/views/network-management/network-storePolicy')
			}, {
				path: 'franchise-management',
				access: 0,
				icon: '',
				name: 'franchise-management',
				title: '加盟管理',
				component: () => import('@/views/network-management/franchise-management.vue')
			}, {
				path: 'nedia-news',
				access: 0,
				icon: '',
				name: 'nedia-news',
				title: '媒体新闻',
				component: () => import('@/views/network-management/nedia-news')
			}, {
				path: 'magazine-page',
				access: 0,
				icon: '',
				name: 'magazine-page',
				title: '杂志页面',
				component: () => import('@/views/network-management/magazine-page')
			}, {
				path: 'advice-grouping',
				access: 0,
				icon: '',
				name: 'advice-grouping',
				title: '广告片分组',
				component: () => import('@/views/network-management/advice-grouping')
			}, {
				path: 'product-pian-list',
				access: 0,
				icon: '',
				name: 'product-pian-list',
				title: '广告片列表',
				component: () => import('@/views/network-management/product-pian-list')
			}, {
				path: 'notice-management',
				access: 0,
				icon: '',
				name: 'notice-management',
				title: '公告管理',
				component: () => import('@/views/network-management/notice-management')
			}, {
				path: 'resource-load',
				access: 0,
				icon: '',
				name: 'resource-load',
				title: '资源下载',
				component: () => import('@/views/network-management/resource-load')
			},
			{
				path: 'authorized-download',
				access: 0,
				icon: '',
				name: 'authorized-download',
				title: '授权下载',
				component: () => import('@/views/network-management/authorized-download.vue')
			},
			{
				path: 'useCenter',
				access: 0,
				icon: '',
				name: 'useCenter',
				title: '试用中心',
				component: () => import('@/views/network-management/useCenter')
			},

			// {
			//  path: 'classification-qualifications',
			//  access: 0,
			//  icon: '',
			//  name: 'classification-qualifications',
			//  title: '资质分类',
			//  component: () => import ('@/views/network-management/classification-qualifications')
			// },
			{
				path: 'classification-qualif',
				access: 0,
				icon: '',
				name: 'classification-qualif',
				title: '资质分类',
				component: () => import('@/views/network-management/classification-qualif')
			},

			{
				path: 'GroupManagements',
				access: 0,
				icon: '',
				name: 'GroupManagements',
				title: '分组管理',
				component: () => import('@/views/network-management/Group-managements')
			}

		]
	},

	{
		path: '/staffManage',
		icon: 'person-stalker',
		name: 'staffManage',
		title: '员工管理',
		access: 0,
		component: Main,
		children: [{
			path: 'staffChild',
			access: 0,
			icon: '',
			name: 'staffChild',
			title: '员工管理',
			component: () => import('@/views/staff-management/staf-manage.vue')
		}]
	},

];



// 所有上面定义的路由都要写在下面的routers里
export const routers = [
	loginRouter,
	otherRouter,
	preview,
	locking,
	...appRouter,
	page500,
	page403,
	page404
];
