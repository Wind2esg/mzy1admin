<template>
    <section>
        <Modal
            v-model="modal1"
            :title='title'  @on-cancel="Modal_cencel">
            <div class="information-box">
                <span class="names">姓名<span class="reds">*</span></span>
                <Input v-model="valueName"  clearable style="width: 250px"></Input>
            </div>

            <div class="information-box">
                <span class="names">身份证号<span class="reds">*</span></span>
                <Input v-model="valueCar"  clearable style="width: 250px"></Input>
            </div>

            <div class="information-box">
                <span class="names">地址<span class="reds">*</span></span>
                <div class="select-box">
                     <Cascader v-model="valueAdress" :data="AreaData" filterable style="width:250px;"></Cascader>
                </div>
            </div>

            <div class="information-box">
                <span class="names">详细地址<span class="reds">*</span></span>

                <textarea   class="texts" v-model="valueDetails"></textarea>
            </div>


            <div slot="footer" style="text-align:center;">
                  <Button  size="large"  type="primary" @click="saveBtn" >保存</Button>
            </div>

        </Modal>
    </section>
</template>

<script>
    import areaData               from '@/libs/AreaData1.json';
    export default{
         props: {
            visible: {
              type: Boolean,
              default:false
            },
            isTeamLeader: {
              type: Boolean,
              default: false
            },
            title:String,
            memberId:Number,
            angeyData:Object
        },
            
        data(){
            return{
                modal1:this.visible,
                valueName:'',
                valueAdress:[],
                AreaData:areaData,
                valueDetails:'',
                valueCar:''
            }
        },
        methods:{

            saveBtn(){   
            
            console.log(this.angeyData)             
                
                if(this.valueName==''){
                    this.$Message.error('请填写姓名');
                    return false;
                };

                if(this.valueName==''){
                    this.$Message.error('请填写姓名');
                    return false;
                };

                if(this.valueAdress==''){
                    this.$Message.error('请选择省市区');
                    return false;
                };

                if(this.valueDetails==''){
                    this.$Message.error('请填写详细地址');
                    return false;
                };

                let palaers={
                    MemberId:this.memberId,
                    MemberName:this.valueName,
                    Province:this.valueAdress[0],
                    City:this.valueAdress[1],
                    Area:this.valueAdress[2],
                    Address:this.valueDetails,
                    CardID:this.valueCar
                }

                this.$request(this.$api.UpdateInfo,palaers,data=>{
                  if (data.isSuccess){
                        this.$Message.success(data.message || '修改成功!');                        
                        this.valueAdress=[];
                        this.$emit('modal-cancel')
                        this.$emit('saveButton')

                  }else{
                        this.$Message.error(data.message);
                  }
                })

            },

            //对话框取消
             Modal_cencel(){
                this.valueAdress=[];
                this.valueName="";
                this.valueAdress=[];
                return this.$emit('modal-cancel')
             },

        },

          watch: {
            visible(value) {
              if(value){
                this.valueName=this.angeyData.name;
                this.valueAdress.push(this.angeyData.province)
                this.valueAdress.push(this.angeyData.city)
                this.valueAdress.push(this.angeyData.area)
                this.valueDetails=this.angeyData.address
                this.valueCar=this.angeyData.cardID
              }
              this.modal1 = value;
            },
        },
    }
</script>

<style lang="less" scoped>
    .information-box{
            margin:30px;
            position:relative;
            .names{
                font-size:18px;
                display:inline-block;
                width:85px;
                .reds{
                    color:red;
                    font-size:18px;
                    vertical-align: -5px;
                }
            }

            .select-box{
                position:absolute;
                left:88px;
                top:0;
            }
        }
        .texts{
            width: 250px;
            height:150px;
            padding:10px;
            resize:none;
            border:1px solid #ccc;
            border-radius:5px;
            vertical-align: top;
        }
</style>