<template>
	<LoaderComponent v-if="isLoading"/>
	<a href="#" class="btn btn-block btn-danger" @click.prevent="googleLogin()">Google</a>
</template>

<script>
import LoaderComponent from "@/components/LoaderComponent.vue";
import { inject } from "vue";
export default {
	name:"GoogleLoginComponent",
	components:{
		LoaderComponent
	},
	setup() {
    const Vue3GoogleOauth = inject("Vue3GoogleOauth");
    return {
      Vue3GoogleOauth,
    };
  },
	data: function () {
    return {
      errorMessage: "",
      isLoading: false,
    };
  },
	methods: {
		//*ANCHOR handle google login functionality
		googleLogin: async function () {
      try {
        let googleUser;
        //?check if the user is already logged in with google
        if (this.Vue3GoogleOauth.isAuthorized) {
          googleUser = this.$gAuth.instance.currentUser.get();
        }
        //? else open google auth popup and wait for the user to agree for the login
        else {
          googleUser = await this.$gAuth.signIn();
        }
        //* get the user profile information
        const userData = {
          name: googleUser.getBasicProfile().getName(),
          email: googleUser.getBasicProfile().getEmail(),
          avatar: googleUser.getBasicProfile().getImageUrl(),
          id_token: googleUser.getAuthResponse().id_token,
        };
        //? when user Data is ready send request to the server to verify ID token
        this.verifyIDToken(userData);
      } catch (error) {
        //?when user cancels the login or error occurred: send error message
        this.printErrorMessage("Google login failed");
      }
    },

		//*ANCHOR send request to the server to verify ID token
    verifyIDToken: async function (userData) {
      //*start loading functionality
      this.isLoading = true;
      //*fetch api url and basic headers from root global mixin
      const verifyTokenUrl = this.$root.baseAPIUrl + "/user/google-login";
      const headers = this.$root.baseHeaders;
      //set content type to application/json
      headers["Content-Type"] = "application/json";
      //try to connect to the server
      try {
        //send ajax request to the server and fetch server response
        const connection = await fetch(verifyTokenUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(userData),
        });
        //stop the loader after the server response
        this.isLoading = false;
        //*crate a variable to save response body data if needed
        let response;
        //check response status to decide login state
        switch (connection.status) {
          //success case
          case 200:
            //get user data from response body
            response = await connection.json();
            //then authenticate user
            this.$parent.authenticateUser(response.data);
            break;
          //invalid inputs case
          case 422:
            this.printErrorMessage("Id Token Is Required");
            break;
          //server error case
          case 500:
            this.printErrorMessage(
              "Server Error! please contact support center"
            );
            break;
          //default case
          default:
            this.printErrorMessage(
              "Something went wrong, please try again later"
            );
            break;
        }
      } catch (connectionError) {
        //*catch connection error
        //stop the loader
        this.isLoading = false;
        //write report to user
        this.report = "check your internet connection";
      }
    },

		//*ANCHOR emit error message to parent component
    printErrorMessage: function (message) {
      this.errorMessage = message;
      //emit event with error message
      this.$emit("googleError", this.errorMessage);
    },
	}
}
</script>