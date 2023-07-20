<template>

<div>
  <SHeader></SHeader>



  <div class="advanceSearch" >
    <header>
      <div class="advanceDiv">
        <el-button  type="text" @click="changeSta" >advance search</el-button>
      </div>

      <div class="SearchItemDiv" v-show="sta">
        <div class="BrandDiv">

          <div class="selectBrand">Select Brand:</div>
          <el-select filterable placeholder="Brand" v-model="value"     @change="changeBrand()">
            <el-option
                v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

        </div>

        <div class="PriceDiv">


          <div class="block">
            <span class="demonstration">Price Range</span>
            <el-slider
                v-model="PriceValue"
                range
                :step="10"
                show-stops
                :max="1000" @change="changeRange()">
            </el-slider>

            <span class="priceRange">{{PriceValue}}</span>
          </div>


        </div>
      </div>

    </header>

  </div>




<div class="ItemListDiv">

  <div class="container" style="border: none;">

  <el-row>
    <el-col :span="6" v-for="list in this.resultList" :key="list._id"  :offset="list._id > 0 ? 2 : 0" >
      <el-card :body-style="{ padding: '10px' }">
        <img alt :src="list.image" class="image" >
        <div style="padding: 10px; font-size:0.85em;">
          <div class="item_info">
            <div class="item_title">{{ list.title.split(" ").slice(0,10).join(' ') }}</div>
            <div style="margin-bottom: 0.5em">{{ list.brand }}</div>
            <div>${{ list.price }}</div>
          </div>
          <!--          <div>Rating:{{ list.rating }}</div>-->
          <div class="bottom clearfix">
            <el-button type="text" class="button" @click="handleItem(list)">Show More</el-button>
          </div>

        </div>
      </el-card>
    </el-col>
  </el-row>


  </div>

</div>



  <footer class="copyright">
      <p>Copyright © 2022 WebDev-18. All rights reserved. </p>
  </footer>

</div>
</template>

<script>
import SHeader from "@/components/SHeader";
import {searchByTerm} from "@/api/listing";
export default {
  name: "searchPage",
  methods: {
    changeSta () {
      this.sta = !this.sta
    },

    renderPage: function (){
      // console.log("searchTerm "+this.searchTerm);
      // console.log(this.value);
      // console.log(this.PriceValue[0]);
      // console.log(this.PriceValue[1]);
      searchByTerm(this.searchTerm).then(res=>{
        if(res.status === 200){
          // console.log(res.data);
          sessionStorage.setItem("searchResults",JSON.stringify(res.data));
          this.resultList = JSON.parse(sessionStorage.getItem("searchResults"));


        }else {
          alert("Cannot search now");
        }
      })
          .catch(err =>{
            console.log(err)
          });
    },
    changeBrand(){
      //search again
      // console.log(this.value)
      if (this.value===null||this.value==="All"){
        //remove brand from query
        searchByTerm(this.searchTerm,null,this.PriceValue[0],this.PriceValue[1]).then(res=>{
          if(res.status === 200){
            // console.log(res.data);
            sessionStorage.setItem("searchResults",JSON.stringify(res.data));
            this.resultList = JSON.parse(sessionStorage.getItem("searchResults"));

          }else {
            // console.log(res);
            alert("Cannot search now");
          }
        })
            .catch(err =>{
              console.log(err)
            });
      }else{
        searchByTerm(this.searchTerm,this.value,this.PriceValue[0],this.PriceValue[1]).then(res=>{
          if(res.status === 200){
            // console.log(res.data);
            sessionStorage.setItem("searchResults",JSON.stringify(res.data));
            this.resultList = JSON.parse(sessionStorage.getItem("searchResults"));
          }else {
            // console.log(res);
            alert("Cannot search now");
          }
        })
            .catch(err =>{
              console.log(err)
            });
      }
    },
    changeRange(){
      // console.log(this.PriceValue[0]);
      // console.log(this.PriceValue[1]);
      if (this.value==="All"){
        searchByTerm(this.searchTerm,this.PriceValue[0],this.PriceValue[1]).then(res=>{
          if(res.status === 200){
            // console.log(res.data);
            sessionStorage.setItem("searchResults",JSON.stringify(res.data));
            this.resultList = JSON.parse(sessionStorage.getItem("searchResults"));

          }else {
            // console.log(res);
            alert("Cannot search now");
          }
        })
            .catch(err =>{
              console.log(err)
            });
      }else{
        searchByTerm(this.searchTerm,this.value,this.PriceValue[0],this.PriceValue[1]).then(res=>{
          if(res.status === 200){
            // console.log(res.data);
            sessionStorage.setItem("searchResults",JSON.stringify(res.data));
            this.resultList = JSON.parse(sessionStorage.getItem("searchResults"));

          }else {
            console.log(res);
            alert("Cannot search now");
          }
        })
            .catch(err =>{
              console.log(err)
            });
      }
    },
    handleItem:function (item){
      console.log(item);
      sessionStorage.removeItem("item");
      sessionStorage.setItem("item",JSON.stringify(item));
      this.$router.push({path: '/Item'});
    }
  },
  mounted() {
    this.searchTerm=this.$route.params.searchTerm;
    this.renderPage();
    let tmp = sessionStorage.getItem("searchResults");
    if (tmp!==null){
      this.resultList = JSON.parse(tmp);
    }
  },
  data() {
    return {
      sta: false,
      phoneList:{
        brand:'',
        price:'',
        rating:''
      },

      PriceValue: [0, 20000],
      resultList:[],

      options: [{
        value: 'All',
        label: 'All'
      }, {
        value: 'Apple',
        label: 'Apple'
      }, {
        value: 'Samsung',
        label: 'Samsung'
      }, {
        value: 'HTC',
        label: 'HTC'
      }, {
        value: 'Huawei',
        label: 'Huawei'
      },{
        value: 'Motorola',
        label: 'Motorola'
      },{
        value: 'LG',
        label: 'LG'
      },{
        value: 'Nokia',
        label: 'Nokia'
      },{
        value: 'Sony',
        label: 'Sony'
      },{
        value: 'BlackBerry',
        label: 'BlackBerry'
      }
      ],
      value: '',
      searchTerm: '',
      price: 0,


    }

  },
  components: {
    SHeader
  },

}
</script>

<style scoped>
@import "../css/search.css";




</style>
