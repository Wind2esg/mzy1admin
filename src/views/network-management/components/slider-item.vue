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
                    <img v-if="form.MainPicUrl " :src="imghost+form.MainPicUrl " style="width:100%" @mouseover="bigPic" />
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
    

    <Modal
          v-model="modal3"
          title="查看大图" width="800" style="font-size:18px;">  

          <img :src="bigPicture" style="width:100%"  />           

          <div slot="footer" style="text-align:center;">
                  <Button  size="large"  type="primary"  @click="saveSerise">关闭</Button>
          </div>

      </Modal>
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
        dataAll:Array,
        data: Object,
        visble:{
          type: Boolean,
          default: false
        },
    },
    data () {
        return {
            bigPicture:'',
            modal3:false,
            form:{
                uid: 0,
                id: 0,
                // carouselImgId: 0,
                MainPicUrl: '',
                // linkUrl: ''
            }
        }
    },
    computed: {
    },
    created(){
        console.log(this.data)
        this.form.uid           = this.data.uid || 0;
        this.form.id            = this.data.id || 0;
        // this.form.carouselImgId = this.data.carouselImgId || 0;
        this.form.MainPicUrl         = this.data.MainPicUrl  || '';
        // this.form.linkUrl       = this.data.linkUrl || '';
    },
    methods: {
        handleSuccess(data){
            this.form.MainPicUrl  = data[0];
            this.$emit('onChanges', this.form);
        },
        removeItem(){
            console.log(this.form)
            this.$emit('remove', this.form);
        },
        linkChange(){
            this.$emit('onChanges', this.form);
        },

        bigPic(){
            // this.modal3=true;
        },

        saveSerise(){

        },

    },

};
</script>
