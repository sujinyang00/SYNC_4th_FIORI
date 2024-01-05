sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment) {
        "use strict";

        return Controller.extend("project1706.controller.Main", {
            onInit: function () {

            },

            HelloButtonPress: function() {
                
                sap.m.MessageToast.show("Hellooooo")
            },

            onOpenDialog: function() {
                this.byId("idDialog").open();
            },        
            onClose: function() {
                //this.byId("idDialog").close(); //내부에서만 쓴 거라서 외부에서 컨트롤러 부를 땐 사용못함
                sap.ui.getCore().byId("idDialog").close(); //외부에서 load해서 컨트롤러 가져갈 때 인식되려면 이렇게!           
            },
            onCloseNameDialog: function(oEvent) {
                //controller로 접근한 id -> idDialog, view로 접근 -> ~~~~~~Main-idDialog 이런식으로 긴 id
                //⭐ view에서와 controller에서 둘 다 onCloseNameDialog 활용하기 위해서 oEvent객체 사용
                //  getSource() == 해당 이벤트 객체를 일으킨 상위객체(Dialog) 리턴 됨
                
                oEvent.getSource().getParent().close(); //Button의 상위 Dialog 호출.


                //this.byId("idNameDialog").close(); //View로 호출
                //sap.ui.getCore().byId("idNameDialog").close(); //Controller로 호출
            },
            onOpenNameDialog: function() {
                this.byId("idNameDialog").open();
            },

            //Controller 내에서 Dialog Fragment 호출하기 
            onOpenDialog_con: function() {
                //Dialog 닫은 후 다시 Fragment.load로 Dialog화면을 재load하게 되면 id가 중복 -> fragment load는 한 번만 하는 로직으로 수정 
                // Fragment.load({
                //     name : "project1706.view.fragment.Dialog",
                //     type : "XML",
                //     controller : this //controller 가져오기
                // }).then(function(oDialog) {
                //     oDialog.open();
                // });

                //  onOpenDialog_con()에서 Dialog 최초 load -> load된 적 없는 처음 상태에서만 Fragmet.load() 실행
                var dialog = sap.ui.getCore().byId("idDialog"); //Dialog 최초로 load
                
                if(!dialog){ //Dialog load되지 않은 최초의 경우
                    Fragment.load({
                        name: "project1706.view.fragment.Dialog",
                        type: "XML",
                        controller: this //controller 가져오기
                    }).then(function(oDialog) {
                        oDialog.open();
                    });
                } else {
                    dialog.open(); //Dialog를 최초로 load해서 가져온 후에는 다시 load하면 id 중복.
                }
            },
            onOpenNameDialog_con: function() {
                var dialog = sap.ui.getCore().byId("idNameDialog");
                
                if(!dialog){
                    Fragment.load({
                        name: "project1706.view.fragment.Name",
                        type: "XML",
                        controller: this
                    }).then(function(oDialog) {
                        oDialog.open();
                    });
                } else {
                    dialog.open();
                }
                
            },

        });
    });
