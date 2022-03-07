<template>
  <!-- container -->
  <div
    class="row w-100 h-100-vh m-0 align-items-center justify-center bg-light"
  >
    <div class="col-sm-8 col-md-6 col-lg-4 mx-auto">
      <!-- login card -->
      <div class="card card-body">
        <!-- from text -->
        <h1 class="text-black-50">Auth Starter Login</h1>
        <h4>Hello! let's get started</h4>
        <h6>Sign in to continue.</h6>
        <!-- reporting element -->
        <ErrorMessageComponent :message="report" />
        <!-- flash message -->
        <InfoMessageComponent :message="flashMessage" />
        <!-- form -->
        <form class="pt-3" @submit.prevent="login($event)">
          <!-- email -->
          <div class="pb-2">
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
          <!-- password -->
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              class="form-control form-control-lg"
              required
              minlength="6"
            />
            <!-- password errors reporting element -->
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
            <!-- remember me -->
            <div class="form-check">
              <label class="text-muted">
                <input
                  type="checkbox"
                  class="form-check-input"
                  name="remember"
                />
                Keep me signed in
              </label>
            </div>
            <!-- forget password -->
            <router-link to="/forget-password" class="text-black"
              >Forgot password?</router-link
            >
          </div>
          <!--#from footer -->
          <!-- register link -->
          <div class="text-center font-weight-light">
            Don't have an account?
            <router-link to="/register" class="text-primary"
              >Create</router-link
            >
          </div>
          <!-- #register link -->
        </form>
        <!--#from-->
        <!-- social login -->
        <h6 class="mt-4 text-center">Or continue with</h6>
        <div class="d-flex justify-content-around mt-2">
          <!-- Google Login Button -->
					<GoogleLoginComponent v-on:googleError="socialLoginErrors"/>
					<!-- Facebook Login Button -->
					<FacebookLoginComponent v-on:facebookError="socialLoginErrors"/>
        </div>
        <!--#social login -->
      </div>
      <!--#login card -->
    </div>
  </div>
  <!--#container -->
</template>

<script>
import ErrorMessageComponent from "@/components/alerts/ErrorMessageComponent.vue";
import InfoMessageComponent from "@/components/alerts/InfoMessageComponent.vue";
import GoogleLoginComponent from "./social_login/GooglLoginComponent.vue";
import FacebookLoginComponent from "./social_login/FacebookLoginComponent.vue";
export default {
  name: "LoginPage",
  data: function () {
    return {
      buttonText: "SIGN IN",
      report: "",
      isLoading: false,
    };
  },

  components: {
    ErrorMessageComponent,
    InfoMessageComponent,
    GoogleLoginComponent,
		FacebookLoginComponent,
  },

  methods: {
    login: async function (e) {
      //prevent default submitting behavior
      e.preventDefault();
      //clear flash message if exists
      this.$store.dispatch("clearFlashMessage");
      //*start loading functionality
      this.startLoader();
      //*fetch api url and basic headers from root global mixin
      const loginUrl = this.$root.baseAPIUrl + "/user/login";
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
        //*crate a variable to save response body data if needed
        let response;
        //check response status to decide login state
        switch (connection.status) {
          //success case
          case 200:
            //get user data from response body
            response = await connection.json();
            //then authenticate user
            this.authenticateUser(response.data);
            break;
          //incorrect credentials case
          case 401:
            this.report = "Incorrect email or password";
            break;
          //invalid inputs case
          case 422:
            this.report = "Email or password are invalid";
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
      this.buttonText = "SIGN IN";
      //set loader element to true to enable clicking login button
      this.isLoading = false;
    },
    //* this function used to set authentication functionality
    authenticateUser: function (userData) {
      //first save the user data to vue store
      this.$store.dispatch("storeAuthInfo", userData);
      //redirect user to home pages
      this.$router.push("/");
    },
    //* catch social login errors and print them to user
    socialLoginErrors: function (error) {
      this.report = error;
    },
  },
  beforeMount: function () {
    //redirect authenticated user to home page
    this.$root.guestMiddleware();
  },
  computed: {
    //*catch flash messages from vuex store
    flashMessage: function () {
      return this.$store.getters.fetchFlashMessage;
    },
  },
};
</script>