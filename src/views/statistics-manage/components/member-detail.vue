<template>
    <Modal v-model="show" width="1000" title="详情" @on-cancel="cancel">
        <p slot="header" style="color:#f60;text-align:center">

        </p>
        <div style="min-height: 400px;" v-if="show">
            <Tabs v-model="type"  type="card"  @on-click="tabChange">
                <TabPane label="差价利润" name="MemberProfitAwardList" v-if="data.roleName!=='用户'">
                    <profit-award :roleList="roleList" :memberRole="data.roleGradeNum" :memberId="data.memberId"></profit-award>
                </TabPane>
                <TabPane label="团队奖励" name="TeamAwardList" v-if="data.roleName!=='用户'">
                    <team-award :roleList="roleList" :memberId="data.memberId"></team-award>
                </TabPane>
                <TabPane label="团队裂变奖励" name="TeamFissionAwardList" v-if="data.roleName!=='用户'">
                    <team-fission :roleList="roleList" :memberId="data.memberId"></team-fission>
                </TabPane>
                <TabPane label="区域奖励" name="AreaAwardList" v-if="data.roleName!=='用户'">
                    <area-award :roleList="roleList" :memberId="data.memberId"></area-award>
                </TabPane>
                <TabPane label="区域推荐奖励" name="AreaRecommandAwardList" v-if="data.roleName!=='用户'">
                    <area-recommand :roleList="roleList" :memberId="data.memberId"></area-recommand>
                </TabPane>
                <TabPane label="伯乐奖励" name="IntroduceAwardList" v-if="data.roleName!=='用户'">
                    <introduce-award :roleList="roleList" :memberId="data.memberId"></introduce-award>
                </TabPane>
                <TabPane label="客户分享奖" name="CustomerShareAwardList">
                    <customer-share :roleList="roleList" :memberId="data.memberId"></customer-share>
                </TabPane>
                <TabPane label="客户礼包奖" name="CustomerGiftBagAwardList">
                    <customer-gift :roleList="roleList" :memberId="data.memberId"></customer-gift>
                </TabPane>
            </Tabs>
        </div>
        <div slot="footer">
            
        </div> 
    </Modal>
</template>

<script>

import utils            from '@/libs/util';


//差价利润
import profitAward        from './profitAwardList';

//团队奖励
import teamAward        from './teamAwardList';

//团队裂变奖励
import teamFission        from './teamFissionAwardList';

//区域奖励
import areaAward        from './areaAwardList';

//区域推荐奖励
import areaRecommand        from './areaRecommandAwardList';

//伯乐奖励
import introduceAward        from './introduceAwardList';

//客户分享奖
import customerShare        from './customerShareAwardList';

//客户礼包奖
import customerGift        from './customerGiftBagAwardList';


export default {
    name: 'member-detail',
    components: {
        profitAward,
        introduceAward,
        customerShare,
        customerGift,
        teamAward,
        teamFission,
        areaAward,
        areaRecommand
    },
    props:{
        data: {
            type: Object,
            default: ()=>{
                return {}
            }
        },
        visible: {
            type: Boolean,
            default: ()=>{
                return false
            }
        }
    },
    data(){
        return {
            show: false,
            type: this.data.roleName!=='用户' ? 'MemberProfitAwardList' : 'CustomerShareAwardList',
            roleList: [],
        }
    },
    mounted () {
        utils.getRoleList(this,data => {
          this.roleList  = data
        })
    },
    methods:{
        tabChange(value){
            this.type = value;
        },
        cancel(){
            this.$emit('cancel')
        }
    },
    watch: {
        visible(value){
            this.show = value;
            this.type = this.data.roleName!=='用户' ? 'MemberProfitAwardList' : 'CustomerShareAwardList',
            console.log(this.data.roleName!=='用户')
        }
    }
};
</script>
