<style lang="less">
.btn-wraper {
	display: inline-block;
	width: 290px;
	vertical-align: top;
}

.intention-apply {
	height: 100%;
	.ivu-card-body {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.table-wraper {
		margin-top: 20px;
		margin-bottom: 20px;
	}
}

.ivu-table .demo-table-info-row td {
	background-color: #fafbfc;
}
.agent_information{
	.selectType{
		width:140px;
		vertical-align:top;
		margin-right: 12px;
	}
}

.agent_information{
	height: 100%;
}
.manage_box{
	height: 100%;
	display: flex;
	flex-direction: column;

	.search{
		flex: 0 0 auto;
	}

	.table-wraper{
		flex: 1 1 auto;
		overflow: auto;
	}
	.page-wraper{
		flex: 0 0 auto;
	}
}
</style>
<template>
	<Card class="agent_information intention-apply">
		<div class="manage_box">
			<div class="search">
				<Input v-model="keywords" placeholder="操作人" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>

				<Select v-model="ApplyState" class="selectType" placeholder="请选择操作类型">
					<Option v-for="(item,index) in ApplyStateList" :value="item.value" :key="index">{{ item.label }}</Option>
				</Select>
				<Select v-model="RoleVal" class="selectType" placeholder="请选择产品名称">
					<Option v-for="(item,index) in RoleList" :value="item.id" :key="index" v-if="item.productName">{{ item.productName }}</Option>
				</Select>
				<date-apply  placeholder="变动时间" @dateChange="dateChange" style="margin-right:10px;margin-bottom:10px;"></date-apply>

				<div class="btn-wraper">
					<Button type="primary" icon="search" @click="search_click">搜索</Button>
					<Button type="success" @click="exportDocument_click" icon="document-text">导出</Button>
				</div>
			</div>
			<div class="table-wraper">
				<Table ref="selection" :loading="loading" :columns="columns" :data="apidata" size="small"></Table>
			</div>
			<Page :total="total" :page-size="pageSize" :current="pageIndex" show-sizer placement="top" :page-size-opts="[5,10,15,20,25,30]" @on-page-size-change="pageSizeChange" @on-change="pageChange" ></Page>
		</div>

	</Card>
</template>
<script>
import selectType             from '@/views/components/selectType';
import dateApply              from '@/views/components/dateApply';

let that;
export default {
	name: 'intention-apply',
	components: {
		selectType,
		dateApply
	},
	mounted(){

	},
	created() {
		that = this;

		that.$request(this.$api.getProductIdAndNameList, {}, data => {
			that.RoleList  = data || [] //代理等级
		})

		return that.GetList();
	},
	data() {
		let operateList = [  //操作类型
			{value: 3,label:'下单'},
			// {value: 4,label:'在线充值'},
			// {value: 5,label:'下级充值'},
			{value: 6,label:'订单作废'},
			// {value: 7,label:'充值作废'},
			{value: 8,label:'系统增加库存'},
			{value: 9,label:'系统减少库存'}
		];
		return {
			MemberId:0,
			loading:true,
			ApplyState:'',
			ApplyStateList:operateList,
			RoleList:[],
			RoleVal :'',
			keywords: '',
			StartTime:'',
			EndTime:'',
			total: 0,
			pageSize: 15,
			pageIndex: 1,
			columns: [
				{
					title: '产品名称',
					key: 'productName',
					align: 'center'
				},
				{
					title: '操作类型',
					key: 'operatorType',
					align: 'center'
				},
				{
					title: '变动库存',
					key: 'changeNum',
					align: 'center',
				},
				{
					title: '变动后库存',
					key: 'afterNum',
					align: 'center',
				},
				{
					title: '变动时间',
					key: 'addTime',
					align: 'center',
				},
				{
					title: '操作人',
					key: 'operatorName',
					align: 'center',
				},
				{
					title: '备注',
					key: 'remark',
					align: 'center',
				}
			],
			apidata: []
		}
	},
	methods: {
		pageChange(value) {
			this.pageIndex = value;
			that.loading = true
			return that.GetList()
		},
		pageSizeChange(value){
				this.pageSize = value;
				this.GetList();
		},
		//导出文档
		exportDocument_click() {
			let requedata = {
				keywords:that.keywords,
				OperatorType:that.ApplyState || '',
				ProductId:that.RoleVal || '',
				BeginTime:that.StartTime,
				EndTime:that.EndTime
			};
			let url = this.$api.getProductStockRecordListExport;
			let initUrl = url;
			//location.href = that.ajaxUrl
			for(let key in requedata){
				if(requedata[key]) {
					if(url===initUrl) url += '?'+key+'='+requedata[key]
						else url += '&'+key+'='+requedata[key]
				}
			}
			//console.log(url);
			location.href = url
		},

		//列表
		GetList(callback){
			let requedata = {
				indexPage:that.pageIndex,
				Take:that.pageSize,
				keywords:that.keywords,
				OperatorType:that.ApplyState || '',
				ProductId:that.RoleVal || '',
				BeginTime:that.StartTime,
				EndTime:that.EndTime
			};
			//if()
			//console.log(requedata);
			return that.$request(this.$api.getProductStockRecordList, requedata, data => {
				that.total = data.length || 0
				that.apidata = data.list || []
				that.loading = false
				return callback && callback()
			})
		},
		//恢复数据
		recoveryData(callback){
			that.total = 0
			that.loading = true
			//that.apidata = []
			that.pageIndex = 1
			return callback && callback()
		},

		//搜索
		search_click(){
			return that.recoveryData(that.GetList)
		},
		
		//时间选择
		dateChange(value){
			that.StartTime  = value[0] || ''
			that.EndTime    = value[1] || ''
			//console.log(value);
		},

		//授权状态
		ApplyState_Change(val){
			//console.log(val);
			that.ApplyState = val
		},
		
	}
};
</script>
