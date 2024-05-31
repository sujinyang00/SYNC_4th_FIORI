sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, DateFormat) {
        "use strict";

        return Controller.extend("projectsdso.controller.Main", {
            onInit: function () {

            },

            formatDate: function(sDate) {
                if (!sDate) {
                    return "";
                }
                var oDateFormat = DateFormat.getDateInstance({ pattern: "yyyy년 MM월 dd일" });
                return oDateFormat.format(new Date(sDate));
            },
            formatOrdtype: function(sType) {
                if(!sType){
                    return "";
                }
                switch(sType) {
                    case "1":
                        return "";
                    case "2":
                        return "반품";
                }
            },

            formatOkState: function(sState) {
                if (!sState) {
                    return "";
                }
                switch (sState) {   
                    case "1":
                        return "승인";  // 확정 상태 텍스트
                    case "2":
                        return "미승인";  // 미확정 상태 텍스트
                    default:
                        return "";
                }
            },
            

            formatOrdState: function(sState) {
                if (!sState) {
                    return "";
                }

                switch(sState) {
                    case "P":
                        return "즉시구매";
                    case "R5":
                        return "5년 렌탈";                        
                    case "R7":
                        return "7년 렌탈";
                    case "C":
                        return "케어구매";
                    case "1": 
                        return "5년";
                    case "2":
                        return "7년";     
                }
                
            },

            formatOrdStateIcon: function(sState) {
                if (!sState) {
                    return "";
                }
                
                switch(sState) {
                    case "P":
                        return "sap-icon://bed";
                    case "R5":
                        return "sap-icon://customer-history";
                    case "R7":
                        return "sap-icon://customer-history"; 
                    case "C":
                        return "sap-icon://e-care";
                }
            },
            formatOrdtypeIcon: function(sState) {
                if (!sState) {
                    return "";
                }
                
                switch(sState) {
                    case "1":
                        return ""
                    case "2":
                        return "sap-icon://sys-cancel";
                }
            },

            formatShipflag: function(sFlag){
                if (!sFlag) {
                    return "출하 예정";                    
                } else {
                    return "출하 완료";
                }
            },

            formatPrice: function(sValue) {
                // sValue가 존재하고 유효한 숫자인지 확인
                if (sValue && !isNaN(sValue)) {
                    // 숫자로 변환 후 정수로 변환하여 소숫점 이하를 제거
                    var intValue = parseInt(parseFloat(sValue));
                    // KRW를 적용하고 3자리마다 쉼표를 추가하여 반환합니다.
                    return intValue.toLocaleString('en') + " KRW";
                } else {
                    return sValue; // sValue가 유효하지 않으면 그대로 반환합니다.
                }
            },




            //렌탈상태
            formatRentState: function(sState) {
                if(!sState) {
                    return "";
                }

                switch(sState){
                    case "1":
                        return "렌탈 중";
                    case "2":
                        return "렌탈 종료";
                    case "3":
                        return "소유권 이전";  
                    case "4":
                        return "중도해지";
                    case "5":
                        return "무단소유";
                    case "6":
                        return "렌탈대기";
                    }

            },

            //케어 경과일 계산 
            calCareterm: function(sDate) {
                if(!sDate) {
                    return "";                    
                }

                // 오늘 날짜
                var currentDate = new Date();

                // 주어진 날짜를 Date 객체로 변환
                var targetDate = new Date(sDate);

                // 시간을 제외한 날짜만 비교
                currentDate.setHours(0, 0, 0, 0);
                targetDate.setHours(0, 0, 0, 0);

                // 두 날짜 사이의 차이를 계산하여 일 수로 반환
                var differenceInTime = currentDate.getTime() - targetDate.getTime();
                var differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

                if (differenceInDays > 0) {
                    return differenceInDays + "일";
                } else {
                    return "-";
                }
            },
        });
    });
