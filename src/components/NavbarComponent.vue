<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-light">
    <!-- navabr container -->
    <div class="container-fluid">
      <!-- logo -->
      <router-link to="/" class="navbar-brand">Navbar</router-link>
      <!-- collapse button for mobile view -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- navbar links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link active" aria-current="page">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/profile" class="nav-link">Profile</router-link>
          </li>
        </ul>
        <!-- right menu links-->
				<router-link to="/profile"><img :src="user?.avatar" class="nav-avatar"></router-link>
				<router-link to="/profile" style="text-decoration:none !important;"><span class="text-muted mx-3 mt-2 h5">{{ user?.name }}</span></router-link>
        <LogoutComponent />
      </div>
      <!-- #navbar links-->
    </div>
  </nav>
</template>
<script>
import LogoutComponent from "@/pages/auth/LogoutComponent";
export default {
  name: "NavbarComponent",
	data: function () {
		return {
			user: null,
		};
	},
	components: {
		LogoutComponent
	},
	beforeMount: function () {
    //?redirect un authenticated user to login page
    this.$root.authMiddleware();
    //fetch user name from vuex store
    this.user = this.$store.getters.fetchAuthInfo;
  },
};
</script>