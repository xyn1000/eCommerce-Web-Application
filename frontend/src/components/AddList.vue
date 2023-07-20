<template>
    <div class="userPageItems">
      <div class="titleDiv">
        <h1>Manage Listings</h1>
        <!-- <h1 class="mainPageBtn imgBtn">
          <img alt="Main Page" src="../assets/mainPage.png" @click="handleMainPage">
        </h1> -->
      </div>

      <div class="container">
        <!--      <div class="formDiv"></div>-->
        <label id="addlistLabel">Add a Phone List</label>

        <div class="addlistBtnGroup">
          <button id="addListBtn" type="button" @click="handleAddList">Confirm</button>
          <button id="cancelAddList" type="button" @click="handleCancelAddList">Cancel</button>
        </div>


        <div class="formDiv">
          <form>

            <div class="block">
              <label for="title">Title: </label>
              <input id="title" v-model="addListForm.title" name="title" required="required" type="text">
            </div>


            <div class="block">

              <label>Description: </label>
              <textarea id="description" v-model="addListForm.description"></textarea>
              <!--            <input id="description" v-model="addListForm.description" name="description" required="required" type="text">-->

            </div>


            <div class="block">

              <label for="price">Price: </label>
              <input id="price" name="price" required="required" type="number">

            </div>
            <div class="block">

              <label for="uploadBtn">Photos: </label>
              <input id="uploadBtn" name="image" required="required" type="text">

              <!--              <img id="uploadBtn" class="imgBtn" alt="upload" src="../assets/upload.png" @click="handleUpload">-->

            </div>
          </form>
        </div>

      </div>
    </div>

<!--  <div class="userPageItems">-->
<!--    <div class="titleDiv">-->
<!--      <h1>Manage Listings</h1>-->
<!--      <h1 class="mainPageBtn imgBtn">-->
<!--        <img alt="Main Page" src="../assets/mainPage.png" @click="handleMainPage">-->
<!--      </h1>-->
<!--    </div>-->

<!--    <div class="container">-->
<!--      &lt;!&ndash;      <div class="formDiv"></div>&ndash;&gt;-->
<!--      <label id="addlistLabel">Add a Phone List</label>-->

<!--      <div class="addlistBtnGroup">-->
<!--        <button id="addListBtn" type="button" @click="handleAddList">Confirm</button>-->
<!--        <button id="cancelAddList" type="button" @click="handleCancelAddList">Cancel</button>-->
<!--      </div>-->


<!--      <div class="formDiv">-->
<!--        <form>-->

<!--          <div class="block">-->
<!--            <label for="title">Title: </label>-->
<!--            <input id="title" v-model="addListForm.title" name="title" required="required" type="text">-->
<!--          </div>-->


<!--          <div class="block">-->

<!--            <label>Description: </label>-->
<!--            <textarea id="description" v-model="addListForm.description"></textarea>-->
<!--&lt;!&ndash;            <input id="description" v-model="addListForm.description" name="description" required="required" type="text">&ndash;&gt;-->

<!--          </div>-->


<!--          <div class="block">-->

<!--            <label for="price">Price: </label>-->
<!--            <input id="price" name="price" required="required" type="number">-->

<!--          </div>-->
<!--          <div class="block">-->

<!--            <label for="uploadBtn">Photos: </label>-->
<!--            <img id="uploadBtn" class="imgBtn" alt="upload" src="../assets/upload.png" @click="handleUpload">-->

<!--          </div>-->
<!--        </form>-->
<!--      </div>-->

<!--    </div>-->


<!--  </div>-->

</template>


<script>
export default {
  name: "AddList",
  methods: {
    handleMainPage: function () {
      alert("mainpage");
    },
    handleAddList: function (){

    },
    handleCancelAddList: function(){

    }
  },
  data() {
    return {
      addListForm: {
        title: '',
        description: '',
        price: '',
        photos: []
      }
    }
  }
}
</script>

<style scoped>

.block {
  /*border: 1px solid black;*/
  width: 80%;
  display: block;
  margin-bottom: 20px;
  padding: 10px;
}

.formDiv label {
  display: block;
  width: 30%;
  /*text-align: right;*/
  margin-right: 30px;
}

.formDiv input, textarea {
  width: 100%;
  border-radius: 10px;
  margin-top: 20px;
  background-color: #F0F0F0;
  padding: 8px;
}
.formDiv{
  /*border: 1px solid black;*/
  border: 0;
}

.addlistBtnGroup{
  display: inline-block;
  float: right;
}

.addlistBtnGroup button{
  border-radius: 5px;
  height: 35px;
  cursor: pointer;
  background-color: #C4E2FE;
  padding: 10px;
  width: 100px;
  color: #1947E5;
  border: none;

}

.addlistBtnGroup button:hover{
  background-color: #F0F0F0;
}

#cancelAddList{
  margin-left: 30px;
}


#addlistLabel{
  font-family: sans-serif;
}

#description{
  height: 50px;
  resize: none;
}



</style>