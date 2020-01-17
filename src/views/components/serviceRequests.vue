<template>
    <div style="width:100%;height:300px;" ref="service_request_con"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'serviceRequests',
    props:{
        data: Object
    },
    mounted () {
        //console.log(this.refs);
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            grid: {
                top: '3%',
                left: '1.2%',
                right: '5%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: this.data.x
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {normal: {
                        color: '#e3e0f1'
                    }},
                    data: this.data.y
                }
            ]
        };
        const serviceRequestCharts = echarts.init(this.$refs['service_request_con']);
        serviceRequestCharts.setOption(option);

        window.addEventListener('resize', function () {
            serviceRequestCharts.resize();
        });
    }
};
</script>