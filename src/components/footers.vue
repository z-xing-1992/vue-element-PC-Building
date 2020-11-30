<template>
  <div class="footer">
    <div class="artic">
      <ul>
        <li>
          <span>联系方式</span>
          |
          <span>关于我们</span>
          |
          <span>人才招聘</span>
          |
          <span @click="houtai">后台登陆</span>
          |
          <span>友情链接</span>
        </li>
        <li>
          <a :href="item.redirectUrl" v-for="(item,index) in list_link" :key="index" style=" display: inline-block;:in;margin:0 10px;color:#9E9E9E;line-height:16px ;">
            <img :src="item.icon" alt="" style="width:16px;height:16px;display:block;float: left;margin:0 10px;"/>
            {{item.alias}}
          </a>
        </li>
        <li>© {{new Date().getFullYear()}} 版权所有 {{company.name}}</li>
        <li>地址：{{company.address}}</li>
        <li>电话：{{company.phone}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { BASE_FIEL_URL } from "../../config/index";
export default {
  data() {
    return {
      company: "",
      list_link: ""
    };
  },
  created() {
    this.getcompanymsg();
    this.getfriendlink();
  },
  methods: {
    //------------------------------------------------------获取公司信息
    getcompanymsg() {
      axios({
        methods: "GET",
        baseURL: "/api/companyInfo"
      }).then(res => {
        console.log(res.data.data)
        this.company = res.data.data;
      });
    },
    getfriendlink() {
      axios({
        methods: "GET",
        baseURL: "/api/friendLink/list"
      }).then(res => {
        for (const key in res.data.data.list) {
          if (res.data.data.list.hasOwnProperty(key)) {
            if (
              res.data.data.list[key].icon &&
              res.data.data.list[key].icon[0] === "/"
            ) {
              res.data.data.list[key].icon =
                BASE_FIEL_URL + res.data.data.list[key].icon;
            }
          }
        }
        this.list_link = res.data.data.list;
      });
    },
    //-------------------------------------------------------获取友情链接
    houtai() {
      location.href = BASE_FIEL_URL + "/admin";
    }
  }
};
</script>

<style src="../../static/css/footer.css"   scoped="scoped">
</style>
