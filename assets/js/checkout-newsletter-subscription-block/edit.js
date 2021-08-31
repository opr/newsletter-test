/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Disabled } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Block from './block';

export const Edit = () => {
	const previewExtensionData = {
		setExtensionData: () => {}
	};
	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'Block options',
						'woo-gutenberg-products-block'
					) }
				>
					Options for the block go here.
				</PanelBody>
			</InspectorControls>
			<Disabled>
				<Block checkoutExtensionData={ previewExtensionData } />
			</Disabled>
		</>
	);
};

export const Save = () => {
	return <div { ...useBlockProps.save() } />;
};
