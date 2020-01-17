import Cookies from 'js-cookie';

const user = {
    state: {
        ApplyStateList: [{
          value: '0',
          label: '未授权'
        }, {
          value: '1',
          label: '有意向'
        }, {
          value: '2',
          label: '待审核'
        }, {
          value: '3',
          label: '审核未通过'
        }, {
          value: '4',
          label: '授权通过'
        }, {
          value: '5',
          label: '已忽略'
        }, 
        // {
        //   value: '14',
        //   label: '已取消'
        // }, {
        //   value: '16',
        //   label: '申请取消'
        // }, 
        {
          value: '17',
          label: '授权待付款'
        }],
        OrderStateList: [   //订单状态
          {
            value: '0',
            label: '待发货'
          },{
            value: '3',
            label: '已审单'
          },{
            value: '4',
            label: '申请取消'
          },{
            value: '5',
            label: '已取消'
          },{
            value: '1',
            label: '已发货'
          },{
            value: '2',
            label: '已完成'
          },{
            value: '6',
            label: '未付款'
          },
          // {
          //   value: '7',
          //   label: '已拆单'
          // },
          {
            value: '8',
            label: '已作废'
          }
        ],
        OrderTypeList:[   //订单类型
          {value: 1 ,label: '代理单'},
          {value: 2 ,label: '商城普通单'},
          {value: 3 ,label: '商城礼包单'},
        ],
        RecommandLevel:[ //选择推荐层级
          {value: 1,label:'直推'},
          {value: 2,label:'间推'},
          {value: 3,label:'次间推'},
        ],
        operateList: [  //操作类型
          {value: 1,label:'下级授权'},
          {value: 2,label:'代理授权'},
          {value: 3,label:'下单'},
          {value: 4,label:'在线充值'},
          {value: 5,label:'下级充值'},
          {value: 6,label:'订单作废'},
          {value: 7,label:'充值作废'},
          {value: 8,label:'系统增加库存'},
          {value: 9,label:'系统减少库存'}
        ],
        ChangeRecordType:[
          {value: 1,label:'出货'},
          {value: 2,label:'原始订单作废'},
          {value: 3,label:'积分订单作废'},
          {value: 4,label:'积分下单'},
          {value: 5,label:'系统充值'},
          {value: 6,label:'系统扣款'},
        ],    //记录类型
        ProductList:[],   //产品列表
        RoleList: [],     //代理等级 (代理+订单)
        AndRoleList:[],   //部门职位  (人员)
        AllExpress:[],     //物流信息
        withdrawalsState: [{
            value: 1,
            label: '待审核'
        },{
            value: 2,
            label: '已完成'
        },{
            value: 3,
            label: '已否决'
        },{
            value: 4,
            label: '等待银行审核'
        },{
            value: 5,
            label: '银行审核失败'
        }]
    },
    mutations: {
        logout (state, vm) {
            Cookies.remove('user');
            Cookies.remove('password');
            Cookies.remove('access');
            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        }
    }
};

export default user;
