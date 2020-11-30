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

         <div class="seacher_msg">
          <input type="text" class="sousou"  v-model="searcherMsg"/>
          <div class="seach" @click="seacherlist">搜索</div>
        </div>

        </div>
        <div class="artic_main">
          <div class="havenone" v-if="smalltitlemsg.length== 0">
                没有信息了，谢谢
          </div>
          <div
            v-for="(item,index) in smalltitlemsg"
            :key="index"
            v-html="item.content"
            v-if="smalltitlemsg.length==1&&pageparm.total == 1"
            class="artic_detail"
          >{{item.content}}</div>
          <div
            v-for="(item,index) in smalltitlemsg"
            :key="index"
            v-if="smalltitlemsg.length>1 || pageparm.total >1"
            class="artic_detail_list"
            @click="link_to(item)"
          >
            <img :src="item.image" alt />
            <label>{{item.title}}</label>
            <span>{{item.summary}}</span>
            <span>{{item.createTime.split(" ")[0]}}</span>
          </div>
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
import { BASE_FIEL_URL } from "../../config/index";
import Pagination from "../components/Pagination";
import Swiper from "swiper";

export default {
  data() {
    return {
      msgID:localStorage.getItem("message"),
      title_message: "",
      color_style: 0,
      small_name: "",
      smalltitlemsg: "",
      pageparm: {
        page: 1,
        pageSizes: [5],
        rows: 5,
        total: 0
      },

      mySwiper:'',
      bigpicture:'',

      searcherMsg:''
    };
  },
  components: {
    headers: headers,
    footers: footers,
    Pagination: Pagination
  },
  created() {
    this.getsmalltitle();
    this.getSmallmeg(this.pageparm);
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
    //--------------------------------------------------------------------------获取页面的小标题栏信息
    getsmalltitle() {
      var titleID = this.msgID.split(",")[0];
      axios({
        methods: "GET",
        baseURL: "/api/field/tree?" + "id=" + titleID
      }).then(res => {
        this.title_message = res.data.data;
        var arr=res.data.data.sonList
        var smalltitle=this.msgID.split(",")[1]
       for(let i=0;i<arr.length;i++){
            if(arr[i].id==smalltitle){
              this.color_style=i
              this.small_name=arr[i].name                                           
               break
            }
       }
      });
    },
    //-------------------------------------------------------------------分页展示数据
    getSmallmeg(parm) {
      parm.fieldId = this.msgID.split(",")[1]?this.msgID.split(",")[1]:'';
      axios({
        methods: "GET",
        baseURL: "/api/article/list",
        params: {keyword:parm.keyword, fieldId: parm.fieldId ,page: parm.page, rows: parm.rows }
      }).then(res => {
        if (res.data.code != 200) {
           this.smalltitlemsg = [];
        }else{
        this.pageparm.page = res.data.data.currentPage;
        this.pageparm.rows = res.data.data.currentPageTotalElements;
        this.pageparm.total = Number(res.data.data.totalElements);
        var arr = res.data.data.list;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].image[0] === "/"){
            arr[i].image = BASE_FIEL_URL + arr[i].image;
          }
        }
        this.smalltitlemsg = res.data.data.list;
        }
      });
    },
    changestyle(index, item) {
      this.color_style = index;
      localStorage.setItem("message",[item.fatherId, item.id]);
      if (item.type == "1") {
        location.href = "/field";
      } else {
        location.href = "/detail";
      }
    },
    link_to(item) {
      location.href = "/Article_details" + item.id;
    },
    // 分页插件事件
    callFather(param) {
      this.pageparm.page = param.currentPage;
      this.pageparm.rows = param.pageSize;
      this.getSmallmeg(this.pageparm);
    },
    seacherlist(){
      let parm =this.pageparm;
        parm.keyword = this.searcherMsg;
        this.getSmallmeg(parm)
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
<style src="../../static/css/filed.css"   scoped="scoped">
</style>>