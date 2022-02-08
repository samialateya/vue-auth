<template>
	<div class="alert alert-danger text-center p-1" v-if="message.length">{{ message }}</div>
</template>
<script>
export default {
	name:"ErrorMessageComponent",
	props:{
		message:String
	},
}
</script>