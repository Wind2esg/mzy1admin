<style lang="less">

.allocation-item{
    margin: 15px 20px;

}
.allocation-item .title{
    color: #666;
    display: inline-block;
}

</style>
<template>

  <Modal :value="visible" width=460 title='分配代理' @on-cancel="Modal_cencel" class="agent_modalwarp">
        <div class="allocation-item">
            <span class="title">代理电话</span>
            <Input type="text" placeholder="请输入电话" v-model="phone" style="width:200px;margin:0 10px;" />
            <Button type="primary" @click="searchMember">查询</Button>
        </div>

        <div class="allocation-item">
            <span>代理姓名</span><span style="display:inline-block;width:100px;padding-left:10px; color:#f84444">{{memberData.name}}</span>
            <span>代理等级</span><span style="padding-left:10px;color:#f84444">{{memberData.roleName}}</span>
        </div>

        <Card v-if="resultList.length">
            <div style="max-height:400px;overflow:auto;">
                <div v-for="item in resultList" style="font-size:12px;">{{item.name+', '+item.result}}</div>
            </div>
        </Card>

        <div slot="footer">
            <Button type="primary" @click="save">确定</Button>
        </div>
  </Modal>

</template>
<script>

let  that
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: ()=>{
                return []
            }
        }
    },
    components: {

    },
    data() {
        return {
            phone: '',
            memberData: {},
            resultList: []
        }
    },
    created() {
        
    },
    methods: {
        Modal_cencel(){
            this.$emit('cancel');
        },
        searchMember(){
            if (this.phone == ''){
                this.$Message.error('请输入手机号');
                return;
            }

            const params = {
                Phone: this.phone
            }

            this.$request(this.$api.getMemberInfoByPhone, params, data=>{
                if (data.isSuccess){
                    this.memberData = data.result;
                }else{
                    this.$Message.error(data.message, 5);
                }
            })
        },
        save(){
            if (!this.list.length){
                this.$Message.error('请选择分配代理');
                return;
            }

            const params = {
                LowId: this.memberData.memberId,
                DevelopIds: this.list.map(item=>{
                    return {
                        DevelopId: item.memberId,
                        Name: item.name
                    }
                })
            }

            this.$request(this.$api.putDistributeMember, params, data=>{
                if (data.isSuccess){
                    this.resultList = data.result;
                    this.$emit('reload');
                }else{
                    this.$Message.error(data.message);
                }
            }, null, ()=>{}, true)

        }

    },
    watch: {
        visible(value) {
            //this.isShow = value;
        }
    }
};

</script>
