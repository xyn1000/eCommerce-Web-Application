<template>
  <div>
    <SHeader></SHeader>
<div class ="itemPageContainer">
  <div class = "itemPageList" style="margin: 1.5em;">
    <div class ="item">
      <div class = item-left>
        <img alt :src="this.image" class="image" >
      </div>

      <div class = "item-middle">
        <h4 class="itemName">{{ title }}</h4>

        <div class ="itemBrand">Brand: {{ brand }}</div>
        <div class ="itemPrice">Price: ${{price}}</div>
        <div class ="itemStock">Stock: {{ stock }}</div>
        <div class="itemSeller">Seller: {{ seller }}</div>

        <input class="numberInput" type="number" v-model="addCartNum" step="1" min="0" max="100" style="font-size: large;">
        <button class="numberBtn" @click="handleCheckOut">Add to Cart</button>
        <div class ="quantity">Quantity: {{quantityInCart}}</div>

      </div>

      <!-- <div class="item-right">
        <input class="numberInput" type="number" v-model="addCartNum" step="1" min="0" max="100">
        <button class="numberBtn" @click="handleCheckOut">Add to Cart</button>
        <div class ="quantity">Quantity: {{addCartNum}}</div>
      </div> -->
    </div>

  </div>

<!--  <review-page></review-page>-->
  <!-- <div class="commentDiv">
    <div class="container">
      <h3>Comment:</h3>
      <button v-if="!active" class="reviewBtn" @click="handleLeaveReview">Leave a review</button>
      <div class="commentContent" v-if="active">

        <div class="ratingStar">
          <div class="block">
            <span class="demonstration">Rating</span>
            <el-rate v-model="form.rating"></el-rate>
          </div>
        </div>

        <div class="comment">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="Comment">
              <el-input type="textarea" v-model="form.comment"></el-input>

            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">Submit</el-button>
              <el-button @click="cancelReview">Cancel</el-button>
            </el-form-item>
          </el-form>
        </div>

      </div>
    </div>
  </div> -->

  <div class="reviewDiv">

    <div class="container">

      <div class="commentDiv">
    <div class="container" style="padding:0;margin:0;">
      <h3>Review:</h3>
      <button v-if="!active" class="reviewBtn" @click="handleLeaveReview">Leave a review</button>
      <div class="commentContent" v-if="active">

        <div class="ratingStar">
          <div class="block">
            <span class="demonstration">Rating</span>
            <el-rate v-model="form.rating"></el-rate>
          </div>
        </div>

        <div class="comment">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="Comment">
              <el-input type="textarea" v-model="form.comment"></el-input>

            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">Submit</el-button>
              <el-button @click="cancelReview">Cancel</el-button>
            </el-form-item>
          </el-form>
        </div>

      </div>
    </div>
  </div>

      <!-- <h3>Review:</h3> -->
      <div class="reviewContent" v-for="(review,index) in this.reviews.slice(0,count)" :key="index">
        <label class="reviewerName">{{ (!review.firstName || !review.lastName) ? 'Loading reviewer name...' : `${review.firstName} ${review.lastName}` }}</label>
        <!-- <label class="rating">Rating: {{review.rating}}</label> -->
        <el-rate
          v-model="review.rating"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}">
        </el-rate>
        <p v-if="review.comment.length<200" class="reviewText">{{review.comment}}</p>
        <div v-else>
          <p class="reviewText" >{{review.comment.slice(0,200) + "..."}}</p>
          <el-button type="text" class="button"  @click="handleShowMoreComment(index)" style="float:left; padding:0;">Show More</el-button>
          <el-button type="text" class="lessButton"  @click="handleShowLessComment(index)" style="display:none;">Show Less</el-button>
        </div>
      </div>
      <div style="text-align: center; margin-top: 0.5em;">
      <el-button v-if="this.reviews.length >this.count" type="text" class="flodButton"  @click="handleShowMoreReview()">Show More</el-button>
      <el-button v-if="this.count>3" type="text" class="flodButton"  @click="handleShowLessReview()" style="padding-right:1em;">Show Less</el-button>
      </div>
    </div>



  </div>


</div>
<div class="copyright">
    <p>Copyright © 2022 WebDev-18. All rights reserved. </p>
  </div>
  </div>
</template>

<script>
import SHeader from "@/components/SHeader";
import {createReview, getUserNameByID, getReviewsByListingID, injectReviewUserNames} from "@/api/listing";
import {addPhoneToShoppingCart, getShoppingCartJSON} from "@/utils/cart";
export default {
  name: "ItemPage",
  components: {
    SHeader
  },
  data(){
    return{
      title: '',
      price: '',
      reviews: [],
      brand: '',
      stock: '',
      seller: '',
      image: '',
      form: {
        comment: '',
        rating: 0
      },
      addCartNum: 0,
      count: 3,
      active:false,
      quantityInCart:0
    }
  },
  mounted() {
    this.renderPage();
    let cart = getShoppingCartJSON();
    for (let i=0;i<cart.length;i++){
        if (cart[i].lid===this.itemID){
          this.quantityInCart = cart[i].quantity;
        }else{
          this.quantityInCart = 0;
        }
    }
  },
  methods: {
    handleCheckOut: function () {
      // Check for user sign in status
      console.log(sessionStorage.getItem("user"));
      if (!sessionStorage.getItem("user")) {
        alert('You need to sign-in before using the shopping cart');
        this.$router.push({path: '/signin'});
        return;
      }
      let num = parseInt(this.addCartNum);
      if (num<=0){
          alert("please input a positive number");
          return;
      }
      // console.log(typeof(this.addCartNum)=='string')
      // console.log(typeof(num)=='string')
      // Check if item in cart, and if total number exceeds stock
      let cart = getShoppingCartJSON();
      // Check existence in cart
      for (let i=0;i<cart.length;i++){
        if (cart[i].lid===this.itemID){
          if (num+cart[i].quantity>this.stock){
            //refuse to add
            alert("Out of stock!");
            return;
          }else{
            //add
            addPhoneToShoppingCart(this.title,num,this.image,this.price,this.itemID,this.stock);
            alert("add successfully");
            this.quantityInCart = cart[i].quantity + num;
            console.log(this.quantityInCart);
            return;
          }
        }
      }

      if (num>0){
        if (this.stock-num>=0){
          //add to cart
          addPhoneToShoppingCart(this.title,num,this.image,this.price,this.itemID,this.stock);
          alert("add successfully");
          console.log(this.quantityInCart);
          this.quantityInCart = num;
          return;
        }
      }

        alert("Out of stock!");

    },
    renderPage: function(){
      // console.log(sessionStorage.getItem("item"));
      let item = JSON.parse(sessionStorage.getItem("item"));

      this.title=item.title;
      this.price = item.price;
      this.image=item.image;
      // this.reviews = item.reviews;
      this.brand = item.brand;
      this.stock = item.stock;
      this.seller = 'Loading...';
      this.itemID = item._id;

      getUserNameByID(item.seller)
        .then(result => {
          this.seller = `${result.data.firstName} ${result.data.lastName}`;
        })
        .catch(error => {
          console.log(error);
        });

      getReviewsByListingID(this.itemID).then(res=>{
        if(res.status === 200){
          // this.reviews = JSON.parse(res.data);

          const reviews = res.data;
          this.reviews = reviews;

          // Inject reviewer names
          injectReviewUserNames(reviews)
            .then(injectedReviews => {
              console.log(injectedReviews);
              this.reviews = injectedReviews;
            })
            .catch(error => {
              console.log(error);
              alert('Cannot load reviewer names, try refresh the page later.');
            });
          
          // console.log(this.reviews[0].comment);
        }else {
          alert("Cannot load reviews, try refresh the page later.");
        }
      })
          .catch(err =>{
            console.log(err)
          });
    },
    onSubmit: function (){
      if (this.form.comment.trim()===0){
        return;
      }
      createReview(this.form.rating,this.form.comment,this.itemID).then(res=>{
        // console.log(res)
        if(res.status === 200){
          alert("comment successfully");
          this.renderPage();
        }else {
          alert("Cannot comment now");
        }
      })
          .catch(err =>{
            console.log(err)
          });
    },
    handleShowMoreComment: function(num){
      console.log(this.reviews[num].comment);
      var reviewList = document.getElementsByClassName('reviewContent');
      console.log(reviewList[num])
      reviewList[num].querySelector('.reviewText').innerHTML=this.reviews[num].comment;
      reviewList[num].querySelector('.button').style.display="none";
      reviewList[num].querySelector('.lessButton').style.display="inline";
    },
    handleShowLessComment: function(num){
      var reviewList = document.getElementsByClassName('reviewContent');
      reviewList[num].querySelector('.reviewText').innerHTML=this.reviews[num].comment.slice(0,200);
      reviewList[num].querySelector('.button').style.display="inline";
      reviewList[num].querySelector('.lessButton').style.display="none";
    },
    handleShowMoreReview: function(){
      this.count+=3;
    },
    handleShowLessReview: function(){
      this.count = Math.max(3,this.count-3);
    },
    handleLeaveReview: function() {
      // Check for sign-in status
      if (!sessionStorage.getItem("user")) {
        alert('You need to sign-in before leaving a comment');
        return;
      }
      this.active = true;
    },
    cancelReview: function(){
      this.active = false;
    }
  },

}
</script>

<style scoped>
.itemPageList {
  background-color: #C4C4C4;

}
.image {
  /* width: 90%; */
  max-height: 400px;
  max-width: 408px;
  display: block;
}

.item-left{
  display: inline-block;
  margin-right: 40px;
  vertical-align: middle;
  width:30%;
}
.item-middle{
  display: inline-block;
  line-height:2.4;
  vertical-align: middle;
  width: 40%;
}

.item-right{
  float: right;
  display: inline-block;
  margin-right: 50px;
  vertical-align: middle;
  horiz-align: center;
}

.item-right input{
  width: 40px;
  padding: 10px;
}

.item-right button{
  padding: 10px;
  background-color: #C4E2FE;
  border-radius: 10px;
  border: none;
  margin-left: 50px;
  margin-top: 200px;
  cursor: pointer;

}

.item{
  margin: 2em;
}


.reviewContent{
  /* border: 2px solid black; */
  padding: 20px;
  background-color: white;
  margin-top:0.5em;

}

.commentContent{
  /* border: 2px solid black; */
  padding: 20px;
  background-color: white;
}

.container{
  background-color: #C4C4C4;
}

.reviewerName{
  margin-right: 20px;
}

.numberBtn, .reviewBtn{
    background-color: #f4f4f5;
    border: none;
    color: black;
    /* padding: 3px 3px; */
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 6px 3px;
    cursor: pointer;
    border-radius:5px;
    /* padding-top:0px; */
    padding-top: 5px;
    padding-bottom: 3.24px
}

.reviewBtn{
  padding: 16px 24px;
}

.copyright {
    text-align: center;
    font-size: small;
    color: gray;
}

.flodButton{
  font-size: larger;
}

</style>
