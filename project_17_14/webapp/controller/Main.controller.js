sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, ODataModel, MessageBox, Fragment, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("project1714.controller.Main", {
            onInit: function () {
                this.oData = {
                    Memid: "00000001",
                    Memnm: "YANG SU JIN",
                    Telno: "010-4170-0825",
                    Email: "TEST@TEST.COM"
                }

                this.oEmptyData = {
                    Memid: "",
                    Memnm: "",
                    Telno: "",
                    Email: ""
                }
                this.getView().setModel(new JSONModel(this.oData), 'data');
            },

            onRowSelectionChange: function(oEvent) {    
                // ⭐ Row 선택해제 되었을 때도 '선택' 된 것이기 때문에 이벤트 발생
                // ⭐ 따라서 rowContext가 없을 땐 함수 종료하도록 함
                if (!oEvent.getParameter('rowContext')) return;
                

                var sPath = oEvent.getParameter('rowContext').getPath(); //Product('1000')                                
                var oSelectData = this.getView().getModel().getProperty(sPath); //한 건의 model data - 모델경로로 해당 경로의 전체 데이터 얻음

                var oData = {
                    Memid: oSelectData.Memid,
                    Memnm: oSelectData.Memnm,
                    Telno: oSelectData.Telno,
                    Email: oSelectData.Email
                };

                this.getView().getModel("data").setData(oData);

            },

            onClickReset: function() {            
                this.getView().getModel("data").setData({
                    Memid: "",
                    Memnm: "",
                    Telno: "",
                    Email: ""
                });

                //table 선택값도 clear
                this.byId("idTable").clearSelection();
                this.getView().getModel().refresh(true);
            },

            onEntity: function() { 
                // 데이터 한 건 조회
                // GET 요청 : "/Member(Memid='1')"
                var oJSONData = this.getView().getModel('data').getData();
                var oDataModel = this.getView().getModel();
                var sPath = oDataModel.createKey("/Member", {
                    // Memid: '0000001'
                    Memid: oJSONData.Memid
                });

                oDataModel.read(sPath, {
                    success: function(oReturn) {
                        MessageBox.success("✅ 데이터 한 건 조회 완료");
                        // sap.m.MessageToast.show("✅ 데이터 한 건 조회 완료");
                        console.log('Member 데이터 한 건 조회 : ',oReturn);
                    },
                    error: function(oError){
                        MessageBox.success("⚠️ 데이터 한 건 조회 실패");
                    }
                })
            },
            onEntitySet: function(oEvent) {
                var oDataModel = this.getView().getModel();
                
                var oButton = oEvent.getSource(),
                oView = this.getView();
                
                // create popover
                if (!this._pPopover) {
                    this._pPopover = Fragment.load({ //this_pPopover없으면 실행
                        id: oView.getId(),
                        name: "project1714.view.fragment.Popover",
                        controller: this
                    }).then(function(oPopover) {
                        oPopover.setModel(new JSONModel(), 'popover');
                        oView.addDependent(oPopover);
                        return oPopover;
                    });
                } //초기에 팝오버 생성
                this._pPopover.then(function(oPopover) {
                    oPopover.openBy(oButton);
                }); //이후 생성된 팝오버 생성 필요 없이 바로 open
                
                
                // oDataModel.read("/Member", {
                    //     success: function(oReturn) {
                //         MessageBox.success("✅ 데이터 전체조회 완료");
                //         console.log('Member 전체조회 : ',oReturn);
                //     },
                //     error: function(oError) {
                    //         MessageBox.success("⚠️ 데이터 전체조회 실패");
                    //         console.log("Member 전체조회 중 오류 발생: ", oError);
                    //     }
                    // });
                    
                },
                onRead: function() {
                    // var oPopover = sap.ui.getCore().byId("myPopover");
                    
                    // Fragment.load() 사용 시 
                    // view id를 같이 넘겨줬기 때문에 view안에 popover가 붙게 됨
                    // 따라서 this.byid()로 접근 가능
                    
                    
                    var oPopover = this.byId("myPopover");
                    var oPopoverModel = oPopover.getModel('popover');
                    
                    var oMemId = oPopoverModel.getData().Memberid;
                    var oMemName = oPopoverModel.getData().Membername;
                    console.log(oMemName);

                    var oFilter = new Filter("Memnm", FilterOperator.EQ, oMemName); //path, operator, value1, value2

                    console.log(oFilter);

                    var oDataModel = this.getView().getModel();
                    oDataModel.read("/Member", {
                        urlParameters: {
                            "$expand" : "WorkSet",
                            "$select" : "Memid,WorkSet" //결과 전체에서 Memid와 WorkSet만 조회하겠다 
                        },
                        filters: [oFilter],
                        success: function(oReturn) { 
                            MessageBox.success("✅ 데이터 전체조회 완료");
                            console.log('Member 전체조회 : ',oReturn);
                        },
                        error: function(oError) {
                            MessageBox.success("⚠️ 데이터 전체조회 실패");
                            console.log("Member 전체조회 중 오류 발생: ", oError);
                        }
                    });

            },
            onCreate: function() {
                var oDataModel = this.getView().getModel();  
                var oJSONData = this.getView().getModel('data').getData();

                var oBody = {
                    Memid: oJSONData.Memid,
                    Memnm: oJSONData.Memnm,
                    Telno: oJSONData.Telno,
                    Email: oJSONData.Email
                };

                oDataModel.create("/Member", oBody, {
                    success: function() {
                        // sap.m.MessageToast.show("✅ 데이터 생성 완료");
                        this._showMessage("✅ 데이터 생성 완료");

                        // MessageBox.success("✅ 데이터 생성 완료");
                    }.bind(this),
                    error: function(oError) {
                        MessageBox.error("⚠️ 데이터 생성 실패 !! Key 값 등을 확인하세요.");
                        // sap.m.MessageToast.show("⚠️ 데이터 생성 실패");
                    }
                });
            },
            _showMessage: function(msg) {
                sap.m.MessageToast.show(msg);
            },
            
            onUpdate: function() {
                var oBody = this.getView().getModel('data').getData();
                var oDataModel = this.getView().getModel();  

                var sPath = oDataModel.createKey("/Member", {
                    Memid: oBody.Memid
                });

                oDataModel.update(sPath, oBody, {
                    success: function() {
                        MessageBox.success("✅ 데이터 수정 완료");
                        // sap.m.MessageToast.show("✅ 데이터 수정 완료");
                    },
                    error: function() {
                        MessageBox.error("⚠️ 데이터 수정 실패");
                        // sap.m.MessageToast.show("⚠️ 데이터 수정 실패");
                    }
                });
            },

            onDelete: function() {
                var oBody = this.getView().getModel('data').getData();
                var oDataModel = this.getView().getModel();

                var sPath = oDataModel.createKey("/Member", {
                    Memid: oBody.Memid
                });

                oDataModel.remove(sPath, {
                    success: function(oReturn) {
                        // sap.m.MessageToast.show("✅ 데이터 삭제 완료");
                        MessageBox.success("✅ 데이터 삭제 완료");
                        console.log('Member 삭제 : ',oReturn);
                    },
                    error: function(oError) {
                        // sap.m.MessageToast.show("⚠️ 데이터 삭제 실패");
                        MessageBox.error("⚠️ 데이터 삭제 실패");
                        console.log("Member 삭제 중 오류 발생: ", oError);
                    }
                })
            }





        });
    });
