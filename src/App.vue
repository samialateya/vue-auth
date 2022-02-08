<template>
  <router-view />
</template>
<script>
export default {
	mounted: async function(){
		//*sync user data from local storage to vuex storage if exists
		await this.$store.dispatch('syncUserData');
	}
}
</script>
