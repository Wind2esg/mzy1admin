import axios from 'axios';
import qs from 'qs';
//axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
let Api = {};
Api.install = function (Vue) {

	Vue.prototype.getURIArgs = () =>{
		let str = window.location.href,
			arr, obj = {};
		if (str.indexOf('?') <= -1) {
			return;
		}
		str = str.split('?')[1];
		if (str.indexOf('=') <= -1) {
			return;
		}
		str = str.split('&');
		str.map(e => {
			arr = e.split('=');
			obj[arr[0].toLowerCase()] = arr[1];
		});
		return obj;
	};

	Vue.prototype.$request = (url,requedata,sucessfn, bool,errorfn, isvip) => {
		axios.defaults.withCredentials = true;
		if (!isvip){
			return axios({
				method: 'post',
				url: url,
				data: qs.stringify(requedata),
				// headers: {
				//     'Content-Type': 'application/json; charset=UTF-8'//'application/x-www-form-urlencoded'
				// }
			}).then(res => {
				return sucessfn && sucessfn(res.data);
			}).catch(error => {
				errorfn && errorfn(error);
			});
		}else{
			return axios({
				method: 'post',
				url: url,
				data: requedata,
				headers: {
				    'Content-Type': 'application/json; charset=UTF-8'//'application/x-www-form-urlencoded'
				}
			}).then(res => {
				return sucessfn && sucessfn(res.data);
			}).catch(error => {
				errorfn && errorfn(error);
			});
		}
		
	};
	Vue.prototype.$get = (url,requedata,sucessfn, bool,errorfn) => {
		//axios.defaults.withCredentials = true;
		return axios({
			method: 'get',
			url: url,
			params: requedata
		}).then(res => {
			return sucessfn && sucessfn(res.data);
		}).catch(error => {
			errorfn && errorfn(error);
		});
	};
}

export default Api;
