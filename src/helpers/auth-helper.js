/*======================================================================
	This Auth Helper will be exported to used as a global Mixin 
	which will be available in the hole application components and pages
========================================================================*/
const AuthHelper = {
	methods:{
		//steps that must be done when getting invalid token from the api call
		invalidToken: function () {
			//TODO clear user session from client side
			this.$store.dispatch("clearAuthInfo");
			//TODO send flash message to inform the user that he/she needs to login again
			this.$store.dispatch("updateFlashMessage", "Your session has expired, please login again");
			//TODO Logout user
			this.$router.push("/login");
		},

		//redirect to email verification page if user is not verified yet
		unVerifiedEmail: function () {
			//TODO send flash message to inform the user that he/she needs to verify email
			this.$store.dispatch("updateFlashMessage", "you have to verify your email to continue");
			//TODO Logout user
			this.$router.push("/verify-email");
		}
	}
}

export default AuthHelper;