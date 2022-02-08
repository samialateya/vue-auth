<template>
	<!-- navabr -->
  <NavbarComponent />
	<!-- profile page container -->
  <div class="container mt-4">
    <div class="w-100 row justify-content-center">
			<!-- profile card -->
      <div class="card col-sm-8 col-md-6 col-lg-4 mx-auto">
				<!-- avatar -->
        <img :src="user.avatar" class="card-img-top" />
				<!-- card body -->
        <div class="card-body">
          <h5 class="card-title">{{ user.name }}</h5>
          <h6 class="card-title">{{ user.email }}</h6>
          <router-link to="/profile/update" class="btn btn-primary"
            >Update profile</router-link
          >
        </div>
				<!-- #card body -->
      </div>
			<!-- #profile card -->
    </div>
  </div>
	<!-- #profile page container -->
</template>
<script>
import NavbarComponent from "@/components/NavbarComponent.vue";
export default {
  name: "ProfilePage",
  components: {
    NavbarComponent,
  },
  data: function () {
    return {
      user: null,
    };
  },
  beforeMount: function () {
    //?redirect un authenticated user to login page
    this.$root.authMiddleware();
    //fetch user name from vuex store
    this.user = this.$store.getters.fetchAuthInfo;
  },
};
</script>