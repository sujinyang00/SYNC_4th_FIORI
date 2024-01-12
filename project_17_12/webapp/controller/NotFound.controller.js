sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("project1712.controller.NotFound", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();

                var oTarget = this.oRouter.getTarget("NotFound");
                oTarget.attachDisplay(this._onAttachDisplay, this);
            },
            
            //해당 타겟 화면이 표시될 때마다 이벤트 실행
            _onAttachDisplay: function(oEvent) {
                // 해당 타겟으로 넘겨질 때 받았던 파라미터 값이 "data"에 들어있음
                // "data" 에 들어있는 값을 해당 controller 내부에서 사용할 수 있도록 
                // this.data에 담음
                
                this._oData = oEvent.getParameter("data");
                
            },
            onNavBack: function() {
                if(this._oData && this._oData.fromTarget) {
                    this.oRouter.getTargets().display(this._oData.fromTarget);
                    delete this._oData.fromTarget; //사용했으니까 삭제
                    return;
                }
                window.history.go(-1); //브라우저에 쌓인 히스토리에서 한 번 뒤로가기
            }
        });
    });
