<template>
  
  <div>
    <header>
      <div class="titleDiv">
      <img alt="home"  src="../assets/logo.png" @click="handleHome">

      <h1 @click="handleHome">SellPhone</h1>
    </div>
    <div class="top-right-div">
      <img id="cartButton" alt="cart" src="../assets/cart.png" @click="handleCheckout">

      <img  id="signOutButton" alt="Sign Out" class="stateButtons" src="../assets/signOutLogo.png"
           @click="handleSignOut">

    </div>
    </header>
  <div class="wrapper">
    
    <div class="navigationCol">
      <!--      <div class="greetingDiv">-->
      <!--        <img alt="Profile" src="../assets/profile.png">-->
      <!--        <label>Hi, {{userInfoForm.firstname}}!</label>-->
      <!--      </div>-->
      <table class="tabBar">
        <tr>
          <th style="padding:6px;">
            <img alt="Profile" height="30" src="../assets/profile.png" style="position: relative;top: 5px;left: 5px;">
            <label class="greetingLabel">Hi, {{ userInfoForm.firstname }}!</label>
          </th>
        </tr>
        <tr class = "Function-Buttom" >
          <td @click="handleProfile" :class="{active:categoryIndex==0}">
            Edit Profile
          </td>
        </tr>
        <tr class = "Function-Buttom">
          <td @click="handleChangePwd" :class="{active:categoryIndex==1}">
            Change Password
          </td>
        </tr>
        <tr class = "Function-Buttom">
          <td @click="handleListing" :class="{active:categoryIndex==2}">Manage Listings</td>
        </tr>
        <tr class = "Function-Buttom">
          <td @click="handleComments" :class="{active:categoryIndex==3}">View Comments</td>
        </tr>
      </table>

      <!-- <button id="signOutBtn" type="button" @click="handleSignOut">Sign Out</button> -->

    </div>
    <div class="infoPanel">
      <EditProfile v-if="this.editProfile"></EditProfile>
      <ChangePwd v-else-if="this.changePwd"></ChangePwd>
      <ManageListing v-else-if="this.manageListing"></ManageListing>
      <ViewComments v-else-if="this.viewComment"></ViewComments>
      <footer class="copyrightUserPage" style="float:bottom">
          <p>Copyright © 2022 WebDev-18. All rights reserved. </p>
        </footer>
    </div>

  </div>
  </div>
</template>

<script>
import EditProfile from "@/components/EditProfile";
import ChangePwd from "@/components/ChangePwd";
import ManageListing from "@/components/ManageListing";
import ViewComments from "@/components/ViewComments";
import {signOut} from "@/api/register";
export default {
  name: "UserPage",
  components: {
    EditProfile,
    ManageListing,
    ChangePwd,
    // AddList,
    ViewComments
  },
  mounted: function() {
    if (sessionStorage.getItem("user")===null){
      alert("please sign in first");
      this.$router.push({path: '/signin'});
      return;
    }
    let user = JSON.parse(sessionStorage.getItem("user"));
    console.log(user.firstName);
    this.userInfoForm.firstname=user.firstName;
  },
  methods: {
    handleProfile: function () {
      this.editProfile = true;
      this.changePwd = false;
      this.manageListing=false;
      this.viewComment=false;
      this.categoryIndex=0;
    },
    handleChangePwd: function () {
      this.changePwd = true;
      this.editProfile = false;
      this.manageListing=false;
      this.viewComment=false;
      this.categoryIndex=1;
    },
    handleListing: function () {
      this.editProfile = false;
      this.changePwd = false;
      this.manageListing=true;
      this.viewComment=false;
      this.categoryIndex=2;
    },
    handleComments: function () {
      this.editProfile = false;
      this.changePwd = false;
      this.manageListing=false;
      this.viewComment=true;
      this.categoryIndex=3;
    },
    handleSignOut: function () {
      signOut();
      sessionStorage.removeItem("user");
      this.$router.push({path:'/'})
    },
    handleHome:function(){
      this.$router.push({path: '/'});
    },
    handleCheckout: function () {
      this.$router.push({path: '/checkout'});

    }
  },
  data() {
    return {
      userInfoForm: {
        firstname: '',
        lastname: '',
        email: ''
      },
      editProfile: true,
      changePwd: true,
      manageListing: true,
      viewComment: true,
      categoryIndex: 0
    }
  }
}
</script>

<style scoped>
@import "../css/userPage.css";


</style>