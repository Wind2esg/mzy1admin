<style lang="less">
    .add-product{
        padding: 20px 40px;
    }
</style>

<template>
    <div class="add-product">
        <Form ref="form" :model="form" :rules="rule" :label-width="100">
  
            <FormItem label="排序" prop="order">
                <Input v-model="form.order" placeholder="排序" style="width:200px;"></Input>
            </FormItem>
            <FormItem label="产品名称" prop="name">
                <Input v-model="form.name" placeholder="产品名称" style="width:200px;"></Input>
            </FormItem>
            <FormItem label="零售价格" prop="price">
                <Input v-model="form.price" placeholder="零售价格" style="width:200px;"></Input>
            </FormItem>
            <FormItem label="商品主图" prop="pic">
                <Upload
                    ref="upload"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    action="//jsonplaceholder.typicode.com/posts/"
                    style="display: inline-block;border:1px dashed #ccc">
                    <div style="width: 160px;height:160px;line-height: 160px;text-align:center;color:#999">
                        <Icon type="camera" size="20"></Icon>
                    </div>
                </Upload>
            </FormItem>
            <FormItem label="规格体系" style="width:600px">
                <Row>
                    <Col span="7" style="text-align:center">规格名称</Col>
                    <Col span="7" style="text-align:center">条形码头</Col>
                    <Col span="7" style="text-align:center">数量</Col>
                </Row>
                <Row :gutter="20">
                    <Col span="7">
                        <Input type="text"></Input>
                    </Col>
                    <Col span="7">
                        <Input type="text"></Input>
                    </Col>
                    <Col span="7">
                        <Input type="text"></Input>
                    </Col>
                    <Col span="3">
                        <Button>删除</Button>
                    </Col>
                </Row>
                <Button type="dashed" long style="width:100px;margin-top:20px" @click="handleAdd" icon="plus-round">添加规格</Button>
            </FormItem>
          
        </Form>
    </div>
</template>

<script>


export default {
    name: 'add-product',
    components: {
        
    },
    data () {
        return {
            form:{
                order: '',
                name: '',
                price: '',
            },
            rule:{
                order: [
                    { required: true, message: '请输入排序', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        handleSuccess(){

        }
    }
};
</script>
