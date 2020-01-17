<style lang="less">
.btn-wraper {
  display: inline-block;
  width: 290px;
  vertical-align: top;
}

.intention-apply {
  height: 100%;
  .ivu-card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .table-wraper {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

.ivu-table .demo-table-info-row td {
  background-color: #fafbfc;
}
.agent_information{
  .selectType{
    width:140px;
    vertical-align:top;
    margin-right: 12px;
  }
  .tree_box{
    margin: 20px;
    flex: 1 1 auto;
    overflow: auto;
  }
}
.tree_input{
  font-size: 16px;
}
</style>
<template>
  <Card class="agent_information intention-apply">
    <div class="search">
      <Input v-model="keywords" placeholder="姓名、电话" style="width: 150px;margin-right:10px;margin-bottom:10px;"></Input>
      
      <div class="btn-wraper">
        <Button type="primary" icon="search" @click="search_click">搜索</Button>
        <Button type="success" @click="exportDocument_click" icon="document-text">导出</Button>
      </div>
    </div>

    <div class="tree_box">
      <Tree :data="data" class="tree_input" :load-data="loadData" @on-select-change="tree_change"></Tree>
    </div>
  </Card>
</template>
<script>

export default {
    components: {
    },
    created() {
        this.getData(-1, (data)=>{
            this.data = this.filterData(data);
        });
    },
    data() {
        return {
            keywords: '',
            data: [],
            searchList: [],
            selectId: 0
        }
    },
    methods: {
        getData(memberId, callback){
            const params = {
                SuperId: memberId
            }
            this.$request(this.$api.GetMemberStruct, params, data=>{
                console.log(data)
                callback && callback(data);
            })

        },
        loadData(item, callback){
            this.searchList = [];
            const params = {
                SuperId: item.memberId
            }
            this.$request(this.$api.GetMemberStruct, params, data=>{
                callback(this.filterData(data));
            })
        },
        filterData(data){
            return data.result.map(item=>{
                let obj = {
                    title: item.roleName+'：'+item.name+'(手机号:'+item.phone+')'+(item.lowCount ? '('+item.lowCount+')' : ''),
                    memberId: item.memberId
                };
                if (item.lowCount){
                    obj.loading = false;
                    obj.children = [];
                }

                let haveId = false;
                let isLast = false;
                
                this.searchList.map(record=>{
                    if (record.superId === item.memberId){
                        haveId = true;
                    }
                    isLast = record.superId === item.memberId;
                })

                if (haveId){
                    if (isLast){
                        obj.selected = true;
                        this.selectId = item.memberId;
                    }else{
                        obj.expand = true;
                        this.appendChild(obj);
                    }
                    
                }

                return obj;
            })
        },
        appendChild(item){
            const params = {
                SuperId: item.memberId
            }
            this.$request(this.$api.GetMemberStruct, params, data=>{
                this.$set(item, 'children', this.filterData(data));
            })
        },
        tree_change(record){
            this.selectId = record[0].memberId;
        },
        search_click(){

            this.searchList = [];
            this.selectId = 0;

            if (this.keywords == ''){

                this.getData(-1, (data)=>{
                    this.data = this.filterData(data);
                });
                return;
            }

            const params = {
                KeyWords: this.keywords
            }

            this.$request(this.$api.GetMemberInfoByKeyWords, params, data=>{
                //this.data = this.filterData(data);
                if (data.isSuccess){
                    this.searchList = data.result;
                    this.getData(-1, (data)=>{
                        this.data = this.filterData(data);
                    });
                }else{
                    this.$Message.error(data.message);
                }
                
            })

        },
        exportDocument_click(){

            if (!this.selectId){
                this.$Message.error('请选择代理!');
                return
            }

            let url = this.$api.ExportMemberStruct;
            url += '?SuperId='+this.selectId;
            location.href = url;
        }
    }
};
</script>
