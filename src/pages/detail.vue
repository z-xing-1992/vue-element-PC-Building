<template>
  <div class="field">
    <headers></headers>
    <div class="picture" v-if="title_message.backgroundImage">
      <img :src="title_message.backgroundImage" alt />
    </div>
     <div class="picture" v-else>
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
    <div class="field_left">
      <p>{{title_message.name}}</p>
      <ul>
        <li
          v-for=" (item,index) in title_message.sonList"
          :key="index"
          :class="color_style == index ?'bot_style' :''"
          @click="changestyle(index,item)"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="main">
      <div class="field_right">
        <div class="header">
          <span>首页 ></span>
          <span>{{title_message.name}}></span>
          <span>{{small_name}}</span>
        </div>
        <div class="artic_main">
          <div
            v-for="(item,index) in smalltitlemsg"
            :key="index"
            class="artic_detail_list demo-image__preview"
            @click="imgInfo(item)"
          >
             <el-image 
                style="width: 192px; height: 163"
                :src="item.url" 
                @click="getbigIMG(item.url)"
                :preview-src-list="imgList">
            </el-image>
            <label>{{item.alias}}</label>
          </div>  
        </div>
        <div class="fenye">
            <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
        </div>
      </div>
    </div>
    <footers></footers>
  </div>
</template>
<script>
import axios from "axios";
import headers from "../components/headers.vue";
import footers from "../components/footers.vue";
import { formatObject } from "../../static/js/check-value";
import { isEmpty } from "../../static/js/check-value";
import { BASE_FIEL_URL } from "../../config/index";
import Pagination from "../components/Pagination";
import Swiper from "swiper";
export default {
  data(){
    return {
      msgID: localStorage.getItem("message"),
      title_message: "",
      color_style: 0,
      small_name: "",
      smalltitlemsg: "",
      imgList:[],
       pageparm: {
        page: 1,
        pageSizes: [5],
        rows: 5,
        total: 0
      },
       mySwiper:'',
      bigpicture:''
    };
  },
  components: {
    headers: headers,
    footers: footers,
    Pagination: Pagination
  },
  created() {
    this.getsmalltitle();
    this.getSmallpic(this.pageparm);
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
      getbigIMG(url){
          this.imgList = [];
           this.imgList.push(url) 
      },
    //--------------------------------------------------------------------------获取页面的小标题栏信息
    getsmalltitle() {
      var titleID = this.msgID.split(",")[0];
      axios({
        methods: "GET",
        baseURL: "/api/field/tree?" + "id=" + titleID
      }).then(res => {
        this.title_message = res.data.data;
        var arr = res.data.data.sonList;
        var smalltitle = this.msgID.split(",")[1];
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id == smalltitle) {
            this.color_style = i;
            this.small_name = arr[i].name;
            break;
          }
        }
      });
    },
    //-------------------------------------------------------------------分页展示数据
    getSmallpic(parm) {
      var small_title = this.msgID.split(",")[1];
      axios({
        methods: "GET",
        baseURL: "/api/photo/list" + formatObject({ fieldId: small_title }),
        params: { page: parm.page, rows: parm.rows }
      }).then(res => {
        if (res.data.code != 200) {
          this.smalltitlemsg = [];
        } else {
          this.pageparm.page = res.data.data.currentPage;
          this.pageparm.rows = res.data.data.currentPageTotalElements;
          this.pageparm.total = Number(res.data.data.totalElements);
          var arr = res.data.data.list;
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].url[0] === "/") {
              arr[i].url = BASE_FIEL_URL + arr[i].url;
            }
          }
          this.smalltitlemsg = res.data.data.list;
        }
      });
    },
    changestyle(index, item) {
      this.color_style = index;
      localStorage.setItem("message", [item.fatherId, item.id]);
      if (item.type == "1") {
        location.href = "/field";
      } else {
        location.href = "/detail";
      }
    },
    imgInfo(item) {
      if (!isEmpty(item.redirectUrl)) {
        location.href = item.redirectUrl;
      }
    },
     callFather(param) {
      this.pageparm.page = param.currentPage;
      this.pageparm.rows = param.pageSize;
      this.getSmallpic(this.pageparm);
    }
  },
   mounted(){
     this.$nextTick(() => {
        this.initSwiper()
      })
  },watch:{
			$route:{
				handler(now){
					if(now.path=="/detail"){
						this.mySwiper.autoplay.start()
					}else{
						this.mySwiper.autoplay.stop()
					}
				}				
			}
		},
};
</script>
<style>
.artic_main .el-image-viewer__img{
    width: 600px;
    height:600px;
}  
</style>
<style src="../../static/css/detail.css" scoped="scoped"/>