/*======================================================================
	This API Helper will be exported to used as a global Mixin 
	which will be available in the hole application components and pages
========================================================================*/
const APIHelper = {
	data: function () {
		return {
			baseAPIUrl: "http://localhost/togithub/AuthStarter/public/api",
			baseHeaders: {
				"Accept": "application/json",
			},
		};
	}
};
export default APIHelper;