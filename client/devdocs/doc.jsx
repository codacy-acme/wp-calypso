/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';

/**
 * Internal dependencies
 */
import DocService from './service';
import CompactCard from 'components/card/compact';
import highlight from 'lib/highlight';

export default createReactClass( {
	displayName: 'SingleDocument',
	propTypes: {
		path: PropTypes.string.isRequired,
		term: PropTypes.string,
		sectionId: PropTypes.string
	},
	timeoutID: null,

	getInitialState: function() {
		return {
			body: ''
		};
	},

	componentDidMount: function() {
		this.fetch();
	},

	componentDidUpdate: function( prevProps ) {
		if ( this.props.path !== prevProps.path ) {
			this.fetch();
		}
		if ( this.state.body ) {
			this.setBodyScrollPosition();
		}
	},

	componentWillUnmount: function() {
		this.clearLoadingMessage();
	},

	fetch: function() {
		this.setState( {
			body: ''
		} );
		this.delayLoadingMessage();
		DocService.fetch( this.props.path, function( err, body ) {
			if ( this.isMounted() ) {
				this.setState( {
					body: ( err || body )
				} );
			}
		}.bind( this ) );
	},

	setBodyScrollPosition: function() {
		if ( this.props.sectionId ) {
			const sectionNode = document.getElementById( this.props.sectionId );

			if ( sectionNode ) {
				sectionNode.scrollIntoView();
			}
		}
	},

	delayLoadingMessage: function() {
		this.clearLoadingMessage();
		this.timeoutID = setTimeout( function() {
			if ( ! this.state.body ) {
				this.setState( {
					body: 'Loading…'
				} );
			}
		}.bind( this ), 1000 );
	},

	clearLoadingMessage: function() {
		if ( 'number' === typeof this.timeoutID ) {
			window.clearTimeout( this.timeoutID );
			this.timeoutID = null;
		}
	},

	render: function() {
		const editURL = encodeURI( 'https://github.com/Automattic/wp-calypso/edit/master/' + this.props.path ) +
			'?message=Documentation: <title>&description=What did you change and why&target_branch=update/docs-your-title';

		return (
			<div className="devdocs devdocs__doc">
				<CompactCard className="devdocs__doc-header">
					Path: <code>{ this.props.path }</code>
					<a href={ editURL } target="_blank" rel="noopener noreferrer">Improve this document on GitHub &rarr;</a>
				</CompactCard>
				<div
					className="devdocs__doc-content"
					ref="body"
					dangerouslySetInnerHTML={ { __html: highlight( this.props.term, this.state.body ) } } //eslint-disable-line react/no-danger
				/>
			</div>
		);
	}
} );
