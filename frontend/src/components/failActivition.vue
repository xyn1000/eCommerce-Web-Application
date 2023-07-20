<template>
  <div class="failActive">
    <center>
    <h1>Your account is not actived</h1>

    <div>
        <span>
          <router-link to="/">Go Back to homepage</router-link>
        </span>

    </div>


    <div class="relink">
        <p>
          Haven't received your activition link?
          <br>
          Click <a href="#" @click.prevent="handleResend()">here</a> to re-send it to your email address.
        </p>
      <br>
    </div>



    </center>

    </div>
</template>

<script>

import { resendEmail } from "@/api/signIn";

export default {
  name: "failActivation",
  methods: {
    loadPage: function() {
      const email = this.$route.query.email;

      console.log('email:', email);

      this.email = email;
    },
    handleResend: function() {
      resendEmail(this.email)
        .then(result => {
          console.log(result);
          alert('A new activation link has been sent to your email address. Please check your email inbox. \nRedirecting to sign-in page');
          this.$router.push({path: '/signin'});
        })
        .catch(error => {
          console.log(error);
          alert("Cannot resend activation link");
        });
    }
  },
  mounted() {
    this.loadPage();
  },
  data() {
    return {
      email: '',
    }
  }
}
</script>

<style scoped>
.failActive{
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
