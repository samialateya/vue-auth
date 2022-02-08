import { createStore } from 'vuex';
import AuthModule from './modules/auth.js';
import FlashMessagesModule from './modules/flash-messages.js'

// Create store
const store = createStore({
	modules: {
		AuthModule,
		FlashMessagesModule
	}
});

export default store;