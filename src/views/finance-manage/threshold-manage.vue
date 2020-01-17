<style lang="less">
    
    .saled-order{
        height: 100%;

        .ivu-card-body{
            display: flex;
            flex-direction: column;

            height: 100%;
        }

        .table-wraper{
            margin-top: 20px;
            margin-bottom: 20px;
            flex: 1 1 auto;
            overflow: auto;
        }

        .btn-wraper{
            display: inline-block;
            width: 130px;
            vertical-align: top;
        }
    }
</style>

<template>
    <Card class="saled-order">
        
        <Form ref="form" :model="form" :rules="rules" :label-width="100" style="margin: 40px 0 0 20px">
            <FormItem :label="item.roleName" prop="roleName" :key="item.id" v-for="item in roleList">
                <InputNumber style="width:200px" v-model="item.authRechargeStock" placeholder="金米"></InputNumber>
                <span>折算等比金额：{{(item.authRechargeStock * item.pricePerStock).toFixed(2)}}</span>

                <div style="display:inline-block;margin-left: 70px">
                    <RadioGroup v-model="item.type">
                        <Radio label="打款截图"></Radio>
                        <Radio label="在线充值"></Radio>
                    </RadioGroup>
                </div>
            </FormItem>
        </Form>

        <div style="margin: 40px 0 0 140px">
            <Button type="primary" @click="save">确定</Button>
        </div>

    </Card>
</template>

<script>
import utils            from '@/libs/util';

export default {
    components: {
    },
    data () {
        return {
            roleList: [],
            form: {

            },
            rules: {

            }
        }
    },
    created(){
        utils.getRoleList(this,data => {
            this.roleList = data;
        })
    },
    methods: {
        save(){
            const params = {
                RoleList: this.roleList.map(item=>{
                    return {
                        Id: item.id,
                        Stock: item.authRechargeStock
                    }
                })
            }

            this.$request(this.$api.EditMemberRoleAuthStock, params, data=>{
                if (data.isSuccess){
                    this.$Message.success('设置成功!');
                }else{
                    this.$Message.error(data.message);
                }
            }, null, ()=>{}, true)

        }
    }
};
</script>
