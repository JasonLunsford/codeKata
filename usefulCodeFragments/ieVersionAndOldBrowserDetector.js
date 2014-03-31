   var featureDetector = {
           legal: function() {
               // only useful if Modernizr is loaded...
            return Modernizr.canvas;
           },
           ieDetect: function() {
               var html  = document.documentElement,
                style = html.style,
                ver   = 0;
                
            // detect if IE is being used, and what version, based on features
            // IE8-10 browser and document modes incorrect detect IE7 as IE8
            // Pure IE7 works as intended. IE6 cannot be targeted.
            if ('-ms-scroll-limit' in style || 'behavior' in style) {
                if ('-ms-ime-align' in style) { ver = 11; }
                else if ('-ms-user-select' in style) { ver = 10; }
                else if ('fill' in style) { ver = 9; }
                else if ('widows' in style) { ver = 8; }
                else { ver = 7; }
            }

            return ver;
           }
    };