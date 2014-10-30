// Sets the require.js configuration for your application.
require.config( {

	baseUrl: "../www/js",

	// 3rd party script alias names
	paths: {

		// Core Libraries
		"jquery": "lib/jquery-1.11.1.min",
		"jquerymobile": "lib/jquery.mobile-1.4.4.min",
		"jqueryparse": "lib/jquery.parse.min",
		"underscore": "lib/lodash.min",
		"backbone": "lib/backbone-1.1.2-min",

		"core": "../js/core"
	},

	// Sets the configuration for your third party scripts that are not AMD compatible
	shim: {

		"backbone": {
			"deps": [ "underscore", "jquery" ],
			"exports": "Backbone"
		}

	}

});

// Includes File Dependencies
require([
	"jquery",
	"backbone",
	"core/routers/mobileRouter",
	"core/icatalogue"
], function ( $, Backbone, Mobile, iCatalogue ) {

	$( document ).on( "mobileinit",

		// Set up the "mobileinit" handler before requiring jQuery Mobile's module
		function () {

			iCatalogue.init();

			// Prevents all anchor click handling including the addition of active button state and alternate link bluring.
			$.mobile.linkBindingEnabled = false;

			// Disabling this will prevent jQuery Mobile from handling hash changes
			$.mobile.hashListeningEnabled = false;
		}
	)

	require( [ "jquerymobile" ], function () {

		// Instantiates a new Backbone.js Mobile Router
		this.router = new Mobile();
	});
});
