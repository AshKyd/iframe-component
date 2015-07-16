(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else {
        // Browser globals
        root.iframeComponent = factory();
    }
}(this, function () {
	var defaults = {
		frameborder:0, // Solely for IE8.
		allowTransparency: true,
		style: "background:transparent;margin:0;width:100%;",
		src: "about:blank"
	};

	function loadStyles(styles, head, contentDocument, cb){
		var stylesToLoad = styles.length;
		var stylesLoaded = 0;

		function onload(){
			stylesLoaded++;
			if(stylesLoaded === stylesToLoad){
				cb();
			}
		}
		styles.forEach(function(url){
			var style = contentDocument.createElement('link');
			style.onload = onload;
			style.setAttribute('rel', 'stylesheet');
			style.setAttribute('type', 'text/css');
			style.setAttribute('href', url);
			head.appendChild(style);
		});
	}

	function watchFrame(iframe){
		var body = iframe.contentDocument.querySelector('body');
		var height = body.height;

		// This is what happens when we resize.
		function resize(){
			iframe.height = body.offsetHeight;
			height = body.offsetHeight;
		}

		// If we support the mutation observer, go for it.
		// This should immediately trigger the change.
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		if(MutationObserver){
			var observer = new MutationObserver(resize);

			observer.observe(iframe.contentDocument, {
			  subtree: true,
			  attributes: true,
			  characterData: true,
			  childList: true
			});
		}

		// Attach to window resize for events.
		if(window.addEventListener){
			addEventListener('resize', resize);
		} else {
			attachEvent('onresie', resize);
		}

		// Check the height at an interval, failsafe/fallback for old browsers.
		setInterval(function(){
			if(body.offsetHeight !== height){
				resize();
			}
		}, 1000);

		resize();
	}

	function iframeFactory(){
		var opts, cb;
		if(arguments[1]){
			opts = arguments[0];
			cb = arguments[1];
		} else {
			opts = {};
			cb = arguments[0];
		}
		var iframe = document.createElement('iframe');
		iframe.addEventListener('load', function(){
			// Check we can access the iframe, and get the head element.
			var head;
			try{
				head = iframe.contentDocument.querySelector('head');
			} catch(exception){
				// Call back with an error if this doesn't work.
				return cb(exception);
			}

			// If we need to watch this frame for changes, set that up.
			if(opts.watch !== false){
				watchFrame(iframe);
			}

			// If we want to load some stylesheets, do this now.
			if(opts.styles){
				loadStyles(opts.styles, head, contentDocument, function(){
					cb(null, iframe);
				});
			} else {
				// Call back with the iframe.
				cb(null, iframe);
			}

		});

		Object.keys(defaults).forEach(function(property){
			iframe.setAttribute(property, defaults[property]);
		});

		return iframe;
	}

    return iframeFactory;
}));
