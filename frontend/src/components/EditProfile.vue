<template>
  <div class="userPageItems">
    <div class="titleDiv">
      <h1>Edit Profile</h1>
      <!-- <h1 class="mainPageBtn imgBtn">
        <img alt="Main Page" src="../assets/mainPage.png" @click="handleMainPage">
      </h1> -->
    </div>

    <div class="container">
      <div class="formDiv">
        <form>
          <div>
          <label for="profileFirstname">First name: </label>
          <input id="profileFirstname" v-model="editForm.firstname" name="firstname" required="required" type="text">

          <label id="lastnamelbl" for="profileLastname">Last name: </label>
          <input id="profileLastname" v-model="editForm.lastname" name="lastname" required="required" type="text">
          </div>
          
          <br>
          <br>

          <div>
          <label for="profileEmail">Email: </label>
          <input id="profileEmail" v-model="editForm.email" name="email" required="required" type="email">
          </div>

          <br>
          <br>

          <div>
          <label for="profilePassword">Password (We need to verify your password before updating your profile):</label>
          <br>
          <input id="profilePassword" v-model="editForm.password" name="password" required="required" type="password">
          </div>
        </form>
      </div>

      <div class="btnGroup">
        <button id="updateBtn" type="button" @click="handleUpdate">Update Profile</button>
        <button id="cancelBtn" type="button" @click="handleCancel">Cancel</button>
      </div>


    </div>


  </div>

</template>

<script>
import {updateProfile} from "@/api/register";

export default {
  name: "EditProfile",
  methods: {
    handleMainPage: function () {
      this.$router.push({path: '/'});
    },
    handleUpdate: function () {
      if (this.editForm.password.trim().length == 0) {
        alert("Please enter your password before we can update your profile");
        return;
      }

      let user = JSON.parse(sessionStorage.getItem("user"));
      updateProfile(user._id, this.editForm.email, this.editForm.firstname, this.editForm.lastname, this.editForm.password)
        .then(response => {
          console.log(response);
            sessionStorage.setItem("user", JSON.stringify(response.data));
            alert("Updated successfully!");
            location.reload();
        })
        .catch(error => {
          console.log(error);
          alert("Cannot update your profile. Please double-check the information you provided");
        });
    },
    handleCancel: function () {
      this.editForm.firstname = '';
      this.editForm.lastname = '';
      this.editForm.email='';
    }
  },
  mounted() {
    this.editForm.firstname = JSON.parse(sessionStorage.getItem("user")).firstName;
    this.editForm.lastname = JSON.parse(sessionStorage.getItem("user")).lastName;
    this.editForm.email=JSON.parse(sessionStorage.getItem("user")).email;
  },
  data() {
    return {
      editForm: {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
      }
    }
  }
}
</script>

<style scoped>
@import "../css/userPage.css";
</style>
