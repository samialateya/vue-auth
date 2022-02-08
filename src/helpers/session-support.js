/*======================================================================
	This Session Helper Class contains a utility function to simplify working with browser local storage
	it's exported to be used in vuex Auth Module
========================================================================*/
export default class sessionSupport {
	// set local storage key name
	constructor(key) {
		//*the constructor used to set local storage key name
		this.key = key;
		//*and getting the value of this key
		this.storageItem = localStorage.getItem(this.key);
	}
	// check if current storage key contains a value on it
	check() {
		return this.storageItem ? true : false;
	}
	// store data in the storage key
	store(data) {
		localStorage.setItem(this.key, JSON.stringify(data));
	}
	//fetch storage value for the current key
	fetch() {
		return this.storageItem ? JSON.parse(this.storageItem) : null;
	}
	//remove current key from the storage
	remove() {
		localStorage.removeItem(this.key);
	}
}
