<template>
  <div v-if="addList">
      <div class="addListContainer">
        <div class="userPageItems">
          <div class="titleDiv">
            <h1>Manage Listings</h1>
            <!-- <h1 class="mainPageBtn imgBtn">
              <img alt="Main Page" src="../assets/mainPage.png" @click="handleMainPage">
            </h1> -->
          </div>

          <div class="container">
            <div class="addListTitle">
              <label id="addlistLabel">Add a Phone List</label>
              <div class="addlistBtnGroup">
                <button id="confirmBtn" type="button" @click="handleConfirm">Confirm</button>
                <button id="cancelAddList" type="button" @click="handleCancelAddList">Cancel</button>
              </div>
            </div>


            <div class="formDiv">
              <form>

                <div class="block">
                  <label for="title">Title: </label>
                  <input id="title" v-model="addListForm.title" name="title" required="required" type="text">
                </div>


                <div class="block">

                  <label>Brand: </label>
<!--                  <textarea id="description" v-model="addListForm.description"></textarea>-->
                  <input id="brand" v-model="addListForm.brand" name="brand" required="required" type="text">

                </div>


                <div class="block">

                  <label for="price">Price: </label>
                  <input id="price" v-model="addListForm.price" name="price" required="required" type="number">

<!--                </div>-->

<!--                <div class="block">-->

                  <label for="stock">Stock: </label>
                  <input id="stock" v-model="addListForm.stock" name="stock" required="required" type="number">

                </div>

                <div class="block">

                  <label for="uploadBtn">Photo URL: </label>
                  <input id="uploadBtn" name="image" v-model="addListForm.image" required="required" type="text">

                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
  </div>
  <div v-else>
    <div class="userPageItems">
      <div class="titleDiv">
        <h1>Manage Listings</h1>
        <!-- <h1 class="mainPageBtn imgBtn">
          <img alt="Main Page" src="../assets/mainPage.png" @click="handleMainPage">
        </h1> -->
      </div>

      <div class="container">
        <!--      <div class="formDiv"></div>-->
        <!-- <label style="font-size:x-large;">Current Phone Lists</label> -->

        <div class="listDiv">
          <div v-for="(list,index) in itemList" :key='index'  class="list">
            <label class="itemTitle" @click="handleItem(list)">{{ list.title }}</label>
            
            <div class="enableDeleteBtns">
              Status: {{ list.disabled ? 'Disabled' : 'Enabled' }}
              <input type="button" :value="list.disabled ? 'Enable' : 'Disable'" @click="handleUpdate(index)">
              <img alt="Delete" class="deleteBtns" src="../assets/delete.png" @click="handleDelete(index)">
            </div>
          </div>
        </div>

        <div class="btnGroup" style="margin-top:20px">
          <button id="addListBtn" type="button" @click="handleAddList">+ add a new phone list</button>

        </div>


      </div>
    </div>

  </div>


</template>

<script>
// import {getLists} from "@/api/listing";
import {getListByUid} from "@/api/listing";
import {createList} from "@/api/listing";
import {deleteListByLid} from "@/api/listing";
import {updateList} from "@/api/listing";

export default {
  name: "ManageListing",
  mounted() {
    this.renderPage();
  },
  methods: {
    handleMainPage: function () {
      this.$router.push({path: '/'});
    },
    handleAddList: function () {
      this.addList=true;
    },
    handleDelete: function (index) {
      let lid = this.itemList[index]._id;
      if (confirm("Are you sure to delete the list?")){
        deleteListByLid(lid).then(res=>{
          if(res.status === 200){
            this.renderPage();
          }else {
            alert("Cannot delete now");
          }
        })
            .catch(err =>{
              console.log(err)
            })
      }
    },
    handleUpdate: function(index) {
      let lid = this.itemList[index]._id;
      let title = this.itemList[index].title;
      let brand = this.itemList[index].brand;
      let image = this.itemList[index].image;
      let stock = this.itemList[index].stock;
      let price = this.itemList[index].price;

      let disabled = !this.itemList[index].disabled;

      updateList(lid,title,brand,image,stock,price,disabled)
        .then(result => {
          console.log(result);
          this.renderPage();
        })
        .catch(err =>{
          console.log(err);
          alert("Cannot update now");
        });
    },
    handleListStatus: function () {
      alert("status");
    },
    handleConfirm: function (){
      //input validation
      if (this.addListForm.title.trim().length === 0||this.addListForm.brand.trim().length===0||this.addListForm.stock.trim().length===0||this.addListForm.price===0){
        alert("Please enter valid information!")
        return;
      }

      if (parseFloat(this.addListForm.stock).toString() === "NaN") {
        alert("Please enter a number as the stock");
        return;
      }
      if (parseFloat(this.addListForm.price).toString() === "NaN") {
        alert("Please enter a number as the price");
        return;
      }

      createList(this.addListForm.title,this.addListForm.brand,this.addListForm.image,this.addListForm.stock,this.addListForm.price).then(response => {
        // console.log(response);
        if (response.status === 200) {
          this.addList=false;
          this.renderPage();
        } else {
          alert(response.data);
        }
      });
    },
    handleCancelAddList: function(){
      if (confirm("Do you want to cancel adding a new list?")){
        this.addList=false;
      }
    },
    renderPage: function (){
      let user = JSON.parse(sessionStorage.getItem("user"));
      getListByUid(user._id).then(response => {
        if (response.status === 200) {
          this.itemList = response.data;
        } else {
          alert(response.data);
        }
      });
    },
    handleItem:function (item){
      console.log(item);
      sessionStorage.removeItem("item");
      sessionStorage.setItem("item",JSON.stringify(item));
      this.$router.push({path: '/Item'});
    }
  },
  data(){
    return{
      addList: false,
      itemList: [],
      buttonTxt: "Available",
      // buttonStatus: [],
      addListForm: {
        title: '',
        brand: '',
        price: '',
        stock: '',
        image: ''
      }
    }
  }
}
</script>

<style scoped>

.listDiv{
  margin-top: 20px;
}

.container{
  padding-top: 10px;
}

.list {
  /* border: 2px solid grey; */
  padding: 30px;
  horiz-align: center;
  /*height: 60px;*/
  /* border-radius: 28px; */
  margin-bottom: 1em;
  background-color: #c4c4c4;
  
}

.deleteBtns {
  /*float: right;*/
  height: 25px;
  /*margin: 10px;*/
  cursor: pointer;
  margin-left: 20px;
}

.enableDeleteBtns {
  float: right;
  /*horiz-align: center;*/
  display: inline;
}

.switch-btn {
  width: 45px;
  height: 25px;
  position: relative;
  top: 1px;
  display: inline-block;
}

.hidden-checkbox,
.switch-area,
.switch-toggle {
  position: absolute;
  top: 0;
  left: 0;
}

.hidden-checkbox {
  width: 45px;
  height: 25px;
  opacity: 0;
  z-index: 10;
  cursor: pointer;
}

.switch-area {
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background-color: #B3B3B3;
}

.switch-toggle {
  width: 25px;
  height: 25px;
  border: 1px solid #B3B3B3;
  border-radius: 50%;
  background-color: #fff;
}

.hidden-checkbox:checked ~ .switch-area {
  background-color: #4084F1;
}

.hidden-checkbox:checked ~ .switch-toggle {
  border: 1px solid #4084F1;
  left: 20px;
}

.switch-area,
.switch-toggle {
  -webkit-transition: All 0.3s ease;
  -moz-transition: All 0.3s ease;
  -o-transition: All 0.3s ease;
  transition: All 0.3s ease;
}

#addListBtn{
  width: 400px;
  background-color: #C4E2FE;
  color: #1947E5;
}


.block {
  /*border: 1px solid black;*/
  width: 80%;
  display: block;
  margin-bottom: 20px;
  padding: 10px;
}

.addListContainer label {
  display: inline;
  width: 30%;
  /*text-align: right;*/
  margin-right: 30px;
  margin-bottom: 10px;
  vertical-align: middle;
}

.addListContainer input, textarea {
  width: 90%;
  border-radius: 10px;
  margin-top: 15px;
  background-color: #F0F0F0;
  padding: 8px;
}
.addListContainer{
  border: 0;
}

.addlistBtnGroup{
  display: inline-block;
  float: right;
  vertical-align: middle;
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

#price{
  display: inline-block;
  width: 30%;
  margin-right: 20px;
}

#stock{
  width: 30%;
}

.addListTitle{
  overflow: hidden;
  width: 80%;
  padding-bottom: 5px;
}

.enableBtn{
  padding: 8px;
  background-color: #C4E2FE;
  vertical-align: middle;
  margin-bottom: 10px;
  border-radius: 10px;
  border: none;
}

.disableBtn{
  padding: 8px;
  background-color: #EE1515;
  vertical-align: middle;
  margin-bottom: 10px;
  border-radius: 10px;
  border: none;
}

.itemTitle{
    width:600px; 
    overflow:hidden; 
    /* white-space:nowrap;  */
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:1;
    margin-bottom: 0.5em;
    font-weight: bold;
}

.itemTitle:hover{
  color:gray;
}
</style>
