<template>
  <LoaderComponent v-if="isLoading" />
  <!-- social login -->
  <h6 class="mt-4 text-center">Or continue with</h6>
  <div class="d-flex justify-content-around mt-2">
    <a href="#" class="btn btn-block btn-danger" @click.prevent="googleLogin()"
      >Google</a
    >
    <a
      href="#"
      @click.prevent="facebookLogin()"
      class="btn btn-block btn-primary"
      >Facebook</a
    >
  </div>
  <!--#social login -->
</template>
<script>
import { inject } from "vue";
import LoaderComponent from "@/components/LoaderComponent.vue";
// const facebookAppId = process.env.VUE_APP_FACEBOOK_APP_ID;
export default {
  name: "SocialLoginComponent",
  components: {
    LoaderComponent,
  },
  data: function () {
    return {
      errorMessage: "",
      isLoading: false,
    };
  },
  methods: {
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
		
		getLoginStatus: function () {
			return new Promise((resolve, reject) => {
				window.FB.getLoginStatus(response => {
					if(response.status !== "connected") resolve(response.authResponse);
					else reject("User is not logged in");
				});
			});
		},
		fbLogin: function(){
			return new Promise((resolve) => {
				window.FB.login(resolve);
			});
		},

    facebookLogin: async function () {
      const vueInstance = this;
			// ?check if the user is already logged in with facebook
			window.FB.getLoginStatus(function(response) {
				//catch user data if the user is already connected
				if(response.status == "connected") 
					vueInstance.getUserData(response.authResponse);
			});
			let response = await window.FB.getLoginStatus();
			try{
				response = await this.getLoginStatus();
				console.log(response);
			} catch(err){
				console.log(err);
				return
			}
			//?if the user is not connected to facebook
			if (response.status == "connected") {
				//*get user data from facebook apis
				this.getUserData(response.authResponse);
				return;
			}
			//?else open facebook login popup and wait for the user to agree for the login
			response = await this.fbLogin();
			console.log(response);
      window.FB.login(
        function (response) {
          if (response.authResponse) {
						//get user data from facebook apis
						vueInstance.getUserData(response.authResponse);
          } else {
            //?when user cancels the login or error occurred: send error message
            this.printErrorMessage("Facebook login failed");
          }
        }
      );
    },

    //verify user id_token in the server
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

    //emit error message to parent component
    printErrorMessage: function (message) {
      this.errorMessage = message;
      //emit event with error message
      this.$emit("googleError", this.errorMessage);
    },
		//*get user data from facebook api
    getUserData: function (basicAuth) {
			const userData = {
				access_token: basicAuth.accessToken,
			};
			//*fetch user id email and name
      window.FB.api("/me","GET",{ fields: "id,name,email" },(userInformation) => {
				userData.id = userInformation.id;
				userData.email = userInformation.email;
				userData.name = userInformation.name;
			});
			//*fetch user avatar
			window.FB.api("/" + userData.id + "/picture?redirect=false","GET",(response) => {
				userData.avatar = response.data.url;
			});
			console.log(userData);
    },
  },
  setup() {
    const Vue3GoogleOauth = inject("Vue3GoogleOauth");
    return {
      Vue3GoogleOauth,
    };
  },
};
</script>