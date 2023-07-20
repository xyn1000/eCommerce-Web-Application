<template>

  <div class="activeDiv">
    <center>
      <h1>Activating your account...</h1>

      <div class="relink">
        <p>
          <router-link to="/signin">Sign in</router-link>
          <br>
          <router-link to="/">Go Back to homepage</router-link>
          <br>

        </p>

      </div>
    </center>


  </div>
</template>

<script>

import { activateAccount } from "@/api/signIn";

export default {
  name: "activationPage",
  methods:{
    loadPage: function() {
      const email = this.$route.query.email;
      const token = this.$route.query.token;

      console.log('email:', email);
      console.log('token:', token);

      this.email = email;
      this.token = token;

      this.handleActivation();
    },
    handleActivation: function() {
      activateAccount(this.email, this.token)
        .then(result => {
          console.log(result);
          alert('Your account has been activated. \nRedirecting to sign-in page');
          this.$router.push({path: '/signin'});
        })
        .catch(error => {
          console.log(error);
          alert("Cannot activate your account");
        });
    }
  },
  mounted() {
    this.loadPage();
  },
  data() {
    return {
      email: '',
      token: ''
    }
  }



}
</script>

<style scoped>
.activeDiv {
  background-color: #E8E8E8;
  margin: 3em auto;
  height:100%;
  width: 40%;
  border-spacing: 1em;
}

.relink p{
  line-height:2.4;
}
</style>
