<template>
	<!-- navabr -->
  <NavbarComponent />
	<!-- container -->
  <div
    class="row w-100 h-100-vh m-0 align-items-center justify-center"
  >
    <div class="col-sm-8 col-md-6 col-lg-4 mx-auto">
      <!-- verify email card -->
      <div class="card card-body">
        <!-- from text -->
        <h4>Verify your Email</h4>
        <!-- reporting element -->
        <ErrorMessageComponent :message="errorMessage" />
        <!-- success message -->
        <SuccessMessageComponent :message="successMessage" />
				<!-- flash message -->
        <InfoMessageComponent :message="flashMessage" />
        <!-- form -->
        <form class="pt-2" @submit.prevent="verifyEmail($event)">
          <!-- send email verification button -->
          <div>
            <button
              type="submit"
              class="btn btn-block btn-dark w-100"
              :disabled="isLoading"
            >
              {{ buttonText }}
            </button>
          </div>
        </form>
        <!--#from-->
      </div>
      <!--#verify email card -->
    </div>
  </div>
  <!--#container -->
</template>

<script>
import NavbarComponent from "@/components/NavbarComponent.vue";
import ErrorMessageComponent from "@/components/alerts/ErrorMessageComponent.vue";
import SuccessMessageComponent from "@/components/alerts/SuccessMessageComponent.vue";
import InfoMessageComponent from "@/components/alerts/InfoMessageComponent.vue";
export default {
	name: "VerifyEmailPage",
	components: {
		NavbarComponent,
		ErrorMessageComponent,
		SuccessMessageComponent,
		InfoMessageComponent
	},
	data() {
		return {
			errorMessage: "",
      successMessage: "",
			isLoading: false,
			buttonText: "Send Email Verification",
			user:null
		};
	},
	methods:{
		verifyEmail: async function(e){
			//prevent default submitting behavior
			e.preventDefault();
			//clear flash message if exists
			this.$store.dispatch('clearFlashMessage');
			//*start loading functionality
      this.startLoader();
			//*fetch api url and basic headers from root global mixin
      const sendVerificationURL = this.$root.baseAPIUrl + "/user/verify-email";
      const headers = this.$root.baseHeaders;
			//*append access token to headers
			headers.Authorization = "Bearer " + this.user.access_token;
			//try to connect to the server
      try {
				//send ajax request to the server and fetch server response
        const connection = await fetch(sendVerificationURL, {
          method: "POST",
          headers: headers,
        });
				//stop the loader after the server response
				this.stopLoader();
				//check response status to decide login state
				switch (connection.status){
					//success case
					case 200:
						//print success message
						this.successMessage = "Email verification link sent successfully check your email and flow the instructions";
						break;
					//invalid access token
					case 401: this.$root.invalidToken(); break;
					//server error case
					case 500: this.errorMessage = "Server Error! please contact support center"; break;
					//default case
					default:this.errorMessage = "Something went wrong, please try again later"; break;
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
	},
	computed:{
		//*catch flash messages from vuex store
		flashMessage: function(){ return this.$store.getters.fetchFlashMessage},
	},
	beforeMount:function(){
		//?redirect un authenticated user to login page
		this.$root.authMiddleware();
		//fetch user name from vuex store
		this.user = this.$store.getters.fetchAuthInfo;
	},
}
</script>