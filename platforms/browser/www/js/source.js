var APP = {
    Server: {
        local: 'https://dulichq6.hcmgis.vn',
        // dulich: 'https://dulichq6.hcmgis.vn'
	},
	ListApplication: {
        'Android': 'file:///android_asset/www/',
        'Browser': '/'
	},
	HeadMeta: [
		`<meta http-equiv="Content-Security-Policy"
			content="default-src 'self' https://dulichq6.hcmgis.vn data: gap: https://ssl.gstatic.com 'unsafe-eval'; 
			script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com https://maps.googleapis.com https://nominatim.openstreetmap.org/ https://router.project-osrm.org/; 
			style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maxcdn.bootstrapcdn.com s7.addthis.com; 
			img-src * 'self' data: content:; 
			font-src 'self' https://fonts.gstatic.com https://unpkg.com https://nominatim.openstreetmap.org/ https://router.project-osrm.org/";>`,
		`<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">`,
		`<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800%7CShadows+Into+Light" rel="stylesheet" type="text/css">`,
	],
    HeadStyle: [
		`css/porto/vendor/bootstrap/css/bootstrap.min.css`,
		`css/porto/vendor/font-awesome/css/font-awesome.min.css`,
		`css/porto/vendor/animate/animate.min.css`,
		`css/porto/vendor/simple-line-icons/css/simple-line-icons.min.css`,
		`css/porto/vendor/owl.carousel/assets/owl.carousel.min.css`,
		`css/porto/vendor/owl.carousel/assets/owl.theme.default.min.css`,
		`css/porto/vendor/magnific-popup/magnific-popup.min.css`,
		`css/porto/theme.css`,
		`css/porto/vendor/rs-plugin/css/layers.css`,
		`css/porto/vendor/rs-plugin/css/navigation.css`,
		`css/porto/vendor/circle-flip-slideshow/css/component.css`,
		`css/porto/skins/default.css`,
		`css/porto/custom.css`,
		`css/dulich.css`,
    ],
    Script: [
		`js/vue/vue.js`,
		`js/porto/vendor/jquery.appear/jquery.appear.min.js`,
		`js/porto/vendor/jquery.easing/jquery.easing.min.js`,
		`js/porto/vendor/jquery-cookie/jquery-cookie.min.js`,
		`js/porto/vendor/popper/umd/popper.min.js`,
		`js/porto/vendor/bootstrap/js/bootstrap.min.js`,
		`js/porto/vendor/common/common.min.js`,
		`js/porto/vendor/jquery.validation/jquery.validation.min.js`,
		`js/porto/vendor/jquery.easy-pie-chart/jquery.easy-pie-chart.min.js`,
		`js/porto/vendor/jquery.gmap/jquery.gmap.min.js`,
		`js/porto/vendor/jquery.lazyload/jquery.lazyload.min.js`,
		`js/porto/vendor/isotope/jquery.isotope.min.js`,
		`js/porto/vendor/owl.carousel/owl.carousel.min.js`,
		`js/porto/vendor/magnific-popup/jquery.magnific-popup.min.js`,
		`js/porto/vendor/vide/vide.min.js`,
		`js/porto/theme.js`,
		`js/porto/vendor/rs-plugin/js/jquery.themepunch.tools.min.js`,
		`js/porto/vendor/rs-plugin/js/jquery.themepunch.revolution.min.js`,
		`js/porto/vendor/circle-flip-slideshow/js/jquery.flipshow.min.js`,
		`js/porto/views/view.home.js`,
		`js/porto/custom.js`,
		`js/porto/theme.init.js`,
		`js/porto/examples/examples.demos.js`,
        `js/porto/examples/examples.portfolio.js`,
	],
	Pages: {
		home: 'index.html',
		listDiemden: 'diemden/list_diemden.html',
		detailDiemden: 'diemden/detail_diemden.html'
    },
    VueInstance: {},
    VueComponent: {},
    storage: window.localStorage,
    applicationDirectory: '/'
}



function InitHeadAndScriptDefault() {

	var applicationDirectory = APP.storage.getItem('applicationDirectory');

    APP.HeadMeta.forEach(function (headmeta) {
        $('head').append(headmeta);
    });
    APP.HeadStyle.forEach(function(headstyle) {
        $('head').append('<link rel="stylesheet" href="' + applicationDirectory + headstyle + '">')
    });
    APP.Script.forEach(function (script) {
        $('body').append('<script type="text/javascript" src="' + applicationDirectory + script + '"></script>')
    });
    $('body').append('<script type="text/javascript" src="' + applicationDirectory + 'cordova.js"></script>');
}

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam){
            return sParameterName[1];
        }
    }
}

function redirectTo(url) {
    var applicationDirectory = APP.storage.getItem('applicationDirectory');
    window.location.replace(applicationDirectory + url);
}

function sleep(time) {
	var time1 = new Date().getTime();
	var time2 = new Date().getTime();
	while (time2 < time1 + time ) {
		time2 = new Date().getTime();
	}
	return;
}