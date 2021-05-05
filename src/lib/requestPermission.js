// menampilkan kotak dialog untuk mengaktifkan permission
module.exports = function() {
    try {
      var permissions = cordova.plugins.permissions;
      console.log("permission", permissions);
  
      var list = [
        permissions.CAMERA,
        permissions.RECORD_AUDIO,
        permissions.RECORD_VIDEO,
        // permissions.MODIFY_AUDIO_SETTINGS
      ];
      permissions.checkPermission(list, success, null);
  
      function error() {
        console.warn("Permission is not turned on");
      }
  
      function success(status) {
        console.log("status", status);
        if (!status.hasPermission) {
          permissions.requestPermissions(
            list,
            function(status) {
              if (!status.hasPermission) error();
            },
            error
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  