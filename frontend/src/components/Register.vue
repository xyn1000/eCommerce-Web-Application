<template>
  <body>
  <a class="link" @click="returnMainPage">Go back to the main page></a>

  <div class="initialDiv">
    <div class="titleDiv" style="width:100%;">
      <img alt="" src="../assets/logo.png">
      <h1>SellPhone</h1>
    </div>

    <div class="signUpDiv">
      <h1>Sign Up</h1>

      <form>
        <table>
          <tr>
            <td class="labels"><label for="firstname">*First name: </label></td>
            <td><input id="firstname" v-model="signUpForm.firstname" name="firstname" required="required" type="text">
            </td>
          </tr>
          <tr>
            <td class="labels"><label for="lastname">*Last name: </label></td>
            <td><input id="lastname" v-model="signUpForm.lastname" name="lastname" required="required" type="text"></td>
          </tr>

          <tr>
            <td class="labels"><label for="email">*Email: </label></td>
            <td><input id="email" v-model="signUpForm.email" name="email" required="required" type="email"></td>
          </tr>

          <tr>
            <td class="labels"><label for="password">*Password: </label></td>
            <td><input id="password" v-model="signUpForm.password" name="password" required="required" type="password">
            </td>
          </tr>

          <tr>
            <td class="labels"><label for="confirmPwd">*Confirm: </label></td>
            <td><input id="confirmPwd" v-model="signUpForm.confirmPwd" name="confirmPwd" required="required"
                       type="password"></td>
          </tr>
        </table>

        <div id="btnGroup">

          <button type="button" @click="handleRegister">Sign up</button>

          <a id="returnLogin" @click="returnLogin">Return to log in></a>

        </div>


      </form>

    </div>


  </div>


  </body>
</template>

<script>
import {register} from "@/api/register.js"

export default {
  name: 'SignUp',
  methods: {
    returnMainPage: function () {
      this.$router.push({path: '/'});
    },
    handleRegister: function () {
      //validation
      if (this.signUpForm.firstname.trim().length === 0) {
        alert("firstname is required!");
        return;
      }
      if (this.signUpForm.lastname.trim().length === 0) {
        alert("lastname is required!");
        return;
      }
      if (this.signUpForm.email.trim().length === 0) {
        alert("email is required!");
        return;
      } else if (!this.validEmail(this.signUpForm.email)) {
        alert("Please enter a valid email address!");
        return;
      }
      if (this.signUpForm.password === this.signUpForm.confirmPwd) {
        register(this.signUpForm.firstname, this.signUpForm.lastname, this.signUpForm.email, this.signUpForm.password).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.returnLogin();
          } else {
            alert(response.data);
          }
        });

      } else {
        alert("confirm the password!");
      }
    },
    returnLogin: function () {
      this.$router.push({path: '/signin'});
    },
    validEmail: function (email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  },
  data() {
    return {
      signUpForm: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPwd: ''
      }
    }
  }
}
</script>

<style scoped>
@import "../css/signUp.css";


</style>
