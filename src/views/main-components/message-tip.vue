<template>
    <div class="message-con">
        <Dropdown trigger="click" @on-click="handleClick" :transfer="true">
            <div style="width: 30px;">
                <Badge :count="value" dot>
                    <Icon type="ios-bell" :size="22"></Icon>
                </Badge>
            </div>
            <DropdownMenu slot="list"  style="width:160px">
                <DropdownItem name="intention-apply">
                    <div style="text-align:left;position:relative">意向申请：
                        <div style="position:absolute;right:0px;top:2px;color:red">{{message.delevopCount||0}}</div>
                    </div>
                </DropdownItem>
                <DropdownItem name="audit-authorization">
                    <div style="text-align:left;position:relative">审核授权：
                        <div style="position:absolute;right:0px;top:2px;color:red">{{message.waitAuthCount||0}}</div>
                    </div>
                </DropdownItem>
                <DropdownItem name="audit-upgrade">
                    <div style="text-align:left;position:relative">审核升级：
                        <div style="position:absolute;right:0px;top:2px;color:red">{{message.waitUpCount||0}}</div>
                    </div>
                </DropdownItem>
                <DropdownItem name="order-waitFor">
                    <div style="text-align:left;position:relative">待处理订单：
                        <div style="position:absolute;right:0px;top:2px;color:red">{{message.waitDealOrder||0}}</div>
                    </div>
                </DropdownItem>
                <DropdownItem name="withdrawals-manage">
                    <div style="text-align:left;position:relative">提现管理：
                        <div style="position:absolute;right:0px;top:2px;color:red">{{message.withdrawalsCount||0}}</div>
                    </div>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        
    </div>
</template>

<script>
import util from '@/libs/util.js';
export default {
    name: 'messageTip',
    props: {
        value: {
            type: Number,
            default: 0
        }
    },
    data(){
        return {
            message: {}
        }
    },
    methods: {
        showMessage () {
            // util.openNewPage(this, 'message_index');
            // this.$router.push({
            //     name: 'message_index'
            // });
        },
        handleClick(name){
            this.$router.push({
                name: name
            })
        }
    },
    created(){
        this.$request(this.$api.GetHomeIndexData, {}, data=>{
            this.message = data.result;
        })
    }
};
</script>
