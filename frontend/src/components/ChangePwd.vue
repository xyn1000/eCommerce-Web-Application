<template>
  <div class="userPageItems">
    <div class="titleDiv">
      <h1>Change Password</h1>
      <!-- <h1 class="mainPageBtn imgBtn">
        <img alt="Main Page" src="../assets/mainPage.png" @click="handleMainPage">
      </h1> -->
    </div>

    <div class="container">
      <div class="formDiv">
        <form>

          <div class="block">
            <label for="oldPwd">Current password: </label>
            <input id="oldPwd" v-model="changePwdForm.oldPwd" name="oldPwd" required="required" type="password">
          </div>


          <div class="block">

            <label for="newPwd">New password: </label>
            <input id="newPwd" v-model="changePwdForm.newPwd" name="newPwd" required="required" type="password">

          </div>


          <div class="block">

            <label for="confirmPwd">Confirm password: </label>
            <input id="confirmPwd" v-model="changePwdForm.confirmPwd" name="confirmPwd" required="required" type="password">

          </div>
        </form>
      </div>

      <div class="btnGroup">
        <button id="confirmBtn" type="button" @click="handleChangePwd">Confirm</button>
        <button id="cancelBtn" type="button" @click="handleCancel">Cancel</button>
      </div>
    </div>


  </div>

</template>

<script>
import {changePwd} from "@/api/register";

export default {
  name: "ChangePwd",
  methods: {
    handleMainPage: function () {
      this.$router.push({path: '/'});
    },
    handleChangePwd: function () {
      //confirm pwd
      if (this.changePwdForm.oldPwd.trim().length===0 && this.changePwdForm.newPwd.trim().length===0) {
        alert("please enter the information");
        return;
      }

      if (this.changePwdForm.newPwd!==this.changePwdForm.confirmPwd){
        confirm("please confirm the password");
        return;
      }
        //input pwd
      console.log("here");
        let user = JSON.parse(sessionStorage.getItem("user"));
        changePwd(user.email, this.changePwdForm.oldPwd,this.changePwdForm.newPwd).then(response => {
          if (response.status === 200) {
            alert("change password successfully!");
            this.changePwdForm.newPwd='';
            this.changePwdForm.oldPwd='';
            this.changePwdForm.confirmPwd='';

          } else {
            alert(response.data);
            // alert("WRONG PASSWORD");
          }
        });
    },
    handleCancel: function () {
      this.changePwdForm.newPwd='';
      this.changePwdForm.oldPwd='';
      this.changePwdForm.confirmPwd='';
    }
  },
  data() {
    return {
      changePwdForm: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      }
    }
  }
}
</script>

<style scoped>
@import "../css/userPage.css";

.block {
  /*border: 1px solid black;*/
  width: 80%;
  display: block;
  margin: 5px 0;
}

label {
  display: inline-block;
  width: 30%;
  text-align: right;
  margin-right: 30px;
}

input, textarea {
  width: 50%;
}

#confirmBtn {
  background-color: #9AADB4;
}

#confirmBtn:hover {
  background-color: #f5f5f5;
}

</style>
