<template>
  <h4>Update Profile Info</h4>
  <h6>Update basic information</h6>
	<!-- reporting element -->
	<ErrorMessageComponent :message="errorMessage" />
	<!-- flash message -->
	<SuccessMessageComponent :message="successMessage" />
  <form class="pt-3" @submit.prevent="updateProfileInfo">
    <!-- name -->
    <div class="pb-2">
      <input type="name" name="name" placeholder="Name" class="form-control form-control-lg" :value="user.name" required minlength="3"/>
    </div>
    <!-- password -->
    <div class="pb-2">
      <input type="password" name="password" placeholder="New Password" class="form-control form-control-lg" />
    </div>
    <!-- submit button -->
    <div class="mt-3">
      <button type="submit" class="btn w-100 btn-dark" :disabled="isLoading">
        {{ buttonText }}
      </button>
    </div>
  </form>
</template>
<script>
import ErrorMessageComponent from '@/components/alerts/ErrorMessageComponent.vue';
import SuccessMessageComponent from '@/components/alerts/SuccessMessageComponent.vue';
export default {
	name:"UpdateBasicInfoComponent",
	components: {
		ErrorMessageComponent,
		SuccessMessageComponent,
	},
	props:{user:Object},
	data: function () {
    return {
      buttonText: "Update Basic Info",
      errorMessage: "",
      successMessage: "",
      isLoading: false,
			userInfo: this.user
    };
  },
	methods: {
		updateProfileInfo: async function(e){
			//prevent default submitting behavior
			e.preventDefault();
			//*start loading functionality
      this.startLoader();
			//*fetch api url and basic headers from root global mixin
      const updateBasicInfoUrl = this.$root.baseAPIUrl + "/user/profile/update";
      const headers = this.$root.baseHeaders;
			//*append access token to headers
			headers.Authorization = "Bearer " + this.user.access_token;
			//try to connect to the server
      try {
				//catch login form data
				const formData = new FormData(e.target);
				//send ajax request to the server and fetch server response
        const connection = await fetch(updateBasicInfoUrl, {
          method: "POST",
          headers: headers,
          body: formData,
        });
				//stop the loader after the server response
				this.stopLoader();
				//check response status to decide login state
				switch (connection.status){
					//success case
					case 200:
						//update user info local object
						this.userInfo.name = formData.get("name"); 
						//update user data in local session
						this.updateUserSessionInfo();
						//print success message
						this.successMessage = "Info Updated successfully";
						break;
					//invalid access token
					case 401: this.$root.invalidToken(); break;
					//invalid inputs case
					case 422: this.errorMessage = "Email or password are invalid"; break;
					//un verified email case
					case 403: this.$root.unVerifiedEmail(); break;
					//server error case
					case 500: this.errorMessage = "Server Error! please contact support center"; break;
					//default case
					default: this.errorMessage = "Something went wrong, please try again later"; break;
				}
      }
			//*catch connection error
			catch (connectionError) {
				//stop the loader
        this.stopLoader();
				//write error message to user
        this.errorMessage = "check your internet connection";
      }
		},
		startLoader: function () {
			//change login button text
      this.buttonText = "Loading ...";
			//remove reporting area text if exists
      this.errorMessage = this.successMessage = "";
			//set loader element to true to disabled login button from being clicked
      this.isLoading = true;
    },
    stopLoader: function () {
			//set login text back to its default Value
      this.buttonText = "Update Basic Info";
			//set loader element to true to enable clicking login button
      this.isLoading = false;
    },
		updateUserSessionInfo: function () {
			//TODO update user session info
			this.$store.dispatch("storeAuthInfo", this.userInfo);
		},
	},
}
</script>