<template>
  <!-- container -->
  <div
    class="row w-100 h-100-vh m-0 align-items-center justify-center bg-light"
  >
    <div class="col-sm-8 col-md-6 col-lg-4 mx-auto">
      <!-- login card -->
      <div class="card card-body">
        <!-- from text -->
        <h1 class="text-black-50">Auth Starter Register</h1>
        <h4>Hello! let's get started</h4>
        <h6>Register now and continue.</h6>
        <!-- reporting element -->
        <ErrorMessageComponent :message="report" />
        <!-- form -->
        <form class="pt-3" @submit.prevent="register($event)">
          <!-- name -->
          <div class="pb-2">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              class="form-control form-control-lg"
              required
              minlength="3"
            />
            <!-- email errors reporting element -->
            <span class="text-danger mt-1 d-inline-block"></span>
          </div>
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
          <div class="pb-2">
            <input
              type="password"
              name="password"
              placeholder="Password"
              class="form-control form-control-lg"
              required
              minlength="6"
              v-model="password"
            />
            <!-- password errors reporting element -->
            <span class="text-danger mt-1 d-inline-block"></span>
          </div>
          <!-- password confirmation -->
          <div class="pb-2">
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Your Password"
              class="form-control form-control-lg"
              required
              minlength="6"
              :pattern="password"
							title="the confirmation password is mismatching the password field"
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
          <!-- login link -->
          <div class="text-center font-weight-light">
            already have an account?
            <router-link to="/login" class="text-primary">login</router-link>
          </div>
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
export default {
  name: "LoginPage",
  components: {
    ErrorMessageComponent,
  },
  data: function () {
    return {
      buttonText: "Register",
      report: "",
      isLoading: false,
			password:"",
    };
  },
	methods:{
		register: async function (e) {
			//prevent default submitting behavior
      e.preventDefault();
			//*start loading functionality
      this.startLoader();
			//*fetch api url and basic headers from root global mixin
      const loginUrl = this.$root.baseAPIUrl + "/user/register";
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
				//get user data from response body
        const response = await connection.json();
				//check response status to decide login state
				switch (connection.status){
					//success case
					case 201: 
						//write success message to flash messages store to be shown in the login page
						this.$store.dispatch('updateFlashMessage','Account created Successfully!');
						//redirect to login page
						this.$router.push('/login');
						break;
					//incorrect credentials case
					case 401:this.report = "Incorrect email or password"; break;
					//invalid inputs case
					case 422: 
						//?check if email is been used before 
						if(response.errors.email) this.report = "this email is used before";
						else this.report = "Email or password are invalid"; 
						break;
					//server error case
					case 500:this.report = "Server Error! please contact support center"; break;
					//default case
					default:this.report = "Something went wrong, please try again later"; break;
				}
      }
			//*catch connection error
			catch (connectionError) {
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
      this.buttonText = "Register";
			//set loader element to true to enable clicking login button
      this.isLoading = false;
    },
	}
};
</script>
