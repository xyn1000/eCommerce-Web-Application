<template>
  <div class="checkoutContainer">
    <div class="checkoutHeader">
      <img class="imgBtn" alt="home" src="../assets/home.png" id="homeButton" @click="handleHome">
    </div>
    <div class="checkoutTitle">
      <img alt="" src="../assets/cart.png">
      <label>Cart</label>
    </div>

    <div class="checkoutList">
      <!-- Placeholder if no item in cart -->
      <div class="item" v-show="this.cartList.length == 0">
        <div class="item-middle">
          <h4 class="itemName">You Don't have anything in your cart yet, why not check out some trending products at <router-link to="/">our homepage</router-link>?</h4>
        </div>
      </div>

      <div class="item" v-for="(item,index) in this.cartList" :key="index">
        <div class="item-left">
          <img alt="" :src="item.img" height="200px">
        </div>

        <div class="item-middle">
          <h4 class="itemName">{{ item.title }}</h4>

          <label class="itemNum">Quantity: {{ item.quantity }}</label>
          <input class="numberInput" type="number" v-model="modifyNum[index]">
          <button class="numberBtn" @click="handleNumber(item,index)">Modify</button>

        </div>

        <div class="item-right">
          <label>Price: ${{ item.price }}</label>
          <button class="rmBtn" @click="handleRemove(item)">Remove</button>

        </div>
      </div>
    </div>

    <div class="confirmDiv">
      <label>Total Price: ${{ this.totalPrice }}</label>
      <button id="checkoutBtn" @click="handleCheckout">Confirm</button>
    </div>
  </div>

</template>

<script>
import {
  createShoppingCart,
  getShoppingCartJSON,
  getTotalPrice,
  removePhoneFromShoppingCart,
  updateNumberDirect,
  requestCheckOut
} from "@/utils/cart";
export default {
  name: "CheckOut",
  data() {
    return {
      cartList: [],
      totalPrice: '',
      modifyNum: []
    }
  },
  mounted() {
    this.cartList = getShoppingCartJSON();
    this.totalPrice = getTotalPrice();

    // Check for user sign in status
    console.log(sessionStorage.getItem("user"));
    if (!sessionStorage.getItem("user")) {
      alert('You need to sign-in before using the shopping cart');
      this.$router.push({path: '/signin'});
    }
  },
  methods: {
    handleHome: function () {
      this.$router.push({path: '/'});
    },
    handleRemove: function (item) {
      console.log("item.lid" + item.lid);

      removePhoneFromShoppingCart(item.lid);
      this.renderPage();

    },
    handleNumber: function (item, index) {
      // console.log(this.modifyNum[index]);
      //shoud check the stock
      //get stock first
      let cart = getShoppingCartJSON();
      let stock;

      for (let i = 0; i < cart.length; i++) {
        if (cart[i].lid===item.lid){
          stock = cart[i].stock;
          // console.log(cart[i].stock);
        }
      }
      // console.log(stock);
      if (this.modifyNum[index] > stock) {
        alert("out of stock!")
        return;
      }
      if (this.modifyNum[index] === "0") {
        alert("please enter a positive number!")
        return;
      }
      updateNumberDirect(item.lid, this.modifyNum[index]);
      this.renderPage();
    },
    handleCheckout: function () {
      let cartObj = {};

      this.cartList.forEach(listing => {
        console.log(`${listing.lid}: ${listing.quantity}`);
        cartObj[listing.lid] = listing.quantity;
      });

      requestCheckOut(cartObj)
        .then(result => {
          console.log(result);
          alert("Checked out successfully!")
          // Reset cart
          createShoppingCart();
          // Back to homepage
          this.$router.push({path: '/'});
        })
        .catch(error => {
          console.log(error);
          alert("Cannot check out this cart");
        });
    },
    renderPage: function () {
      this.cartList = getShoppingCartJSON();
      this.totalPrice = getTotalPrice();
    }
  }
}
</script>

<style scoped>
.checkoutHeader {
  background-color: #C4C4C4;
}

#homeButton {
  height: 40px;
  margin: 20px;
}

.checkoutList {
  border: 2px solid black;
}

.item {
  padding: 40px;
  border-bottom: 1px solid gray;
}

.checkoutCheckbox {
  margin-right: 30px;
  vertical-align: middle;
}

.item-left img {
  vertical-align: middle;
}


.item-left {
  display: inline-block;
  margin-right: 40px;
  vertical-align: middle;
}

.item-middle {
  display: inline-block;
  width: 50%;
}

.item-right {
  float: right;
  display: inline-block;
  margin-right: 100px;
}

.numberInput {
  width: 50px;
  margin-left: 100px;
}

.numberBtn {
  background-color: #00B7FF;
  margin-left: 20px;
  border: none;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
}

.checkoutHeader {
  margin-bottom: 20px;
}

.checkoutTitle {
  padding-left: 20px;
  padding-bottom: 10px;
}

.checkoutTitle img {
  height: 30px;
  vertical-align: middle;

}

.checkoutTitle label {
  font-size: large;
  margin-left: 20px;
  vertical-align: middle;

}

.rmBtn {
  display: block;
  background-color: #EE1515;
  cursor: pointer;
  border-radius: 10px;
  border: none;
  padding: 10px;
  opacity: 90%;
  margin-top: 35px;
}

.confirmDiv {
  /*border: 1px solid black;*/
  width: 100%;
  text-align: right;
}

#checkoutBtn {
  background-color: #898995;
  cursor: pointer;
  border-radius: 10px;
  border: none;
  padding: 15px;
  margin: 30px;
}

#checkoutBtn:hover {
  background-color: #9AADB4;
}

</style>
