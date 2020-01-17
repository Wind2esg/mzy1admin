<template>
    <section>
        <div class="agent-adds">
            <h1>添加代理商</h1>

            <div class="information-box">
                <span class="names">姓名<span class="reds">*</span></span>
                <Input v-model="value1"  clearable style="width: 250px"></Input>
            </div>

            <div class="information-box">
                <span class="names">手机号<span class="reds">*</span></span>
                <Input v-model="value2"  clearable style="width: 250px"></Input>
            </div>

            <div class="information-box">
                <span class="names">推荐人ID<span class="reds">*</span></span>
                <Input v-model="value3"  clearable style="width: 250px"></Input>
            </div>

            <div class="information-box">
                <span class="names">上级ID</span>
                <Input v-model="value4"  clearable style="width: 250px"></Input>
            </div>

            <div class="information-box">
                <span class="names">身份证号<span class="reds">*</span></span>
                <Input v-model="value7"  clearable style="width: 250px"></Input>
            </div>

            <div class="information-box">
                <span class="names">等级<span class="reds">*</span></span>
                <Select v-model="model1" class="selectType" placeholder="选择代理等级" style="width:250px">
                  <Option v-for="(item,index) in RoleList" :value="item.id" :key="index">{{ item.roleName }}</Option>
                </Select>
            </div>

            <div class="information-box">
                <span class="names">地址<span class="reds">*</span></span>
                <div class="select-box">
                     <Cascader v-model="value5" :data="AreaData" filterable style="width:400px;"></Cascader>
                </div>

            </div>

            <div class="information-box">
                <span class="names">详细地址<span class="reds">*</span></span>

                <textarea   class="texts" v-model="value6"></textarea>
            </div>

            <Button type="primary" style="margin-left:30px;" @click="saveData">保存</Button>

        </div>
        
    </section>
</template>

<script>
    import areaData               from '@/libs/AreaData1.json';
    import utils            from '@/libs/util';
    export default{
        data(){
            return{
                value1:'',
                value2:'',
                value3:'',
                value4:'',
                AreaData: areaData,
                RoleList:[],
                model1: '',
                value5:[],
                value6:'',
                value7:''
            }
        },
        created() {        
            utils.getRoleList(this,data => {
              this.RoleList  = data
            })
          },
     
        methods:{

             format (labels, selectedData) {
                const index = labels.length - 1;
                const data = selectedData[index] || false;
                if (data && data.code) {
                    return labels[index] + ' - ' + data.code;
                }
                return labels[index];
            },

            // 保存数据
            saveData(){
                if(this.value1==''){
                    this.$Message.error('请输入姓名');
                    return false;
                }
                if(this.value2==''){
                    this.$Message.error('请输入手机号');
                    return false;
                }
                if(this.value3==''){
                    this.$Message.error('请输入推荐人ID');
                    return false;
                }
                if(this.value7==''){
                    this.$Message.error('请输入身份证号');
                    return false;
                }

                if(this.model1==''){
                    this.$Message.error('请选择等级');
                    return false;
                }

                if(this.value5==''){
                    this.$Message.error('请选择地址');
                    return false;
                }
                if(this.value6==''){
                    this.$Message.error('请输入详细地址');
                    return false;
                }
                
            }
        },
    }
</script>

<style lang="less" scoped>
    .agent-adds{
        overflow-x:hidden;
        overflow-y:auto;
        height:100%;
        background: #fff;
        position:absolute;
        width:99.3%;

        h1{
            width: 100%;
            background: #f0f0f0;
            padding: 10px 0 20px;
            font-size: 20px;
            border-bottom: 1px solid #ccc;
            margin-bottom: 5px;
            font-weight: normal;
        }  

        .information-box{
            margin:30px;
            position:relative;
            .names{
                font-size:18px;
                display:inline-block;
                width:100px;
                .reds{
                    color:red;
                    font-size:18px;
                    vertical-align: -5px;
                }
            }

            .select-box{
                position:absolute;
                left:100px;
                top:0;
            }
        }

        .texts{
            width: 400px;
            height:200px;
            resize:none;
            border:1px solid #ccc;
            border-radius:5px;
            vertical-align: top;
        }
    }
    
</style>