sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {

        //클로저 변수 (= 전역변수)
        var TEXT = "test"; //전역변수 선언
        "use strict";

        return Controller.extend("project1707.controller.Main", {

            //이름있는 model 하나, 없는 model 하나
            onInit: function () {
                this.TEXT = "new test2"; //전역변수 사용
                //console.log(this.TEXT);
                

                //* 방법1️⃣ json 직접 선언으로 json model 객체 생성
                // var oData = { 
                //     name : 'Yang Su Jin',
                //     age : 23,
                //     title : 'Sujin`s Page'
                // };
                // var oModel = new JSONModel(oData);
                
                //* 방법2️⃣ json파일로 json model 객체생성
                var oModel1 = new JSONModel();
                oModel1.loadData('../model/data.json', {}, false); //이름이 없는 모델 불러옴
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
                            ],
                    textValue : "Hello"
                });
                this.getView().setModel(oModel2,"test");
                
            },
            onSetData: function(oEvent) {
                var oModel = this.getView().getModel();
                var oTestModel = this.getView().getModel("test");

                //var sInputData = oModel.getProperty("/inpValue");
                var sInputData = oModel.getData().inpValue; //getData로 전체 데이터 가져온 후 inpValue키에 해당하는 값 가져옴
                //console.log(sInputData);
                
                oTestModel.setData({textValue: sInputData}, true); //방법1️⃣ - setData / 합치기 여부 
                //oTestModel.setProperty("/textValue", 'Hello '+sInputData); //방법2️⃣ - setProperty
                var textValue = oTestModel.getData().textValue;

                console.log(textValue);                               
            },

            onClickNew: function() {
                // Model 가져오기 -> .getModel('이름');
                // var oModel = this.getView().getModel('local');

                // oModel.getData().history;
                // oModel.getProperty('/history');

                // oModel.setData({name: 'okok'},true);
                // oModel.setProperty("/name","okok");

                var oModel = this.getView().getModel("test");

                var data = oModel.getData(); //test라는 모델의 전체 데이터
                var data2 = oModel.getProperty("/name/firstName"); //test라는 모델의 name이라는 데이터의 firstName

                // oModel.setData({ name: "Park GilDong"}, true); //true: 덮어쓰기
                oModel.setProperty("/name/firstName","Park"); //name의 firstName값을 Park로 바꿈
                
                // debugger;
                console.log(oModel.getData());

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