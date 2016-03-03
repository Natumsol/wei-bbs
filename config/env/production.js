module.exports = {
	// production configuration options
	sessionSecret:"productionSessionSecret",
	db:"mongodb://http:localhost/wei-bbs",
	statics: "./statics",
	staticsOptions:{
		dotfiles: 'ignore',
		etag: false,
		extensions: ['htm', 'html'],
		index: false,
		maxAge: '1d',
		redirect: false,
		setHeaders: function (res, path, stat) {
			res.set('x-timestamp', Date.now());
		}
	}
};