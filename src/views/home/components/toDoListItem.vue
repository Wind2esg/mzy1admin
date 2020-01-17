<style lang="less">
    @import './styles/to-do-list-item.less';
</style>

<template>
    <Row class="to-do-list-item" :class="{'item-hover':hover}" @mouseenter.native="handleHover" @mouseleave.native="handleOut">
        <Col span="3" class="item">
            {{index}}
        </Col>
        <Col span="7" class="item">
            {{data.name}}({{data.roleName}})
        </Col>
        <Col span="7" class="item">
            {{data.phone}}
        </Col>
        <Col span="7" class="item">
            提货量{{data.stock}}
        </Col>
    </Row>
</template>

<script>
export default {
    name: 'toDoListItem',
    data () {
        return {
            hover: false
        };
    },
    props: {
        data: Object,
        index: Number
    },
    methods: {
        handleHover(){
            this.hover = true;
        },
        handleOut(){
            this.hover = false;
        }
    }
};
</script>