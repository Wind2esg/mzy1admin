<style lang="less">
  .statistics_pages {
    .selectType {
      width: 140px;
      vertical-align: top;
      margin-left: 5px;
    }
    .card_title {
      overflow: visible;
      font-weight: 300;
    }
    .data-source-row {}
  }
</style>
<template>
  <Row class="statistics_pages" :gutter="16" style="overflow:auto;height:100%;margin-botom:30px;">

    <Col span="14">
    <Card class="">
      <p slot="title" class="card_title">
        <Icon type="android-map"></Icon>
        <span>代理商地区分布统计图</span>
        <Select v-model="roleId" class="selectType" placeholder="选择代理等级" size="small" @on-change="role_change">
          <Option v-for="(item,index) in roleList" :value="item.id" :key="index">{{ item.roleName }}</Option>
        </Select>
      </p>
      <div class="data-source-row">
        <visite-volume :data="areaVolume" toggleTitle="分布数量"></visite-volume>
      </div>

    </Card>

    <!-- 区域销售统计 -->
    <Card style="margin-top:30px;">

      <p slot="title" class="card_title">
        <span>区域销售统计</span>
      </p>

      <div class="data-source-row">
        <visite-volume :data="areaVolume1"  toggleTitle="销售数量"></visite-volume>
      </div>

    </Card>

    </Col>

    <!-- 右边 -->
    <Col span="10">

    <!-- 城市分布 -->
    <Card class="">
      <p slot="title" class="card_title">
        <Icon type="map"></Icon>
        <span>城市分布</span>
        <Select v-model="provinceId" class="selectType" placeholder="选择省份" size="small" @on-change="province_change">
          <Option v-for="(item,index) in provinceList" :value="item?item:''" :key="index">{{item}}</Option>
        </Select>
      </p>
      <div class="data-source-row">
        <Table :loading="loading" :columns="columns" :data="cityData" size="small"></Table>
      </div>
    </Card>

    <!-- 销售额 -->
    <Card style="margin-top:337px;">
      <p slot="title" class="card_title">
        <Icon type="map"></Icon>
        <span>选择城市</span>
     <!--    <Select v-model="provinceId2" class="selectType" placeholder="选择省份" size="small" @on-change="Balance_change">
          <Option v-for="(item,index) in provinceList1" :value="item" :key="index">{{ item }}</Option>
        </Select> -->

        <!-- 选择地区 -->
        <Select v-model="model1" class="selectType" placeholder="选择省份" size="small"  @on-change="Balance_change">
          <Option v-for="(item,index) in AreaData.Province" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>

      </p>
      <div class="data-source-row">
        <Table :loading="loading1" :columns="columns1" :data="cityData1" size="small" @on-sort-change='sortOrder' ></Table>
      </div>

      <div style="margin-top: 20px;margin-left: 20px;">
        <Page :total="talas" :page-size="PageSize" @on-change="pageChange"></Page>
      </div>

      


    </Card>

    </Col>

  </Row>

</template>
<script>
  import utils from '@/libs/util';
  import visiteVolume from './components/visiteVolume.vue';
  import areaData               from '@/libs/arealist.json';

  //import areaVolume from './data/areaVolume.json';
  let that;

  export default {
    components: {
      visiteVolume
    },
    created() {
      that = this;
      that.ProvinceBalance();
      utils.getRoleList(that, data => {
        that.roleList = data
      })


      return that.GetAreaVolume()
    },
    data() {
      return {
        roleId: '',
        roleList: [],
        provinceId:'',
        provinceList:[],
        provinceList1: [],
        loading: false,
        loading1: false,
        areaVolume: {},
        areaVolume1: {},
        cityData: [],
        cityData1: [],
        PageSize: 10,
        PageIndex: 1,
        AreaData: areaData,
        model1: '',
        talas:0,
        IsAsc:'',
        columns: [{
            title: '城市',
            key: 'city',
            align: 'center',
          },
          {
            title: '用户数',
            key: 'memberCount',
            sortable: true,
            //align: 'center',
            render(disrow, column, index) {

              let arr = []
              let row = column.row
              let num = row.memberCount / that.maxcity * 100

              arr.push(disrow('div', {
                style: {
                  'padding-right': "10px",
                  textAlign: "left",
                  'min-width': '18%'
                }
              }, row.memberCount))

              arr.push(disrow('Progress', {
                props: {
                  'status': 'success',
                  'percent': num,
                  'hide-info': true
                },
                style: {
                  'display': 'block',
                  '-webkit-box-flex': 1,
                }
              }))

              return disrow('div', {
                style: {
                  textAlign: "center",
                  overflow: 'hidden',
                  display: '-webkit-box',
                  '-webkit-box-pack': 'center',
                  '-webkit-box-align': 'center'
                }
              }, arr);
            }
          }
        ],

        columns1: [{
            title: '城市',
            key: 'cityName',
            align: 'center',
          },
          {
            title: '销售额',
            key: 'sellBalance',
            sortable: true,
            //align: 'center',
            render(disrow, column, index) {
              
              let arr = []
              let row = column.row
              let num = row.sellBalance

              arr.push(disrow('div', {
                style: {
                  'padding-right': "10px",
                  textAlign: "left",
                  'min-width': '18%'
                }
              }, row.sellBalance))

              arr.push(disrow('Progress', {
                props: {
                  'status': 'success',
                  'percent': num,
                  'hide-info': true
                },
                style: {
                  'display': 'block',
                  '-webkit-box-flex': 1,
                }
              }))

              return disrow('div', {
                style: {
                  textAlign: "center",
                  overflow: 'hidden',
                  display: '-webkit-box',
                  '-webkit-box-pack': 'center',
                  '-webkit-box-align': 'center'
                }
              }, arr);
            }
          }
        ],

      }
    },

    methods: {
      pageChange(value) {
        this.pageIndex = value;
        that.loading1 = true
        return that.BalanceChart()
      },

      GetAreaVolume(callback) {
        let requedata = {
          RoleId: that.roleId
        };
        return that.$request(this.$api.GetMemberProvinceDistribution, requedata, data => {
          let x = [];
          let y = [];

          data.result.map(item => {
            x.push(item.province);
            y.push(item.memberCount);
          })

          that.provinceList = x;
          //if(!that.roleId) that.provinceList = areaVolume.x

          that.areaVolume = {
            x: x,
            y: y
          }
          return callback && callback()
        })
      },

      ProvinceBalance(callback) {

        return that.$request(this.$api.ProvinceOrderBalanceBargraph, {}, data => {
          let x = [];
          let y = [];
          data.result.map(item => {
            x.push(item.provinceName);
            y.push(item.sellBalance);
          })

          that.provinceList1 = x;
          //if(!that.roleId) that.provinceList = areaVolume.x

          that.areaVolume1 = {
            x: x,
            y: y
          }
          return callback && callback()
        })

      },

      // 省市销售金额状图
      BalanceChart() {

        let banlance = {
          ProvinceId: this.model1,
          IsAsc:this.IsAsc,
          PageIndex: this.PageIndex,
          PageSize: this.PageSize,
        }

        this.$request(this.$api.CityOrderBalanceBargraph, banlance, data => {

          that.cityData1 = data.result || [];
          that.talas= data.result.length;
          that.loading1 = false
        });

      },

      GetCityList() {
        let requedata = {
          Province: that.provinceId,
          RoleId: that.roleId
        };

        return that.$request(this.$api.GetMemberCityDistribution, requedata, data => {
          
          let count = 0;
          data.result.map(item => {
            count += item.memberCount;
          })
          that.maxcity = count;

          that.cityData = data.result || []
          that.loading = false
        })
      },

      //等级状态改变
      role_change(value) {
        that.provinceId = ''
        that.cityData = []
        return that.GetAreaVolume()
      },
      //省份状态改变
      province_change(value) {
        if(value) {
          that.loading = true;
          return that.GetCityList()
        }
      },

      // 销售金额的省的改变
      Balance_change(value) {
        if(value) {
          this.model1 = value;
          that.loading1 = true
          return that.BalanceChart()
        }
      },


      //恢复数据
      recoveryData(callback) {
        that.total = 0
        that.loading = true
        //that.apidata = []
        that.pageIndex = 1
        return callback && callback()
      },


       //排序

      sortOrder(event){
         if(event.order=="asc"){
           this.IsAsc=1;
         }else{
           this.IsAsc=0;
         }

         this.BalanceChart();
        
      }, 

    }
  };
</script>