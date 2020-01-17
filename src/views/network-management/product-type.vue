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
}
.product_list{
    height: 100%;
}
.manage_box{
    height: 100%;
    display: flex;
    flex-direction: column;

    .search{
        flex: 0 0 auto;
    }

    .tabble-big-box{
        flex: 1 1 auto;
        overflow: auto;
    }
    .page-wraper{
        flex: 0 0 auto;
    }
}

</style>
<template>
<div class="product_list">
    <Card class="agent_information intention-apply">
        <div class="manage_box">
            <div class="search">
                <div class="btn-wraper">
                    <Button type="info" @click="addType({})" icon="plus">新增</Button>
                </div>
            </div>
            <div class="table-wraper" style="max-width:1170px">
                <Table ref="selection" :loading="loading" :columns="columns" :data="data" size="small"></Table>
            </div>
        </div>
    </Card>

    <Modal
        v-model="visible"
        width=400 
        title="编辑系列"
        @on-cancel="cancel">
        
        <Form ref="form" :model="form" :rules="rule" :label-width="100">
            <FormItem prop="disPlayOrder" label="排序">
                <InputNumber type="text" style="width: 200px;" v-model="form.disPlayOrder" placeholder="排序">
                </InputNumber>
            </FormItem>
            <FormItem prop="name" label="系列名称">
                <Input type="text" style="width: 200px;" v-model="form.name" placeholder="系列名称">
                </Input>
            </FormItem>
            <FormItem prop="englishName" label="英文名称">
                <Input type="text" style="width: 200px;" v-model="form.englishName" placeholder="英文名称">
                </Input>
            </FormItem>
            <FormItem prop="describe" label="描述">
                <Input type="textarea" style="width: 200px;" v-model="form.describe" placeholder="描述">
                </Input>
            </FormItem>
        </Form>

        <div slot="footer">
            <Button type="primary" @click="saveType">保存</Button>
        </div>
    </Modal>


</div>
</template>
<script>

let pageIndex = 1;

export default {
    components: {
            // stockManage,
        //productManage
    },
    created() {
    },
    beforeMount(){
       
        this.getList();
    },
    data() {
        return {
            loading: false,
            visible: false,
            editData: {},
            form: {
                disPlayOrder: 0,
                name: '',
                englishName: '',
                describe: ''
            },
            rule: {
                name: [
                    { required: true, message: '请输入系列名称', trigger: 'blur' }
                ],
                englishName: [
                    { required: true, message: '请输入英文名称', trigger: 'blur' }
                ]
            },
            columns: [
                {
                  title: '序号',
                  key: 'disPlayOrder',
                  align: 'center',
                  width: 60
                },
                {
                  title: '产品系列',
                  key: 'name',
                  width: 300,
                  align: 'center',
                },
                {
                  title: '是否开启',
                  key: 'isDisPlay',
                  align: 'center',
                  width: 100,
                  render: (h, params) => {
                      return h('div', [
                              h('i-switch', {
                                  props:{
                                      'value': params.row.isDisPlay
                                  },
                                  on:{
                                      'on-change':()=>{
                                          this.changeState(params.row);
                                      }
                                  }
                              })
                          ])
                  }
                },
                {
                  title: '当前产品数',
                  key: 'productcount',
                  width:250,
                  align: 'center'
                },
                {
                  title: '创建时间',
                  key: 'addTime',
                  width:250,
                  align: 'center'
                },
                {
                  title: '操作',
                  key: 'action',
                  align: 'center',
                  "fixed": "right",
                  width:200,
                  render:(row, column)=>{
                    let arr = [];

                    arr.push(row('Button', {
                      props: {
                        type: 'primary',
                      },
                      style: {
                        marginRight: '15px',
                        marginLeft: '5px',
                      },
                      on: {
                        click: ()=>{                
                          this.addType(column.row)
                        }
                      }
                    }, '编辑'))
                    

                    arr.push(row('Poptip', {
                          props: {
                              confirm: 'confirm',
                              title: '删除后不可恢复，确定删除？',
                              placement: 'top-end',
                              transfer: true
                          },
                          on:{
                              'on-ok':()=>{                       
                                  this.deleteData(column.row);
                              }
                          }
                      },[row('Button', {
                          props: {
                              type: 'error',
                          }
                      }, '删除')]))


                    return row('div', {
                      style: {
                        textAlign: "center"
                      }
                    }, arr);
                  }
                }
            ],
            data: []
        }
    },
    methods: {

        getList(){
            this.$request(this.$api.productType, {}, data => {
                 this.data = data.result || [];
            })
        },
        addType(record){
            this.form = {
                disPlayOrder: record.disPlayOrder || 0,
                name: record.name || '',
                englishName: record.englishName || '',
                describe: record.describe || ''
            };
            this.editData = record;
            this.visible = true;
        },
        saveType(){
            let params = Object.assign({}, this.form);
            params.Id = this.editData.id || 0;

            this.$request(this.$api.updateProudctType, params, data => {
                 if (data.isSuccess){
                    this.$Message.success('编辑成功!');
                    this.visible = false;
                    this.getList();
                 }else{
                    this.$Message.error(data.message);
                 }
            })
        },
        changeState(record){
            this.$request(this.$api.changeProudctTypeState, {Id: record.id}, data => {
                setTimeout(()=>{
                    this.getList();
                }, 200)
            })
        },
        deleteData(record){
            console.log(record);
            this.$request(this.$api.DeleteProudctType, {Id: record.id}, data => {
                if (data.isSuccess){
                    this.$Message.success('删除成功!');
                    this.getList();
                }else{
                    this.$Message.error(data.message);
                }
            })
        },
        cancel(){
            this.visible = false;
        }
    
    }
};
</script>
