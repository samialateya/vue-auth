<template>
  <!-- navabr -->
  <NavbarComponent />
  <!-- profile page container -->
  <div class="container mt-4">
    <div class="row w-100 m-0 justify-center">
      <div class="col-sm-8 col-md-6 mx-auto">
        <!-- form card -->
        <div class="card card-body">
          <!-- from text -->
          <UpdateBasicInfoComponent :user="user"/>
          <!--#from update information -->
          <hr />
          <!-- from to update user avatar -->
          <UpdateAvatarComponent :user="user"/>
          <!--#from to update user avatar -->
          <hr />
          <!-- from to remove user avatar -->
          <RemoveAvatarComponent :user="user"/>
          <!--#from remove user avatar -->
        </div>
      </div>
    </div>
  </div>
  <!-- #profile page container -->
</template>
<script>
import NavbarComponent from "@/components/NavbarComponent.vue";
import UpdateBasicInfoComponent from "./UpdateBasicInfoComponent.vue";
import UpdateAvatarComponent from "./UpdateAvatarComponent.vue";
import RemoveAvatarComponent from "./RemoveAvatarComponent.vue";
export default {
	name:"UpdateProfilePage",
	components:{
		NavbarComponent,
		UpdateBasicInfoComponent,
		UpdateAvatarComponent,
		RemoveAvatarComponent,
	},
	data:function(){
		return{
			user:null,
		}
	},
	beforeMount:function(){
		//?redirect un authenticated user to login page
		this.$root.authMiddleware();
		//fetch user name from vuex store
		this.user = this.$store.getters.fetchAuthInfo;
	},
}
</script>