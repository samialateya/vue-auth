/*======================================================================
	This MiddlewareHelper Helper will be exported to used as a global Mixin 
	which will be available in the hole application components and pages
========================================================================*/
const MiddlewareHelper = {
	//define middleware functions to be excluded before component mount
	methods: {
		//?used to prevent un authenticated users from reaching guarded pages
		authMiddleware: function(){
			//if there is no user Auth Info in vuex store then the redirect user to login page
			if(!this.$store.getters.fetchAuthInfo) this.$router.push('/login');
		},

		//?used to redirect users to home page if they access login page or any other guest pages
		guestMiddleware: function () {
			//redirect user to home page if he/she is already logged in
			if (this.$store.getters.fetchAuthInfo) this.$router.push('/');
		}
	}
};
export default MiddlewareHelper;