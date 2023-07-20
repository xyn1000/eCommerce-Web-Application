<template>

<div>
  <SHeader></SHeader>
  <div class ="SoldOutDiv">
    <h1 class="question-title">Sold Out Soon</h1>
    <div class="question-area">
      <a v-for="(item,index) in this.soldOutList" :key="index" @click="handleItemDetail(item)" >
<!--        <img alt src="https://img12.360buyimg.com/n1/jfs/t1/68636/31/9824/169738/5d780ed7E97e88252/7b62380330636738.jpg" class="image" >-->
        <img alt :src="item.image" class="image" >
        <div>{{ item.title.split(" ").slice(0,5).join(' ') }}</div>
        <div>${{ item.price }}</div>
      </a>

    </div>

  </div>


  <div class ="BestSellerDiv">
    <h1 class="question-title">Best Sellers</h1>
    <div class="question-area">
      <a v-for="(item,index2) in this.bestSellerList" :key="index2" @click="handleItemDetail(item)">
<!--        <img alt src="https://img12.360buyimg.com/n1/jfs/t1/68636/31/9824/169738/5d780ed7E97e88252/7b62380330636738.jpg" class="image" >-->
        <img alt :src="item.image" class="image" >
        <div>{{ item.title.split(" ").slice(0,5).join(' ') }}</div>
        <div>Rating: {{ item.avgRating }}</div>
      </a>

    </div>

    <!-- filtered.forEach(listing => {
                    let ratingSum = 0;
                    listing.reviews.map((ele) => ratingSum += ele.rating);
                    listing.avgRating = ratingSum / listing.reviews.length;
                });
                // Sort by average rating, desc
                const sorted = filtered.sort(function (a, b) { return b.avgRating - a.avgRating });
                const sliced = sorted.slice(0, 5); -->

  </div>
  <div class="copyright">
    <p>Copyright © 2022 WebDev-18. All rights reserved. </p>
  </div>

 </div>


</template>


<script>
import SHeader from "@/components/SHeader";
import {getLast5Stock, getTop5Rating} from "@/api/listing";
import {createShoppingCart, getShoppingCartJSON} from "@/utils/cart";

export default {
  name: "HomePage",
  mounted() {
    //check if a cart is created
    if (getShoppingCartJSON()==null){
      createShoppingCart();
    }


    getTop5Rating().then(res=>{
      console.log(res)
      if(res.status === 200){
        // this.bestSellerList = res.data;
        res.data.forEach(listing => {
                    let ratingSum = 0;
                    listing.reviews.map((ele) => ratingSum += ele.rating);
                    listing.avgRating = (ratingSum / listing.reviews.length).toFixed(2);
                });
        this.bestSellerList = res.data;

      }else {
        alert("Cannot get now");
      }
    })
        .catch(err =>{
          console.log(err)
        });
    getLast5Stock().then(res=>{
      console.log(res)
      if(res.status === 200){
        this.soldOutList = res.data;

      }else {
        alert("Cannot get now");
      }
    })
        .catch(err =>{
          console.log(err)
        });
  },
  methods: {
    handleItemDetail: function (item){
      sessionStorage.removeItem("item");
      sessionStorage.setItem("item",JSON.stringify(item));
      this.$router.push({path: '/Item'});
    }
  },
  data() {
    return {
      bestSellerList: [],
      soldOutList: []
    }
  },
  components: {
    SHeader,
  },
}
</script>

<style scoped>

.SoldOutDiv{
  background-color: #C4C4C4;

}

.BestSellerDiv{
  background-color: #C4C4C4;

}

.block {
  /*border: 1px solid black;*/
  width: 80%;
  display: block;
  margin: 5px 0;
}

label {
  display: inline-block;
  width: 30%;
  text-align: right;
  margin-right: 30px;
}

input, textarea {
  width: 50%;
}


.question-area {
  background-color: #ffffff;
  padding-bottom: 20px;
  border-top: 1px solid #e3e3e3;
}
.question-area a{
  display:inline-block;
  width:19%;
  cursor: pointer;
}
.question-area a:not(:first-child) {
  border-left: 1px solid #e3e3e3;
}
.question-area a img{
  width:50%;
  height:50%;
  margin:0 auto;
}
.question-area a div {
  font-weight: normal;
  font-size: 14px;
  text-align: center;
}

h1.question-title {
    padding: 0.3em;
    padding-left: 30px;
    margin-top: 0.67em;
    margin-bottom: 0;
    background-color: #f4f4f5;
}

.copyright {
    text-align: center;
    font-size: small;
    color: gray;
}
</style>
