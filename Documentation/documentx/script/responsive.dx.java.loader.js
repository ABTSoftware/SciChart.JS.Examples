yepnope.insertBeforeElement = document.getElementById('responsive-marker');
switch (getDeviceType()) {
    case "MOBILE":
        Modernizr.load([{
                        load: ['stylesheets/bootstrap.css',
                                'stylesheets/mobile.dx.java.2012.css',
                                'script/responsive.common.min.js',
                                'script/mobile.dx.java.2012.js'],
                        complete: function () {
                            onResponsiveFilesLoaded()
                        }
                        }]);
        break;
    case "TABLET":
        Modernizr.load([{
                        load: ['stylesheets/bootstrap.css',
                                'stylesheets/tablet.dx.java.2012.css',
                                'script/responsive.common.min.js',
                                'script/tablet.dx.java.2012.js'],
                        complete: function () {
                            onResponsiveFilesLoaded()
                        }
                        }]);
        break;
}