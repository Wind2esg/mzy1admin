
const config = {
    app: 'http://mzypcapi.zuiws.com', // 测试
	
    
	//app: 'http://meiye.dyj.kim/',  //正式
};

let Api = {};
Api.install = function (Vue) {

	Vue.prototype.imghost = 'http://img.xsmore.com/mzy';
	Vue.prototype.apihost = config.app;

	Vue.prototype.$api = {

		uploadVideo: 'http://file.xsmore.com/api/image/upload?PlatForm=mzy&Path=video',
		uploadImage: 'http://file.xsmore.com/api/image/upload?PlatForm=mzy&Path=image',

		//上传所有文件
		uploadAllfile:'http://file.xsmore.com/file/upload?PlatForm=mzy&Path=files',

		//登录
		Login: config.app + '/Pc/Auth/Login',

		//登出
		LoginOut: config.app + '/Pc/Auth/LoginOut',

		//物流
		GetExpressInfo: config.app + '/V1/Order/GetExpressInfo',

		/*首页*/
		GetHomeIndexData: config.app + '/Pc/HomeIndex/GetHomeIndexData',



		/**品牌历程******************************************************/
		//新增品牌历程
		CompanyHistoryEdit: config.app + '/Pc/CompanyHistory/Edit',

		//修改品牌历程主图
		CompanyHistoryMainImgEdit: config.app + '/Pc/CompanyHistory/MainImg/Edit',

		//获取品牌历程主图
		CompanyHistoryMainImgModel: config.app + '/Pc/CompanyHistory/MainImg/Model',

		//历程列表
		CompanyHistoryList: config.app + '/Pc/CompanyHistory/List',

		//历程详情
		CompanyHistoryModel: config.app + '/Pc/CompanyHistory/Model',

		// 开启关闭
		CompanyHistoryOpen: config.app + '/Pc/CompanyHistory/Open',

		//删除
		CompanyHistoryDelete: config.app + '/Pc/CompanyHistory/Delete',

		//获取品牌介绍数据
		BrandModel: config.app + '/Pc/Introduce/Brand/Model',

		//修改品牌介绍数据
		BrandEdit: config.app + '/Pc/Introduce/Brand/Edit',

		//获取公司介绍数据
		CompanyModel: config.app + '/Pc/Introduce/Company/Model',

		//修改公司介绍数据
		CompanyEdit: config.app + '/Pc/Introduce/Company/Edit',



		/****轮播图************************************************************************/
		//轮播图列表
		CarouselImgList: config.app + '/Pc/CarouselImg/List',

		//添加修改
		CarouselImgEdit: config.app + '/Pc/CarouselImg/Edit',

		//删除
		CarouselImgDelete: config.app + '/Pc/CarouselImg/Delete',

		//是否开启
		CarouselImgOpen: config.app + '/Pc/CarouselImg/Open',

		//获取轮播图详情
		CarouselImgModel: config.app + '/Pc/CarouselImg/Model',



		/****新闻*************************************************************************/
		//新闻列表
		CompanyNewsList: config.app + '/Pc/CompanyNews/List',

		//获取新闻详情
		CompanyNewsModel: config.app + '/Pc/CompanyNews/Model',

		//添加修改
		CompanyNewsEdit: config.app + '/Pc/CompanyNews/Edit',

		//是否开启
		CompanyNewsOpen: config.app + '/Pc/CompanyNews/Open',

		//删除
		CompanyNewsDelete: config.app + '/Pc/CompanyNews/Delete',


		/**公告****************************************************************************/
		//删除
		CompanyNoticeDelete: config.app + '/Pc/CompanyNotice/Delete',

		//编辑
		CompanyNoticeEdit: config.app + '/Pc/CompanyNotice/Edit',

		//列表
		CompanyNoticeList: config.app + '/Pc/CompanyNotice/List',

		//详情
		CompanyNoticeModel: config.app + '/Pc/CompanyNotice/Model',

		//开启关闭
		CompanyNoticeOpen: config.app + '/Pc/CompanyNotice/Open',



		/**客服问题管理****************************************************************************/
		//删除
		CustomerServiceCommonmQuestionDelete: config.app + '/Pc/CustomerServiceCommonmQuestion/Delete',

		//编辑
		CustomerServiceCommonmQuestionEdit: config.app + '/Pc/CustomerServiceCommonmQuestion/Edit',

		//列表
		CustomerServiceCommonmQuestionList: config.app + '/Pc/CustomerServiceCommonmQuestion/List',

		//详情
		CustomerServiceCommonmQuestionModel: config.app + '/Pc/CustomerServiceCommonmQuestion/Model',

		//开启关闭
		CustomerServiceCommonmQuestionOpen: config.app + '/Pc/CustomerServiceCommonmQuestion/Open',




		/*****人员管理*************************************************************************************************/
		//部门管理-部门列表
		getListDepartMent: config.app + '/Pc/DepartmentManagementCenter/GetListDepartMent',

		//部门管理-删除部门
		delDepartMent: config.app + '/Pc/DepartmentManagementCenter/DelDepartMent',

		//部门管理-新增修改部门
		updateDepartment: config.app + '/Pc/DepartmentManagementCenter/UpdateDepartment',


		//部门管理-职位
		getListPosition: config.app + '/Pc/DepartmentManagementCenter/GetListPosition',

		//部门管理-职位-删除
		delPosition: config.app + '/Pc/DepartmentManagementCenter/DelPosition',

		//部门管理-职位-获取权限列表
		getAuthList: config.app + '/Pc/DepartmentManagementCenter/GetAuthList',

		//部门管理-职位-更新权限列表
		updateAuthList: config.app + '/Pc/DepartmentManagementCenter/UpdateAuthList',

		//部门管理-职位-更新职位
		updatePosition: config.app + '/Pc/DepartmentManagementCenter/UpdatePosition',


		//员工管理-离职员工
		delEmployee: config.app + '/Pc/EmployeeCenter/DelEmployee',

		//获取部门及包含职位
		getDepartmentAndRoleList: config.app + '/Pc/EmployeeCenter/GetDepartmentAndRoleList',

		//员工管理-获取员工列表
		getEmployeeList: config.app + '/Pc/EmployeeCenter/GetEmployeeList',

		//员工管理-修改密码
		resetPasswordEmployee: config.app + '/Pc/EmployeeCenter/ResetPasswordEmployee',

		//员工管理-添加修改员工
		updateEmployee: config.app + '/Pc/EmployeeCenter/UpdateEmployee',

		//修改员工密码
		editEmployeePassword: config.app + '/Pc/EmployeeInfo/EditEmployeePassword',

		//获取员工基础信息
		getEmployeeBaseInfo: config.app + '/Pc/EmployeeInfo/GetEmployeeBaseInfo',

		//验证员工密码是否正确
		judgeEmployeePassword: config.app + '/Pc/EmployeeInfo/JudgeEmployeePassword',

		//获取权限编辑菜单
		getPositionMenuList: config.app + '/Pc/EmployeeMenu/GetPositionMenuList',

		//菜单列表
		GetAllMenuList: config.app + '/Pc/EmployeeMenu/GetAllMenuList',




		/***产品管理************************************************************************/
		//更改上下架状态
		changeProductState: config.app + '/Pc/ProductManager/changeProductState',

		//增加减少库存
		changeProductStock: config.app + '/Pc/ProductManager/changeProductStock',

		//删除产品
		delProduct: config.app + '/Pc/ProductManager/delProduct',

		//获取产品详情
		getProductDetail: config.app + '/Pc/ProductManager/getProductDetail',

		//获取产品列表
		getProductIdAndNameList: config.app + '/Pc/ProductManager/getProductIdAndNameList',

		//获取产品列表
		getProductList: config.app + '/Pc/ProductManager/getProductList',

		//产品库存记录
		getProductStockRecordList: config.app + '/Pc/ProductManager/getProductStockRecordList',

		//产品库存记录导出
		getProductStockRecordListExport: config.app + '/Pc/ProductManager/getProductStockRecordListExport',

		//添加或更改产品
		updateProduct: config.app + '/Pc/ProductManager/updateProduct',

		//设置为推荐
		SetProductRecommendState: config.app + '/Pc/ProductManager/SetProductRecommendState',


		//添加评论
		insertProductComment: config.app + '/Pc/ProductManager/InsertProductComment',

		//删除评论
		productCommentDelete: config.app + '/Pc/ProductManager/ProductCommentDelete',

		//评论状态设置
		productCommentDisplaySet: config.app + '/Pc/ProductManager/ProductCommentDisplaySet',

		//评论列表
		productCommentList: config.app + '/Pc/ProductManager/ProductCommentList',


		//运费列表
		ExpressTemplateList: config.app + '/Pc/Express/ExpressTemplateList',

		//运费模板
		ExpressTemplateModify: config.app + '/Pc/Express/ExpressTemplateModify',




		/**审核授权*****************************************************************************/
		//审核否决
		checkMemberAuthFail: config.app + '/Pc/Member/CheckMemberAuthFail',

		//审核通过
		checkMemberAuthSuccess: config.app + '/Pc/Member/CheckMemberAuthSuccess',

		//详细信息
		getCheckMemberInfoDetails: config.app + '/Pc/Member/GetCheckMemberInfoDetails',

		//代理列表
		getCheckMemberInfoList: config.app + '/Pc/Member/GetCheckMemberInfoList',

		//导出审核授权
		ExportCheckMemberInfoList: config.app + '/Pc/Member/ExportCheckMemberInfoList',



		/***审核升级**************************************************************************************/
		//审核否决
		checkMemberUpFail: config.app + '/Pc/Member/CheckMemberUpFail',

		//通过
		checkMemberUpSuccess: config.app + '/Pc/Member/CheckMemberUpSuccess',

		// 详细信息
		getCheckMemberUpInfoDetails: config.app + '/Pc/Member/GetCheckMemberUpInfoDetails',

		//列表
		getCheckMemberUpInfoList: config.app + '/Pc/Member/GetCheckMemberUpInfoList',

		//导出
		ExportCheckMemberUpInfoList: config.app + '/Pc/Member/ExportCheckMemberUpInfoList',




		/***意向申请**************************************************************************************/
		//导出
		exportMemberDevelopInfoList: config.app + '/Pc/Member/ExportMemberDevelopInfoList',

		//分配记录
		getMemberDevelopDistributRecord: config.app + '/Pc/Member/GetMemberDevelopDistributRecord',

		//列表
		getMemberDevelopInfoList: config.app + '/Pc/Member/GetMemberDevelopInfoList',

		//通过手机号查询代理信息
		getMemberInfoByPhone: config.app + '/Pc/Member/GetMemberInfoByPhone',

		//分配选中意向代理
		putDistributeMember: config.app + '/Pc/Member/PutDistributeMember',

		//获取等级列表
		getMemberRoleList: config.app + '/Pc/MemberRole/GetMemberRoleList',






		/**代理资料*****************************************************************************************/
		//获取代理资料列表页面数据
		getMemberInfoMangerList: config.app + '/Pc/Member/GetMemberInfoMangerList',

		//导出代理资料列表页面数据
		exportMemberInfoMangerList: config.app + '/Pc/Member/ExportMemberInfoMangerList',

		//设置团队长
		setTeamLeader: config.app + '/Pc/Member/SetTeamLeader',

		//查看银行卡
		getBankCardList: config.app + '/Pc/Member/GetBankCardList',

		//获取低等级列表
		getLowRoleList: config.app + '/Pc/MemberRole/GetLowRoleList',

		//查看代理下级
		getLowMemberInfoList: config.app + '/Pc/Member/GetLowMemberInfoList',

		//导出代理下级
		exportLowMemberInfoList: config.app + '/Pc/Member/ExportLowMemberInfoList',

		//修改代理上级
		memberInfoEditSuper: config.app + '/Pc/Member/MemberInfoEditSuper',

		//获取我推荐代理列表
		getRecommandMemberList: config.app + '/Pc/Member/GetRecommandMemberList',

		//获取推荐层级
		getRecommandLevel: config.app + '/Pc/Member/GetRecommandLevel',

		//修改推荐人
		editMemberRecommand: config.app + '/Pc/Member/EditMemberRecommand',

		//获取代理基础信息
		getMemberBaseInfo: config.app + '/Pc/Member/GetMemberBaseInfo',

		//修改代理基础信息
		EditMemberBaseInfo: config.app + '/Pc/Member/EditMemberBaseInfo',

		//导出我的推荐人列表
		ExportRecommandMemberList: config.app + '/Pc/Member/ExportRecommandMemberList',

		//批量导入代理
		CreateMember: config.app + '/Pc/ExtMember/CreateMember',




		/***代理结构图************************************************************************************/
		//获取代理结构图
		GetMemberStruct: config.app + '/Pc/Member/GetMemberStruct',

		//通过关键字查询代理结构图
		GetMemberInfoByKeyWords: config.app + '/Pc/Member/GetMemberInfoByKeyWords',

		//导出代理结构图
		ExportMemberStruct: config.app + '/Pc/Member/ExportMemberStruct',



		/***团队结构图************************************************************************************/
		//获取团队推荐结构图
		GetRecommandStruct: config.app + '/Pc/Member/GetRecommandStruct',

		//通过关键字查询推荐结构图
		GetRecommandStructByKeyWords: config.app + '/Pc/Member/GetRecommandStructByKeyWords',

		//导出团队推荐结构图
		ExportRecommandStruct: config.app + '/Pc/Member/ExportRecommandStruct',




		/****订单管理***************************************************************************************/
		//待处理订单

		//列表
		PendingOrderList: config.app + '/Pc/Order/PendingOrderList',

		//拆单
		PendingOrderSplit: config.app + '/Pc/Order/PendingOrderSplit',

		//导出
		ExportPendingOrderList: config.app + '/Pc/Order/ExportPendingOrderList',

		//审单
		OrderCheck: config.app + '/Pc/Order/OrderCheck',

		//交易详情
		OrderDetailsInfo: config.app + '/Pc/Order/OrderDetailsInfo',

		//修改收货信息-获取订单收货信息
		GetOrderReceiveInfo: config.app + '/Pc/Order/GetOrderReceiveInfo',

		//修改收货信息-修改订单收货地址
		EditOrderReceiveInfo: config.app + '/Pc/Order/EditOrderReceiveInfo',

		//审核取消
		OrderCancel: config.app + '/Pc/Order/OrderCancel',

		//拆单产品信息
		SplitProductInfo: config.app + '/Pc/Order/SplitProductInfo',



		//全部订单列表
		PendingOrderList: config.app + '/Pc/Order/PendingOrderList',

		//导出
		ExportPendingOrderList: config.app + '/Pc/Order/ExportPendingOrderList',

		//订单作废
		OrderDestory: config.app + '/Pc/Order/OrderDestory',

		//订单收货信息
		GetOrderReceiveInfo: config.app + '/Pc/Order/GetOrderReceiveInfo',

		//订单记录
		GetOrderRecordList: config.app + '/Pc/Order/GetOrderRecordList',

		//快递类型
		GetExpressInfoList: config.app + '/V1/Mall/GetExpressInfoList',

		




		/**余额云仓***************************************************************************/
		//导出云仓管理列表数据
		ExportMemberStockList: config.app + '/Pc/MemberStock/ExportMemberStockList',

		//导出云仓记录列表
		ExportMemberStockRecordList: config.app + '/Pc/MemberStock/ExportMemberStockRecordList',

		//获取云仓管理列表
		GetMemberStockList: config.app + '/Pc/MemberStock/GetMemberStockList',

		//获取云仓记录列表
		GetMemberStockRecordList: config.app + '/Pc/MemberStock/GetMemberStockRecordList',

		//扣除云仓库存
		PutDeductStock: config.app + '/Pc/MemberStock/PutDeductStock',

		//充值云仓库存
		PutRechargeStock: config.app + '/Pc/MemberStock/PutRechargeStock',



		/**佣金***********************************************************************/
		//导出佣金列表
		ExportMemberCommissionManagerList: config.app + '/Pc/MemberCommission/ExportMemberCommissionManagerList',

		//导出佣金变动记录
		ExportMemberCommissionRecordList: config.app + '/Pc/MemberCommission/ExportMemberCommissionRecordList',

		//佣金管理列表
		GetMemberCommissionManagerList: config.app + '/Pc/MemberCommission/GetMemberCommissionManagerList',

		//佣金变动记录列表
		GetMemberCommissionRecordList: config.app + '/Pc/MemberCommission/GetMemberCommissionRecordList',

		//扣除佣金
		PutDeductCommission: config.app + '/Pc/MemberCommission/PutDeductCommission',

		//充值佣金
		PutUpCommission: config.app + '/Pc/MemberCommission/PutUpCommission',


		//门槛设置
		EditMemberRoleAuthStock: config.app + '/Pc/MemberRole/EditMemberRoleAuthStock',


		/***财务管理************************************************************************/
		//提现管理

		//提现列表
		WithdrawalsList: config.app + '/Pc/Draw/WithdrawalsList',

		//提现批量审核
		MultWithdrawalsCheck: config.app + '/Pc/Draw/MultWithdrawalsCheck',

		//提现审核通过
		MultWithdrawalsCheck: config.app + '/Pc/Draw/MultWithdrawalsCheck',

		//提现审核否决
		MultWithdrawalsCheck: config.app + '/Pc/Draw/MultWithdrawalsCheck',

		//导出
		WithdrawalsExport: config.app + '/Pc/Draw/WithdrawalsExport',



		/****代理奖励统计**************************************************************/
		//列表
		GetMemberCommissionStatisticsList: config.app + '/Pc/MemberCommission/GetMemberCommissionStatisticsList',

		//导出
		ExportMemberCommissionStatisticsList: config.app + '/Pc/MemberCommission/ExportMemberCommissionStatisticsList',

		//差价利润
		GetMemberProfitAwardList: config.app + '/Pc/MemberCommission/GetMemberProfitAwardList',

		//导出差价利润
		ExportMemberProfitAwardList: config.app + '/Pc/MemberCommission/ExportMemberProfitAwardList',

		//伯乐奖励
		GetIntroduceAwardList: config.app + '/Pc/MemberCommission/GetIntroduceAwardList',

		//导出伯乐奖励
		ExportIntroduceAwardList: config.app + '/Pc/MemberCommission/ExportIntroduceAwardList',

		//客户礼包
		GetCustomerGiftBagAwardList: config.app + '/Pc/MemberCommission/GetCustomerGiftBagAwardList',

		//导出客户礼包
		ExportCustomerGiftBagAwardList: config.app + '/Pc/MemberCommission/ExportCustomerGiftBagAwardList',

		//客户分享奖
		GetCustomerShareAwardList: config.app + '/Pc/MemberCommission/GetCustomerShareAwardList',

		//导出客户分享奖
		ExportCustomerShareAwardList: config.app + '/Pc/MemberCommission/ExportCustomerShareAwardList',



		//团队奖励
		GetTeamAwardList: config.app + '/Pc/MemberCommission/GetTeamAwardList',

		//导出团队奖励
		ExportTeamAwardList: config.app + '/Pc/MemberCommission/ExportTeamAwardList',

		//团队奖励业绩
		GetMemberTeamAwardShipMent: config.app + '/Pc/MemberCommission/GetMemberTeamAwardShipMent',



		//团队裂变奖励
		GetTeamFissionAwardList: config.app + '/Pc/MemberCommission/GetTeamFissionAwardList',

		//导出团队裂变奖励
		ExportTeamFissionAwardList: config.app + '/Pc/MemberCommission/ExportTeamFissionAwardList',



		//区域推荐奖励
		GetAreaRecommandAwardList: config.app + '/Pc/MemberCommission/GetAreaRecommandAwardList',

		//导出区域推荐奖励
		ExportAreaRecommandAwardList: config.app + '/Pc/MemberCommission/ExportAreaRecommandAwardList',



		//区域奖励
		GetAreaAwardList: config.app + '/Pc/MemberCommission/GetAreaAwardList',

		//导出区域奖励
		ExportAreaAwardList: config.app + '/Pc/MemberCommission/ExportAreaAwardList',

		//区域奖励数据
		GetAreaAwardStatistics: config.app + '/Pc/MemberCommission/GetAreaAwardStatistics',




		/****用户地域统计************************************************************************/

		//代理商地区分布统计
		GetMemberProvinceDistribution: config.app + '/Pc/Member/GetMemberProvinceDistribution',

		//城市分布
		GetMemberCityDistribution: config.app + '/Pc/Member/GetMemberCityDistribution',




		/**出货统计****************************************************************************/
		//出货统计
		GetOrderSellStatisticsList: config.app + '/Pc/Order/GetOrderSellStatisticsList',

		//导出出货统计
		ExportOrderSellStatisticsList: config.app + '/Pc/Order/ExportOrderSellStatisticsList',

		//查看详情
		GetSellOrderDetailList: config.app + '/Pc/Order/GetSellOrderDetailList',

		//导出详情
		ExportSellOrderDetailList: config.app + '/Pc/Order/ExportSellOrderDetailList',



		/***客户管理************************************************************/

		//客户管理列表、导出
		UserManagementList: config.app + '/Pc/Member/UserManagementList',

		//查看订单列表、导出
		UserMemberOrderList: config.app + '/Pc/Member/UserMemberOrderList',

		//查询推荐人信息
		GetUserRecommendInfo: config.app + '/Pc/Member/GetUserRecommendInfo',

		//修改推荐人
		EditUserRecommend: config.app + '/Pc/Member/EditUserRecommend',

		//推荐人列表、导出
		UserRecommendMemberList: config.app + '/Pc/Member/UserRecommendMemberList',



		/**系统消息*********************************************************************/

		//发送消息
		CreateSystemMessage: config.app + '/Pc/SystemMessage/CreateSystemMessage',




		/**用户数据统计*************************************************************************/
		UserInfoMonth: config.app + '/Pc/Member/UserInfoMonth',

		/**产品类型*************************************************************************/

		productType: config.app+'/GuanWang/Product/ProudctTypeList',

		/**获取官网产品列表*************************************************************************/

		networkList: config.app+'/GuanWang/Product/getProductList',

		/**官网产品列表上下架*************************************************************************/
		changeProudctState:config.app+'/GuanWang/Product/changeProudctState',

		/**获取专业线产品列表*************************************************************************/

		PcProductProfession: config.app+'/GuanWang/PcProductProfession/list',

		//专业线产品删除
		PcProductProfessionDelete: config.app+'/GuanWang/PcProductProfession/Delete',

		//专业线产品上下架
		PcProductProfessionState: config.app+'/GuanWang/PcProductProfession/State',

		//专业线产品添加/修改
		PcProductProfessionUpdate: config.app+'/GuanWang/PcProductProfession/Update',


		//专业线产品分类列表
		PcProductTypeProfession:config.app+'/GuanWang/PcProductTypeProfession/List',

		//专业线产品类型上下架

		PcProductTypeProfessionIsDisplay:config.app+'/GuanWang/PcProductTypeProfession/IsDisplay',


		//专业线产品分类删除
		PcProductTypeProfessionDelete:config.app+'/GuanWang/PcProductTypeProfession/Delete',


		//专业线产品分类添加/修改
		PcProductTypeProfessionUpdate:config.app+'/GuanWang/PcProductTypeProfession/Update',


		//专业线产品分类编辑系列描述
		PcProductTypeProfessionEditSeriesDes:config.app+'/GuanWang/PcProductTypeProfession/EditSeriesDescription',

		//添加产品
		pcUpdateProudct: config.app+'/GuanWang/Product/updateProudct',

		//删除产品
		pcDeleteProudct: config.app+'/GuanWang/Product/DeleteProudct',
		

		//添加修改产品类型
		updateProudctType: config.app+'/GuanWang/Product/updateProudctType',

		//修改产品类型上下架状态
		changeProudctTypeState: config.app+'/GuanWang/Product/changeProudctTypeState',

		//删除产品类型
		DeleteProudctType: config.app+'/GuanWang/Product/DeleteProudctType',


		/**全部订单确认收货*************************************************************************/
		PcOrderComfirmReceipt:config.app+'/Pc/Order/PcOrderComfirmReceipt',


		/**待处理订单发货*************************************************************************/

		PcOrderDelivery:config.app+'/Pc/Order/PcOrderDelivery',


		/**员工业绩明细*************************************************************************/
		StuffManagerDetailsList:config.app+'/Pc/Stuff/StuffManagerDetailsList',

		/**员工管理列表*************************************************************************/

		StuffManagerList:config.app+'/Pc/Stuff/StuffManagerList',


		/**新增员工*************************************************************************/

		StuffInit:config.app+'/Pc/Stuff/StuffInit',


		/**删除员工*************************************************************************/

		StuffDelete:config.app+'/Pc/Stuff/StuffDelete',	


		/**员工数据的导出*************************************************************************/

		StuffManagerListExport:config.app+'/Pc/Stuff/StuffManagerListExport',	

		/**出货统计*************************************************************************/

		ProduceShipmentStatistics:config.app+'/Pc/ProductManager/ProduceShipmentStatistics	',

	
		/**省市销售金额柱状图*************************************************************************/

		CityOrderBalanceBargraph:config.app+'/Pc/ProductManager/CityOrderBalanceBargraph',
		

		/**区域销售统计*************************************************************************/

		ProvinceOrderBalanceBargraph:config.app+'/Pc/ProductManager/ProvinceOrderBalanceBargraph',

		/**产品出货统计导出*************************************************************************/

		ProduceShipmentStatisticsExport:config.app+'/Pc/ProductManager/ProduceShipmentStatisticsExport',

		/**代理充值记录*************************************************************************/

		MemberRechargeRecordList:config.app+'/Pc/MemberStock/MemberRechargeRecordList',


		/**代理充值记录导出*************************************************************************/

		MemberRechargeRecordListExport:config.app+'/Pc/MemberStock/MemberRechargeRecordListExport',

		/**代理充值记录导出*************************************************************************/

		MemberInfoDetails:config.app+'/Pc/MemberStock/MemberInfoDetails',


		/**获取加盟管理列表*************************************************************************/

		GetShopApplyList:config.app+'/GuanWang/PcManage/GetShopApplyList',

		/**删除加盟管理*************************************************************************/

		DeleteApplyShop:config.app+'/GuanWang/PcManage/DeleteApplyShop',

		/**根据ID获取加盟管理*************************************************************************/

		GetApplyShopInfoById:config.app+'/GuanWang/PcManage/GetApplyShopInfoById',


		/**标记加盟管理为已处理*************************************************************************/

		LookApplyShop:config.app+'/GuanWang/PcManage/LookApplyShop',

		/**获取首页信息*************************************************************************/

		GetPcIndexInfo:config.app+'/GuanWang/PcManage/GetPcIndexInfo',



		/**获取新闻列表*************************************************************************/

		GetNewsList:config.app+'/GuanWang/PcManage/GetNewsList',

		/**新闻删除*************************************************************************/

		DeleteNews:config.app+'/GuanWang/PcManage/DeleteNews',


		/**添加修改新闻*************************************************************************/

		updateNews:config.app+'/GuanWang/PcManage/updateNews',	


		/**新闻主推或不主推*************************************************************************/

		changeNewsPush:config.app+'/GuanWang/PcManage/changeNewsPush',

		/**新闻新闻显示主页或不显示主页*************************************************************************/

		changeNewsRecommand:config.app+'/GuanWang/PcManage/changeNewsRecommand',

		/**获取广告片类型列表*************************************************************************/

		GetAdTypeList:config.app+'/GuanWang/PcManage/GetAdTypeList',

		/*首页信息的修改*************************************************************************/

		updatePcIndexInfo:config.app+'/GuanWang/PcManage/updatePcIndexInfo',

		/*添加修改广告片类型*************************************************************************/

		updateAdType:config.app+'/GuanWang/PcManage/updateAdType',

		/*广告片类型的删除*************************************************************************/

		DeletePcAdType:config.app+'/GuanWang/PcManage/DeletePcAdType',

		/*广告片类型上下架*************************************************************************/

		changPcAdTypeState:config.app+'/GuanWang/PcManage/changPcAdTypeState',

		/*获取广告片列表*************************************************************************/

		GetAdList:config.app+'/GuanWang/PcManage/GetAdList',

		/*添加系列描述*************************************************************************/

		AddSeriesDescription:config.app+'/GuanWang/Product/AddSeriesDescription',	

		/*添加修改广告片*************************************************************************/

		updateAd:config.app+'/GuanWang/PcManage/updateAd',

		/*广告片的删除*************************************************************************/

		DeletePcAd:config.app+'/GuanWang/PcManage/DeletePcAd',

		/*广告片上下架*************************************************************************/

		changPcAdState:config.app+'/GuanWang/PcManage/changPcAdState',

		/*编辑系列描述*************************************************************************/

		EditSeriesDescription:config.app+'/GuanWang/Product/EditSeriesDescription',

		/*是否全选*************************************************************************/

		MemberIsCheckAll:config.app+'/Pc/Member/MemberIsCheckAll',

		/*获取公告管理列表*************************************************************************/

		GetNoticeList:config.app+'/GuanWang/PcManage/GetNoticeList',

		/*公告的上下架*************************************************************************/

		GetchangeNoticeState:config.app+'/GuanWang/PcManage/changeNoticeState',

		/*添加修改公告*************************************************************************/

		updateNotice:config.app+'/GuanWang/PcManage/updateNotice',

		/*删除公告*************************************************************************/

		DeleteNotice:config.app+'/GuanWang/PcManage/DeleteNotice',

		/*获取在线申请列表*************************************************************************/

		GetJoinUsList:config.app+'/GuanWang/PcManage/GetJoinUsList',

		/*标记在线申请列表为已处理*************************************************************************/

		LookJoinUs:config.app+'/GuanWang/PcManage/LookJoinUs',

		/*删除在线申请*************************************************************************/

		DeleteJoinUs:config.app+'/GuanWang/PcManage/DeleteJoinUs',

		/*获取杂志列表*************************************************************************/

		GetMagazineList:config.app+'/GuanWang/PcManage/GetMagazineList',

		/*添加修改杂志*************************************************************************/

		updateMagazine:config.app+'/GuanWang/PcManage/updateMagazine',

		/*杂志删除*************************************************************************/

		DeleteMagazine:config.app+'/GuanWang/PcManage/DeleteMagazine',

		/*杂志上下架*************************************************************************/

		changeMagazineState:config.app+'/GuanWang/PcManage/changeMagazineState',

		/*授权下载列表*************************************************************************/

		AuthDownloadList:config.app+'/GuanWang/PcManage/AuthDownloadList',

		/*添加授权下载图片*************************************************************************/

		AddAuthDownload:config.app+'/GuanWang/PcManage/AddAuthDownload',

		/*删除授权下载图片*************************************************************************/

		DeleteAuthDownload:config.app+'/GuanWang/PcManage/DeleteAuthDownload',

		/*获取资源下载的列表*************************************************************************/

		GetPcResourcesDownLoadList:config.app+'/GuanWang/PcManage/GetPcResourcesDownLoadList',

		/*资质认证获取一级分类*************************************************************************/

		GetPcCardOneType:config.app+'/GuanWang/PcManage/GetPcCardOneType',

		/*添加资质认证图片*************************************************************************/

		updatePcCard:config.app+'/GuanWang/PcManage/updatePcCard',

		/*资质认证一级二级三级的删除*************************************************************************/

		DeletePcCardType:config.app+'/GuanWang/PcManage/DeletePcCardType',

		/*资质下载的修改*************************************************************************/

		UpdatePcResourcesDownLoad:config.app+'/GuanWang/PcManage/UpdatePcResourcesDownLoad',

		/*添加修改一级分类*************************************************************************/

		updatePcCardOneType:config.app+'/GuanWang/PcManage/updatePcCardOneType',

		/*资质认证一级二级三级上下架*************************************************************************/

		changePcCardTypeState:config.app+'/GuanWang/PcManage/changePcCardTypeState',

		/*资质认证获取二级分类*************************************************************************/

		GetPcCardTwoType:config.app+'/GuanWang/PcManage/GetPcCardTwoType',

		/*获取官网轮播图*************************************************************************/

		TurnPicList:config.app+'/GuanWang/PcManage/TurnPicList',

		/*走进蔓之研*************************************************************************/

		GetJoinManZhiYanInfo:config.app+'/GuanWang/PcManage/GetJoinManZhiYanInfo',

		/*走进蔓之研信息修改保存*************************************************************************/

		updateZouJinManZhiYanInfo:config.app+'/GuanWang/PcManage/updateZouJinManZhiYanInfo',

		/*资质认证三级分类*************************************************************************/

		GetPcCardThreeType:config.app+'/GuanWang/PcManage/GetPcCardThreeType',

		/*资质认证获取图片*************************************************************************/

		GetPcCardList:config.app+'/GuanWang/PcManage/GetPcCardList',

		/*添加修改二级分类*************************************************************************/

		updatePcCardTwoType:config.app+'/GuanWang/PcManage/updatePcCardTwoType',

		/*添加修改三级分类*************************************************************************/

		updatePcCardThreeType:config.app+'/GuanWang/PcManage/updatePcCardThreeType',


		/*获取轮播图图片*************************************************************************/

		TurnPicGet:config.app+'/GuanWang/PcManage/TurnPicGet',

		/*轮播图上下架*************************************************************************/

		changeTurnPicState:config.app+'/GuanWang/PcManage/changeTurnPicState',

		/*删除轮播图图片*************************************************************************/

		DeleteTurnPicState:config.app+'/GuanWang/PcManage/DeleteTurnPicState',

		/*添加修改轮播图*************************************************************************/

		updateTurnPic:config.app+'/GuanWang/PcManage/updateTurnPic',

		/*获取资质认证的图片*************************************************************************/

		GetPcCard:config.app+'/GuanWang/PcManage/GetPcCard',


		/*添加资质认证图片*************************************************************************/

		updatePcCard:config.app+'/GuanWang/PcManage/updatePcCard',	

		/*新轮播图列表*************************************************************************/

		newList:config.app+'/Pc/NewCarouselImg/List',

		/*添加修改新版轮播图*************************************************************************/

		newEdit:config.app+'/Pc/NewCarouselImg/Edit',

		/*新版轮播图删除*************************************************************************/

		newDelete:config.app+'/Pc/NewCarouselImg/Delete',

		/*修改手机号*************************************************************************/

		UpdatePhone:config.app+'/Pc/Member/UpdatePhone',

		/*修改代理资料*************************************************************************/

		UpdateInfo:config.app+'/Pc/Member/UpdateInfo',

		/*删除用户*************************************************************************/

		suerDelete:config.app+'/Pc/Member/Delete',

		/*取消授权*************************************************************************/

		MemberInfoDeauthorize:config.app+'/Pc/Member/MemberInfoDeauthorize',

		/*更改代理商等级*************************************************************************/

		MemberInfoModifyAgentLevel:config.app+'/Pc/Member/MemberInfoModifyAgentLevel',

		/*加盟须知列表*************************************************************************/

		PcJoiningInstructions:config.app+'/GuanWang/PcJoiningInstructions/List',

		/*加盟须知更新*************************************************************************/

		PcJoiningInstructionsUpdate:config.app+'/GuanWang/PcJoiningInstructions/Update',

		/*加盟须知上下架*************************************************************************/

		PcJoiningInstructionsIsDisplay:config.app+'/GuanWang/PcJoiningInstructions/IsDisplay',

		/*加盟须知删除*************************************************************************/

		PcJoiningInstructionsDel:config.app+'/GuanWang/PcJoiningInstructions/Del',

		/*加盟须知删除*************************************************************************/

		PcJoiningInstructionsDel:config.app+'/GuanWang/PcJoiningInstructions/Del',

		/*加盟须知管理更新*************************************************************************/

		PcJoiningInstructionsAdd:config.app+'/GuanWang/PcJoiningInstructions/Add',

		/*加盟须知管理列表*************************************************************************/

		PcJoiningGroupbyList:config.app+'/GuanWang/PcJoiningInstructions/GroupbyList',


		/*实体店政策*************************************************************************/

		PcStorePolicyModel:config.app+'/GuanWang/PcStorePolicy/Model',

		/*实体店政策更新*************************************************************************/

		PcStorePolicyUpdate:config.app+'/GuanWang/PcStorePolicy/Update',

		/*试用中心列表*************************************************************************/

		TrialCenterList:config.app+'/GuanWang/TrialCenterList/List',

		/*试用中心删除*************************************************************************/
		TrialCenterListDel:config.app+'/GuanWang/TrialCenterList/Del',

		/*试用中心标记*************************************************************************/
		TrialCenterListMark:config.app+'/GuanWang/TrialCenterList/Deal',



		
	

	};

}

export default Api;
