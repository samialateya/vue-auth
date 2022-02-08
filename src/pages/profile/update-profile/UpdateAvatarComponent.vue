<template>
  <form class="pt-3" enctype="multipart/form-data" @submit="updateAvatar">
    <h4>Update Profile Image</h4>
    <h6>Change your profile picture</h6>
    <!-- reporting element -->
    <ErrorMessageComponent :message="errorMessage" />
    <!-- flash message -->
    <SuccessMessageComponent :message="successMessage" />
    <!-- image -->
    <div class="pb-2">
      <input
        type="file"
        name="image"
        placeholder="Select new profile image"
        class="form-control form-control-lg"
      />
    </div>
    <!-- submit button -->
    <div class="mt-3">
      <button type="submit" class="btn w-100 btn-dark">{{ buttonText }}</button>
    </div>
  </form>
</template>

<script>
import ErrorMessageComponent from "@/components/alerts/ErrorMessageComponent.vue";
import SuccessMessageComponent from "@/components/alerts/SuccessMessageComponent.vue";
export default {
  name: "UpdateAvatarComponent",
  components: {
    ErrorMessageComponent,
    SuccessMessageComponent,
  },
  props: { user: Object },
  data: function () {
    return {
      buttonText: "Update Avatar",
      errorMessage: "",
      successMessage: "",
      isLoading: false,
      userInfo: this.user,
    };
  },
	methods: {
		updateAvatar: async function(e){
			//prevent default submitting behavior
			e.preventDefault();
			//*start loading functionality
      this.startLoader();
			//*fetch api url and basic headers from root global mixin
      const updateBasicInfoUrl = this.$root.baseAPIUrl + "/user/profile/update/change-avatar";
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
				//*crate a variable to save response body data if needed
        let response;
				//check response status to decide login state
				switch (connection.status){
					//success case
					case 200:
						//get user data from response body
						response = await connection.json();
						//update user info local object
						this.userInfo.avatar = response.avatar; 
						//update user avatar in local session
						this.updateUserSessionInfo();
						//print success message
						this.successMessage = "Avatar Updated successfully";
						break;
					//invalid access token
					case 401: this.$root.invalidToken(); break;
					//invalid inputs case
					case 422: this.errorMessage = "Invalid Image"; break;
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
      this.buttonText = "Update Avatar";
			//set loader element to true to enable clicking login button
      this.isLoading = false;
    },
		updateUserSessionInfo: function () {
			//TODO update user session info
			this.$store.dispatch("storeAuthInfo", this.userInfo);
		},
	},
};
</script>