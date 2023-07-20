<template>
  <body>
  <a class="link" @click="returnMainPage">Go back to the main page></a>

  <div class="initialDiv">
    <div class="titleDiv" style="width:100%;">
      <img alt="" src="../assets/logo.png">
      <h1>SellPhone</h1>
    </div>

    <div class="signUpDiv">
      <h1>Reset Password</h1>
      <form>

        <label for="resetEmail">Email: </label>
        <input id="resetEmail" v-model="resetForm.email" name="email" required="required" type="email" width="70%">
        <div id="btnGroup">

          <button type="button" @click="handleReset">Reset Password</button>
          <button type="button" @click="returnLogin">Cancel</button>
          <a id="returnLogin" @click="returnLogin">Return to log in></a>

        </div>

      </form>

    </div>


  </div>


  </body>
</template>

<script>

import { requestPasswordReset } from "@/api/signIn";

export default {
  name: "ResetPwd",
  methods: {
    returnMainPage: function () {
      this.$router.push({path: '/'});
    },
    handleReset: function () {
      const email = this.resetForm.email;
      
      requestPasswordReset(email)
        .then(result => {
          console.log(result);
          alert('A password reset link has been sent to your email address');
          this.$router.push({path: '/signin'});
        })
        .catch(error => {
          console.log(error);
          alert("Cannot request password reset");
        });
    },
    returnLogin: function () {
      this.$router.push({path: '/signin'});
    }
  },
  data() {
    return {
      resetForm: {
        email: ''
      }
    }
  }
}
</script>

<style scoped>
@import "../css/signUp.css";


</style>
