<template>
  <body>
  <a class="link" @click="returnMainPage">Go back to the main page></a>

  <div class="initialDiv">
    <div class="titleDiv" style="width:100%;">
      <img alt="" src="../assets/logo.png">
      <h1>SellPhone</h1>
    </div>

    <div class="signInDiv">
      <h1>Sign In</h1>

      <form>
        <table>
          <tr>
            <td class="labels"><label for="email">Email: </label></td>
            <td><input id="email" v-model="signInForm.email" name="email" required="required" type="email"></td>
          </tr>

          <tr>
            <td class="labels"><label for="password">Password: </label></td>
            <td><input id="password" v-model="signInForm.password" name="password" required="required" type="password">
            </td>
          </tr>

        </table>

        <div id="btnGroup">

          <button type="button" @click="handleSignIn()">Sign In</button>

          <router-link to="/register">Register now</router-link>
          <br>

          <router-link to="/reset">Forget password</router-link>


        </div>


      </form>

    </div>


  </div>


  </body>
</template>

<script>
import {signIn} from "@/api/signIn.js"
// import {createShoppingCart} from "@/utils/cart";

export default {
  name: 'SignIn',
  methods: {
    returnMainPage: function () {
      this.$router.push({path: '/'});
    },

    handleSignIn: function(){
      // Validation
      if (this.signInForm.email.trim() === '') {
        alert('Email cannot be empty');
        return false;
      }

      if (this.signInForm.password.trim() === '') {
        alert('Password cannot be empty');
        return false;
      }

      signIn(this.signInForm.email, this.signInForm.password)
        .then(res=>{
          console.log(res);
          sessionStorage.setItem("user",JSON.stringify(res.data));
          console.log(JSON.parse(sessionStorage.getItem("user"))._id);
          this.$router.push({path:'/'});
        })
        .catch(err =>{
          console.log(err);
          // User not activated
          if (err.response.data == "User not activated!") {
            this.$router.push({path: `/activation-failed?email=${this.signInForm.email}`});
          }
        });

    },
  },
  data() {
    return {
      signInForm: {
        email: '',
        password: '',
      },
      show:false,
    }
  }
}
</script>

<style scoped>
@import "../css/signIn.css";

.link{
  cursor: pointer;
  color: #326276;
}

</style>
