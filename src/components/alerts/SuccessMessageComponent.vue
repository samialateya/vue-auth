<template>
	<div class="alert alert-success text-center p-1" v-if="message">{{ message }}</div>
</template>
<script>
export default {
	name:"SuccessMessageComponent",
	props:{
		message:String
	},
}
</script>