var Agent = require('agentkeepalive');


module.exports = {
	productionSourceMap: false,
	filenameHashing: false,
	outputDir: '../scripts/app',

	chainWebpack: config => {
		// // clear the existing entry point
//config.entry('main').clear();
//config.entryPoints.delete('main');

		if(process.env.NODE_ENV !== 'development') {
//config.entry('app').clear();
//config.entryPoints.delete('app');

			//add your custom entry point

			//config.entry('admin-page').add('./src/admin-page.js');
			//config.entry('logs-page').add('./src/logs-page.js');
			//config.entry('jobs-page').add('./src/jobs-page.js');
			//config.entry('permits-page').add('./src/permits-page.js');

			//config.optimization.delete('splitChunks');
		}

		// config.plugin('optimize-css').tap(([options]) => {
		// 	options.cssnanoOptions.preset[1].zindex = false;
		// 	return [options];
		// });

	},

	configureWebpack: {
		resolve: {
			extensions: ['.js', '.vue', '.json'],
			alias: {
				'vue$': 'vue/dist/vue.esm.js',
			}
		}
	},

	devServer: {
		port: 4200,
		//proxy: 'http://localhost:63109'
		proxy: {
			'^/api': {
				target: 'http://localhost:63109',
				ws: true,
				changeOrigin: true,
				//logLevel: 'debug',
				agent: new Agent({
					maxSockets: 100,
					keepAlive: true,
					maxFreeSockets: 10,
					keepAliveMsecs:1000,
					timeout: 60000,
					//freeSocketTimeout: 30000 // free socket keepalive for 30 seconds
					freeSocketTimeout: 5000 // free socket keepalive for 5 seconds
				}),
				onProxyRes: proxyRes => {
					// console.log(proxyRes);
					var key = 'www-authenticate';
					proxyRes.headers[key] = proxyRes.headers[key] && proxyRes.headers[key].split(',');
				}
			},
			'^/signalr': {
				target: 'http://localhost:63109',
				ws: true,
				changeOrigin: true,
			},
			'^/Images': {
				target: 'http://localhost:63109',
				changeOrigin: true,
			},
			'^/Job/ShowAttachment': {
				target: 'http://localhost:63109',
				changeOrigin: true,
			}
		}
	},

	pluginOptions: {
		moment: {
			locales: ['en', 'ru']
		},
		// webpackBundleAnalyzer: {
		// 	analyzerMode: 'static'
		// },
	},
};