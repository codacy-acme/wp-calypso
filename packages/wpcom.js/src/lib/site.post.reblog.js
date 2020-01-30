/**
 * Reblog methods
 *
 * @param {String} pid post id
 * @param {String} sid site id
 * @param {WPCOM} wpcom - wpcom instance
 * @return {Null} null
 */
export default function Reblog( pid, sid, wpcom ) {
	if ( ! sid ) {
		throw new Error( '`site id` is not correctly defined' );
	}

	if ( ! pid ) {
		throw new Error( '`post id` is not correctly defined' );
	}

	if ( ! ( this instanceof Reblog ) ) {
		return new Reblog( pid, sid, wpcom );
	}

	this.wpcom = wpcom;
	this._pid = pid;
	this._sid = sid;
}

/**
 * Get your reblog status for a Post
 *
 * @param {Object} [query] - query object parameter
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Reblog.prototype.mine = Reblog.prototype.state = function( query, fn ) {
	var path = '/sites/' + this._sid + '/posts/' + this._pid + '/reblogs/mine';
	return this.wpcom.req.get( path, query, fn );
};

/**
 * Reblog a post
 *
 * @param {Object} [query] - query object parameter
 * @param {Object} body - body object parameter
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Reblog.prototype.add = function( query, body, fn ) {
	if ( 'function' === typeof body ) {
		fn = body;
		body = query;
		query = {};
	}

	if ( body && ! body.destination_site_id ) {
		return fn( new Error( 'destination_site_id is not defined' ) );
	}

	let path = '/sites/' + this._sid + '/posts/' + this._pid + '/reblogs/new';
	return this.wpcom.req.put( path, query, body, fn );
};

/**
 * Reblog a post to
 * It's almost an alias of Reblogs#add
 *
 * @param {Number|String} dest site id destination
 * @param {String} [note] - post reblog note
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Reblog.prototype.to = function( dest, note, fn ) {
	if ( undefined === fn ) {
		if ( undefined === note ) {
			note = null;
		} else if ( 'function' === typeof note ) {
			fn = note;
			note = null;
		}
	}

	return this.add( { note: note, destination_site_id: dest }, fn );
};
