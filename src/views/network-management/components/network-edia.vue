<style lang="less">

</style>

<template>
    
    <div style="padding-top:30px">

        <text-editor :data="form.content" @on-change="textChange"></text-editor>
        
    </div>
    
</template>

<script>

import textEditor from '../../components/quill-editor/quill-editor.vue'

export default {
    name: 'edit-notice',
    components: {
        textEditor
    },
    props:{
        data: {
            type: Object,
            default: ()=>{
                return {}
            }
        }
    },
    data () {
        return {
            form: {
                sort: 0,
                title: '',
                content: ''
            },
            rule: {
            },
        }
    },
    computed: {
    },
    created(){
        if (this.data.id){
            this.getData();
        }
        //console.log(this.$store.state.app.sliderType)
    },
    methods: {
        getData(){
            const params = {
                Id: this.data.id
            }

            this.$request(this.$api.CompanyNoticeModel, params, data=>{
                this.form.sort = data.result.sort;
                this.form.title = data.result.title;
                this.form.content = data.result.content;
            })
        },

        textChange(text){
            this.form.content = text;
        }
    }
};
</script>
