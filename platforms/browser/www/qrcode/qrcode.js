function barcodescanner() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            swal({   
                title: "Quá trình quét mã hoàn thành",   
                text: "Kết quả: " + result.text + "\n" +
                      "Định dạng: " + result.format + "\n",   
                type: "success",   
                showCancelButton: true,   
                confirmButtonColor: "#DD6B55",   
                confirmButtonText: "Truy cập liên kết: "  + result.text,   
                cancelButtonText: "Quay về", 
                closeOnConfirm: false,   
                closeOnCancel: true }, 
                function(){   
                    location.href = result.text;
            });
        },
        function (error) {
            swal({   
                title: "Quá trình quét mã không thành công",   
                type: "error",   
                showCancelButton: true,   
                confirmButtonColor: "#DD6B55",   
                cancelButtonText: "Quay về", 
                closeOnConfirm: false,   
                closeOnCancel: true 
            });
        },
        {
            preferFrontCamera : false, // iOS and Android
            showFlipCameraButton : true, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
     );
}