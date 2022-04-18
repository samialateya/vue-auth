/*======================================================================
	This API Helper will be exported to used as a global Mixin 
	which will be available in the hole application components and pages
========================================================================*/
const APIHelper = {
	data: function () {
		return {
			baseAPIUrl: "http://127.0.0.1:8000/api",
			baseHeaders: {
				"Accept": "application/json",
			},
		};
	}
};
export default APIHelper;