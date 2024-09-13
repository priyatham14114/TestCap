sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"

], function (Controller, Fragment) {
    'use strict';

    return Controller.extend("com.app.vendorapp.controller.baseController", {
        
        loadFragment: async function (sFragmentName) {
            const oFragment = await Fragment.load({
                id: this.getView().getId(),
                name: `com.app.vendorapp.fragments.${sFragmentName}`,
                controller: this
            });
            this.getView().addDependent(oFragment);
            return oFragment
        }

    })

});