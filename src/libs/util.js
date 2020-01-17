import axios from 'axios';
import env from '../../build/env';
import semver from 'semver';
import packjson from '../../package.json';
import Cookies from 'js-cookie';

let util = {

};
util.title = function (title) {
    title = title || '蔓之研';
    window.document.title = title;
};

/*const ajaxUrl = env === 'development'
    ? 'https://www.url.com'
    : env === 'production'
        ? 'https://www.url.com'
        : 'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});*/

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    //console.log(item.title)
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;

    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }

    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

util._float = (f, digit) => {
    let m = Math.pow(10, digit);
    return Math.round(f * m) / m;
};
util.deepClone = (obj) => {
   let proto = Object.getPrototypeOf(obj);
   return Object.assign({},Object.create(proto),obj);
};
util._cloneObj =  (obj) => {
    var str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
      return;
    } else if (window.JSON) {
      try{
        str = JSON.stringify(obj), //序列化对象
        newobj = JSON.parse(str); //还原
      }catch(err){
        for (var i in obj) {
          if(typeof obj[i] === 'object'){
            var lmlobj = {},objj = obj[i];
            for(var j in objj){
              if(typeof objj[j] === 'object'){
                try{
                  str = JSON.stringify(objj[j]);
                }catch(err){
                  str = "{}";
                };
                lmlobj[j] = JSON.parse(str);
              }else{
                lmlobj[j] = objj[j];
              };
            }
            newobj[i] = lmlobj;
          }else{
            newobj[i] = obj[i];
          };
        }
      }
      
    } else {
      for (var i in obj) {
        newobj[i] = typeof obj[i] === 'object' ? utils.cloneObj(obj[i]) : obj[i];
      }
    }
    return newobj;
  };

//获取代理等级
util.getRoleList = (that,callback) => {
   if(that.$store.state.user.RoleList.length>0){
        return callback && callback(that.$store.state.user.RoleList)
    }else{
      //console.log('getRoleList1',that.$store.state.user.RoleList.length);
      return that.$request(that.$api.getMemberRoleList, {}, data => {
        let RoleList  = data.result || [] //代理等级
        that.$store.state.user.RoleList = RoleList
        return callback && callback(RoleList)
      })
    }
};

//获取产品列表
util.getProductList = (that,callback) => {
   if(that.$store.state.user.ProductList.length>0){
        return callback && callback(that.$store.state.user.ProductList)
    }else{
      //console.log('getRoleList1',that.$store.state.user.RoleList.length);
      return that.$request('areaProductList', {}, data => {
        let ProductList  = data || [] //代理等级
        that.$store.state.user.ProductList = ProductList
        return callback && callback(ProductList)
      })
    }
};

//获取物流信息
util.getAllExpress = (that,callback) => {
   if(that.$store.state.user.AllExpress.length>0){
        return callback && callback(that.$store.state.user.AllExpress)
    }else{
      //console.log('getRoleList1',that.$store.state.user.RoleList.length);
      return that.$request('AllExpress', {}, data => {
        let AllExpress  = data || [] //代理等级
        that.$store.state.user.AllExpress = AllExpress
        return callback && callback(AllExpress)
      })
    }
};

//获取当前用户信息
util.getEmployeeInfo = (that,callback) => {
    let employeeInfo = Cookies.get('employeeInfo')
    const loginOutFn = ()=>{
        that.$store.commit('logout', that);
        that.$store.commit('clearOpenedSubmenu');
        that.$router.push({
            name: 'login'
        });
    }

    if(employeeInfo){
        return callback && callback(JSON.parse(employeeInfo))
    }else {
        return that.$request(that.$api.getEmployeeBaseInfo, {}, data => {
            if(data.name) {
                Cookies.set('employeeName', data.name);
                Cookies.set('employeeInfo', data);
                return callback && callback(data)
            }else return loginOutFn()
        },loginOutFn)
    }
};

/*util.checkUpdate = function (vm) {
    axios.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(res => {
        let version = res.data.tag_name;
        vm.$Notice.config({
            duration: 0
        });
        if (semver.lt(packjson.version, version)) {
            vm.$Notice.info({
                title: 'iview-admin更新啦',
                desc: '<p>iView-admin更新到了' + version + '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
            });
        }
    });
};*/

export default util;
