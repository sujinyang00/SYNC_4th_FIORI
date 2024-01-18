/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"opdata/project_17_13/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
