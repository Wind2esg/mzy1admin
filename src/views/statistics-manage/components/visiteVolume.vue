<template>
    <div style="width:100%;height:380px" ref="visite_volume_con"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'visiteVolume',
    props:{
        data: Object,
        toggleTitle: {
            type: String,
            default: ''
        }
    },
    mounted () {
        
    },
    methods:{
        init(data){
            //console.log(JSON.stringify(data.x));
            const option = {
                tooltip : {
                    trigger: 'axis'
                },
                grid: {
                    top: '10%',
                    left: '1.2%',
                    right: '3%',
                    bottom: '4%',
                    containLabel: true
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : data.x,
                        axisLabel:{  
                             interval:0,//横轴信息全部显示  
                             rotate:-30,//-30度角倾斜显示  
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name: this.toggleTitle,
                        type:'bar',
                        data: data.y,
                        itemStyle: {normal: {
                            color: 'rgb(124, 181, 236)'
                        }},
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    },
                ]
            }

            const visiteVolume = echarts.init(this.$refs['visite_volume_con']);
            visiteVolume.setOption(option);

            window.addEventListener('resize', function () {
                visiteVolume.resize();
            });
        }
    },
    watch: {
        data(value){
            return this.init(value)
        }
    }
};
</script>
