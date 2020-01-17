<style lang="less">
.Modal_from_product {
  
  .fromInput {
    width: 250px;
  }
  .imgbox_up{
    width: 200px;
    height: 200px;
    position: relative;
    border: 1px solid #e1e2e3;
    overflow: hidden;
    float: left;
    cursor: pointer;
  }
  .imgbox-img{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    display: block;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .price_title{
    color: #656565;
    font-weight: bold;
    font-size: 14px;
  }
}

.product_warper{
    height: 100%;
    overflow: auto;
}

</style>
<template>
<div class="product_warper">
  <Card  v-show="isShow">
    <p slot="title">产品基本信息</p>
      <Form ref="formInfo" :model="formInfo" :rules="ruleInfo" :label-width="100" class="Modal_from Modal_from_product">
      <FormItem label="排序" >
        <Input v-model="formInfo.sort" number class="fromInput"></Input>
      </FormItem>

      <FormItem label="产品名称" prop="productName">
        <Input v-model="formInfo.productName" class="fromInput"></Input>
      </FormItem>

      <FormItem label="英文名称" prop="englishName">
        <Input v-model="formInfo.englishName" class="fromInput"></Input>
      </FormItem>

      <FormItem label="主要功效" prop="mainEfficacy">
        <Input v-model="formInfo.mainEfficacy" class="fromInput"></Input>
      </FormItem>

      <FormItem label="产地" prop="origin">
        <Input v-model="formInfo.origin" class="fromInput"></Input>
      </FormItem>

      <FormItem label="保质期" prop="productTime">
        <Input v-model="formInfo.expirationDate" class="fromInput"></Input>
      </FormItem>

      <FormItem label="简称" prop="abbreviation">
        <Input v-model="formInfo.abbreviation" class="fromInput"></Input>
      </FormItem>


      <FormItem prop="retailPrice" label="零售价格"> 
        <Input v-model="formInfo.retailPrice" number class="fromInput"></Input>
      </FormItem>
      <p style="color: #f84444;margin:0 0 20px 40px">注：用户零售价格是指最小规格的零售价格</p>
      <FormItem prop="productType" label="产品类型">
        <Select  v-model="formInfo.productType" class="fromInput">
            <Option :value="1">普通产品</Option>
            <Option :value="2">礼包产品</Option>
        </Select>
      </FormItem>
      <FormItem prop="minSpec" label="拿货库存">
        <Input v-model="formInfo.minSpec" number class="fromInput" @on-change="specStock_change"></Input>
      </FormItem>
      <FormItem prop="minWeight" label="产品重量">
        <Input v-model="formInfo.minWeight" number class="fromInput"></Input>
      </FormItem>
      <FormItem label="产品主图">
        <div class="imgbox_up" style="margin-right: 20px;" @click="upimg_visible=true">
          <img :src="upimg" alt="" class="imgbox-img">
        </div>
        <div class="upload_btn">
          <Upload 
              :max-size="2048"
              :show-upload-list="false"
              :on-success="upimgSuccess"
              :on-error="upimgError"
              :on-format-error="upimgFormatError"
              :format="['jpg','jpeg','png']"
              v-model="formInfo.mainPicUrl"
              :action="$api.uploadImage">
            <Button type="info" >图片选择</Button>
          </Upload>
        </div>
      </FormItem>
      <FormItem label="规格体系">
        <div class="addSpec_btn">
          <Button type="info" @click="addSpec_click">添加</Button>
        </div>

        <div class="addSpec_table" style="margin-top:16px;">
          <can-edit-table v-model="formInfo.specSystems" :editIncell="true" :columns-list="specColumns" @on-cell-change="handleCellChange" @on-change="handleChange" @on-delete="handleDelete"></can-edit-table>
        </div>

        <!-- 不可编辑的规格 -->
        <div class="addSpec_notablebox" v-if="noSpecData.length>0">
          <div class="addSpec_notable_title" style="font-weight:bold;margin-top:16px; ">不可编辑的规格</div>
          <div class="addSpec_notable">
            <can-edit-table v-model="noSpecData" :cannotEdit="true" :editIncell="true" :columns-list="noSpecColumns" @on-delete="handleNoDelete"></can-edit-table>
          </div>
        </div>
      </FormItem>
      <FormItem label="代理价格体系" v-if="formInfo.rolePriceSystems.length>0&&formInfo.productType=='1'">
        <div v-for="(item,index) in formInfo.rolePriceSystems" :key="index" >
          <div class="price_title">
            <span>{{item.roleName}}</span>
          </div>
          <div class="price_box">
            <can-edit-table v-if="item.rolePriceSys" v-model="item.rolePriceSys"  :editIncell="true" :columns-list="priceColumns"></can-edit-table>
          </div>
        </div >
        
        <!-- <div class="addSpec_table" style="margin-top:16px;">
          <can-edit-table v-model="specSystems" :editIncell="true" :columns-list="specColumns"></can-edit-table>
        </div> -->
      </FormItem>
      <FormItem label="商品详情">

        
        <div class="imgbox_up" style="margin-right: 20px;" @click="detailsImg_visible=true">
          <img :src="detailsImg" alt="" class="imgbox-img">
        </div>
        <div class="upload_btn">
          <Upload 
              :max-size="2048"
              :show-upload-list="false"
              :on-success="detailsImgSuccess"
              :on-error="detailsImgError"
              :on-format-error="detailsImgFormatError"
              :format="['jpg','jpeg','png']"
              v-model="formInfo.detailsImg"
              :action="$api.uploadImage">
            <Button type="info" >图片选择</Button>
          </Upload>
        </div>
      </FormItem>
      <FormItem>
        <Button style="margin-right: 10px;" @click="Modal_cencel">返回</Button>
        <Button :loading="save_loading"  type="primary" @click="Modal_ok">保存</Button>
      </FormItem>
    </Form>
    </Card>
    <Modal title="预览" v-model="upimg_visible">
      <img :src="upimg" style="width: 100%">
      <div slot="footer">
        <Button size="large" @click="upimg_visible=false">关闭</Button>
      </div>
    </Modal>
    <Modal title="预览" v-model="detailsImg_visible">
      <img :src="detailsImg" style="width: 100%">
      <div slot="footer">
        <Button size="large" @click="detailsImg_visible=false">关闭</Button>
      </div>
    </Modal>
</div>

</template>
<script>
import canEditTable from './canEditTable.vue';
import util         from '@/libs/util.js';

const deepClone = util.deepClone
const _float    = util._float

let  that
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        memberId:Number,
    },
    components: {
        canEditTable
    },
    data() {
        const changeNumCheck = (rule, value, callback)=>{
            //console.log(/^(-?\d+)(\.\d{1,2})?$/.test(value));
            if (!(/^(-?\d+)(\.\d{1})?$/.test(value))) {
                callback(new Error('请输入一位小数'));
            } else if(value<=0){
                callback(new Error('请输入库存数量'));
            }else {
                callback();
            }
        }

        const changePriceCheck = (rule, value, callback)=>{
            //console.log(/^(-?\d+)(\.\d{1,2})?$/.test(value));
            if (!(/^(-?\d+)(\.\d{1})?$/.test(value))) {
                callback(new Error('请输入一位小数'));
            } else if(value<=0){
                callback(new Error('请输入零售价'));
            }else {
                callback();
            }
        }

        const changeWeightCheck = (rule, value, callback)=>{
            //console.log(/^(-?\d+)(\.\d{1,2})?$/.test(value));
            if (!(/^(-?\d+)(\.\d{1})?$/.test(value))) {
                callback(new Error('请输入一位小数'));
            } else if(value<=0){
                callback(new Error('请输入产品重量'));
            }else {
                callback();
            }
        }

        return {
            save_loading:false,
            isEdit:false,
            addSpecs:{    //新增规格数据
                "id": 0,
                "specName": "规格名称",
                "barCode": "条形码头",
                "specCount": 1,
                "productStock": 0
            },
            addPrice:{
                "id": 0,
                "specId": 0,
                "productId": 12,
                "specName": "规格名称",
                "price": 0,
                "minCount": 0,
                "maxCount": 0,
                "notEnoughMsg": "",
                "tooManyMsg": "",
            },
            upimg_visible:false,
            detailsImg_visible: false,
            title:'添加产品',
            upimg:'http://cdn.xiaojiankeji.com/images/other/default-img.png',
            detailsImg: 'http://cdn.xiaojiankeji.com/images/other/default-img.png',
            formInfo:{
                sort:0,
                minSpec:0,
                minWeight: 0, //产品重量
                retailPrice: 0, //零售价格
                productType: '', //产品类型
                productName:'',
                mainPicUrl:'',
                detailsImg: [],
                specSystems:[],   //规格体系
                rolePriceSystems:[] ,  //价格体系
                englishName :'', //英文名称
                mainEfficacy:'' ,//功效
                origin:'', //产地
                abbreviation:'',  //简称
                expirationDate:'', //保质期

            },
            ruleInfo:{
                minSpec: [{
                    required: true,
                    validator: changeNumCheck,
                    trigger: 'change'
                }],
                productName: [{
                    required: true,
                    message: '产品名称不能为空',
                    trigger: 'blur'
                }],
                retailPrice: [{
                    required: true,
                    validator: changePriceCheck,
                    trigger: 'change'
                }],
                minWeight: [{
                    required: true,
                    validator: changeWeightCheck,
                    trigger: 'change'
                }],
                productType: [{
                    required: true,
                    message: '请选择产品类型'
                }],
            },
            isShow: this.visible,
      
            allSpecData:[],
            noSpecData:[],
            noSpecColumns:[
                {
                    title: '规格名称',
                    key: 'specName',
                    align: 'center'
                },{
                    title: '条形码头',
                    key: 'barCode',
                    align: 'center',
                    editable: true
                },{
                    title: '数量',
                    key: 'specCount',
                    align: 'center'
                },{
                    title: '购买所需库存',
                    key: 'productStock',
                    align: 'center'
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'action',
                    handle: ['delete']
                }
            ],
            specColumns:[
                {
                    title: '规格名称',
                    key: 'specName',
                    align: 'center',
                    editable: true
                },{
                    title: '条形码头',
                    key: 'barCode',
                    align: 'center',
                    editable: true
                },{
                    title: '数量',
                    key: 'specCount',
                    align: 'center',
                    editable: true
                },{
                    title: '购买所需库存',
                    key: 'productStock',
                    align: 'center'
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'action',
                    handle: ['edit', 'delete']
                }
            ],
            priceColumns:[
                {
                    title: '规格',
                    key: 'specName',
                    align: 'center'
                },{
                    title: '价格',
                    key: 'price',
                    align: 'center'
                },{
                    title: '起订数',
                    key: 'minCount',
                    align: 'center',
                    editable: true
                },{
                    title: '限购数',
                    key: 'maxCount',
                    align: 'center',
                    editable: true
                },{
                    title: '低于时提示',
                    key: 'notEnoughMsg',
                    align: 'center',
                    editable: true
                },{
                    title: '超出时提示',
                    key: 'tooManyMsg',
                    align: 'center',
                    editable: true
                }
            ]
        }
    },
    created() {
        that = this;
    },
    methods: {
        //列表
        GetList(callback){            
            let requedata = deepClone(that.formInfo)
            console.log( requedata,99)
            requedata.specSystems = [...that.noSpecData,...that.formInfo.specSystems]
            //requedata.Id = that.memberId
            //if()

            let oneNumber = 0;
            requedata.specSystems.map(item=>{
                if (item.specCount == 1){
                    oneNumber ++;
                }
            })

            if (oneNumber > 1){
                this.$Message.error('数量为1的规格有且只能有一个');
                that.save_loading = false;
                return;
            }

            return that.$request(this.$api.updateProduct, requedata, data => {

                return callback && callback(data)
            }, null, ()=>{}, true)
        },
        //表单提交
        Modal_ok() {


            this.$refs['formInfo'].validate((valid) => {
                console.log(valid)
                if (valid) {
                    that.save_loading = true;
                    //that.$emit('modal-ok')
                    return that.GetList(data => {
                        console.log(data,888)
                        that.save_loading = false
                        if(data.isSuccess){
                            that.$emit('modal-ok')
                        }else if(data.message) that.$Message.error(data.message);
                        else that.$Message.error('提交失败');
                    })
                } else {
                    this.$Message.error('提交失败');
                }
            })
        },

        //对话框取消
        Modal_cencel(){
            this.$refs.formInfo.resetFields();

      console.log(this.formInfo,8989)
            return this.$emit('modal-cancel')
        },

        //上传图片
        upimgSuccess(res, file){
            //console.log(res,file,this.imghost);
            if(res.length>0){
                this.upimg = this.imghost + res[0]
                that.formInfo.mainPicUrl = res[0]
            }
        },
        upimgError (file) {
            this.$Notice.warning({
                title: '上传',
                desc: file.name + '文件上传失败'
            });
        },
        upimgFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: file.name + ' 的格式不正确, 请选择 jpg or png.'
            });
        },

        //上传图片
        detailsImgSuccess(res, file){
            //console.log(res,file,this.imghost);
            if(res.length>0){
                this.detailsImg = this.imghost + res[0]
                that.formInfo.detailsImg[0] = res[0]
            }
        },
        detailsImgError (file) {
            this.$Notice.warning({
                title: '上传',
                desc: file.name + '文件上传失败'
            });
        },
        detailsImgFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: file.name + ' 的格式不正确, 请选择 jpg or png.'
            });
        },


    
        //新增规格
        addSpec_click(){
          //that.specColumns[0].editable = false

            let addPrice = deepClone(that.addPrice)
            let addSpecs = deepClone(that.addSpecs)
            let specSystems = that.formInfo.specSystems

            addSpecs.productStock = _float(that.formInfo.minSpec*parseInt(addSpecs.specCount,10),2)
              //console.log(addSpecs.productStock);
            that.formInfo.specSystems.push(addSpecs)

            that.formInfo.rolePriceSystems.map((el1, ix1) => {
                let obj = deepClone(addPrice);
                console.log(obj);
                obj.price = _float(that.formInfo.minSpec*el1.pricePerStock,2);
                el1.rolePriceSys.push(obj);
                return el1
            })

        },

        //规格单元格修改
        handleCellChange (val, index, key) {
            /*if(key==='specCount'){
                //console.log(that.formInfo.specSystems[index][key],index);
                return that._changeCont(that.formInfo.specSystems[index][key],index)
              }else if(key==='specName'){
                return that._changeName(that.formInfo.specSystems[index][key],index)
              }*/
              //console.log(val, index, key,that.formInfo.specSystems);
            let specName  = val[index].specName
            let specCount = val[index].specCount
              //console.log(val);
            that._changeCont()
            that._changeName(specName,index)

        },
        //规格编辑
        handleChange(val, index){
            let specName  = val[index].specName
            let specCount = val[index].specCount
              //console.log(val);
            that._changeCont()
            that._changeName(specName,index)
        },
        handleDelete(val, index){
            return that._deleteProduct(that.noSpecData.length+index)
          //console.log('handleDelete',val);
        },
        //不可编辑删除
        handleNoDelete(val, index){
          //console.log('handleNoDelete',val, index);
            return that._deleteProduct(index)
        },

        //规格库存的改变
        specStock_change(event){
            if(that.formInfo.minSpec) return that._changeCont()
          
        },

        //内置改变数量
        _changeCont(num,index){
          if(num != undefined){
                let specCount = parseFloat(num)

                that.formInfo.specSystems[index].productStock =  _float(that.formInfo.minSpec*specCount,2)
                that.formInfo.rolePriceSystems.map((el1, ix1) => {
                el1.rolePriceSys[(index+that.noSpecData.length)].price =  _float(that.formInfo.minSpec*el1.pricePerStock*specCount,2)
                    return el1
                })
          }else{
                that.noSpecData.map((el, ix) => {
                    el.productStock = _float(that.formInfo.minSpec*el.specCount,2)
                    return el
                })
                //console.log(that.noSpecData);

                that.formInfo.specSystems.map((el, ix) => {
                    el.productStock = _float(that.formInfo.minSpec*el.specCount,2)
                    return el
                })

                that.formInfo.rolePriceSystems.map((el1, ix1) => {
                    el1.rolePriceSys.map((el2, ix2) => {
                        let specCount = (ix2<that.noSpecData.length)?that.noSpecData[ix2].specCount:that.formInfo.specSystems[ix2-that.noSpecData.length].specCount
                        //console.log(specCount);
                        el2.price = _float(that.formInfo.minSpec*el1.pricePerStock*specCount,2)
                    return el2
                    })
                    return el1
                })
            }
          
        },

        //内置改变名称
        _changeName(name,index){
            //console.log('_changeName',name,index);
            that.formInfo.rolePriceSystems.map((el1, ix1) => {
                el1.rolePriceSys[(index+that.noSpecData.length)].specName = name
                return el1
            })
        },

        //内置删除
        _deleteProduct(index){
            that.formInfo.rolePriceSystems.map((el1, ix1) => {
                el1.rolePriceSys.splice(index,1)
                return el1
            })
        },
  },
  watch: {
    visible(value) {
      that.isShow = value
      /*if(that.memberId){
        that.specColumns[0].editable = false
      }*/

      
      if(value){
        
        let requedata = {Id:that.memberId};
        return that.$request(this.$api.getProductDetail, requedata, data => {
           
            that.formInfo = data;
            //that.allSpecData = data.specSystems
            that.noSpecData = data.specSystems;
            that.formInfo.specSystems = [];

            if(data.mainPicUrl) {
                that.upimg = that.imghost + data.mainPicUrl;
            }else {
                that.upimg = 'http://cdn.xiaojiankeji.com/images/other/default-img.png'
            }
            if(data.detailsImg.length) {
                that.detailsImg = that.imghost + data.detailsImg[0];
            }else {
                that.detailsImg = 'http://cdn.xiaojiankeji.com/images/other/default-img.png'
            }
        })
      }
    }
  }
};
</script>
