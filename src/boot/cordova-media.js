document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    // new Media
    console.log(Media);
    // console.log(navigator.device.capture);
    console.log(navigator.device.audiorecorder)
    console.log(cordova.file);
}