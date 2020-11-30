<template>
  <div class="headers">
     <!-- <div class="header_msg"> -->
        <div class="header">
            <div class="logo">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149.08 149.08" width="70px" height="30px"><defs><svg:style type="text/css">.cls-1{fill:#d61518;}.cls-2{fill:#c39c61;}</svg:style></defs><title>资源 1</title><g id="图层_2" data-name="图层 2"><g id="图层_1-2" data-name="图层 1"><path class="cls-1" d="M116.31,29.82a9,9,0,1,1-9-9,9,9,0,0,1,9,9"/><rect class="cls-2" x="86.47" y="101.38" width="8.95" height="23.85"/><rect class="cls-2" x="86.47" y="71.58" width="8.95" height="23.85"/><path class="cls-2" d="M74.54,0a74.54,74.54,0,1,0,74.54,74.54A74.63,74.63,0,0,0,74.54,0m68.3,68.58H116.29V61.12h25.51a68.18,68.18,0,0,1,1.05,7.45m-2.53-13.42h-24V47.71h21.36a68.07,68.07,0,0,1,2.67,7.45M65.6,142.52q-3-.4-6-1V35.81l-4.47,6H41.74v70l6,4.47V65.6h6v62.62L35.78,114.79v-73h-6v84.66a69.22,69.22,0,0,1-6-5.78V41.8H14.3a68.88,68.88,0,0,1,3.67-6h5.89V28.4a69.37,69.37,0,0,1,6-5.78V35.84H52.17L74.47,6h.07a69.26,69.26,0,0,1,7.09.37l-16,21.49Zm60.87-23.25H107.34V107.34h27.41a68.78,68.78,0,0,1-8.29,11.93m11.18-17.89H107.34V89.47l34.13,0a68,68,0,0,1-3.82,11.92M101.38,83.51v41.72h19.31a68.61,68.61,0,0,1-25.27,14.62v-8.66H71.56v-6H80.5V101.39H71.56v-6H80.5V71.58H71.56v-6H80.5V41.77H71.56v-6H80.5v-12h6v12h8.95v6H86.47V65.61h8.95V9.21a68.93,68.93,0,0,1,39.34,32.53H110.32v32.8h32.8a68.8,68.8,0,0,1-.6,8.95Z"/></g></g></svg>
                  <span>广州雄昌建设有限公司</span>
            </div>
        </div>
    <!-- </div> -->
    <div class="title">
      <div class="title_artic">
        <ul class="title_artic_ul">
          <li
            class="tab_title"
            :class="actiove == index ?'Active' :'' "
            v-for="(item,index) in filedlist"
            @mouseenter="cutTabClick(index)"
            :key="index"
            @click.stop="link_to(index,item)"
            @mouseleave="outesty"
          >
            {{item.name}}
            <ul class="tab_title_list" v-show="actiove == index" >
              <li
                v-for="(list_item,index) in sonfiledlist"
                :key="index"
                @mouseenter="listfild(index)"
                 @mouseleave="outliststyle"
                :class="afieldtiove == index ?'sonActive' :'' "
                @click.stop="sonfieldID(item,list_item)"
              >
               {{list_item.name}}
              </li>
            </ul>
          </li>
    
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {formatObject} from '../../static/js/check-value'
export default{
    data(){
        return{
            actiove: localStorage.getItem("frist_title")?localStorage.getItem("frist_title"):0,
            afieldtiove: localStorage.getItem("second_title")?localStorage.getItem("second_title"):0,
            filedlist: [],
            sonfiledlist: [],
            small_picture:"",
            }
    },
    created(){
           this.getalltitle()
    },
    methods:{
 //------------------------------------------------------------------获取头部所有标题      
        getalltitle(){
             axios({
              methods: "GET",
              baseURL: "/api/field/list"+formatObject({sortBy:"sortNumber_ASC",fatherId:"0"})
              }).then(res => {
              this.filedlist =res.data.data.list  
              this.filedlist.unshift({
                  name: "首页"
              });
              this.filedlist.push({
                  name: "联系我们"
              });
            });
      
        },
         cutTabClick(index) {
            // -------------------------------------------------------------获取子栏目详细信息
            this.actiove = index;
            this.sonfiledlist = this.filedlist[index].sonList;
            },
            outesty(index) {
            this.actiove=localStorage.getItem("frist_title")?localStorage.getItem("frist_title"):0
            this.sonfiledlist = "";
            },
            listfild(index) {
            this.afieldtiove = index;
            },
            outliststyle(){
               this.afieldtiove=localStorage.getItem("second_title")?localStorage.getItem("second_title"):0
            },
            //---------------------------------------------------------------------------点击栏目 路由跳转分类型跳转
            link_to(index,item){
               this.actiove=index
               localStorage.removeItem("second_title")
               localStorage.setItem("frist_title",this.actiove)   //缓存对头部一级标题栏的状态保存
               if(index==0){
                  location.href="/"
                  // this.$router.push("/")
               }else if(item.name=="联系我们"){
                  // this.$router.push("/contact")
                  location.href="/contact"
               }
               else  if(this.sonfiledlist[0].type==1){              
              // else  if(item.type==1){
                  localStorage.setItem("message",[item.id,item.sonList[0].id])  //缓存大小标题ID
                  location.href="/field"
                  // this.$router.push("/field")
                }               
                // else if(item.type==2){
                 else if(this.sonfiledlist[0].type==2){  
                  localStorage.setItem("message",[item.id,item.sonList[0].id])  //缓存大小标题ID
                  location.href="/detail"
                  //  this.$router.push("/detail")
                }
            },
             sonfieldID(item,list_item){
              localStorage.setItem("frist_title",this.actiove)   //缓存对头部一级标题栏的状态保存
              localStorage.setItem("second_title",this.afieldtiove)       //缓存对头部二级标题栏的状态保存
              localStorage.setItem("message",[item.id,list_item.id])  //缓存大小标题ID
                if(list_item.type==1){
                   location.href="/field"
                  //  this.$router.push("/field")
                }else if(list_item.type==2){
                  location.href="/detail"
                  //  this.$router.push("/detail")
                }
               
            }
    }
}
</script>

<style src="../../static/css/header.css"   scoped="scoped">
</style>