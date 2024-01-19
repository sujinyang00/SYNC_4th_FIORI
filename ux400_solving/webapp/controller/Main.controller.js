sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("sap.btp.ux400solving.controller.Main", {
            onInit: function () {
                var sInput = new JSONModel({
                    value: '0'
                });
                this.getView().setModel(sInput);


                this.byId("idInput").setValueState('Error');
                this.byId("idInput").setValueStateText('숫자를 입력해야 됩니다. ');
            },

            onRandomPress: function() {
                var sInput = this.byId("idInput");            
                var random = Math.floor(Math.random() * 100) + 1;
                sInput.setValue(random);
                this.getView().getModel().setProperty('/value',sInput);          
                

                //debugger;
                // console.log(this.getView().getModel().getProperty('/value'));

                var oModel = this.getView().getModel("numbers"); 
                if (!oModel) { //생성된 적이 없으먼 
                    //초기 model 세팅
                    var oNewModel = new JSONModel({
                        list : [
                            { num: random }
                        ]
                    });
                    this.getView().setModel(oNewModel, "numbers");
                } else {
                    var aHistory = oModel.getProperty("/list") || []; //model의 속성을 가져오기
                    var newEntry = { num: random };
                    aHistory.push(newEntry);
                    //oModel.setProperty("/history", aHistory); //방법1 - setProperty
                    oModel.setData(aHistory, true); //방법2 - setD
                }

                //setValueState 써서 none error 이런거
                //oInput.setValueState() => 'None' 세팅
                //oInput.setValueState(sap.ui.core.ValueState.Error);


            },

            onClickDialog: function() {
                this.byId("idProductsDialog").open();
            },
            onClose: function(oEvent) {
                oEvent.getSource().getParent().close();
            },

            transformDiscontinued: function(sValue) {
                if(sValue){ return 'Yes'; }
                else { return 'No'; }
            },
            fnIconFormatter: function(sValue) {
                if(sValue){
                    if(sValue>=15) { return 'sap-icon://thumb-up'; }
                    else { return 'sap-icon://thumb-down'; }
                }
            },
            fnColorFormatter: function(sValue) {
                if(sValue){
                    if(sValue>=15) { return 'rgb(27, 234, 33)'; }
                    else { return 'rgb(234, 52, 27)'; }
                }
            },

            onValueChange: function(oEvent) {

                var sInput = oEvent.getParameters().value;

                if (sInput) {
                    if(sInput >= 1 && sInput <= 100){                        
                        this.byId("idInput").setValueState('None');  
                        var oModel = this.getView().getModel("numbers");
                        if(!oModel){
                            var oNewModel = new JSONModel({
                                list : [
                                    { num: sInput }
                                ]
                            });
                            this.getView().setModel(oNewModel, "numbers");
                        } else {
                            var aHistory = oModel.getProperty("/list") || [];
                            var newEntry = { num: sInput };
                            aHistory.push(newEntry);
                            oModel.setData(aHistory, true);
                        }                      
                    } else {

                        this.byId("idInput").setValueState('Error');
                        this.byId("idInput").setValueStateText('1이상 100이하의 수를 입력하세요');
                    }
                } else {
                    this.byId("idInput").setValueState('Error');
                    this.byId("idInput").setValueStateText('숫자를 입력해야 됩니다. ');
                }
                
                
                

            }
        });
    });
