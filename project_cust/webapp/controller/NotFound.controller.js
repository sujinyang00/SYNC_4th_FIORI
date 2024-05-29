sap.ui.define([
	"./BaseController",
	"sap/ui/core/UIComponent"
], function(BaseController, UIComponent) {
	"use strict";

	return BaseController.extend("projectcust.controller.NotFound", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("RoutePayment").attachPatternMatched(this._onPatternMatched, this);
			
			var oPaymentModel = this.getOwnerComponent().getModel();
			this.getView().setModel(oPaymentModel,"payment");
		}
	});
});
