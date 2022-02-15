<template>
	<LoaderComponent v-if="isLoading" />
  <button
    class="btn btn-dark"
    type="submit"
    @click="logout"
    :disabled="isLoading"
  >
    {{ logoutButtonText }}
  </button>
</template>
<script>
import LoaderComponent  from "@/components/LoaderComponent.vue";
export default {
  data: function () {
    return {
      logoutButtonText: "Logout",
      isLoading: false,
    };
  },
	components:{
		LoaderComponent
	},
  methods: {
    logout: async function () {
      if (!this.$store.getters.fetchAuthInfo) {
        //redirect to the login page
        this.$router.push("/login");
        return;
      }
      //logout user from the server session
			//start loader
      this.isLoading = true;
      //*fetch api url and basic headers from root global mixin
      const loginUrl = this.$root.baseAPIUrl + "/user/logout";
      const headers = this.$root.baseHeaders;
      headers.Authorization =
        "Bearer " + this.$store.getters.fetchAuthInfo.access_token;
      //send ajax request to the server and fetch server response
      await fetch(loginUrl, {
        method: "POST",
        headers: headers,
      });
			//stop the loader
      this.isLoading = false;
      //clear browser session and vuex user store
      this.$store.dispatch("clearAuthInfo");
			//logout and destroy google login data if exists
			await this.$gAuth.signOut();
      //redirect to the login page
      this.$router.push("/login");
    },
  },
};
</script>