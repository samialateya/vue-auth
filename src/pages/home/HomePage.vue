<template>
  <NavbarComponent />
  <FeaturesComponent />
</template>
<script>
import NavbarComponent from "@/components/NavbarComponent.vue";
import FeaturesComponent from "./FeaturesComponent.vue";
export default {
  name: "HomePage",
  components: {
    NavbarComponent,
    FeaturesComponent,
  },
  beforeMount: function () {
		//?redirect un authenticated user to login page
    this.$root.authMiddleware();
  },
};
</script>