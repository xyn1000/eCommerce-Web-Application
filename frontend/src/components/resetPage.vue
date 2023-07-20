<template>
  <body>
  <a class="link" @click="returnMainPage">Go back to the main page></a>

  <div class="initialDiv">
    <div class="titleDiv">
      <img alt="" src="../assets/logo.png">
      <h1>SellPhone</h1>
    </div>

    <div class="signUpDiv">
      <h1>Reset Password</h1>
      <form>
        <table>
          <tr>
            <td class="labels"><label for="newPwd">New password: </label></td>
            <td><input id="newPwd" v-model="resetForm.newPwd" name="newPwd" required="required" type="password" ref="newPwd"></td>
          </tr>

          <tr>
            <td class="labels"><label for="confirmPwd">Confirm password: </label></td>
            <td><input id="confirmPwd" v-model="resetForm.confirmPwd" name="confirmPwd" required="required" type="password" ref="confirmPwd"></td>
          </tr>
        </table>

          <div id="btnGroup">
            <button type="button" @click="handleReset">Reset Password</button>
            <button type="button" @click="handelClear">Cancel</button>
            <a id="returnLogin" @click="returnLogin">Return to log in></a>
          </div>


      </form>

    </div>


  </div>


  </body>
</template>

<script>

import { resetPassword } from "@/api/signIn";

export default {
  name: "ResetPage",
  methods: {
    loadPage: function() {
      const email = this.$route.query.email;
      const token = this.$route.query.token;

      console.log('email:', email);
      console.log('token:', token);

      this.email = email;
      this.token = token;
    },
    returnMainPage: function () {
      this.$router.push({path: '/'});
    },
    handleReset: function () {
      const newPassword = this.resetForm.newPwd;
      const confirmPassword = this.resetForm.confirmPwd;

      if (newPassword != confirmPassword) {
        alert('Passwords do not match, please try enter again');
        return;
      }

      resetPassword(this.email, this.token, newPassword)
        .then(result => {
          console.log(result);
          alert('Your password has been reset. \nRedirecting to sign-in page');
          this.$router.push({path: '/signin'});
        })
        .catch(error => {
          console.log(error);
          alert("Cannot reset your password");
        })
    },
    returnLogin: function () {
      this.$router.push({path: '/signin'});
    },

    handelClear:function(){
      this.resetForm.newPwd='';
      this.resetForm.confirmPwd='';

    },

  },
  data() {
    return {
      resetForm: {
        email: '',
        token: '',
        newPwd: '',
        confirmPwd:'',
      }
    }
  },
  mounted() {
    this.loadPage();
  }
}
</script>

<style scoped>
@import "../css/signUp.css";


</style>

