sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/m/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Device, JSONModel, library) {
        "use strict";

        return Controller.extend("projectcust.controller.Main", {
            onInit: function () {
                var oProductsModel = this.getOwnerComponent().getModel(),
                    iPagesCount = 1;
                
                           
    
                if (Device.system.desktop) {
                    iPagesCount = 4;
                } else if (Device.system.tablet) {
                    iPagesCount = 2;
                }

    
                var oSettingsModel = new JSONModel({ pagesCount: iPagesCount });
                //oProductsModel.setSizeLimit(10);
                this.getView().setModel(oSettingsModel, "settings");
                this.getView().setModel(oProductsModel, "products");
            },

            

            onNumberOfPages: function (oEvent) {
                const oCarouselCustomLayout = this.byId("carouselSample").getCustomLayout(),
                    sVisiblePageCount = oEvent.getParameter("value");
    
                    oCarouselCustomLayout.setVisiblePagesCount(Number(sVisiblePageCount));
            },
    
            OnScrollModeChange: function(oEvent) {
                    const CarouselScrollMode = library.CarouselScrollMode,
                        bViewMode = oEvent.getParameter("state"),
                        sScrollMode = bViewMode ?  CarouselScrollMode.VisiblePages : CarouselScrollMode.SinglePage;
    
                        this.byId("carouselSample").getCustomLayout()?.setScrollMode(sScrollMode);
            }



        });
    });
