<template>
  <div class="call_msg">
    <headers></headers>
    <div class="picture">
          <div class="lun swiper-container">      
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,index) in bigpicture" :key="index">
                  <img
                    :src="item.carouselLink"
                    alt
                  />
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
    </div>
    <div class="contact_left">
      <p>联系我们</p>
      <ul>
        <li
          v-for="(item,index) in tabs"
          :key="index"
          :class="{active:num==index}"
          @click="table(index,item)"
        >{{item}}</li>
      </ul>
    </div>
    <div class="main">
      <div class="contact_right">
        <div class="header">
          <span>首页 ></span>
          <span>联系我们></span>
          <span>{{callmsg}}</span>
        </div>
        <div class="artic_main" v-show="this.num==0">
          <p>{{company.name}}</p>
          <ul>
            <li>
              <img src="../../static/img/dizhi.png" alt />
              地址：{{company.address}}
            </li>
            <li>
              <img src="../../static/img/dianhua.png" alt />
              电话：{{company.phone}}
            </li>
            <li>
              <img src="../../static/img/youxiang.png" alt />
              邮箱：{{company.email}}
            </li>
            <li>
              <img src="../../static/img/youbian.png" alt />
              微信号：{{company.wmp}}
            </li>
            <li>
              <img src="../../static/img/chuanzhen.png" alt />
              小程序号:{{company.wpp}}
            </li>
          </ul>
          <div class="map">
            <div id="allmap"></div>
          </div>
        </div>
        <div class="form_msg" v-show="this.num==1">
          <ul>
            <li>
              <label>联系人：</label>
              <input type="text" placeholder="请输入您的名字" v-model="message.name" />
              <span></span>
            </li>
            <li>
              <label>电话：</label>
              <input type="iphone" placeholder="请输入您的电话" v-model="message.phone" />
              <span></span>
            </li>
            <li>
              <label>邮箱：</label>
              <input type="email" placeholder="请输入您的邮箱" v-model="message.email" />
              <span></span>
            </li>
            <li>
              <label>公司名称：</label>
              <input type="text" placeholder="请输入您的公司名称" v-model="message.companyName" />
              <span></span>
            </li>
            <li>
              <label>留言类容：</label>
              <textarea
                name
                id
                style="width:300px;height:100px"
                placeholder="请输入您的留言"
                v-model="message.content"
              ></textarea>
              <span></span>
            </li>
            <li style="width:550px;line-height:30px">
              <div style="transform: scale(0.7);font-size:13px">
                <i style="color:red">*</i>
                感谢您的留言,反馈问题或意见我们会在通过审核后，第一时间与您联系!!!
              </div>
            </li>
          </ul>
          <button class="submite" :style="{'background':backg}">提交</button>
          <button class="resetting">重置</button>
        </div>
      </div>
    </div>
    <footers></footers>
  </div>
</template>
<script>
import axios from "axios";
import Swiper from "swiper";
import headers from "../components/headers.vue";
import footers from "../components/footers.vue";
import { isEmpty } from "../../static/js/check-value";
import { formatObject } from "../../static/js/check-value";
export default {
  data() {
    return {
      tabs: ["联系方式", "在线留言"],
      num: 0,
      callmsg: "联系方式",
      company: "",
      backg: "#111F3F",
      message: {
        name: "",
        phone: "",
        email: "",
        companyName: "",
        content: ""
      },
      mySwiper:'',
      bigpicture:'',
    };
  },
  components: {
    headers: headers,
    footers: footers
  },
  created() {
    this.getcompanymsg();
      axios({
            methods: "GET",
            baseURL: "/api/carousel/list"+formatObject({fieldId:"0"})
            }).then(res => {
              for (const key in res.data.data.list) {
                if (res.data.data.list.hasOwnProperty(key)) {
                  if(res.data.data.list[key].carouselLink && res.data.data.list[key].carouselLink[0] ==='/'){
                      res.data.data.list[key].carouselLink = BASE_FIEL_URL+res.data.data.list[key].carouselLink;
                  };                  
                }
              }
            this.bigpicture=res.data.data.list
        });
  },
  methods: {
     initSwiper () {
        setTimeout(()=>{
            //--------------------------------------------------------------------------头部图片轮播
          this.mySwiper = new Swiper(".lun", {
              loop: true,
              autoplay: {
                delay: 3000,
                disableOnInteraction: false
              },
              pagination: {
                el: ".swiper-pagination"
              },
              // initialSlide :0,
              observer:true,//修改swiper自己或子元素时，自动初始化swiper
              observeParents:true//修改swiper的父元素时，自动初始化swiper
            });
        },300)
      },
    table(index, item) {
      this.num = index;
      this.callmsg = item;
    },
    getcompanymsg() {
      axios({
        methods: "GET",
        baseURL: "/api/companyInfo"
      }).then(res => {
        this.company = res.data.data;
        var map = new BMap.Map("allmap");
        var point = new BMap.Point(
          this.company.baiduMapLat,
          this.company.baiduMapLon
        );
        map.centerAndZoom(point, 20);
        map.addOverlay(new BMap.Marker(point));
      });
    }
  },
   mounted(){
     this.$nextTick(() => {
        this.initSwiper()
      })
  },watch:{
			$route:{
				handler(now){
					if(now.path=="/field"){
						this.mySwiper.autoplay.start()
					}else{
						this.mySwiper.autoplay.stop()
					}
				}				
			}
			
			
		},
};
</script>
<style   src="../../static/css/contact.css"   scoped="scoped">
</style>