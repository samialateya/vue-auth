<template>
	<LoaderComponent v-if="isLoading"/>
  <a href="#" @click.prevent="handleFacebookLogin()" class="btn btn-block btn-primary">Facebook</a>
</template>

<script>
import LoaderComponent from "@/components/LoaderComponent.vue";
export default {
	name:"FacebookLoginComponent",
	components:{
		LoaderComponent
	},
	data: function () {
    return {
      errorMessage: "",
      isLoading: false,
    };
  },
	methods: {
		//*ANCHOR handle facebook login functionality
		handleFacebookLogin: async function () {
			//?fetch current login status from facebook sdk
			let response = await this.fbGetLoginStatus();
			//?if the user is already logged in with facebook
			if (response?.status == "connected") {
				//*get user data from facebook apis
				const userData = await this.prepareUserData(response.authResponse);
				//*send request to the server to verify ID token and authenticate the user
				this.verifyAccessToken(userData);
				return;
			}

			//?else open facebook login popup and wait for the user to agree for the login
			try{
				response = await this.fbLogin();
				//*get user data from facebook apis
				const userData = await this.prepareUserData(response);
				//*send request to the server to verify ID token and authenticate the user
				this.verifyAccessToken(userData);
				return;
			} catch(error){
				this.printErrorMessage("Facebook login failed");
				return;
			}
		},
		//*ANCHOR construct user data to be ready to be sent to the server
    prepareUserData: async function (basicAuth) {
			let userData = {
				access_token: basicAuth.accessToken
			};
			//*fetch user id email and name
			const userBasicData = await this.fbGetUserBasicData();
			userData = {...userData ,...userBasicData}

			//*fetch user avatar
			const avatarLink = await this.fbGetUserAvatar(userData.id);
			userData = {...userData ,avatar: avatarLink}
			return userData;
    },

		//SECTION Facebook SKD API Calls
		//*ANCHOR retrieve current user login status from facebook sdk
		fbGetLoginStatus: function () {
			return new Promise((resolve) => {
				window.FB.getLoginStatus(response => {
					resolve(response);
				});
			});
		},

		//*ANCHOR open facebook login popup
		fbLogin: function(){
			return new Promise((resolve, reject) => {
				window.FB.login(response=>{
					response.authResponse ? resolve(response.authResponse) : reject("Facebook login failed");
				},{scope: 'email,public_profile'});
			});
		},

		//*ANCHOR fetch user data from facebook sdk
		fbGetUserBasicData: function () {
			return new Promise((resolve) => {
				window.FB.api("/me","GET",{ fields: "id,email,name" },(userInformation) => {
					resolve(userInformation);
				});
			});
		},

		//*ANCHOR fetch user image from facebook sdk by user ID
		fbGetUserAvatar: function(userID){
			return new Promise(resolve => {
				window.FB.api("/" + userID+ "/picture?redirect=false","GET",(response) => {
					resolve(response.data.url);
				});
			});
		},
		//#!SECTION Facebook SKD API Calls

		//*SECTION send request to the server to verify Access token
    verifyAccessToken: async function (userData) {
      //*start loading functionality
      this.isLoading = true;
      //*fetch api url and basic headers from root global mixin
      const verifyTokenUrl = this.$root.baseAPIUrl + "/user/facebook-login";
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
        this.isLoading = false;
        this.report = "check your internet connection";
      }
    },
		//#!SECTION send request to the server to verify Access token

		//*ANCHOR emit error message to parent component
    printErrorMessage: function (message) {
      this.errorMessage = message;
      //emit event with error message
      this.$emit("facebookError", this.errorMessage);
    },
	}
}
</script>