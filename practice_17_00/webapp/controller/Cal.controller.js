sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("practice1700.controller.Cal", {
            onInit: function () {
                var oData = {
                    opers: [
                        { key: 'plus', text: '+', addTxt: '더하기'},
                        { key: 'minus', text: '-', addTxt: '빼기'},
                        { key: 'multiple', text: '*', addTxt: '곱하기'},
                        { key: 'divide', text: '/', addTxt: '나누기'}
                    ],                    
                };                
                this.getView().setModel(new JSONModel(oData)); //기본 모델에 set
            },

            onCal: function() {
                var sInput1 = Number(this.byId("idInput1_cal").getValue());
                var sInput2 = Number(this.byId("idInput2_cal").getValue());
                var result = 0;
                
                var oper_key = this.byId("idCombobox_cal").getSelectedItem().getKey(); //plus
                var oper_val = this.byId("idCombobox_cal").getSelectedItem().getText(); //+

            
                switch(oper_val) {
                    case '+':
                        result = sInput1 + sInput2;
                        break;
                    case '-':
                        result = sInput1 - sInput2;
                        break;
                    case '*':
                        result = sInput1 * sInput2;
                        break;
                    case '/':
                        result = sInput1 / sInput2;
                        break;
                }

                var oModel = this.getView().getModel('cal');
                if (!oModel) { //model이 생성된 적 없으면
                    var oData = {
                        calResult : [
                            {num1: sInput1, num2: sInput2, oper: oper_val, result: result}
                        ]
                    };
                    this.getView().setModel(new JSONModel(oData), 'cal'); 
                } else {
                    var aHistory = oModel.getProperty('/calResult') ?? [];
                    var newEntry = { num1: sInput1, num2: sInput2, oper: oper_val, result: result }
                    aHistory.push(newEntry);
                    oModel.setProperty('/calResult', aHistory);                                
                }                
            },
            onDel: function() {
                sap.m.MessageToast.show('계산 데이터 전부 삭제');       
                if (this.getView().getModel('cal')){

                    this.getView().getModel('cal').setProperty('/calResult',[]);
                }         

                
            }






        });
    });
