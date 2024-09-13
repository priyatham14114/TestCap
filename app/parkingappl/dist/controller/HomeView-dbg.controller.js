sap.ui.define([
    "./basecontroller",
    // "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "../Secrets/Config",
    "sap/ndc/BarcodeScanner",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/model/Sorter"

],
    function (Controller, JSONModel, Fragment, Filter, FilterOperator, MessageToast, MessageBox, Config, BarcodeScanner, ODataModel, Sorter) {
        "use strict";

        return Controller.extend("com.app.parkingappl.controller.HomeView", {
            onInit: function () {


                // var oModel = new ODataModel({
                //     serviceUrl: "/ParkingSrv/",
                //     synchronizationMode: "None"
                // });
                // this.getView().setModel(oModel);

                // // by date slot status updation
                // this.updateSoltsStatusbyDate();


                // // brcode
                // var obj = { name: "subhash", age: 24 };
                // var jsonString = JSON.stringify(obj);
                // this._generateBarcode(jsonString)
                // const newAssign = new JSONModel({
                //     driverName: "",
                //     driverMobile: "",
                //     vehicleNumber: "",
                //     deliveryType: "",
                //     checkInTime: "",
                //     slotNumber: {
                //         slotNumbers: ""
                //     }
                // });
                // this.getView().setModel(newAssign, "newAssign");

                // Data Analysis
                // this._setHistoryModel();
                // this._setParkingLotModel();

            },
            // onBellText: function () {

            // },
            onBeforeRendering: function () {
                debugger
                this.byId("parkingLotSelect").getBinding("items").sort(new sap.ui.model.Sorter("Slotnumbers"));
                this.updateSoltsStatusbyDate();
                // count
                var count = 0;
                var oModel = this.getView().getModel("ModelV2");
                var oThis = this;
                oModel.read("/ZPARKING_RESERVE_SSet", {
                    success: function (odata) {
                        // var otemp = odata.results.length;
                        odata.results.forEach((obj) => {
                            if (obj.Reservedslot === "") {
                                count = count + 1
                            }
                        })
                        oThis.getView().byId("idbadghqwe").setValue(count);

                    }, error: function (oError) {

                    }
                })
            },
            onEditPress: function () {
                debugger
                var oTable = this.byId("idAssignedTable");
                var aSelectedItem = oTable.getSelectedItem()

                if (!aSelectedItem) {
                    MessageToast.show("Please select record to edit.");
                    return;
                }
                const oObject = aSelectedItem.getBindingContext().getObject(),
                    oOldSlotNum = oObject.Slotnumbers
                aSelectedItem.getCells()[5].getItems()[0].setVisible(false)
                aSelectedItem.getCells()[5].getItems()[1].setVisible(true)

                this.byId("idBtnEdit").setVisible(false);
                this.byId("idBtnSave").setVisible(true);
                this.byId("idBtnCancel").setVisible(true);
                this.byId("idBtUnassign").setVisible(false);



            },
            onSavePress: function () {
                debugger
                const oThis = this
                var oTable = this.byId("idAssignedTable");
                var oSelectedItem = oTable.getSelectedItem(),
                    oObject = oSelectedItem.getBindingContext().getObject()

                var oModel = this.getView().getModel("ModelV2")

                oSelectedItem.getCells()[5].getItems()[0].setVisible(true)
                oSelectedItem.getCells()[5].getItems()[1].setVisible(false)
                var oOldSlotNumer = oSelectedItem.getCells()[5].getItems()[0].getText()
                var oNewSlotNumer = oSelectedItem.getCells()[5].getItems()[1].getSelectedKey()

                const newSlotPayload = {
                    Status: "NOT AVAILABLE",
                    Assigneddrivername: oObject.Assigneddrivername,
                    Assigneddrivermobile: oObject.Assigneddrivermobile,
                    Assignedvehiclenumber: oObject.Assignedvehiclenumber,
                    Assigneddeliverytype: oObject.Assigneddeliverytype,
                    VendorName: oObject.VendorName,
                    Assignedcheckintime: oObject.Assignedcheckintime
                }
                const oldSlotPayload = {
                    Status: "AVAILABLE",
                    Assigneddrivername: "",
                    Assigneddrivermobile: "",
                    Assignedvehiclenumber: "",
                    Assigneddeliverytype: "",
                    VendorName: "",
                    Assignedcheckintime: ""

                }

                oModel.update(`/ZPARKING_SLOTS_SSet('${oNewSlotNumer}')`, newSlotPayload, {
                    success: function (oData, oResponse) {
                        oModel.update(`/ZPARKING_SLOTS_SSet('${oOldSlotNumer}')`, oldSlotPayload, {
                            success: function (oData, oResponse) {
                                MessageToast.show("Slot Updated Successfully")

                            },
                            error: function (error) {
                                MessageToast.show("Error" + error.message)
                            }
                        })

                        MessageToast.show("Slot Updated Successfully")

                    },
                    error: function (error) {
                        MessageToast.show("Error" + error.message)
                    }
                })

                // var oAssignedSlotBinding = oModel.bindList("/assignedSlots");

                // oAssignedSlotBinding.filter([
                //     new Filter("Slotnumbers", FilterOperator.EQ, oOldSlotNumer)
                // ]);

                // const SlotUpdate = oAssignedSlotBinding.requestContexts().then(function (aAssignedContext) {
                //     if (aAssignedContext.length > 0) {
                //         var oAssignedContext = aAssignedContext[0];
                //         var oAssignedData = oAssignedContext.getObject();
                //         // Update 
                //         oAssignedData.slotNumber = oNewSlotNumer_ID
                //         oAssignedContext.setProperty("slotNumber_ID", oAssignedData.slotNumber);
                //         oModel.submitBatch("updateGroup");
                //         oModel.refresh(); // Refresh the model to get the latest data

                //     }
                // })

                // //  
                // var oParkingSlotBinding = oModel.bindList("/parkingSlots")

                // oParkingSlotBinding.filter([
                //     new Filter("ID", FilterOperator.EQ, oNewSlotNumer_ID)
                // ]);

                // const oNewStatusUpdate = oParkingSlotBinding.requestContexts().then(function (aParkingContexts) {
                //     if (aParkingContexts.length > 0) {
                //         var oParkingContext = aParkingContexts[0];
                //         var oParkingData = oParkingContext.getObject();
                //         // Update 
                //         oParkingData.status = "Not Available"
                //         oParkingContext.setProperty("status", oParkingData.status);
                //         oModel.submitBatch("updateGroup");
                //         oThis.getView().byId("idAllSlots").getBinding("items").refresh();
                //         oModel.refresh(); // Refresh the model to get the latest data

                //     } else {
                //         MessageToast.show("Something went wrong")
                //     }
                // })

                // var oParkingSlotBinding = oModel.bindList("/parkingSlots");

                // oParkingSlotBinding.filter([
                //     new Filter("slotNumbers", FilterOperator.EQ, oOldSlotNumer)
                // ]);

                // const oOldStatusUpdate = oParkingSlotBinding.requestContexts().then(function (aParkingContexts) {
                //     if (aParkingContexts.length > 0) {
                //         var oParkingContext = aParkingContexts[0];
                //         var oParkingData = oParkingContext.getObject();
                //         // Update 
                //         oParkingData.status = "Available"
                //         oParkingContext.setProperty("status", oParkingData.status);
                //         oModel.submitBatch("updateGroup");
                //         oThis.getView().byId("idAllSlots").getBinding("items").refresh();
                //         oModel.refresh(); // Refresh the model to get the latest data

                //     } else {
                //         MessageToast.show("Something went wrong")
                //     }
                // })

                this.byId("idBtnSave").setVisible(false);
                this.byId("idBtnEdit").setVisible(true);
                this.byId("idBtnCancel").setVisible(false);
                this.byId("idBtUnassign").setVisible(true);
            },

            onCanclePress: function () {
                var oTable = this.byId("idAssignedTable");
                var aSelectedItem = oTable.getSelectedItems();

                aSelectedItem.forEach(function (oItem) {
                    var aCells = oItem.getCells();
                    aCells.forEach(function (oCell) {
                        if (oCell.getId().includes("idinTablevbox")) {
                            var aVBoxItems = oCell.getItems();
                            aVBoxItems[0].setVisible(true); // Hide Text
                            aVBoxItems[1].setVisible(false); // Show 
                        }
                    });
                });

                this.byId("idBtnEdit").setVisible(true);
                this.byId("idBtnSave").setVisible(false);
                this.byId("idBtnCancel").setVisible(false);
                this.byId("idBtUnassign").setVisible(true);

            },
            onReservationsPress: async function () {
                // count
                var count = 0;
                var oModel = this.getView().getModel("ModelV2");
                var oThis = this;
                oModel.read("/ZPARKING_RESERVE_SSet", {
                    success: function (odata) {
                        // var otemp = odata.results.length;
                        odata.results.forEach((obj) => {
                            if (obj.Reservedslot === "") {
                                count = count + 1
                            }
                        })
                        oThis.getView().byId("idbadghqwe").setValue(count);

                    }, error: function (oError) {

                    }
                })
                if (!this.Reservationspopup) {
                    this.Reservationspopup = await this.loadFragment("Reservations")
                }
                this.Reservationspopup.open()
                oModel.refresh(true)

            },
            onCloseReservations: function () {
                if (this.Reservationspopup.isOpen()) {
                    this.Reservationspopup.close()
                    const oModel = this.getView().getModel("ModelV2")
                    oModel.refresh()

                }

            },

            onSearch: function (oEvent) {
                debugger
                // Add filters for search
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();

                if (sQuery && sQuery.length > 0) {
                    // Filters for each field based on the search query
                    var filterVehicle = new Filter("Assignedvehiclenumber", FilterOperator.Contains, sQuery);
                    var filterSlot = new Filter("Slotnumbers", FilterOperator.Contains, sQuery);
                    var filterName = new Filter("Assigneddrivername", FilterOperator.Contains, sQuery);
                    var filterMobile = new Filter("Assigneddrivermobile", FilterOperator.Contains, sQuery);
                    var filterDelivery = new Filter("Assigneddeliverytype", FilterOperator.Contains, sQuery);
                    var filterVendor = new Filter("VendorName", FilterOperator.Contains, sQuery);

                    // Combine all the above filters with OR condition
                    var searchFilters = new Filter({
                        filters: [filterVehicle, filterSlot, filterName, filterMobile, filterDelivery, filterVendor],
                        and: false
                    });

                    // Filter to ensure Assignedvehiclenumber is not empty
                    var vehicleFilter = new Filter("Assignedvehiclenumber", FilterOperator.NE, "");

                    // Combine search filters with the vehicle filter (AND condition)
                    var allFilters = new Filter({
                        filters: [searchFilters, vehicleFilter],
                        and: true
                    });

                    aFilters.push(allFilters);
                } else {
                    // If no query, just ensure the vehicle number is not empty
                    aFilters.push(new Filter("Assignedvehiclenumber", FilterOperator.NE, ""));
                }

                // Update list binding with the combined filters
                var oList = this.byId("idAssignedTable");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters);
            },

            // onSearch: function (oEvent) {
            //     debugger
            //     // add filter for search
            //     var aFilters = [];
            //     var sQuery = oEvent.getSource().getValue();
            //     if (sQuery && sQuery.length > 0) {
            //         var filterVehicle = new Filter("Assignedvehiclenumber", FilterOperator.Contains, sQuery);
            //         var filterSlot = new Filter("Slotnumbers", FilterOperator.Contains, sQuery)

            //         var filterName = new Filter("Assigneddrivername", FilterOperator.Contains, sQuery);
            //         var filterMobile = new Filter("Assigneddrivermobile", FilterOperator.Contains, sQuery);
            //         var filterDelivery = new Filter("Assigneddeliverytype", FilterOperator.Contains, sQuery);
            //         var filterVendor = new Filter("VendorName", FilterOperator.Contains, sQuery);

            //         var allFilter = new Filter([filterVehicle, filterSlot, filterName, filterMobile, filterDelivery, filterVendor]);
            //     }

            //     // update list binding
            //     var oList = this.byId("idAssignedTable");
            //     var oBinding = oList.getBinding("items");
            //     oBinding.filter(allFilter);

            // },

            // onSearchHistory: function (oEvent) {
            //     debugger
            //     // add filter for search
            //     // var aFilters = [];
            //     var sQuery = oEvent.getSource().getValue();
            //     if (sQuery && sQuery.length > 0) {
            //         // var filterVehicle = new Filter("Vehiclenumber", FilterOperator.Contains, sQuery);
            //         // var filterSlot = new Filter("Historyslotnumber", FilterOperator.Contains, sQuery);
            //         var filterName = new Filter("Drivername", FilterOperator.EQ, sQuery);
            //         var filterMobile = new Filter("Drivermobile", FilterOperator.Contains, sQuery);
            //         var filterDelivery = new Filter("Deliverytype", FilterOperator.Contains, sQuery);
            //         var filterVendor = new Filter("VendorName", FilterOperator.Contains, sQuery);

            //         var allFilter = new Filter([filterName, filterMobile, filterDelivery, filterVendor]);
            //     }

            //     // update list binding
            //     var oList = this.byId("idHistoryTable");
            //     var oBinding = oList.getBinding("items");
            //     oBinding.filter(allFilter);

            // },

            onAssignPress: async function (oEvent) {

                debugger
                var oThis = this
                var currentDate = new Date();
                var year = currentDate.getFullYear();
                var month = currentDate.getMonth() + 1; // Months are zero-based
                var day = currentDate.getDate();
                var hours = currentDate.getHours();
                var minutes = currentDate.getMinutes();
                var seconds = currentDate.getSeconds();
                var FinalDate = `${year}-${month}-${day} TIME ${hours}:${minutes}:${seconds}`
                const oUserView = this.getView(),
                    oDriverName = oUserView.byId("idDriverName").getValue().toUpperCase(),
                    oDriverMobile = oUserView.byId("idDriverMobile").getValue().toUpperCase(),
                    oVehicleNumber = oUserView.byId("idVehicleNUmber").getValue().toUpperCase(),
                    oVendorName = oUserView.byId("idVendorName___").getValue().toUpperCase(),
                    odeliveryType = oUserView.byId("idTypeOfDelivery").getSelectedKey().toUpperCase(),
                    oslotNumber = oUserView.byId("parkingLotSelect").getSelectedKey(),
                    oCheckInTime = FinalDate

                var oSelect = this.byId("parkingLotSelect");
                var oSelectedItem = oSelect.getSelectedItem();

                if (oSelectedItem) {
                    var sSlotNumber = oSelectedItem.getText();

                }

                const newAssignPayload = {
                    Status: "NOT AVAILABLE",
                    Assigneddrivername: oDriverName,
                    Assigneddrivermobile: oDriverMobile,
                    Assignedvehiclenumber: oVehicleNumber,
                    Assigneddeliverytype: odeliveryType,
                    VendorName: oVendorName,
                    Assignedcheckintime: oCheckInTime
                }
                const oModel = this.getView().getModel("MOdelV2")
                

                oModel.update(`/ZPARKING_SLOTS_SSet('${oslotNumber}')`, newAssignPayload, {
                    success: async function (oData, oResponse) {
                        MessageToast("Updated")
                    },
                    error: async function (message) {
                        MessageToast("failed to Updated")
                    }
                })

                // var oModel = this.getView().getModel("ModelV2")
                // var bValid = true;
                // if (!oDriverName || oDriverName.length < 3 || !/^[a-zA-Z\s]+$/.test(oDriverName)) {
                //     oUserView.byId("idDriverName").setValueState("Error");
                //     oUserView.byId("idDriverName").setValueStateText("Name Must Contain 3 Characters A-Z or a-z");
                //     bValid = false;
                // } else {
                //     oUserView.byId("idDriverName").setValueState("None");
                // }
                // if (!oDriverMobile || oDriverMobile.length !== 10 || !/^\d+$/.test(oDriverMobile)) {
                //     oUserView.byId("idDriverMobile").setValueState("Error");
                //     oUserView.byId("idDriverMobile").setValueStateText("Mobile number must be a 10-digit numeric value");

                //     bValid = false;
                // } else {
                //     oUserView.byId("idDriverMobile").setValueState("None");
                // }
                // if (!oVehicleNumber || !/^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/.test(oVehicleNumber)) {
                //     oUserView.byId("idVehicleNUmber").setValueState("Error");
                //     oUserView.byId("idVehicleNUmber").setValueStateText("Vehicle number should follow this pattern AP12BG1234");

                //     bValid = false;
                // } else {
                //     oUserView.byId("idVehicleNUmber").setValueState("None");
                // }
                // if (!odeliveryType || odeliveryType === "SELECT") {
                //     oUserView.byId("idTypeOfDelivery").setValueState("Error");
                //     oUserView.byId("idTypeOfDelivery").setValueStateText("Please select atleast one option below");

                //     bValid = false;
                // } else {
                //     oUserView.byId("idTypeOfDelivery").setValueState("None");
                // }
                // if (!oslotNumber) {
                //     oUserView.byId("parkingLotSelect").setValueState("Error");
                //     bValid = false;
                // } else {
                //     oUserView.byId("parkingLotSelect").setValueState("None");
                // }
                // if (!oVendorName || oVendorName.length < 3 || !/^[a-zA-Z\s]+$/.test(oVendorName)) {
                //     oUserView.byId("idVendorName___").setValueState("Error");
                //     oUserView.byId("idVendorName___").setValueStateText("Vendor Name Must Contain 3 Characters A-Z or a-z");
                //     bValid = false;
                // } else {
                //     oUserView.byId("idVendorName___").setValueState("None");
                // }

                // if (!bValid) {
                //     MessageToast.show("Please enter correct data");
                //     return; // Prevent further execution

                // }
                // else {

                //     const ofilter = new Filter("Assignedvehiclenumber", FilterOperator.EQ, oVehicleNumber)

                //     oModel.read("/ZPARKING_SLOTS_SSet", {
                //         filters: [ofilter],
                //         success: async function (oData) {
                //             if (oData.results.length > 0) {
                //                 MessageBox.warning("You can not Assign.A Slot for " + oVehicleNumber + " already assigned")
                //             } else {

                //                 oModel.update(`/ZPARKING_SLOTS_SSet('${oslotNumber}')`, newAssignPayload, {
                //                     success: async function (oData, oResponse) {

                //                         // success
                //                         // Test

                //                         const accountSid = Config.twilio.accountSid;
                //                         const authToken = Config.twilio.authToken;

                //                         // debugger
                //                         const toNumber = `+91${oDriverMobile}`
                //                         const fromNumber = '+15856485867';
                //                         const messageBody = `Hi ${oDriverName} a Slot number ${sSlotNumber} is alloted to you vehicle number ${oVehicleNumber} \nVendor name: ${oVendorName}. \nThank You,\nVishal Parking Management.`; // Message content

                //                         // Twilio API endpoint for sending messages
                //                         const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;


                //                         // Send POST request to Twilio API using jQuery.ajax
                //                         $.ajax({
                //                             url: url,
                //                             type: 'POST',
                //                             async: true,
                //                             headers: {
                //                                 'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                //                             },
                //                             data: {
                //                                 To: toNumber,
                //                                 From: fromNumber,
                //                                 Body: messageBody
                //                             },
                //                             success: function (data) {
                //                                 // console.log('SMS sent successfully:', data);
                //                                 // Handle success, e.g., show a success message
                //                                 MessageToast.show('if number exists SMS will be sent!');
                //                             },
                //                             error: function (error) {
                //                                 // console.error('Error sending SMS:', error);
                //                                 // Handle error, e.g., show an error message
                //                                 MessageToast.show('Failed to send SMS: ' + error);
                //                             }
                //                         });

                //                         // SMS END

                //                         // Function to make an announcement
                //                         function makeAnnouncement(message, lang = 'en-US') {
                //                             // Check if the browser supports the Web Speech API
                //                             if ('speechSynthesis' in window) {
                //                                 // Create a new instance of SpeechSynthesisUtterance
                //                                 var utterance = new SpeechSynthesisUtterance(message);

                //                                 // Set properties (optional)
                //                                 utterance.pitch = 1; // Range between 0 (lowest) and 2 (highest)
                //                                 utterance.rate = 0.75;  // Range between 0.1 (lowest) and 10 (highest)
                //                                 utterance.volume = 1; // Range between 0 (lowest) and 1 (highest)
                //                                 utterance.lang = lang; // Set the language

                //                                 // Speak the utterance
                //                                 debugger
                //                                 window.speechSynthesis.speak(utterance);
                //                             } else {
                //                                 console.log('Sorry, your browser does not support the Web Speech API.');
                //                             }
                //                         }

                //                         // Example usage
                //                         makeAnnouncement(`कृपया ध्यान दें। वाहन नंबर ${oVehicleNumber} को स्लॉट नंबर ${sSlotNumber} द्वारा आवंटित किया गया है।`, 'hi-IN');
                //                         // makeAnnouncement(`దయచేసి వినండి. వాహనం నంబర్ ${oVehicleNumber} కు స్లాట్ నంబర్ ${sSlotNumber} కేటాయించబడింది.`, 'te-IN');

                //                         // Lorry Animation
                //                         var oImage = oThis.byId("movingImage");
                //                         oImage.setVisible(true);
                //                         oImage.addStyleClass("animate");
                //                         setTimeout(function () {
                //                             oImage.setVisible(false);
                //                         }, 7000);

                //                         // open receipt    
                //                         // test
                //                         if (!oThis.ReceiptDailog) {
                //                             oThis.ReceiptDailog = await oThis.loadFragment("Receipt")
                //                         }
                //                         oThis.ReceiptDailog.open();
                //                         // barcode generations with value
                //                         var obj = sSlotNumber
                //                         oThis._generateBarcode(obj)
                //                         oThis.byId("textprint1").setText(oVehicleNumber)
                //                         oThis.byId("textprint5").setText(sSlotNumber)
                //                         oThis.byId("textprint2").setText(oDriverName)
                //                         oThis.byId("textprint3").setText(oDriverMobile)
                //                         oThis.byId("textprint4").setText(odeliveryType)
                //                         oThis.byId("dfvtextprint1").setText(`Date: ${year}-${month}-${day} \nTIME: ${hours}:${minutes}:${seconds}`)

                //                         //  refresh and clear data
                //                         oThis.getView().byId("idAllSlots").getBinding("items").refresh();
                //                         oModel.refresh(); // Refresh the model to get the latest data

                //                         oThis.getView().byId("idDriverName").setValue("")
                //                         oThis.getView().byId("idDriverMobile").setValue("")
                //                         oThis.getView().byId("idVehicleNUmber").setValue("")
                //                         oThis.getView().byId("idTypeOfDelivery").setValue("Select")
                //                         oThis.getView().byId("idVendorName___").setValue("")



                //                     },
                //                     error: function (error) {
                //                         MessageToast.show("Error" + error.message)
                //                     }
                //                 })
                //             }
                //         },
                //         error: function (er) {
                //             console.log("error in reading ", er.message);
                //         }
                //     })

                // }
            },
            closeReceiptDailog: function () {
                if (this.ReceiptDailog.isOpen()) {
                    this.ReceiptDailog.close()
                }
            },
            onUnassignPress: function (oEvent) {
                debugger;
                const oThis = this
                const oModel = this.getView().getModel("ModelV2")
                var oSelected = this.byId("idAssignedTable").getSelectedItem();
                if (oSelected) {
                    var sVehicle = oSelected.getBindingContext().getObject().Assignedvehiclenumber;
                    var sSlotNumber = oSelected.getBindingContext().getObject().Slotnumbers;
                    var sDriverName = oSelected.getBindingContext().getObject().Assigneddrivername
                    var sTypeofDelivery = oSelected.getBindingContext().getObject().Deliverytype
                    var sDriverMobile = oSelected.getBindingContext().getObject().Assigneddrivermobile
                    var dCheckInTime = oSelected.getBindingContext().getObject().Assignedcheckintime
                    // var oSlotId = oSelected.getBindingContext().getObject().slotNumber_ID
                    var oVendorName = oSelected.getBindingContext().getObject().VendorName
                    var currentDate = new Date();
                    var year = currentDate.getFullYear();
                    var month = currentDate.getMonth() + 1; // Months are zero-based
                    var day = currentDate.getDate();
                    var hours = currentDate.getHours();
                    var minutes = currentDate.getMinutes();
                    var seconds = currentDate.getSeconds();
                    var FinalDate = `${year}-${month}-${day} TIME ${hours}:${minutes}:${seconds}`
                    var oCheckOutTime = FinalDate

                    // UUID generation
                    function generateUUID() {
                        // Generate random values and place them in the UUID format
                        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                    }
                    const NewUuid = generateUUID();

                    // update the slot data
                    const oUpdatedSlotPayload = {
                        Status: "AVAILABLE",
                        Assigneddrivername: "",
                        Assigneddrivermobile: "",
                        Assignedvehiclenumber: "",
                        Assigneddeliverytype: "",
                        VendorName: "",
                        Assignedcheckintime: ""
                    }

                    // create a record in history
                    const oNewHistoryPayload = {
                        Uuid: NewUuid,
                        Drivername: sDriverName,
                        Drivermobile: sDriverMobile,
                        Vehiclenumber: sVehicle,
                        Deliverytype: sTypeofDelivery,
                        Checkintime: dCheckInTime,
                        Historyslotnumber: sSlotNumber,
                        VendorName: oVendorName,
                        Checkouttime: oCheckOutTime
                    }

                    oModel.update(`/ZPARKING_SLOTS_SSet('${sSlotNumber}')`, oUpdatedSlotPayload, {
                        success: async function (oData, oResponse) {
                            oModel.refresh(true)
                            // Unassign SMS
                            const accountSid = Config.twilio.accountSid;
                            const authToken = Config.twilio.authToken;

                            // debugger
                            const toNumber = `+91${sDriverMobile}` // Replace with recipient's phone number
                            const fromNumber = '+15856485867'; // Replace with your Twilio phone number
                            const messageBody = `Hi ${sDriverName} please move the vehicle from the parking yard.\nIgnore if already left from the yard.\nThank you,\nVishal Parking Management`; // Message content

                            // Twilio API endpoint for sending messages
                            const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;


                            // Send POST request to Twilio API using jQuery.ajax
                            $.ajax({
                                url: url,
                                type: 'POST',
                                headers: {
                                    'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                                },
                                data: {
                                    To: toNumber,
                                    From: fromNumber,
                                    Body: messageBody
                                },
                                success: function (data) {
                                    console.log('SMS sent successfully:', data);
                                    // Handle success, e.g., show a success message
                                    sap.m.MessageToast.show('SMS sent successfully!');
                                },
                                error: function (error) {
                                    console.error('Error sending SMS:', error);
                                    // Handle error, e.g., show an error message
                                    sap.m.MessageToast.show('Failed to send SMS: ' + error);
                                }
                            });

                            // SMS END

                            var oImage = oThis.byId("movingImage2");
                            oImage.setVisible(true);
                            oImage.addStyleClass("animate");
                            setTimeout(function () {
                                oImage.setVisible(false);
                            }, 7000);

                            // CREATE history
                            oModel.create("/ZPARKING_HISTORYSet", oNewHistoryPayload, {
                                success: function (oData, oResponse) {

                                },
                                error: function (error) {
                                    MessageToast.show("Error" + error.message)
                                }
                            })

                            oThis.getView().byId("idHistoryTable").getBinding("items").refresh();
                            MessageToast.show("Vechicle " + sVehicle + " Unassigned Successfully");


                        },
                        error: function (err) {
                        }
                    })




                    // const oBindlist = oModel.bindList("/history")

                    // oSelected.getBindingContext().delete("$auto").then(function () {

                    //     // Add sms code here

                    //     // Unassign SMS

                    //     const accountSid = Config.twilio.accountSid;
                    //     const authToken = Config.twilio.authToken;

                    //     // debugger
                    //     const toNumber = `+91${sDriverMobile}` // Replace with recipient's phone number
                    //     const fromNumber = '+15856485867'; // Replace with your Twilio phone number
                    //     const messageBody = `Hi ${sDriverName} please move the vehicle from the parking yard.\nIgnore if already left from the yard.\nThank you,\nVishal Parking Management`; // Message content

                    //     // Twilio API endpoint for sending messages
                    //     const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;


                    //     // Send POST request to Twilio API using jQuery.ajax
                    //     $.ajax({
                    //         url: url,
                    //         type: 'POST',
                    //         headers: {
                    //             'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                    //         },
                    //         data: {
                    //             To: toNumber,
                    //             From: fromNumber,
                    //             Body: messageBody
                    //         },
                    //         success: function (data) {
                    //             console.log('SMS sent successfully:', data);
                    //             // Handle success, e.g., show a success message
                    //             sap.m.MessageToast.show('SMS sent successfully!');
                    //         },
                    //         error: function (error) {
                    //             console.error('Error sending SMS:', error);
                    //             // Handle error, e.g., show an error message
                    //             sap.m.MessageToast.show('Failed to send SMS: ' + error);
                    //         }
                    //     });

                    //     // SMS END

                    //     var oImage = oThis.byId("movingImage2");
                    //     oImage.setVisible(true);
                    //     oImage.addStyleClass("animate");
                    //     setTimeout(function () {
                    //         oImage.setVisible(false);
                    //     }, 7000);

                    //     oBindlist.create(oNewHistory)
                    //     oThis.getView().byId("idHistoryTable").getBinding("items").refresh();
                    //     var oParkingSlotBinding = oModel.bindList("/parkingSlots");

                    //     oParkingSlotBinding.filter([
                    //         new Filter("slotNumbers", FilterOperator.EQ, sSlotNumber)
                    //     ]);

                    //     oParkingSlotBinding.requestContexts().then(function (aParkingContexts) {
                    //         if (aParkingContexts.length > 0) {
                    //             var oParkingContext = aParkingContexts[0];
                    //             var oParkingData = oParkingContext.getObject();
                    //             // Update 
                    //             oParkingData.status = "Available"
                    //             oParkingContext.setProperty("status", oParkingData.status);
                    //             oModel.submitBatch("updateGroup");
                    //             oThis.getView().byId("idAllSlots").getBinding("items").refresh();
                    //             oModel.refresh(); // Refresh the model to get the latest 


                    //         } else {
                    //             MessageToast.show("Something went wrong")
                    //         }
                    //     })

                    //     MessageToast.show("Vechicle " + sVehicle + " Unassigned Successfully");

                    // },
                    //     function (oError) {
                    //         MessageToast.show("Technical Issue Cannot Unassign", oError);
                    //     });
                    // this.getView().byId("idAssignedTable").getBinding("items").refresh();

                } else {
                    MessageToast.show("Please Select a record");
                }
            },
            onConfirmReservePress: async function () {
                debugger
                if (!this.confirmDialog) {
                    this.confirmDialog = await this.loadFragment("confirmBookings")
                }
                const oSelected = this.getView().byId("idReservationsTable").getSelectedItem()
                if (oSelected) {

                    const oSelectedObject = oSelected.getBindingContext().getObject(),
                        oDriverName = oSelectedObject.Drivername,
                        oDriverMobile = oSelectedObject.Drivermobile,
                        oVehicleNumber = oSelectedObject.Vehiclenumber,
                        // oDeliveryType = oSelectedObject.deliveryType,
                        oVendorName = oSelectedObject.Vendorname;
                    this.confirmDialog.open()
                    this.byId("_IDGendfgdInput1").setValue(oDriverName)
                    this.byId("_IDGexgrgnInput2").setValue(oDriverMobile)
                    this.byId("idasgredhmeInput").setValue(oVehicleNumber)
                    // this.byId("_IDGewertnSelect1").setValue(oDeliveryType)
                    this.byId("idasgredhmeIn0075put").setValue(oVendorName)

                    // Restrict date
                    debugger
                    var oDatePicker = this.getView().byId("idDatePicker");
                    var oCurrentDate = new Date();
                    oDatePicker.setMinDate(oCurrentDate);

                    var oMaxDate = new Date();
                    oMaxDate.setDate(oMaxDate.getDate() + 7);

                    oDatePicker.setMaxDate(oMaxDate);

                    this.getView().getModel("ModelV2").refresh()

                } else {
                    MessageToast.show("Select a record to accept reservations")
                }


            },
            onCloseConfirmDialog: function () {
                if (this.confirmDialog.isOpen()) {
                    this.confirmDialog.close()

                }

            },
            onConfirmBookSlotPress: function () {
                debugger
                let currentDate = new Date();
                let year = currentDate.getFullYear();
                let month = String(currentDate.getMonth() + 1).padStart(2, '0');
                let day = String(currentDate.getDate()).padStart(2, '0');
                const currentDay = `${year}-${month}-${day}`

                const oThis = this
                const oDriverName = this.getView().byId("_IDGendfgdInput1").getValue(),
                    oDriverMobile = this.getView().byId("_IDGexgrgnInput2").getValue(),
                    oVehicleNumber = this.getView().byId("idasgredhmeInput").getValue(),
                    oVendorName = this.getView().byId("idasgredhmeIn0075put").getValue(),
                    // oDeliveryType = this.getView().byId("_IDGewertnSelect1").getSelectedKey(),
                    oReservedSlot = this.getView().byId("idSlotReserve").getSelectedKey(),
                    oBookedDate = this.getView().byId("idDatePicker").getValue()



                var oSelect = this.byId("idSlotReserve");
                var oSelectedItem = oSelect.getSelectedItem();

                if (oSelectedItem) {
                    var sSlotNumber = oSelectedItem.getText();

                }
                const selectedRecordId = this.getView().byId("idReservationsTable").getSelectedItem().getBindingContext().getObject().Uuid

                const NewReservedRecord = {

                    Drivername: oDriverName,
                    Drivermobile: oDriverMobile,
                    Vehiclenumber: oVehicleNumber,
                    Vendorname: oVendorName,
                    // deliveryType: oDeliveryType,
                    Reservedslot: oReservedSlot,
                    Reserveddate: oBookedDate

                }
                const oModel = this.getView().getModel("ModelV2"),
                    oUserView = this.getView()

                var bValid = true;
                if (!oDriverName || oDriverName.length < 3 || !/^[a-zA-Z\s]+$/.test(oDriverName)) {
                    oUserView.byId("_IDGendfgdInput1").setValueState("Error");
                    oUserView.byId("_IDGendfgdInput1").setValueStateText("Name Must Contain 3 Characters A-Z or a-z");
                    bValid = false;
                } else {
                    oUserView.byId("_IDGendfgdInput1").setValueState("None");
                }
                if (!oDriverMobile || oDriverMobile.length !== 10 || !/^\d+$/.test(oDriverMobile)) {
                    oUserView.byId("_IDGexgrgnInput2").setValueState("Error");
                    oUserView.byId("_IDGexgrgnInput2").setValueStateText("Mobile number must be a 10-digit numeric value");

                    bValid = false;
                } else {
                    oUserView.byId("_IDGexgrgnInput2").setValueState("None");
                }
                if (!oVehicleNumber || !/^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/.test(oVehicleNumber)) {
                    oUserView.byId("idasgredhmeInput").setValueState("Error");
                    oUserView.byId("idasgredhmeInput").setValueStateText("Vehicle number should follow this pattern AP12BG1234");

                    bValid = false;
                } else {
                    oUserView.byId("idasgredhmeInput").setValueState("None");
                }
                if (!oVendorName || oVendorName.length < 3 || !/^[a-zA-Z\s]+$/.test(oVendorName)) {
                    oUserView.byId("idasgredhmeIn0075put").setValueState("Error");
                    oUserView.byId("idasgredhmeIn0075put").setValueStateText("Vendor Name Must Contain 3 Characters A-Z or a-z");
                    bValid = false;
                } else {
                    oUserView.byId("idasgredhmeIn0075put").setValueState("None");
                }
                if (!oBookedDate) {
                    oUserView.byId("idDatePicker").setValueState("Error");
                    oUserView.byId("idDatePicker").setValueStateText("Select Date");
                    bValid = false;
                } else {
                    oUserView.byId("idDatePicker").setValueState("None");
                }

                if (!bValid) {
                    MessageToast.show("Please enter correct data");
                    return; // Prevent further execution

                }

                const oFilters = new Filter("Reserveddate", FilterOperator.EQ, oBookedDate)
                const oFilter2 = new Filter("Reservedslot", FilterOperator.EQ, oReservedSlot)
                // const ofilter3 = new Filter("Status", FilterOperator.NE, "AVAILABLE")
                const oFilter4 = new Filter("Slotnumbers", FilterOperator.EQ, oReservedSlot)


                if (oBookedDate === currentDay) {
                    oModel.read("/ZPARKING_SLOTS_SSet", {
                        filters: [oFilter4],
                        success: function (oData) {
                            if (oData.results.length > 0 && oData.results[0].Status !== "AVAILABLE") {
                                MessageBox.information("Selected slot not available Today")
                            } else {
                                oModel.update(`/ZPARKING_RESERVE_SSet('${selectedRecordId}')`, NewReservedRecord, {
                                    success: async function (oData, oResponse) {

                                        // count
                                        var count = 0;
                                        var oModel = oThis.getView().getModel("ModelV2");
                                        oModel.read("/ZPARKING_RESERVE_SSet", {
                                            success: function (odata) {
                                                // var otemp = odata.results.length;
                                                odata.results.forEach((obj) => {
                                                    if (obj.Reservedslot === "") {
                                                        count = count + 1
                                                    }
                                                })
                                                oThis.getView().byId("idbadghqwe").setValue(count);

                                            }, error: function (oError) {

                                            }
                                        })

                                        const accountSid = Config.twilio.accountSid;
                                        const authToken = Config.twilio.authToken;

                                        // debugger
                                        const toNumber = `+91${oDriverMobile}` // Replace with recipient's phone number
                                        const fromNumber = '+15856485867'; // Replace with your Twilio phone number
                                        const messageBody = `Hi ${oDriverName} a Slot number ${sSlotNumber} is reserved on your vehicle number ${oVehicleNumber} \nVendor name: ${oVendorName}. \nThank You,\nVishal Parking Management`; // Message content

                                        // Twilio API endpoint for sending messages
                                        const APIendpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;


                                        // Send POST request to Twilio API using jQuery.ajax
                                        $.ajax({
                                            url: APIendpoint,
                                            type: 'POST',
                                            headers: {
                                                'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                                            },
                                            data: {
                                                To: toNumber,
                                                From: fromNumber,
                                                Body: messageBody
                                            },
                                            success: function (data) {
                                                // console.log('SMS sent successfully:', data);
                                                MessageToast.show('SMS sent successfully!');
                                            },
                                            error: function (error) {
                                                // console.error('Error sending SMS:', error);
                                                MessageToast.show('Failed to send SMS: ' + error);
                                            }
                                        });

                                        // SMS END
                                        // var oSelected = oThis.byId("idReservationsTable").getSelectedItem();

                                        oThis.byId("_IDGendfgdInput1").setValue("")
                                        oThis.byId("_IDGexgrgnInput2").setValue("")
                                        oThis.byId("idasgredhmeInput").setValue("")
                                        //  this.byId("_IDGewertnSelect1").setValue(oDeliveryType)
                                        oThis.byId("idasgredhmeIn0075put").setValue("")
                                        oThis.confirmDialog.close()


                                        // update the slot acc to date 

                                        const filter = new Filter("Slotnumbers", FilterOperator.EQ, oReservedSlot)
                                        oModel.read("/ZPARKING_SLOTS_SSet", {
                                            filters: [filter],
                                            success: function (oData, resp) {
                                                if (oBookedDate === currentDay) {
                                                    oModel.update(`/ZPARKING_SLOTS_SSet('${oReservedSlot}')`, { Status: "RESERVED" })

                                                }

                                            },
                                            error: function (err) {
                                                MessageToast.show("Failed to read slots")
                                            }
                                        })

                                    },
                                    error: async function (err) {
                                        MessageToast.show("Failed to read slots")
                                    }
                                })

                            }
                        },
                        error: function () {

                        }
                    })
                } else {

                    oModel.read("/ZPARKING_RESERVE_SSet", {
                        filters: [oFilters, oFilter2],
                        success: async function (oData, oResponse) {
                            if (oData.results.length > 0) {
                                MessageBox.information("A slot not available on selected date")
                            } else {
                                oModel.update(`/ZPARKING_RESERVE_SSet('${selectedRecordId}')`, NewReservedRecord, {
                                    success: async function (oData, oResponse) {

                                        // count
                                        var count = 0;
                                        var oModel = oThis.getView().getModel("ModelV2");
                                        oModel.read("/ZPARKING_RESERVE_SSet", {
                                            success: function (odata) {
                                                // var otemp = odata.results.length;
                                                odata.results.forEach((obj) => {
                                                    if (obj.Reservedslot === "") {
                                                        count = count + 1
                                                    }
                                                })
                                                oThis.getView().byId("idbadghqwe").setValue(count);

                                            }, error: function (oError) {

                                            }
                                        })

                                        const accountSid = Config.twilio.accountSid;
                                        const authToken = Config.twilio.authToken;

                                        // debugger
                                        const toNumber = `+91${oDriverMobile}` // Replace with recipient's phone number
                                        const fromNumber = '+15856485867'; // Replace with your Twilio phone number
                                        const messageBody = `Hi ${oDriverName} a Slot number ${sSlotNumber} is reserved on your vehicle number ${oVehicleNumber} \nVendor name: ${oVendorName}. \nThank You,\nVishal Parking Management`; // Message content

                                        // Twilio API endpoint for sending messages
                                        const APIendpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;


                                        // Send POST request to Twilio API using jQuery.ajax
                                        $.ajax({
                                            url: APIendpoint,
                                            type: 'POST',
                                            headers: {
                                                'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                                            },
                                            data: {
                                                To: toNumber,
                                                From: fromNumber,
                                                Body: messageBody
                                            },
                                            success: function (data) {
                                                // console.log('SMS sent successfully:', data);
                                                MessageToast.show('SMS sent successfully!');
                                            },
                                            error: function (error) {
                                                // console.error('Error sending SMS:', error);
                                                MessageToast.show('Failed to send SMS: ' + error);
                                            }
                                        });

                                        // SMS END
                                        // var oSelected = oThis.byId("idReservationsTable").getSelectedItem();

                                        oThis.byId("_IDGendfgdInput1").setValue("")
                                        oThis.byId("_IDGexgrgnInput2").setValue("")
                                        oThis.byId("idasgredhmeInput").setValue("")
                                        //  this.byId("_IDGewertnSelect1").setValue(oDeliveryType)
                                        oThis.byId("idasgredhmeIn0075put").setValue("")
                                        oThis.confirmDialog.close()


                                        // update the slot acc to date 

                                        const filter = new Filter("Slotnumbers", FilterOperator.EQ, oReservedSlot)
                                        oModel.read("/ZPARKING_SLOTS_SSet", {
                                            filters: [filter],
                                            success: function (oData, resp) {
                                                if (oBookedDate === currentDay) {
                                                    oModel.update(`/ZPARKING_SLOTS_SSet('${oReservedSlot}')`, { Status: "RESERVED" })

                                                }

                                            },
                                            error: function (err) {
                                                MessageToast.show("Failed to read slots")
                                            }
                                        })

                                    },
                                    error: async function (err) {
                                        MessageToast.show("Failed to read slots")
                                    }
                                })

                            }
                        },
                        error: async function (err) {
                            MessageToast.show("Failed to read slots")

                        }
                    })
                }

            },
            onDeleteReservedPressToConfirm: async function () {
                const oSelected = this.getView().byId("idReservedTable__").getSelectedItem()
                if (oSelected) {
                    if (!this.ConfirmDeleteDialog) {
                        this.ConfirmDeleteDialog = await this.loadFragment("DeleteReserved")
                    }
                    this.ConfirmDeleteDialog.open()
                } else {
                    MessageBox.information("Please Select one record")
                }

            },
            onCloseDeleteReservedPressToConfirm: function () {

                if (this.ConfirmDeleteDialog.isOpen()) {
                    this.ConfirmDeleteDialog.close()
                }
            },
            onDeleteReservedPress: function () {
                debugger
                const oThis = this;
                let currentDate = new Date();
                let year = currentDate.getFullYear();
                let month = String(currentDate.getMonth() + 1).padStart(2, '0');
                let day = String(currentDate.getDate()).padStart(2, '0');
                const currentDay = `${year}-${month}-${day}`;
                const oModel = this.getView().getModel("ModelV2")

                const oSelected = this.getView().byId("idReservedTable__").getSelectedItem()

                const sDriverMobile = oSelected.getBindingContext().getObject().Drivermobile,
                    sDriverName = oSelected.getBindingContext().getObject().Drivername,
                    sSlotNumber = oSelected.getBindingContext().getObject().Reservedslot,
                    dReservedDate = oSelected.getBindingContext().getObject().Reserveddate,
                    sUUID = oSelected.getBindingContext().getObject().Uuid

                oModel.remove(`/ZPARKING_RESERVE_SSet('${sUUID}')`, {
                    success: function () {

                        MessageBox.information("Rejected and SMS will be sent")
                        oThis.ConfirmDeleteDialog.close()
                        // Unassign SMS

                        const accountSid = Config.twilio.accountSid;
                        const authToken = Config.twilio.authToken;

                        // debugger
                        const toNumber = `+91${sDriverMobile}`
                        const fromNumber = '+15856485867';
                        const messageBody = `Hi ${sDriverName} We regret to inform you that \nCurrently we can not proceed with your reservation.\nyou are failed to come on reserved day\nThank you,\nVishal Parking Management`; // Message content

                        // Twilio API endpoint for sending messages
                        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;


                        // Send POST request to Twilio API using jQuery.ajax
                        $.ajax({
                            url: url,
                            type: 'POST',
                            headers: {
                                'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                            },
                            data: {
                                To: toNumber,
                                From: fromNumber,
                                Body: messageBody
                            },
                            success: function (data) {
                                sap.m.MessageToast.show('SMS sent successfully!');
                            },
                            error: function (error) {
                                sap.m.MessageToast.show('Failed to send SMS: ' + error);
                            }
                        });
                        // SMS END


                        if (dReservedDate === currentDay) {

                            oModel.update(`/ZPARKING_SLOTS_SSet('${sSlotNumber}')`, { Status: "AVAILABLE" }, {
                                success: function () {

                                },
                                error: function () {

                                }

                            })

                        }
                    },
                    error: function () {

                    }
                })

            },
            // Updation of slots status based on date
            updateSoltsStatusbyDate: function () {
                debugger
                const oThis = this;
                let currentDate = new Date();
                let year = currentDate.getFullYear();
                let month = String(currentDate.getMonth() + 1).padStart(2, '0');
                let day = String(currentDate.getDate()).padStart(2, '0');
                const currentDay = `${year}-${month}-${day}`;

                const oModel = this.getView().getModel("ModelV2");

                if (!oModel) {
                    // MessageToast.show("Model is not defined");
                    console.log("error")
                    return;
                }

                oModel.read("/ZPARKING_RESERVE_SSet", {
                    success: function (oData, resp) {
                        if (oData.results.length > 0) {
                            MessageBox.information("Hey you have reservations today")
                            oData.results.forEach((element) => {
                                var oReservedDate = element.Reserveddate
                                if (oReservedDate === currentDay) {
                                    var oReservedSlot = element.Reservedslot
                                    const ofilter = new Filter("Slotnumbers", FilterOperator.EQ, oReservedSlot)
                                    oModel.update(`/ZPARKING_SLOTS_SSet('${oReservedSlot}')`, { Status: "RESERVED" }, {
                                        success: function () {

                                        },
                                        error: function () {
                                        }
                                    })
                                }
                            })

                        } else {
                            MessageBox.information("No Reservations found today")
                        }
                    },
                    error: function () {
                    }
                })
            },
            onAssignfromReservations: async function () {
                debugger
                if (!this.ConfirmAssignDialog) {
                    this.ConfirmAssignDialog = await this.loadFragment("ConfirmAssign")
                }
                const oSelected = this.getView().byId("idReservedTable__").getSelectedItem()
                if (oSelected) {
                    const oObject = oSelected.getBindingContext().getObject(),
                        oDriverName = oObject.Drivername,
                        oDriverMobile = oObject.Drivermobile,
                        oVehicleNumber = oObject.Vehiclenumber,
                        oVendorName = oObject.Vendorname,
                        oSlot = oObject.Reservedslot

                    this.ConfirmAssignDialog.open()
                    this.getView().byId("_IDGen__dfgdInput1").setValue(oDriverName)
                    this.getView().byId("_IDGexgrsdfgnIn__put2").setValue(oDriverMobile)
                    this.getView().byId("afidasgredhmeI__nput").setValue(oVehicleNumber)
                    this.getView().byId("idss__n0075put").setValue(oVendorName)
                    this.getView().byId("_dhmeI__nput").setValue(oSlot)

                } else {
                    MessageToast.show("Please select a record")
                }

            },
            onCloseAssignConfirmDialog: function () {
                if (this.ConfirmAssignDialog.isOpen()) {
                    this.ConfirmAssignDialog.close()
                }
            },
            onConfirmAssignSlotPress: function () {
                debugger
                var oThis = this
                const oSelected = this.getView().byId("idReservedTable__").getSelectedItem().getBindingContext().getObject()
                const oBindingContext = this.getView().byId("idReservedTable__").getSelectedItem().getBindingContext(),
                    oBookedDate = oSelected.Reserveddate,
                    // sSlotNumber = oSelected.Slotnumbers,
                    // oVehicle = oSelected.Vehiclenumber,
                    sUuid = oSelected.Uuid;

                var currentDate = new Date();
                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var seconds = String(currentDate.getSeconds()).padStart(2, '0');
                var FinalDate = `${year}-${month}-${day} TIME ${hours}:${minutes}:${seconds}`;
                var currentDate = `${year}-${month}-${day}`

                const oUserView = this.getView(),
                    oDriverName = oUserView.byId("_IDGen__dfgdInput1").getValue().toUpperCase(),
                    oDriverMobile = oUserView.byId("_IDGexgrsdfgnIn__put2").getValue(),
                    oVehicleNumber = oUserView.byId("afidasgredhmeI__nput").getValue().toUpperCase(),
                    oVendorName = oUserView.byId("idss__n0075put").getValue().toUpperCase(),
                    odeliveryType = oUserView.byId("_IDGewertnSelect1").getSelectedKey().toUpperCase(),
                    oslotNumber = oUserView.byId("_dhmeI__nput").getValue(),
                    oCheckInTime = FinalDate


                const newAssignPayload = {
                    Status: "NOT AVAILABLE",
                    Assigneddrivername: oDriverName,
                    Assigneddrivermobile: oDriverMobile,
                    Assignedvehiclenumber: oVehicleNumber,
                    Assigneddeliverytype: odeliveryType,
                    VendorName: oVendorName,
                    Assignedcheckintime: oCheckInTime
                }

                var oModel = this.getView().getModel("ModelV2")
                // oBindList = oModel.bindList("/assignedSlots");
                // if (!oDriverName || !oDriverMobile || !oVehicleNumber) {

                //     MessageToast.show("Please Enter All Required Fields")
                // } 
                var bValid = true;
                if (!oDriverName || oDriverName.length < 3 || !/^[a-zA-Z\s]+$/.test(oDriverName)) {
                    oUserView.byId("_IDGen__dfgdInput1").setValueState("Error");
                    oUserView.byId("_IDGen__dfgdInput1").setValueStateText("Name Must Contain 3 Characters (A-Z or a-z)");
                    bValid = false;
                } else {
                    oUserView.byId("_IDGen__dfgdInput1").setValueState("None");
                }
                if (!oDriverMobile || oDriverMobile.length !== 10 || !/^\d+$/.test(oDriverMobile)) {
                    oUserView.byId("_IDGexgrsdfgnIn__put2").setValueState("Error");
                    oUserView.byId("_IDGexgrsdfgnIn__put2").setValueStateText("Mobile number must be a 10-digit numeric value");

                    bValid = false;
                } else {
                    oUserView.byId("_IDGexgrsdfgnIn__put2").setValueState("None");
                }
                if (!oVehicleNumber || !/^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/.test(oVehicleNumber)) {
                    oUserView.byId("afidasgredhmeI__nput").setValueState("Error");
                    oUserView.byId("afidasgredhmeI__nput").setValueStateText("Vehicle number should follow this pattern AP12BG1234");

                    bValid = false;
                } else {
                    oUserView.byId("afidasgredhmeI__nput").setValueState("None");
                }
                if (!oVendorName || oVendorName.length < 3 || !/^[a-zA-Z\s]+$/.test(oVendorName)) {
                    oUserView.byId("idss__n0075put").setValueState("Error");
                    oUserView.byId("idss__n0075put").setValueStateText("Vendor Name Must Contain 3 Characters (A-Z or a-z)");
                    bValid = false;
                } else {
                    oUserView.byId("idss__n0075put").setValueState("None");
                }
                if (!odeliveryType || odeliveryType === "SELECT") {
                    oUserView.byId("_IDGewertnSelect1").setValueState("Error")
                    oUserView.byId("_IDGewertnSelect1").setValueStateText("Please select atleast one option");

                    bValid = false;
                } else {
                    oUserView.byId("_IDGewertnSelect1").setValueState("None");
                }
                if (!oslotNumber) {
                    oUserView.byId("_dhmeI__nput").setValueState("Error");
                    bValid = false;
                } else {
                    oUserView.byId("_dhmeI__nput").setValueState("None");
                }

                if (!bValid) {
                    MessageToast.show("Please enter correct data");
                    return; // Prevent further execution
                }
                else {
                    if (oBookedDate === currentDate) {
                        const oVehicleFilter = new Filter("Assignedvehiclenumber", FilterOperator.EQ, oVehicleNumber)
                        oModel.read("/ZPARKING_SLOTS_SSet", {
                            filters: [oVehicleFilter],
                            success: function (oData, resp) {
                                if (oData.results.length === 0) {

                                    oModel.update(`/ZPARKING_SLOTS_SSet('${oslotNumber}')`, newAssignPayload, {
                                        success: async function (oData, oResponse) {

                                            oModel.refresh(true)

                                            const accountSid = Config.twilio.accountSid;
                                            const authToken = Config.twilio.authToken;

                                            // debugger
                                            const toNumber = `+91${oDriverMobile}`
                                            const fromNumber = '+15856485867';
                                            const messageBody = `Hi ${oDriverName} a Slot number ${oslotNumber} is alloted to you vehicle number ${oVehicleNumber} \nVendor name: ${oVendorName}. \nThank You,\nVishal Parking Management.`; // Message content

                                            // Twilio API endpoint for sending messages
                                            const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;


                                            // Send POST request to Twilio API using jQuery.ajax
                                            $.ajax({
                                                url: url,
                                                type: 'POST',
                                                async: true,
                                                headers: {
                                                    'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                                                },
                                                data: {
                                                    To: toNumber,
                                                    From: fromNumber,
                                                    Body: messageBody
                                                },
                                                success: function (data) {
                                                    // console.log('SMS sent successfully:', data);
                                                    // Handle success, e.g., show a success message
                                                    MessageToast.show('if number exists SMS will be sent!');
                                                },
                                                error: function (error) {
                                                    // console.error('Error sending SMS:', error);
                                                    // Handle error, e.g., show an error message
                                                    MessageToast.show('Failed to send SMS');
                                                }
                                            });

                                            // SMS END

                                            // Function to make an announcement
                                            function makeAnnouncement(message, lang = 'en-US') {
                                                // Check if the browser supports the Web Speech API
                                                if ('speechSynthesis' in window) {
                                                    // Create a new instance of SpeechSynthesisUtterance
                                                    var utterance = new SpeechSynthesisUtterance(message);

                                                    // Set properties (optional)
                                                    utterance.pitch = 1; // Range between 0 (lowest) and 2 (highest)
                                                    utterance.rate = 0.75;  // Range between 0.1 (lowest) and 10 (highest)
                                                    utterance.volume = 1; // Range between 0 (lowest) and 1 (highest)
                                                    utterance.lang = lang; // Set the language

                                                    // Speak the utterance
                                                    debugger
                                                    window.speechSynthesis.speak(utterance);
                                                } else {
                                                    console.log('Sorry, your browser does not support the Web Speech API.');
                                                }
                                            }

                                            // Example usage
                                            makeAnnouncement(`कृपया ध्यान दें। वाहन नंबर ${oVehicleNumber} को स्लॉट नंबर ${oslotNumber} द्वारा आवंटित किया गया है।`, 'hi-IN');
                                            // makeAnnouncement(`దయచేసి వినండి. వాహనం నంబర్ ${oVehicleNumber} కు స్లాట్ నంబర్ ${sSlotNumber} కేటాయించబడింది.`, 'te-IN');

                                            // Lorry Animation
                                            var oImage = oThis.byId("movingImage");
                                            oImage.setVisible(true);
                                            oImage.addStyleClass("animate");
                                            setTimeout(function () {
                                                oImage.setVisible(false);
                                            }, 7000);


                                            // open receipt    
                                            // test
                                            if (!oThis.ReceiptDailog) {
                                                oThis.ReceiptDailog = await oThis.loadFragment("Receipt")
                                            }
                                            oThis.ReceiptDailog.open();
                                            // barcode generations with value
                                            var obj = oslotNumber
                                            oThis._generateBarcode(obj)
                                            oThis.byId("textprint1").setText(oVehicleNumber)
                                            oThis.byId("textprint5").setText(oslotNumber)
                                            oThis.byId("textprint2").setText(oDriverName)
                                            oThis.byId("textprint3").setText(oDriverMobile)
                                            oThis.byId("textprint4").setText(odeliveryType)
                                            oThis.byId("dfvtextprint1").setText(`Date: ${year}-${month}-${day} \nTIME: ${hours}:${minutes}:${seconds}`)


                                            oModel.remove(`/ZPARKING_RESERVE_SSet('${sUuid}')`, {
                                                success: function (oData, resp) {

                                                    MessageToast.show("allotment successful")
                                                    oThis.getView().byId("_IDGen__dfgdInput1").setValue("");
                                                    oThis.getView().byId("_IDGexgrsdfgnIn__put2").setValue("");
                                                    oThis.getView().byId("afidasgredhmeI__nput").setValue("");
                                                    oThis.getView().byId("_dhmeI__nput").setValue("");
                                                    oThis.getView().byId("idss__n0075put").setValue("");
                                                    oThis.ConfirmAssignDialog.close()


                                                },
                                                error: function () {
                                                    MessageBox.show("Assigned successfully but failed to remove from reservations")
                                                },
                                            })
                                        },
                                        error: async function (err) {
                                            MessageBox.show("Error while assigning the slot")
                                        }
                                    })


                                } else {
                                    MessageBox.information("Vehicle already there in the yard")
                                }
                            },
                            error: function (oData, resp) {
                            }
                        })

                    } else {
                        MessageBox.information("You can assign current date reservations only");
                    }

                }

            },
            onRefresh: function () {
                this.getView().getModel("ModelV2").refresh(true)
            },
            onRejectPress: async function () {
                const oSelected = this.getView().byId("idReservationsTable").getSelectedItem()

                if (oSelected) {
                    if (!this.confirmRejectDialog) {
                        this.confirmRejectDialog = await this.loadFragment("RejectConfirmation")
                    }
                    this.confirmRejectDialog.open()

                } else {
                    MessageBox.information("Select one record to continue")
                }

            },
            onRejectCloseConfirmDialog: function () {

                if (this.confirmRejectDialog.isOpen()) {
                    this.confirmRejectDialog.close()
                }
            },
            onRejectReservePress: function () {
                debugger
                const oThis = this
                const oModel = this.getView().getModel("ModelV2")
                const oSelected = this.getView().byId("idReservationsTable").getSelectedItem(),
                    sUUId = oSelected.getBindingContext().getObject().Uuid,
                    sDriverName = oSelected.getBindingContext().getObject().Drivername,
                    sDriverMobile = oSelected.getBindingContext().getObject().Drivermobile;

                oModel.remove(`/ZPARKING_RESERVE_SSet('${sUUId}')`, {
                    success: function () {

                        MessageBox.information("Rejected and SMS will be sent")
                        // Unassign SMS

                        const accountSid = Config.twilio.accountSid;
                        const authToken = Config.twilio.authToken;

                        // debugger
                        const toNumber = `+91${sDriverMobile}`
                        const fromNumber = '+15856485867';
                        const messageBody = `Hi ${sDriverName} We regret to inform you that\nCurrently we can not proceed with your reservation.\nThank you,\nVishal Parking Management`; // Message content

                        // Twilio API endpoint for sending messages
                        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;


                        // Send POST request to Twilio API using jQuery.ajax
                        $.ajax({
                            url: url,
                            type: 'POST',
                            headers: {
                                'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken)
                            },
                            data: {
                                To: toNumber,
                                From: fromNumber,
                                Body: messageBody
                            },
                            success: function (data) {
                                sap.m.MessageToast.show('SMS sent successfully!');
                            },
                            error: function (error) {
                                sap.m.MessageToast.show('Failed to send SMS: ' + error);
                            }
                        });
                        // SMS END

                        oThis.confirmRejectDialog.close()

                    },
                    error: function () {
                        MessageToast.show("Failed to reject")

                    }
                })
            },
            oncloseDataonDataAnalysis: function () {
                if (this.oDataDialog.isOpen()) {
                    this.oDataDialog.close()
                }

            },

            onDataAnalysisPress: async function () {
                if (!this.oDataDialog) {
                    this.oDataDialog = await this.loadFragment("DataAnalytic")
                }
                this.oDataDialog.open()
                var oModel = this.getOwnerComponent().getModel("ModelV2");
                var oThis = this;
                oModel.refresh()
                this._setHistoryModel();

                var oModel = this.getView().getModel("ModelV2");
                oModel.read("/ZPARKING_SLOTS_SSet", {
                    success: function (oData) {
                        var aItems = oData.results; // Assuming the data is returned in a `results` array
                        var availableCount = aItems.filter((item) => item.Status === "AVAILABLE").length;
                        var occupiedCount = aItems.filter((item) => item.Status === "NOT AVAILABLE").length;
                        var reservedCount = aItems.filter((item) => item.Status === "RESERVED").length;

                        var aChartData = {
                            Items: [
                                {
                                    Status: `Available-${availableCount}`,
                                    Count: availableCount,
                                },
                                {
                                    Status: `Not Available-${occupiedCount}`,
                                    Count: occupiedCount,

                                },
                                {
                                    Status: `Reserved-${reservedCount}`,
                                    Count: reservedCount,

                                }
                            ]
                        };

                        var oParkingLotModel = new JSONModel();
                        oParkingLotModel.setData(aChartData);
                        oThis.getView().setModel(oParkingLotModel, "ParkingLotModel");
                    },
                    error: function (oError) {
                        // Handle error here
                        console.error("Error while reading data:", oError);
                    }
                });
            },
            _setHistoryModel: function () {
                debugger
                var oModel = this.getOwnerComponent().getModel("ModelV2");
                var that = this;


                var oModel = this.getView().getModel("ModelV2");
                oModel.read("/ZPARKING_HISTORYSet", {
                    success: function (oData) {
                        var aItems = oData.results; // Assuming the data is returned in a `results` array

                        // Process the data
                        var oProcessedData = that._processHistoryData(aItems);

                        // Set the processed data to a JSON model and set it to the view
                        var oHistoryModel = new sap.ui.model.json.JSONModel();
                        oHistoryModel.setData(oProcessedData);
                        that.getView().setModel(oHistoryModel, "HistoryModel");
                    },
                    error: function (oError) {
                        // Handle error here
                        console.error("Error while reading data:", oError);
                    }
                });

            },

            _processHistoryData: function (aItems) {
                var oData = {};

                aItems.forEach(function (item) {
                    var dateTimeParts = item.Checkintime.split(" TIME "); // Split the string to separate date and time
                    var date = new Date(dateTimeParts[0]);

                    // Extract date part in local time
                    var year = date.getFullYear();
                    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
                    var day = date.getDate().toString().padStart(2, '0');
                    var formattedDate = `${year}-${month}-${day}`;

                    if (!oData[formattedDate]) {
                        oData[formattedDate] = {
                            date: formattedDate,
                            inwardCount: 0,
                            outwardCount: 0,
                            totalEntries: 0
                        };
                    }

                    if (item.Deliverytype === "INBOUND") {
                        oData[formattedDate].inwardCount += 1;
                    } else if (item.Deliverytype === "OUTBOUND") {
                        oData[formattedDate].outwardCount += 1;
                    }

                    oData[formattedDate].totalEntries = oData[formattedDate].inwardCount + oData[formattedDate].outwardCount;
                });

                return {
                    Items: Object.values(oData)
                };
            },

            _generateBarcode: function (barcodeValue) {
                // Get the HTML control where the barcode will be rendered
                var oHtmlControl = this.byId("barcodeContainer");

                if (oHtmlControl) {
                    // Set the HTML content to an SVG element
                    oHtmlControl.setContent('<svg id="barcode" ></svg>');

                    // Ensure the content is fully rendered before using JsBarcode
                    setTimeout(function () {
                        // Generate the barcode using JsBarcode
                        JsBarcode("#barcode", barcodeValue, {
                            // format: "EAN:", // Barcode format
                            // lineColor: "#0aa", // Line color
                            // width: 20, // Width of each bar
                            // height: 100, // Height of the barcode
                            displayValue: false // Hide the value
                        });
                    }, 0); // Delay to ensure the SVG element is rendered
                } else {
                    console.error("HTML control not found or not initialized.");
                }
            },
            onPrint: function () {
                var oView = this.getView();
                var oElement = oView.byId("idSimpleForm");

                var oDomRef = oElement.getDomRef();

                // Check if domtoimage is available
                if (typeof domtoimage === 'undefined') {
                    console.error('domtoimage library is not loaded.');
                    return;
                }

                // Convert the element to PNG image
                domtoimage.toPng(oDomRef).then(function (dataUrl) {
                    // Create a new PDF document
                    var doc = new jsPDF({
                        orientation: 'landscape',
                    });

                    // Add image to the PDF
                    doc.addImage(dataUrl, 'JPEG', 25, 25, 250, 150);

                    // Save the PDF to a Blob
                    var pdfBlob = doc.output('blob');

                    // Create an URL for the Blob
                    var pdfUrl = URL.createObjectURL(pdfBlob);

                    // Open the PDF in a new window for printing
                    var printWindow = window.open(pdfUrl, '_blank');

                    // Ensure the new window is loaded before calling print
                    printWindow.onload = function () {
                        printWindow.print();
                    };
                })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });
                // var oVBox = this.byId("idSimpleForm");
                // if (!oVBox) {
                //     console.error("VBox with ID 'idSimpleForm' not found.");
                //     return;
                // }

                // // Get the HTML content of the VBox
                // var sHtml = oVBox.getDomRef().innerHTML;

                // // Create a new window for print
                // var oPrintWindow = window.open('', '', 'height=600,width=800');
                // oPrintWindow.document.open();
                // oPrintWindow.document.write(`
                //     <html>
                //     <head>
                //         <title>Print</title>
                //         <style>
                //             body { font-family: Arial, sans-serif; }
                //             .print-container { width: 100%; margin: 0 auto; }
                //             /* Add any additional print styles here */
                //         </style>
                //     </head>
                //     <body>
                //         <div class="print-container">
                //             ${sHtml}
                //         </div>
                //     </body>
                //     </html>
                // `);
                // oPrintWindow.document.close();
                // oPrintWindow.focus();
                // oPrintWindow.print();

            },

            onScanPress: function (oEvent) {
                debugger
                const oThis = this;
                var currentDate = new Date();
                var year = currentDate.getFullYear();
                var month = currentDate.getMonth() + 1; // Months are zero-based
                var day = currentDate.getDate();
                var hours = currentDate.getHours();
                var minutes = currentDate.getMinutes();
                var seconds = currentDate.getSeconds();
                var FinalDate = `${year}-${month}-${day} TIME ${hours}:${minutes}:${seconds}`
                var oCheckOutTime = FinalDate
                const oModel = this.getView().getModel("ModelV2")
                BarcodeScanner.scan(
                    function (mResult) {
                        if (mResult && mResult.text) {
                            var scannedText = mResult.text;


                            // new snippet
                            debugger
                            const ofilter = new Filter("Slotnumbers", FilterOperator.EQ, scannedText)

                            oModel.read("/ZPARKING_SLOTS_SSet", {
                                filters: [ofilter],
                                success: function (oData) {
                                    if (oData.results.length > 0 && oData.results[0].Assignedvehiclenumber !== "") {

                                        // UUID generation
                                        function generateUUID() {
                                            // Generate random values and place them in the UUID format
                                            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                                return v.toString(16);
                                            });
                                        }
                                        const NewUuid = generateUUID();


                                        const oNewHistoryPayload = {
                                            Uuid: NewUuid,
                                            Drivername: oData.results[0].Assigneddrivername,
                                            Drivermobile: oData.results[0].Assigneddrivermobile,
                                            Vehiclenumber: oData.results[0].Assignedvehiclenumber,
                                            Deliverytype: oData.results[0].Assigneddeliverytype,
                                            Checkintime: oData.results[0].Assignedcheckintime,
                                            Historyslotnumber: oData.results[0].Slotnumbers,
                                            VendorName: oData.results[0].VendorName,
                                            Checkouttime: oCheckOutTime
                                        }

                                        const oUpdatedSlotPayload = {
                                            Status: "AVAILABLE",
                                            Assigneddrivername: "",
                                            Assigneddrivermobile: "",
                                            Assignedvehiclenumber: "",
                                            Assigneddeliverytype: "",
                                            VendorName: "",
                                            Assignedcheckintime: ""
                                        }
                                        // if (oData.results[0].Vehiclenumber !== "") {
                                        oModel.update(`/ZPARKING_SLOTS_SSet('${scannedText}')`, oUpdatedSlotPayload, {
                                            success: async function (oData, oResponse) {

                                                // vehicle out
                                                var oImage = oThis.byId("movingImage2");
                                                oImage.setVisible(true);
                                                oImage.addStyleClass("animate");
                                                setTimeout(function () {
                                                    oImage.setVisible(false);
                                                }, 7000);

                                                // CREATE history
                                                oModel.create("/ZPARKING_HISTORYSet", oNewHistoryPayload, {
                                                    success: function (oData, oResponse) {

                                                    },
                                                    error: function (error) {
                                                        MessageToast.show("Error" + error.message)
                                                    }
                                                })

                                                oThis.getView().byId("idHistoryTable").getBinding("items").refresh();
                                                MessageToast.show("Vechicle Unassigned Successfully");


                                            },
                                            error: function (err) {
                                            }
                                        })
                                        // } else {
                                        //     MessageBox.information("Vehicle not found")
                                        // }

                                    } else {
                                        MessageToast.show("Vehicle not found")
                                    }
                                },
                                error: function (err) {
                                    MessageToast.show("error occured")
                                }
                            })

                        } else {
                            MessageBox.information("Something went wrong try again after some time")
                        }
                    }.bind(this), // Bind 'this' context to access the view
                    function (oError) {
                        MessageBox.error("Barcode scanning failed: " + oError);
                    }
                );
            },


            // onPhotoClick: function () {
            //     debugger
            //     var oView = this.getView();
            //     var oCanvas = oView.byId("photoCanvas");
            //     var oImage = oView.byId("photoImage");

            //     // Create and configure video element
            //     var video = document.createElement('video');
            //     video.style.width = '100%';  // Set video width to fit container
            //     video.style.height = '100%'; // Set video height to fit container
            //     video.autoplay = true; // Ensure video plays automatically
            //     video.playsInline = true; // Ensure video plays inline on mobile devices

            //     // Add video element to the view
            //     var videoContainer = document.getElementById('videoContainer');
            //     videoContainer.appendChild(video);

            //     navigator.mediaDevices.getUserMedia({ video: true })
            //         .then(function (stream) {
            //             video.srcObject = stream;

            //             // Create a button to capture the photo
            //             var captureButton = document.createElement('button');
            //             captureButton.textContent = "Capture";
            //             document.body.appendChild(captureButton);

            //             captureButton.addEventListener('click', function () {
            //                 var context = oCanvas.getDomRef().getContext('2d');
            //                 context.drawImage(video, 0, 0, oCanvas.getWidth(), oCanvas.getHeight());

            //                 // Convert canvas image to base64
            //                 var dataUrl = oCanvas.getDomRef().toDataURL('image/jpeg');
            //                 oImage.setSrc(dataUrl); // Set the captured image to UI5 Image control
            //                 oImage.setVisible(true);

            //                 // Convert base64 to Blob
            //                 fetch(dataUrl)
            //                     .then(res => res.blob())
            //                     .then(blob => {
            //                         var formData = new FormData();
            //                         formData.append('image', blob, 'photo.jpg');

            //                         // Upload to your API
            //                         $.ajax({
            //                             method: 'POST',
            //                             url: 'https://api.api-ninjas.com/v1/imagetotext',
            //                             data: formData,
            //                             enctype: 'multipart/form-data',
            //                             processData: false,
            //                             contentType: false,
            //                             success: function (result) {
            //                                 console.log(result); // Handle the result
            //                             },
            //                             error: function ajaxError(jqXHR, textStatus, errorThrown) {
            //                                 alert(jqXHR.responseText);
            //                             }
            //                         });
            //                     })
            //                     .catch(error => {
            //                         console.error('Error converting to Blob:', error);
            //                     })
            //                     .finally(() => {
            //                         // Clean up: stop the video stream and remove elements
            //                         var stream = video.srcObject;
            //                         if (stream) {
            //                             var tracks = stream.getTracks();
            //                             tracks.forEach(track => track.stop());
            //                         }
            //                         videoContainer.removeChild(video);
            //                         document.body.removeChild(captureButton);
            //                     });
            //             });
            //         })
            //         .catch(function (err) {
            //             console.error("Error accessing the camera:", err);
            //         });

            // }


            // search
            onSearchHistory: async function (oEvent) {
                debugger;
                var sQuery = oEvent.getParameter("newValue").trim();
                var oList = this.byId("idHistoryTable"); // Assuming this is your table ID
                var oBinding = oList.getBinding("items");

                // Check if the binding is available
                if (!oBinding) {
                    console.error("Binding not found on the list");
                    return;
                }

                // If no search query, fetch all data and reset the table
                if (sQuery === "") {
                    try {
                        var oModel = this.getView().getModel("ModelV2"); // Assuming the model is bound to the view
                        var sPath = "/ZPARKING_HISTORYSet"; // Your EntitySet path

                        // Fetch the data from the OData service
                        var aAllData = await new Promise((resolve, reject) => {
                            oModel.read(sPath, {
                                success: function (oData) {
                                    resolve(oData.results);
                                },
                                error: function (oError) {
                                    console.error("Failed to fetch all data:", oError);
                                    reject(oError);
                                }
                            });
                        });

                        // Create a new JSON model with all the data
                        var oAllDataModel = new sap.ui.model.json.JSONModel(aAllData);

                        // Bind the all data model to the table
                        oList.setModel(oAllDataModel);
                        oList.bindItems({
                            path: "/",
                            template: oList.getBindingInfo("items").template
                        });
                    } catch (error) {
                        console.error("Error fetching all data:", error);
                    }
                    return;
                }

                // If there is a search query, perform the manual filtering
                var aContexts = oBinding.getContexts();
                var aItems = aContexts.map(function (oContext) {
                    return oContext.getObject();
                });

                // Filter the data based on the query
                var aFilteredItems = aItems.filter(function (oItem) {
                    return (oItem.Drivername && oItem.Drivername.includes(sQuery)) ||
                        (oItem.Drivermobile && oItem.Drivermobile.includes(sQuery)) ||
                        (oItem.Deliverytype && oItem.Deliverytype.includes(sQuery)) ||
                        (oItem.VendorName && oItem.VendorName.includes(sQuery)) ||
                        (oItem.Vehiclenumber && oItem.Vehiclenumber.includes(sQuery)) ||
                        (oItem.Historyslotnumber && oItem.Historyslotnumber.includes(sQuery)) ||
                        (oItem.Checkintime && oItem.Checkintime.includes(sQuery)) ||
                        (oItem.Checkouttime && oItem.Checkouttime.includes(sQuery))
                });

                // Create a new JSON model with the filtered data
                var oFilteredModel = new sap.ui.model.json.JSONModel(aFilteredItems);

                // Bind the filtered model to the table
                oList.setModel(oFilteredModel);
                oList.bindItems({
                    path: "/",
                    template: oList.getBindingInfo("items").template
                });
            },
            onSearch: async function (oEvent) {
                debugger;
                var sQuery = oEvent.getParameter("newValue").trim();
                var oList = this.byId("idAssignedTable"); // Assuming this is your table ID
                var oBinding = oList.getBinding("items");

                // Check if the binding is available
                if (!oBinding) {
                    console.error("Binding not found on the list");
                    return;
                }

                // If no search query, fetch all data and reset the table
                if (sQuery === "") {
                    try {
                        var oModel = this.getView().getModel("ModelV2"); // Assuming the model is bound to the view
                        var sPath = "/ZPARKING_SLOTS_SSet"; // Your EntitySet path

                        // Fetch the data from the OData service
                        // const ofilter = new Filter("Status", FilterOperator.EQ, "NOT AVAILABLE")

                        var aAllData = await new Promise((resolve, reject) => {
                            oModel.read(sPath, {
                                filters: [new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "NOT AVAILABLE")],
                                success: function (oData) {

                                    resolve(oData.results);
                                },
                                error: function (oError) {
                                    console.error("Failed to fetch all data:", oError);
                                    reject(oError);
                                }
                            });
                        });

                        // Create a new JSON model with all the data
                        var oAllDataModel = new sap.ui.model.json.JSONModel(aAllData);

                        // Bind the all data model to the table
                        oList.setModel(oAllDataModel);
                        oList.bindItems({
                            path: "/",
                            template: oList.getBindingInfo("items").template
                        });
                    } catch (error) {
                        console.error("Error fetching all data:", error);
                    }
                    return;
                }

                // If there is a search query, perform the manual filtering
                var aContexts = oBinding.getContexts();
                var aItems = aContexts.map(function (oContext) {
                    return oContext.getObject();
                });

                // Filter the data based on the query
                var aFilteredItems = aItems.filter(function (oItem) {

                    if (oItem.Assignedvehiclenumber !== "") {
                        return oItem.Slotnumbers.includes(sQuery) ||
                            oItem.Assigneddrivername.includes(sQuery) ||
                            oItem.Assigneddrivermobile.includes(sQuery) ||
                            oItem.Assigneddeliverytype.includes(sQuery) ||
                            oItem.VendorName.includes(sQuery) ||
                            oItem.Assignedvehiclenumber.includes(sQuery)
                    }
                });

                // Create a new JSON model with the filtered data
                var oFilteredModel = new sap.ui.model.json.JSONModel(aFilteredItems);

                // Bind the filtered model to the table
                oList.setModel(oFilteredModel);
                oList.bindItems({
                    path: "/",
                    template: oList.getBindingInfo("items").template
                });
            },
            onSortChange: function (oEvent) {
                var sSelectedKey = oEvent.getParameter("selectedItem").getKey();

                var oTable = this.byId("idAllSlots");
                var oBinding = oTable.getBinding("items");

                var aFilters = [];
                if (sSelectedKey === "AVAILABLE" || sSelectedKey === "NOT AVAILABLE" || sSelectedKey === "RESERVED") {
                    aFilters.push(new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, sSelectedKey));
                }
                oBinding.filter(aFilters);
            }


        })
    });




// last push