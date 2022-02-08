<template>
  <!-- container -->
  <div
    class="row w-100 h-100-vh m-0 align-items-center justify-center bg-light"
  >
    <div class="col-sm-8 col-md-6 col-lg-4 mx-auto">
      <!-- login card -->
      <div class="card card-body">
        <!-- from text -->
        <h1 class="text-black-50">Auth Starter</h1>
        <h4>Reset Password</h4>
        <h6>Fill your email address to reset your password</h6>
        <!-- reporting element -->
        <ErrorMessageComponent :message="report" />
        <!-- flash message -->
        <SuccessMessageComponent :message="successMessage" />
        <!-- form -->
        <form class="pt-3" @submit.prevent="login($event)">
          <!-- email -->
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              class="form-control form-control-lg"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
              title="Invalid email address"
            />
            <!-- email errors reporting element -->
            <span class="text-danger mt-1 d-inline-block"></span>
          </div>
          <!-- submit button -->
          <div>
            <button
              type="submit"
              class="btn btn-block btn-dark"
              :disabled="isLoading"
            >
              {{ buttonText }}
            </button>
          </div>
          <!-- from footer -->
          <div class="my-2 d-flex justify-content-between align-items-center">
            <!-- login link-->
            <router-link to="/login" class="text-black">Return to login</router-link>
            <!-- register link -->
            <router-link to="/register" class="text-black">Don't have account?</router-link>
          </div>
          <!--#from footer -->
        </form>
        <!--#from-->
      </div>
      <!--#login card -->
    </div>
  </div>
  <!--#container -->
</template>

<script>
import ErrorMessageComponent from "@/components/alerts/ErrorMessageComponent.vue";
import SuccessMessageComponent from "@/components/alerts/SuccessMessageComponent.vue";
export default {
  name: "ForgetPasswordPage",
  data: function () {
    return {
      buttonText: "Reset Password",
      report: "",
			successMessage:"",
      isLoading: false,
    };
  },

  components: {
    ErrorMessageComponent,
    SuccessMessageComponent,
  },

  methods: {
    login: async function (e) {
      //prevent default submitting behavior
      e.preventDefault();
      //*start loading functionality
      this.startLoader();
      //*fetch api url and basic headers from root global mixin
      const loginUrl = this.$root.baseAPIUrl + "/user/forgot-password";
      const headers = this.$root.baseHeaders;
      //try to connect to the server
      try {
        //catch login form data
        const formData = new FormData(e.target);
        //send ajax request to the server and fetch server response
        const connection = await fetch(loginUrl, {
          method: "POST",
          headers: headers,
          body: formData,
        });
        //stop the loader after the server response
        this.stopLoader();
        //check response status to decide login state
        switch (connection.status) {
          //success case
          case 200:
            //show success message
						this.successMessage = "Reset password link sent to your email";
            break;
          //email not found case
          case 406:
            this.report = "Email not found";
            break;
          //invalid inputs case
          case 422:
            this.report = "Invalid email";
            break;
          //server error case
          case 500:
            this.report = "Server Error! please contact support center";
            break;
          //default case
          default:
            this.report = "Something went wrong, please try again later";
            break;
        }
      } catch (connectionError) {
        //*catch connection error
        //stop the loader
        this.stopLoader();
        //write report to user
        this.report = "check your internet connection";
      }
    },

    startLoader: function () {
      //change login button text
      this.buttonText = "Loading ...";
      //remove reporting area text if exists
      this.report = "";
      //set loader element to true to disabled login button from being clicked
      this.isLoading = true;
    },
    stopLoader: function () {
      //set login text back to its default Value
      this.buttonText = "Reset Password";
      //set loader element to true to enable clicking login button
      this.isLoading = false;
    },
    //? this function used to set authentication functionality
    authenticateUser: function (userData) {
      //first save the user data to vue store
      this.$store.dispatch("storeAuthInfo", userData);
      //redirect user to home pages
      this.$router.push("/");
    },
  },
  beforeMount: function () {
    //redirect authenticated user to home page
    this.$root.guestMiddleware();
  },
};
</script>