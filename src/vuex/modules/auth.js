//* import session support class, used to store and restore user data from browser local storage
import sessionSupport from "@/helpers/session-support.js";
//states attributes
const state = {
	userAuthInfo: null,
};

const getters = {
	//fetch user authentication information
	fetchAuthInfo: (state) => state.userAuthInfo,
};

const actions = {
	// update and store user information
	storeAuthInfo: ({ commit }, userData) => {
		//store auth info to local storage
		const userSession = new sessionSupport('user_auth_user');
		userSession.store(userData);
		//save user auth info to vuex store
		commit('updateAuthData', userData);
	},
	//update vuex store data with the use data stored in local storage
	syncUserData:({ commit}) =>{
		const userSession = new sessionSupport("user_auth_user");
		//abort if no data found in local storage
		if (!userSession.check()) { return false;}
		//save user auth info from local storage vuex store
		commit('updateAuthData', userSession.fetch());
		return true;
	},
	//logout and clear user authentication data from local storage and vuex store
	clearAuthInfo: async ({ commit }) => {
		//remove user data from local storage
		let userSession = new sessionSupport('user_auth_user');
		userSession.remove();
		//remove user data from vuex store
		commit('updateAuthData', null);
	}
};

const mutations = {
	//update user authentication data in vuex store
	updateAuthData: (state, data) => {
		state.userAuthInfo = data;
	},
};

export default {
	state,
	getters,
	actions,
	mutations
};
