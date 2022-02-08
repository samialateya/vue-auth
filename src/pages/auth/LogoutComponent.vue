<template>
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
export default {
  data: function () {
    return {
      logoutButtonText: "Logout",
      isLoading: false,
    };
  },
  methods: {
    logout: async function () {
      if (!this.$store.getters.fetchAuthInfo) {
        //redirect to the login page
        this.$router.push("/login");
        return;
      }
      //logout user from the server session
      this.isLoading = true;
      this.logoutButtonText = "loading...";
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

      this.isLoading = false;
      this.logoutButtonText = "Logout";
      //clear browser session and vuex user store
      this.$store.dispatch("clearAuthInfo");
      //redirect to the login page
      this.$router.push("/login");
    },
  },
};
</script>