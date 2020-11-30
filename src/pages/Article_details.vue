<template>
     <div class="container">
            <headers></headers>
            <div class="main">
                <div class="main_header">{{message.title}}</div>
                <div class="main_time">{{message.createTime}}</div>
                <div class="ql-snow">
                        <div v-html="message.content" class="ql-editor"></div>
                </div>        
            </div>
            <footers></footers>
    </div>
    
</template>
<script>
import headers from "../components/headers.vue";
import footers from "../components/footers.vue";
import axios from "axios";
import {formatObject} from '../../static/js/check-value'
import {BASE_FIEL_URL} from '../../config/index'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
    data(){
        return{
            message:''
        }
    },
    components: {
            headers:headers,
            footers: footers
    },
    created(){
    },
    mounted(){
        var local=window.location.href
        var id=local.split("Article_details")[1]
        axios({
            methods: "GET",
            baseURL: "/api/article/"+id
            }).then(res => {
                if(res.data.data.image[0] ==='/'){
                     res.data.data.image= BASE_FIEL_URL+ res.data.data.image;
                };  
                this.message=res.data.data
        });
    }
}
</script>
<style>
</style>
<style   src="../../static/css/Article_details.css"    scoped="scoped">
</style>
