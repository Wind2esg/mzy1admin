<template>
        <div class="certifical-page">

            <div class="fileBox-list" v-for="(list,index) in dataLists" :key="index">
                <!-- <div style="font-weight:boild;font-size:23px;">{{list.id}}</div> -->

                <div class="group-lists">

                    <span>名称:</span>
                    <Input v-model="list.name" placeholder="请输入文件名称" style="width: 300px;margin-left:40px;" />


                    <div class="addFiles" @click="upFile(list)">
                        <div>添加文件</div>
                        <Upload :action="$api.uploadAllfile" :on-success="successer"  :show-upload-list="false" :v-model="list.fileDetail"  style="margin-left:17px;">
                            <Button icon="ios-cloud-upload-outline">Upload files</Button>
                        </Upload>
                    </div>

                    <Button type="error" class="delect-btn" @click="delectLists(index)">删除</Button>
                     
                </div>
                
            </div>


            <Button type="primary" style="margin:20px 20px 20px 40px;" @click="addMores">添加更多</Button>

            <Button type="primary" style="margin:20px;" @click="savaDatas">保存</Button>


        </div>
</template>

<script>
    export default{

        data(){
            return{
                upimg_visible:false,
                upimg:'http://cdn.xiaojiankeji.com/images/other/default-img.png',   
                formInfo:{mainPicUrl:''},
                nameVal:'', 
                dataLists:[],
                upFiles:'',
                parentId:'',
                delstatus:false,
                files:''

            }
        },

        beforeMount(){
            this.parentId=this.$route.query.Id;
            this.getList();
        
        },

        methods:{

            getList(){

                this.$request(this.$api.PcJoiningGroupbyList,{Id:this.parentId},data=>{
                
                    this.dataLists=data;
                    console.log(data)

                })
            },
            successer(response, file, fileList){
                this.$Message.success('上传成功');
                this.dataLists.map(item=>{
                    if(item.id==this.files.id){
                        item.fileDetail=response[0];
                    }
                })
            },

            //上传文件
            upFile(list){
               this.files=list; 
            },
            //添加
            addMores(){
                let date = new Date();

                
                // let year = date.getFullYear();
                // let month = (date.getMonth()+1) < 10 ? ('0'+(date.getMonth()+1)) : (date.getMonth()+1);
                // let day = date.getDate() < 10 ? ('0'+date.getDate()) : date.getDate();
                // let nowDate=year+'-'+month+'-'+day;
                // let houres=date.getHours();
                // let minutes=date.getMinutes()<10? ('0'+date.getMinutes()):date.getMinutes();
                // let seconds=date.getSeconds()<10? ('0'+date.getSeconds()):date.getSeconds();

                // let nowTime=houres+':'+minutes+':'+seconds
                // let nowDatetime=nowDate+' '+nowTime;

                let objs={
                    id:0,
                    name:'',                    
                    fileDetail:''
                }

                this.dataLists.push(objs)


            },

            //删除
            delectLists(index){
                this.dataLists.splice(index,1)
                // let legths=this.dataLists.length;
                // let i=0
                // for ( i;i<=legths;i++){

                //     if(this.dataLists[i]){
                //        this.dataLists[i].id=i; 
                //     }
                // }               
               
            },

            //保存
            savaDatas(){

                let palma={
                    parentId:this.parentId,
                    list:this.dataLists
                }

                this.$request(this.$api.PcJoiningInstructionsAdd,palma,data=>{

                    if(data.isSuccess){
                        this.$Message.success(data.message);
                        this.getList();
                    }else{
                        this.$Message.error(data.message);
                    }

                },null, ()=>{}, true)
            },


        },

        watch:{

            

            modal3(){
                if(this.formInfo.mainPicUrl) {
                    this.upimg = this.imghost + this.formInfo.mainPicUrl;
                }else {
                    this.upimg = 'http://cdn.xiaojiankeji.com/images/other/default-img.png';
                }
            }

        }

    }
</script>

<style lang="less" scoped>
 .certifical-page{
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
    background: #fff;
    .network-change-language{       
        width: 100%;
        background: #f0f0f0;
        padding: 20px 0 20px;       
        border-bottom: 1px solid #ccc;
        margin-bottom: 5px;
        font-size: 17px;
        line-height: 30px;
        cursor: pointer;
        margin-bottom:20px;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        .change-tab{
            margin-left:30px;
            margin-right: 15px;
        }
        .change-tab-action{
            color:blue;
        }

        h1{ 
            font-size: 20px;    
            font-weight: normal;
        }
    }   
  }



  .fileBox-list{
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    font-size:16px;
    margin:20px 0 20px 30px;
    .group-lists{
        border:1px solid #ccc;
        margin-left:15px;
        padding:20px;

    }
    .uploadBox{
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        margin-top:15px;
    }

    .delect-btn{
        margin-top:15px;
        float:right;
    }

  }

  .group-lists{
    border:1px solid #ddd;
    margin-left:10px;
  }

  .addFiles{
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    margin-top:20px;
  }
</style>