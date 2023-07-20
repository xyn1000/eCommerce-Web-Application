<template>
  <header>
    <div class="titleDiv">
      <img alt="home"  src="../assets/logo.png" @click="handleHome">

      <h1 @click="handleHome">SellPhone</h1>
    </div>
    <div class="searchDiv">
      <input id="searchTerm" v-model="searchTerm" class="textInput" type="text" @keyup.enter="handleSearch" placeholder="  Please enter search content">
      <img id="searchButton" alt="search" src="../assets/search.png" @click="handleSearch">

    </div>


    <div class="top-right-div">
      <img id="cartButton" alt="cart" src="../assets/cart.png" @click="handleCheckout">
      <img v-if="!this.login" id="signInButton" alt="Sign In" class="stateButtons" src="../assets/signInLogo.png"
           @click="handleSignIn">

      <img v-else id="profileButton" alt="Profile" src="../assets/profile.png" @click="handleProfile">
      <img v-if="this.login" id="signOutButton" alt="Sign Out" class="stateButtons" src="../assets/signOutLogo.png"
           @click="handleSignOut">

    </div>


  </header>



</template>

<script>

//import SearchPage from "@/components/SearchPage";
import {signOut} from "@/api/register";

export default {
  name: "SHeader",
  mounted() {
    if (sessionStorage.getItem("user")===null){
      this.login=false;
    }else{
      this.login=true;
    }
  },
  methods: {


    handleSearch: function () {
      if (this.searchTerm.trim().length===0){
        alert("please enter something to search");
        return;
      }
      sessionStorage.setItem("searchResults",null);
      this.$router.push({path: '/search/'+this.searchTerm});
      location.reload();
    },
    handleCheckout: function () {
      this.$router.push({path: '/checkout'});

    },
    handleSignIn: function () {
      this.$router.push({path: '/signin'});
    },
    handleSignOut: function () {
      signOut().then(response => {
        if (response.status === 200) {
          this.login=false;
          sessionStorage.removeItem("user");
        } else {
          alert(response.data);
        }
      });
    },
    handleProfile: function () {
      this.$router.push({path: '/user'});
    },
    handleHome:function(){
      this.$router.push({path: '/'});
    }
  },
  data() {
    return {
      searchTerm: "",
      login: Boolean,


    }
  },
  components: {
  }
}
</script>

<style scoped>
@import "../css/signUp.css";

header {
  background-color: #C4C4C4;

}

.titleDiv {
  display: inline-block;
  width: 30%;
}

.searchDiv {
  display: inline-block;
  width: 40%;
  vertical-align: middle;
  horiz-align: left;
}



#searchTerm {
  border: 0;
  background: white;
  border-radius: 28px;
  display: inline-block;
  width: 80%;
  height: 28px;

}

#searchButton {
  display: inline-block;
  vertical-align: middle;
  margin: 0.5em;
  cursor: pointer;

}

.top-right-div {
  display: inline-block;
  vertical-align: middle;
  /* text-align: right; */
  float:right;
  margin-top: 17.44px;
  margin-right: 30px
}

#cartButton {
  cursor: pointer;
  height: 40px;
}


.stateButtons {
  margin: auto auto auto 0.67em;
  cursor: pointer;
  padding-bottom: 3px
}

#profileButton {
  cursor: pointer;
  margin: auto auto auto 1em;

}


</style>
