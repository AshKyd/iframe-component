window.onload = function(){
	document.body.innerHTML = '';
	var iframe = iframeComponent({
		styles: [
			'stylesheet.css',
			'stylesheet2.css'
		]
	},function(err, iframe){
		try{
			iframe.contentDocument.querySelector('body').innerHTML = '<div style="background:red;color:white;font-size:2em;">Hello world!</div>';
		} catch(e) {
			console.log(e);
		}
		window.setTimeout(function(){
			iframe.contentDocument.querySelector('body').innerHTML = '<ul style="background:darkgreen;color:white;"><li>Item</li><li>Item</li><li>Item</li></ul><div style="background:pink;color:black;">Another div</div>';
		}, 2000);
	    //console.log(err, iframe);
	});
	// console.log('started iframe', iframe);
	document.body.appendChild(iframe);
};
