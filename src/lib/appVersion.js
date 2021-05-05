import { Notify } from 'quasar'
export default function({store}){
    store.dispatch('Setting/index').then(res => {
        const version = res.data.find(item => item.key == 'assigment-app.version').value
        cordova.getAppVersion.getVersionNumber(function(appVersionNumber) {
            // 1.0.0
            // console.log("version number", appVersionNumber, version);
            console.log(appVersionNumber)
            if (appVersionNumber < version) {
                Notify.create({
                    position: 'top',
                    message: 'Versi terbaru telah rilis silahkan update aplikasi melalui playstore',
                    textColor: 'white',
                    actions: [{
                        label: 'Update',
                        color: 'white',
                        handler: () => {
                            cordova.InAppBrowser.open(
                                'https://play.google.com/store/apps/details?id=org.agpaiidigital.assigment.app',
                                "_system",
                                "location=no"
                            );
                        }
                    }, ]
                });
            }
        });
    })
}