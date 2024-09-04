sap.ui.define([
    "./baseController",
    // "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
],
    function (Controller, Fragment, MessageToast, MessageBox, Filter, FilterOperator, JSONModel) {
        "use strict";

        return Controller.extend("com.app.vendorapp.controller.VendorView", {
            onInit: async function () {
                // const newReserveModel = new JSONModel({
                //     Uuid: "",
                //     Drivermobile: "",
                //     Vehiclenumber: "",
                //     Vendorname: "",
                //     Reservedslot: "",
                //     Drivername: "",
                //     Reserveddate: ""
                // });
                // this.getView().setModel(newReserveModel, "newReserveModel");

                if (!this.oReserve) {
                    this.oReserve = await this.loadFragment("reserveSlot")
                }
                this.oReserve.open();


            },
            onCloseDialog: function () {
                if (this.oReserve.isOpen()) {
                    this.oReserve.close()
                }

            },
            onBookPress: async function () {
                if (!this.oReserve) {
                    this.oReserve = await this.loadFragment("reserveSlot")
                }
                this.oReserve.open()
            },
            onBookSlotPress: function () {
                debugger
                const oModel = this.getView().getModel("ModelV2"),
                    oUserView = this.getView(),
                    oThis = this
                var sDriverName = this.getView().byId("idkdjgbrrddrivername").getValue().toUpperCase()
                var sDriverMobile = this.getView().byId("iddrivrtmobilwInput").getValue().toUpperCase()
                var sVehicle = this.getView().byId("idameInput").getValue().toUpperCase()
                // var sTypeofdelivery = this.getView().byId("idTypeOfDelivery").getSelectedKey()
                var sVendorName = this.getView().byId("idvendordadNameInput").getValue().toUpperCase()

                // UUID generation
                function generateUUID() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }

                const NewUuid = generateUUID();
                const newReservePayload = {
                    Uuid: NewUuid,
                    Drivername: sDriverName,
                    Drivermobile: sDriverMobile,
                    Vehiclenumber: sVehicle,
                    Vendorname: sVendorName
                }

                // V4 CALL start

                const defaultModel = this.getView().getModel(),
                bind = defaultModel.bindList("/ZPARKING_RESERVE_SSet")
                bind.create(newReservePayload).created().then(
                    function () {
                        // Success callback
                        MessageToast.show("Entry created successfully!");
                    }
                ).catch(function (oError) {
                    // Error callback
                    MessageBox.error("Failed to create entry: " + oError.message);
                });

                // V4 CALL end


                // V2 call start

                // oModel.create("/ZPARKING_RESERVE_SSet", newReservePayload, {
                //     success: function (oData, oResponse) {
                //         MessageBox.success("Reservation Sent.Slot allotment will be sent to your mobile number")
                //     },
                //     error: function (error) {
                //         MessageToast.show("Error" + error.message)
                //     }
                // })

                // V2 call end

                // var bValid = true;
                // if (!sDriverName || sDriverName.length < 3) {
                //     oUserView.byId("idkdjgbrrddrivername").setValueState("Error");
                //     oUserView.byId("idkdjgbrrddrivername").setValueStateText("Name Must Contain 3 Characters");
                //     bValid = false;
                // } else {
                //     oUserView.byId("idkdjgbrrddrivername").setValueState("None");
                // }
                // if (!sDriverMobile || sDriverMobile.length !== 10 || !/^[6-9]\d{9}$/.test(sDriverMobile)) {
                //     oUserView.byId("iddrivrtmobilwInput").setValueState("Error");
                //     oUserView.byId("iddrivrtmobilwInput").setValueStateText("Mobile number must be a 10-digit numeric value");

                //     bValid = false;
                // } else {
                //     oUserView.byId("iddrivrtmobilwInput").setValueState("None");
                // }
                // if (!sVehicle || !/^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/.test(sVehicle)) {
                //     oUserView.byId("idameInput").setValueState("Error");
                //     oUserView.byId("idameInput").setValueStateText("Vehicle number should follow this pattern AP12BG1234");

                //     bValid = false;
                // } else {
                //     oUserView.byId("idameInput").setValueState("None");
                // }
                // if (!sVendorName || sVendorName.length < 3) {
                //     oUserView.byId("idvendordadNameInput").setValueState("Error");
                //     oUserView.byId("idvendordadNameInput").setValueStateText("Vendor Name Must Contain 3 Characters");
                //     bValid = false;
                // } else {
                //     oUserView.byId("idvendordadNameInput").setValueState("None");
                // }
                // if (!bValid) {
                //     MessageToast.show("Please enter correct data");
                //     return;

                // }
                

                // var ofilter = new Filter("Vehiclenumber", FilterOperator.EQ, sVehicle)
                // oModel.read("/ZPARKING_RESERVE_SSet", {
                //     filters: [ofilter],
                //     success: function (oData) {
                //         if (oData.results.length > 0) {
                //             MessageBox.warning("You can not reserve.vehicle number " + sVehicle + " already reserved")
                //         } else {
                //             oModel.create("/ZPARKING_RESERVE_SSet", newReservePayload, {
                //                 success: function (oData, oResponse) {
                //                     // MessageToast.show("Created")
                //                     oThis.getView().byId("idkdjgbrrddrivername").setValue("")
                //                     oThis.getView().byId("iddrivrtmobilwInput").setValue("")
                //                     oThis.getView().byId("idameInput").setValue("")
                //                     oThis.getView().byId("idvendordadNameInput").setValue("")
                //                     MessageBox.success("Reservation Sent.Slot allotment will be sent to your mobile number")
                //                 },
                //                 error: function (error) {
                //                     MessageToast.show("Error" + error.message)
                //                 }
                //             })
                //         }
                //     },
                //     error: function (er) {
                //         console.log("error in reading ", er.message);
                //     }
                // })
            }
        });
    });