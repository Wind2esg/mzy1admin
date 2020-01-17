import {otherRouter, appRouter} from '@/router/router';
import Util from '@/libs/util';
import Cookies from 'js-cookie';
import Vue from 'vue';

const app = {
    state: {
        cachePage: [],
        lang: '',
        isFullScreen: false,
        openedSubmenuArr: [], // 要展开的菜单数组
        menuTheme: 'dark', // 主题
        themeColor: '',
        pageOpenedList: [{
            title: '首页',
            path: '',
            name: 'home_index'
        }],
        currentPageName: '',
        currentPath: [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ], // 面包屑数组
        menuList: [],
        allMenuArr:[],
        childMenuArr:[],
        routers: [
            otherRouter,
            ...appRouter
        ],
        tagsList: [...otherRouter.children],
        messageCount: 0,
        dontCache: ['text-editor', 'artical-publish'], // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
        channelList: [], //渠道来源
        sliderType: [{  //轮播图类型
            id: 1,
            name: '首页轮播图'
        },{
            id: 2,
            name: '商城轮播图'
        }],
        productState: [{
            id: 1,
            value: '已上架'
        },{
            id: 2,
            value: '未上架'
        }],
        operateType: [{
            id: 1,
            value: '入库'
        },{
            id: 2,
            value: '出库'
        },{
            id: 3,
            value: '下单'
        },{
            id: 4,
            value: '订单取消'
        }],
        orderState: [{  //订单状态
            id: 1,
            value: '待发货',
        },{
            id: 2,
            value: '已审单',
        },{
            id: 3,
            value: '申请取消',
        }],
        orderType: [{  //订单类型
            id: 1,
            value: '代理单',
        },{
            id: 2,
            value: '商城普通单',
        },{
            id: 3,
            value: '商城礼包单',
        }],
        userLevel: [{  //下单人等级
            id: 1,
            value: '用户',
        },{
            id: 2,
            value: '一级',
        },{
            id: 3,
            value: '总监',
        },{
            id: 4,
            value: '官方',
        },{
            id: 5,
            value: '懂事',
        },{
            id: 6,
            value: '城市合伙人',
        }],
        stockType: [{
            id: 1,
            value: '下级授权'
        },{
            id: 2,
            value: '代理授权'
        },{
            id: 3,
            value: '下单'
        },{
            id: 4,
            value: '在线充值'
        },{
            id: 5,
            value: '下级充值'
        },{
            id: 6,
            value: '订单作废'
        },
        // {
        //     id: 7,
        //     value: '充值作废'
        // },
        {
            id: 8,
            value: '系统增加库存'
        },{
            id: 9,
            value: '系统减少库存'
        },{
            id: 10,
            value: '下级升级'
        },{
            id: 11,
            value: '代理升级'
        }],
        areaList:[{  //配送区域
            name: "北京",
            id: 110000
        }, {
            name: "天津",
            id: 120000
        }, {
            name: "河北省",
            id: 130000
        }, {
            name: "山西省",
            id: 140000
        }, {
            name: "内蒙古自治区",
            id: 150000
        }, {
            name: "辽宁省",
            id: 210000
        }, {
            name: "吉林省",
            id: 220000
        }, {
            name: "黑龙江省",
            id: 230000
        }, {
            name: "上海",
            id: 310000
        }, {
            name: "江苏省",
            id: 320000
        }, {
            name: "浙江省",
            id: 330000
        }, {
            name: "安徽省",
            id: 340000
        }, {
            name: "福建省",
            id: 350000
        }, {
            name: "江西省",
            id: 360000
        }, {
            name: "山东省",
            id: 370000
        }, {
            name: "河南省",
            id: 410000
        }, {
            name: "湖北省",
            id: 420000
        }, {
            name: "湖南省",
            id: 430000
        }, {
            name: "广东省",
            id: 440000
        }, {
            name: "广西壮族自治区",
            id: 450000
        }, {
            name: "海南省",
            id: 460000
        }, {
            name: "重庆",
            id: 500000
        }, {
            name: "四川省",
            id: 510000
        }, {
            name: "贵州省",
            id: 520000
        }, {
            name: "云南省",
            id: 530000
        }, {
            name: "西藏自治区",
            id: 540000
        }, {
            name: "陕西省",
            id: 610000
        }, {
            name: "甘肃省",
            id: 620000
        }, {
            name: "青海省",
            id: 630000
        }, {
            name: "宁夏回族自治区",
            id: 640000
        }, {
            name: "新疆维吾尔自治区",
            id: 650000
        }, {
            name: "台湾",
            id: 710000
        }, {
            name: "香港特别行政区",
            id: 810000
        }, {
            name: "澳门特别行政区",
            id: 820000
        }],
        //佣金类型
        commissionType: [
            {
                id: 1,
                value: ' 差价利润'
            },{
                id: 2,
                value: '团队奖励'
            },{
                id: 3,
                value: '团队裂变奖励'
            },{
                id: 4,
                value: '区域奖励'
            },{
                id: 5,
                value: '区域推荐奖励'
            },{
                id: 6,
                value: '伯乐奖励'
            },{
                id: 7,
                value: '客户分享奖励'
            },{
                id: 8,
                value: '客户礼包奖励'
            },{
                id: 9,
                value: '提现'
            },{
                id: 10,
                value: '员工充值'
            },{
                id: 11,
                value: '员工扣款'
            },
            // {
            //     id: 12,
            //     value: '客户分享奖励取消'
            // },{
            //     id: 13,
            //     value: '客户礼包奖励取消'
            // }
        ]
    },
    mutations: {
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        updateMenulist (state) {
            let accessCode = parseInt(Cookies.get('access'));
            let menuList = [];

            appRouter.forEach((item, index) => {
                if(state.allMenuArr.indexOf(item.name)===-1) return false
                let obj = Object.assign({},item);
                if (typeof(obj.access) !== 'undefined') {
 
                    if (Util.showThisRoute(obj.access, accessCode)) {
                        //console.log(item.children,item.name);
                        if (obj.children.length === 1) {
                            menuList.push(obj);
                        } else {
                            let len = menuList.push(obj);
                            let childrenArr = [];

                            childrenArr = obj.children.filter(child => {
                                if(state.childMenuArr.indexOf(child.name)===-1) return false
                                if (child.access !== undefined) {
                                    if (child.access === accessCode) {
                                        return child;
                                    }
                                } else {
                                    return child;
                                }
                            });
                            
                            menuList[len - 1].children = childrenArr;
                        }
                    }
                } else {
                    if (obj.children.length === 1) {
                        menuList.push(obj);
                    } else {
                        let len = menuList.push(obj);
                        let childrenArr = [];
                        childrenArr = obj.children.filter(child => {
                            if (child.access !== undefined) {
                                if (Util.showThisRoute(child.access, accessCode)) {
                                    return child;
                                }
                            } else {
                                return child;
                            }
                        });
                        if (childrenArr === undefined || childrenArr.length === 0) {
                            menuList.splice(len - 1, 1);
                        } else {
                            let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
                            handledItem.children = childrenArr;
                            menuList.splice(len - 1, 1, handledItem);
                        }
                    }
                }
            });
            state.menuList = menuList;
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.themeColor = mainTheme;
        },
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            console.log(state.openedSubmenuArr)
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        closePage (state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        initCachepage (state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        },
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        pageOpenedList (state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearAllTags (state) {
            state.pageOpenedList.splice(1);
            state.cachePage.length = 0;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearOtherTags (state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            let newCachepage = state.cachePage.filter(item => {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setOpenedList (state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
        },
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        setAvator (state, path) {
            localStorage.avatorImgPath = path;
        },
        switchLang (state, lang) {
            state.lang = lang;
            Vue.config.lang = lang;
        },
        clearOpenedSubmenu (state) {
            state.openedSubmenuArr.length = 0;
        },
        setMessageCount (state, count) {
            state.messageCount = count;
        },
        increateTag (state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        }
    }
};

export default app;
