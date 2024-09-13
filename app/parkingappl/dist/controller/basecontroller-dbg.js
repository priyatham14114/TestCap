sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"

], function (Controller, Fragment) {
    'use strict';

    return Controller.extend("com.app.parkingappl.controller.basecontroller", {
        
        loadFragment: async function (sFragmentName) {
            const oFragment = await Fragment.load({
                id: this.getView().getId(),
                name: `com.app.parkingappl.fragments.${sFragmentName}`,
                controller: this
            });
            this.getView().addDependent(oFragment);
            return oFragment
        }

    })

});