<template>
	<div class="alert alert-info text-center p-1" v-if="message">{{ message }}</div>
</template>
<script>
export default {
	name:"InfoMessageComponent",
	props:{
		message:String
	},
}
</script>