//states attributes
const state = {
	flashMessage: null,
};
const getters = {
	//fetch flash message
	fetchFlashMessage: (state) => state.flashMessage,
};
const actions = {
	// update flash message content
	updateFlashMessage: ({ commit }, message) => {
		//save flash message content to vuex store
		commit('commitFlashMessage', message);
	},
	//clear flash message content
	clearFlashMessage: ({ commit }) => {
		//set flash message content to null
		commit('commitFlashMessage', null);
	},
};
const mutations = {
	//commit and save flash message content in vuex store
	commitFlashMessage: (state, data) => {
		state.flashMessage = data;
	},
};
export default {
	state,
	getters,
	actions,
	mutations
};