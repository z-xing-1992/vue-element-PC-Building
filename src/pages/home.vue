<template>
  <div class="container">
     <headers></headers>
    <div class="swiper-container lunbo">
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
    <div class="artic">
      <div class="artic_mained">
        <div class="company_artic">
              <div class="company_artic_header">
                  <span>{{companymsg.name}}</span><span @click="linkto">more></span>
              </div>
              <img :src="img" alt=""/>
              <div class="company_artic_main">
                    <p v-for="(item,index) in companymsg.contentList" :key="index" v-if="index < 8" @click="linkInfo(item)">
                      <label>{{item.title}}</label>
                      <span>{{item.summary}}</span>
                      <span>{{item.createTime.split(" ")[0]}}</span>
                    </p>
              </div>
        </div>
        <div class="industry">
              <div class="industry_header">
                  <span>{{hangye.name}}</span><span @click="link_hangye">more></span>
              </div>
              <div class="industrymsg">
                   <p v-for="(item,index) in hangye.contentList" :key="index" v-if="index < 4" @click="hangyeInfo(item)">
                      <img :src="item.image" alt="" />
                      <span>{{item.summary}}</span>
                   </p>
              </div>
        </div>
      </div>
    </div>
    <div class="project_case_background">
      <div class="project_case">
        <div class="project_case_header">
          <span></span>
          <span>项目案例</span>
          <span></span>
        </div>
        <div class="project">
          <div class="swiper-container project_case_lun">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(item,index) in xiangmu" :key="index" @click="xiangmuInfo(item)">
                <img :src="item.image" alt />
                <p>{{item.title}}</p>
              </div>
            </div>
          </div>
          <div class="swiper-button-prev swiper-button-white"></div>
          <div class="swiper-button-next swiper-button-white"></div>
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
import {formatObject} from '../../static/js/check-value'
import {BASE_FIEL_URL} from '../../config/index'
export default {
  data() {
    return {
      mySwiper:'',
      projectmySwiper:'',
      bigpicture:'',
      project_lun:'',
      companymsg:'',
      hangye:"",
      img:"",
      xiangmu:""
    };
  },
  components: {
    headers:headers,
    footers: footers
  },
  created() {  
       this.getalltitle() 
 //---------------------------------------------------------------------------获取大轮播图片   
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
//-------------------------------------------------------------------------------------------------------获取公司资讯和行业新闻        
         axios({
              methods: "GET",
              baseURL: "/api/field/list"+formatObject({fatherId:"283981499877818368"})
              }).then(res => {
//--------------------------------------------------------------------------------------------------------获取公司资讯                
              for (const key in res.data.data.list[1].contentList) {
                if (res.data.data.list[1].contentList.hasOwnProperty(key)) {
                  if(res.data.data.list[1].contentList[key].image && res.data.data.list[1].contentList[key].image==='/'){
                     res.data.data.list[1].contentList[key].image = BASE_FIEL_URL+res.data.data.list[1].contentList[key].image;
                  };                  
                }
              }
              this.companymsg=res.data.data.list[1]
              this.img=res.data.data.list[1].contentList[0].image
//-----------------------------------------------------------------------------------------------------------获取行业资讯 
              for (const key in res.data.data.list[0].contentList) {
                if (res.data.data.list[0].contentList.hasOwnProperty(key)) {
                  if(res.data.data.list[0].contentList[key].image && res.data.data.list[0].contentList[key].image ==='/'){
                     res.data.data.list[0].contentList[key].image = BASE_FIEL_URL+res.data.data.list[0].contentList[key].image;
                  };                  
                }
              }
              this.hangye=res.data.data.list[0]
            });
  },
  methods: {
//-----------------------------------------------------------------------------------------获取项目轮播 
      getalltitle(){
             axios({
              methods: "GET",
              baseURL: "/api/article/list"+formatObject({fieldId:"283981103784525824"})
              }).then(res => {
                this.xiangmu=res.data.data.list
            });
      },
      initSwiper () {
        setTimeout(()=>{
            //--------------------------------------------------------------------------头部图片轮播
          this.mySwiper = new Swiper(".lunbo", {
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
      footeSwiper () {
        setTimeout(()=>{
          //---------------------------------------------------------------------------项目轮播
              this.projectmySwiper = new Swiper(".project_case_lun", {
                loop: true,
                autoplay: {
                  delay: 3000,
                  disableOnInteraction: false
                },
                slidesPerView: 3,
                spaceBetween: 20,
                navigation: {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev"
                },
                observer:true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents:true//修改swiper的父元素时，自动初始化swiper
              });
        },300)
      },
      linkto(){
        localStorage.setItem("message",[this.companymsg.fatherId,this.companymsg.id])
        if(this.companymsg.type=="1"){
           location.href="/field"
        }else{
            location.href="/detail"
        }
      },
      link_hangye(){
        localStorage.setItem("message",[this.hangye.fatherId,this.hangye.id])
        if(this.hangye.type=="1"){
           location.href="/field"
        }else{
            location.href="/detail"
        }
      },
      linkInfo(item){
          location.href="/Article_details"+item.id
      },
      hangyeInfo(item){
            location.href="/Article_details"+item.id
      },
      xiangmuInfo(item){
            location.href="/Article_details"+item.id
      }
  },
  mounted() {
       this.$nextTick(() => {
        this.initSwiper()
        this.footeSwiper()
      })
  },watch:{
			$route:{
				handler(now){
					if(now.path=="/"){
						this.mySwiper.autoplay.start()
						this.projectmySwiper.autoplay.start()
					}else{
						this.mySwiper.autoplay.stop()
						this.projectmySwiper.autoplay.stop()
					}
				}				
			}						
		},
};
</script>
<style src="../../static/css/home.css" scoped="scoped">
  
</style>
