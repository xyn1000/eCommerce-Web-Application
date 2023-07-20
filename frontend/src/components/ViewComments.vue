<template>
  <div class="userPageItems">
    <div class="titleDiv">
      <h1>View Comments</h1>
      <!-- <h1 class="mainPageBtn imgBtn">
        <img alt="Main Page" src="../assets/mainPage.png" @click="handleMainPage">
      </h1> -->
    </div>

    <div class="container" style="padding-top:0">
      <div v-for="(listing,index) in itemList" :key='index' class="listDiv">
        <div class="listTiTleDiv">
          <label class="listName">{{ listing.title }}</label>
          <label class="numLabels"> {{ listing.reviews.length }} comments </label>
        </div>

        <div class="reviewContent" v-for="review in listing.reviews" :key="review.comment">
          <label class="reviewerName">{{ (!review.firstName || !review.lastName) ? 'Loading reviewer name...' : `${review.firstName} ${review.lastName}` }}</label>
          <label class="rating">Rating: {{ review.rating }}</label>
          <p class="reviewText" v-if="review.comment.length<=200">
            {{review.comment}}
          </p>
          <p class="reviewText" v-else>
            {{review.comment}}
          </p>

<!--          <button type="button" class="btn-more" v-if="review.comment.length>200" id="J_btnmore" @click="showmoreDesc($event,review)">show more</button>-->
        </div>
      </div>


    </div>


  </div>

</template>


<script>
import {getListByUid, getReviewsByListingID, injectReviewUserNames} from "@/api/listing";

export default {
  name: "ViewComments",
  mounted() {
    this.renderPage();
  },
  methods: {
    handleMainPage: function () {
      this.$router.push({path: '/'});
    },
    renderPage: function () {
      const user = JSON.parse(sessionStorage.getItem("user"));
      
      getListByUid(user._id)
        .then(response => {
          this.itemList = response.data;

          this.itemList.forEach(listing => {
            getReviewsByListingID(listing._id)
              .then(res => {
                const reviews = res.data;
                // Inject reviewer names
                return injectReviewUserNames(reviews);
              })
              .then(injectedReviews => {
                listing.reviews = injectedReviews;
              })
              .catch(error => {
                console.log(error);
                alert('Cannot load reviewer names, try refresh the page later.');
              });
          });
        })
        .catch(error => {
          console.log(error);
          alert('Cannot load user listings, try refresh the page later.');
        });

    },
    showmoreDesc(e, review) {
      let el = e.currentTarget;
      el.previousElementSibling.classList[!this.isDescStatus ? 'add' : 'remove']('overflow-line');
      el.classList[this.isDescStatus ? 'add' : 'remove']('more-collapse');
      el.innerHTML = !this.isDescStatus ? 'show more' : 'show less';
      this.isDescStatus = !this.isDescStatus;
      this.isShowMore = true;
      alert(review.comment);
      // review.comment = "aaa";
    }
  },
  data() {
    return {
      itemList: [],
      // reviewList: [],
      // isExpanded: true,
      isShowMore: true,
      isDescStatus: true,
    }
  }
}
</script>

<style scoped>
.listTiTleDiv {
  /* border: 2px solid #1947E5; */
  margin-top: 20px;
  margin-bottom: 15px;
  padding: 20px;
}

.numLabels {
  float: right;
}

.container {
  border: none;
}

.reviewContent {
  /* border: 2px solid black; */
  padding: 20px;
  overflow-wrap: break-word;
  background-color: #f4f4f5;
  border-bottom: 2px solid #c4c4c4e3;

}

.reviewerName {
  margin-right: 30px;
  color: #1947E5;
}

/* .listName{
  font-size: medium;
  font-weight:bold;
} */

.listName {
  max-width: 600px;
  overflow: hidden;
  /* white-space:nowrap;  */
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  margin-bottom: 0.5em;
  font-size: medium;
  font-weight: bold;
}

.listDiv{
  background-color: #c4c4c4;
}
</style>
