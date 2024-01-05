sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("project1703.controller.Main", {
            onInit: function () {

            },

            onClickPrint: function() {
                var inputVal = this.getView().byId("inputTxt").getValue(); //getView() 생략가능

                this.getView().byId("printTxt").setText(`변경 후 : ${inputVal}`);
                //getPrint.setText(inputVal);

                //alert(inputValue);
            },

            onClickReset: function() {
                this.byId("printTxt").setText('초기화 완료');
                
            },

        });
    });
