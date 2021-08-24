const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const WooCommerceDependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

const wcDepMap = {
	'@woocommerce/blocks-checkout': [ 'wc', 'blocksCheckout' ],
	'@woocommerce/blocks-registry': [ 'wc', 'wcBlocksRegistry' ],
	'@woocommerce/base-context/hooks': [ 'wc', 'wcBlocksBaseContextHooks' ],
	'@woocommerce/settings': [ 'wc', 'wcSettings' ],
};

const wcHandleMap = {
	'@woocommerce/blocks-checkout': 'wc-blocks-checkout',
	'@woocommerce/blocks-registry': 'wc-blocks-registry',
	'@woocommerce/base-context/hooks': 'wc-blocks-base-context-hooks',
	'@woocommerce/settings': 'wc-settings',
};

const requestToExternal = ( request ) => {
	if ( wcDepMap[ request ] ) {
		return wcDepMap[ request ];
	}
};

const requestToHandle = ( request ) => {
	if ( wcHandleMap[ request ] ) {
		return wcHandleMap[ request ];
	}
};

// Remove SASS rule from the default config so we can define our own.
const defaultRules = defaultConfig.module.rules.filter( ( rule ) => {
	return String( rule.test ) !== String( /\.(sc|sa)ss$/ );
} );

module.exports = {
	...defaultConfig,
	resolve: {
		extensions: [ '.ts', '.tsx', '.js', '.jsx' ],
	},
	module: {
		...defaultConfig.module,
		rules: [
			...defaultRules,
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
			},
			{
				test: /\.(sc|sa)ss$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: 'css-loader', options: { importLoaders: 1 } },
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								includePaths: [ 'assets/css' ],
							},
							additionalData: ( content, loaderContext ) => {
								const {
									resourcePath,
									rootContext,
								} = loaderContext;
								const relativePath = path.relative(
									rootContext,
									resourcePath
								);

								if (
									relativePath.startsWith( 'assets/css/' )
								) {
									return content;
								}

								return (
									'@import "_colors"; ' +
									'@import "_mixins"; ' +
									'@import "_sizes"; ' +
									content
								);
							},
						},
					},
				],
			},
		],
	},
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new WooCommerceDependencyExtractionWebpackPlugin( {
			requestToExternal,
			requestToHandle,
		} ),
		new MiniCssExtractPlugin( {
			filename: `[name].css`,
		} ),
	],
};
