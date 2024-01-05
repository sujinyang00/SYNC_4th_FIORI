sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("project1707.controller.Main", {
            onInit: function () {

                //* 방법1️⃣ json 직접 선언으로 json model 객체 생성
                // var oData = { 
                //     name : 'Yang Su Jin',
                //     age : 23,
                //     title : 'Sujin`s Page'
                // };
                // var oModel = new JSONModel(oData);
                
                //* 방법2️⃣ json파일로 json model 객체생성
                var oModel1 = new JSONModel();
                oModel1.loadData('../model/data.json', {}, false);
                console.log(oModel1.getData());

                //* view가 JSon model 세팅 ⭐
                this.getView().setModel(oModel1); //이름 없는 default model
                //this.getView().setModel(모델객체, "car"); //car라는 model

                //예제 -방법1️⃣
                var oModel2 = new JSONModel({
                    name : {
                                firstName: 'Hong',
                                lastName: 'GilDong'
                            },
                    datas: [
                                {name : 'Kim', age: 30, tel: '010-1111-2222'},
                                {name : 'Park', age: 10, tel: '010-1111-3333'},
                                {name : 'Lee', age: 20, tel: '010-1111-4444'}
                            ]
                });
                this.getView().setModel(oModel2,"test");
                
            },

            onClick: function() {
                var input = this.byId("idInput").getValue();
                this.byId("inputText").setText(input);

                var oData = {
                    text: input
                };

                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel,"inputModel");
            }
        });
    });