<style lang="less">
    .slider-item{
        padding-top: 10px;
        margin-top: 10px;
        margin-left: 10px;
        border-top: 1px dashed #ddd;
    }
    .slider-item:first-child{
        margin-top: 0;
        padding-top: 0;
        border-top: none;
    }
</style>

<template>
    
    <Row class="slider-item">
        <Col span="4">
            <Upload
                ref="upload"
                :show-upload-list="false"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-success="handleSuccess" 
                :action="$api.uploadImage"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 66px;text-align:center;border:1px dashed #ddd; cursor:pointer; overflow:hidden">
                    <img v-if="form.imgUrl" :src="imghost+form.imgUrl" style="width:100%"/>
                    <Icon v-else type="plus" size="26" style="color:#999"></Icon>
                </div>
            </Upload>
        </Col>
        <Col span="15">
            <!-- <Input v-model="form.linkUrl" @on-change="linkChange" type="text" style="width:250px;margin-top:10px" placeholder="链接..."></Input> -->
        </Col>
        <Col span="4" style="padding-top:12px" v-if="showDelete">
            <Icon @click.native="removeItem" type="minus-circled" style="color:#f84444;cursor:pointer" size="26"></Icon>
        </Col>
    </Row>
            
    </Card>
</template>

<script>


export default {
    name: 'slider-manage',
    components: {
    },
    props:{
        showDelete: Boolean,
        data: Object
    },
    data () {
        return {
            form:{
                uid: 0,
                id: 0,
                carouselImgId: 0,
                imgUrl: '',
            }
        }
    },
    computed: {
    },
    created(){
        this.form.uid           = this.data.uid || 0;
        this.form.id            = this.data.id || 0;
        this.form.carouselImgId = this.data.carouselImgId || 0;
        this.form.imgUrl        = this.data.imgUrl || '';
    },
    methods: {
        handleSuccess(data){
            this.form.imgUrl = data[0];
            this.$emit('change', this.form);
        },
        removeItem(){
            this.$emit('remove', this.form);
        },
        linkChange(){
            this.$emit('change', this.form);
        },
    }
};
</script>
