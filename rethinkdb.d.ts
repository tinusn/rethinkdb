/// <reference path="typings/tsd.d.ts" />

// Type definitions for RethinkDB v2.0.2
// Project: http://rethinkdb.com/
// Definitions by: Tinus Aamand Norstved <https://github.com/tinusn/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module rethinkdb {
	/**
	 * The top-level ReQL namespace.
	 */
	interface r extends RqlDo {
		/**
		 * Create a new connection to the database server. If the connection cannot be established, a RqlDriverError will be passed to the callback instead of a connection.
		 */
		connect(options: ConnectOptions, callback: (err: Error, conn: Connection) => void): Connection;
		/**
		 * Create a new connection to the database server. If the connection cannot be established, a RqlDriverError will be passed to the callback instead of a connection.
		 */
		connect(host: string, callback: (err: Error, conn: Connection) => void): Connection;
		/**
		 * Create a new connection to the database server.
		 */
		connect(options: ConnectOptions): Promise<Connection>;
		/**
		 * Create a new connection to the database server.
		 */
		connect(host: string): Promise<Connection>;

		/**
		 * Create a database. A RethinkDB database is a collection of tables, similar to relational databases.
		 *
		 * If successful, the operation returns an object: {created: 1}. If a database with the same name already exists the operation throws RqlRuntimeError.
		 *
		 * Note: that you can only use alphanumeric characters and underscores for the database name.
		 */
		dbCreate(name: string): Operation<CreateResult>;

		/**
		 * Drop a database. The database, all its tables, and corresponding data will be deleted.
		 *
		 * If successful, the operation returns the object {dropped: 1}. If the specified database doesn’t exist a RqlRuntimeError is thrown.
		 */
		dbDrop(name: string): Operation<DropResult>;

		/**
		 * List all database names in the system.
		 */
		dbList(): Operation<string[]>;

		/**
		 * Reference a table.
		 */
		table(name: string): Table;

		/**
		 * Reference a database.
		 */
		db(name: string): Db;
		
		/**
		 * Returns the currently visited document. Note that row does not work within subqueries to access nested documents; you should use anonymous functions to access those documents instead.
		 */
		row(name?: string): Expression<any>;
		
		/**
		 * Generate a random number between given (or implied) bounds.
		 */
		random(start?: number, end?: number, options?: RandomOptions);

		/**
		 * Return a time object representing the current time in UTC. The command now() is computed once when the server receives the query, so multiple instances of r.now() will always return the same time inside a query.
		 */
		now(): Time;
		
		/**
		 * Create a time object for a specific time.
		 * 
		 * A few restrictions exist on the arguments:
		 * 
		 * year is an integer between 1400 and 9,999.
		 * month is an integer between 1 and 12.
		 * day is an integer between 1 and 31.
		 * hour is an integer.
		 * minutes is an integer.
		 * seconds is a double. Its value will be rounded to three decimal places (millisecond-precision).
		 * timezone can be 'Z' (for UTC) or a string with the format ±[hh]:[mm].
		 */
		time(year: number, month: number, day: number, hour?: number, minutes?: number, seconds?: number, timezone?: string): Time;
		
		/**
		 * Create a time object based on seconds since epoch. The first argument is a double and will be rounded to three decimal places (millisecond-precision).
		 */
		epochTime(epochTime: number): Time;
		
		/**
		 * Create a time object based on an ISO 8601 date-time string (e.g. ‘2013-01-01T01:01:01+00:00’). We support all valid ISO 8601 formats except for week dates. If you pass an ISO 8601 date-time without a time zone, you must specify the time zone with the defaultTimezone argument. Read more about the ISO 8601 format at Wikipedia.
		 */
		ISO8601(iso8601Date: string, options?: ISO8601Options): Time;

		/**
		 * If the test expression returns false or null, the false_branch will be evaluated. Otherwise, the true_branch will be evaluated.
		 * 
		 * The branch command is effectively an if renamed due to language constraints. The type of the result is determined by the type of the branch that gets executed.
		 */
		branch(test: ExpressionFunction<boolean>, true_branch: ExpressionFunction<any>, false_branch: ExpressionFunction<any>): any;
		
		/**
		 * Create a javascript expression.
		 */
		js(jsString: string, options?: jsOptions): Expression<any>;

		tableDrop(name: string);
		
		
		/**
		 * Replace an object in a field instead of merging it with an existing object in a merge or update operation.
		 */
		literal(name: any): any;

		/**
		 * Creates an object from a list of key-value pairs, where the keys must be strings. r.object(A, B, C, D) is equivalent to r.expr([[A, B], [C, D]]).coerce_to('OBJECT').
		 */
		object(...props: any[]): any;
		
		/**
		 * r.args is a special term that’s used to splice an array of arguments into another term. This is useful when you want to call a variadic term such as getAll with a set of arguments produced at runtime.
		 * 
		 * This is analogous to using apply in JavaScript.
		 * 
		 * Example: Get Alice and Bob from the table people.
		 * 
		 * r.table('people').getAll('Alice', 'Bob').run(conn, callback)
		 * or
		 * r.table('people').getAll(r.args(['Alice', 'Bob'])).run(conn, callback)
		 */
		args(arr: any[]): any;
		
		/**
		 * Encapsulate binary data within a query.
		 */
		binary(data: any): rBinary;
		
		/**
		 * Generate a stream of sequential integers in a specified range.
		 * 
		 * range takes 0, 1 or 2 arguments:
		 * With no arguments, range returns an “infinite” stream from 0 up to and including the maximum integer value;
		 * With one argument, range returns a stream from 0 up to but not including the end value;
		 * With two arguments, range returns a stream from the start value up to but not including the end value.
		 * 
		 * Note that the left bound (including the implied left bound of 0 in the 0- and 1-argument form) is always closed and the right bound is always open: the start value will always be included in the returned range and the end value will not be included in the returned range.
		 * 
		 * Any specified arguments must be integers, or a RqlRuntimeError will be thrown. If the start value is equal or to higher than the end value, no error will be thrown but a zero-element stream will be returned.
		 */
		range(startValue?: number, endValue?: number): Stream;
		
		/**
		 * Throw a runtime error. If called with no arguments inside the second argument to default, re-throw the current error.
		 */
		error(message: string): Error;
		
		/**
		 * Construct a ReQL JSON object from a native object.
		 * 
		 * If the native object is a Node.js Buffer, then expr will return a binary object. See binary for more information.
		 */
		expr(value: any): Expression<rObject|rBinary>;
		
		/**
		 * Parse a JSON string on the server.
		 */
		json(json_string: string): Expression<any>;
		
		/**
		 * Retrieve data from the specified URL over HTTP. The return type depends on the resultFormat option, which checks the Content-Type of the response by default.
		 */
		http(url: string, options?: HttpOptions): Expression<any>;
		
		/**
		 * Return a UUID (universally unique identifier), a string that can be used as a unique ID.
		 */
		uuid(): Expression<string>;
		
		r.circle([longitude, latitude], radius[, {numVertices: 32, geoSystem: 'WGS84', unit: 'm', fill: true}]) → geometry
r.circle(point, radius[, {numVertices: 32, geoSystem: 'WGS84', unit: 'm', fill: true}]) → geometry
		
		

		minval: any;
		maxval: any;

		asc(name: string): string;
		desc(name: string): string;

		january: number;
		february: number;
		march: number;
		april: number;
		may: number;
		june: number;
		july: number;
		august: number;
		september: number;
		october: number;
		november: number;
		december: number;

		monday: number;
		tuesday: number;
		wednesday: number;
		thursday: number;
		friday: number;
		saturday: number;
		sunday: number;
	}

	interface HttpOptions {
		/**
		 * Number of seconds to wait before timing out and aborting the operation. Default: 30.
		 */
		timeout?: number;
		/**
		 * An integer giving the number of attempts to make in cast of connection errors or potentially-temporary HTTP errors. Default: 5.
		 */
		reattempts?: number;
		/**
		 * An integer giving the number of redirects and location headers to follow. Default: 1.
		 */
		redirects?: number;
		/**
		 * Verify the server’s SSL certificate, specified as a boolean. Default: true.
		 */
		verify?: boolean;
		/**
		 * The format the result should be returned in. The values can be 'text' (always return as a string), 'json' (parse the result as JSON, raising an error if the parsing fails), 'jsonp' (parse the result as padded JSON), 'binary' (return a binary object), or 'auto' . The default is 'auto'.
		 * 
		 * When resultFormat is auto, the response body will be parsed according to the Content-Type of the response: * application/json: parse as 'json' * application/json-p, text/json-p, text/javascript: parse as 'jsonp' * audio/*, video/*, image/*, application/octet-stream: return a binary object * Anything else: parse as 'text'
		 */
		resultFormat?: string;
		
		/**
		 * HTTP method to use for the request. One of GET, POST, PUT, PATCH, DELETE or HEAD. Default: GET.
		 */
		method?: string;
		/**
		 * Authentication information in the form of an object with key/value pairs indicating the authentication type (in the type key) and any required information. Types currently supported are basic and digest for HTTP Basic and HTTP Digest authentication respectively. If type is omitted, basic is assumed. Example:
js r.http('http://httpbin.org/basic-auth/fred/mxyzptlk', { auth: { type: 'basic', user: 'fred', pass: 'mxyzptlk' } } ).run(conn, callback)
		 */
		auth?: Object;
		
		/**
		 * URL parameters to append to the URL as encoded key/value pairs, specified as an object. For example, { query: 'banana', limit: 2 } will be appended as ?query=banana&limit=2. Default: none.
		 */
		params?: Object;
		/**
		 * Extra header lines to include. The value may be an array of strings or an object. Default: none.
		 * 
		 * Unless specified otherwise, r.http will by default use the headers Accept-Encoding: deflate;q=1, gzip;q=0.5 and User-Agent: RethinkDB/VERSION.
		 */
		header?: string[]| Object;
		
		/**
		 * Data to send to the server on a POST, PUT, PATCH, or DELETE request.
		For PUT, PATCH and DELETE requests, the value will be serialized to JSON and placed in the request body, and the Content- Type will be set to application/ json.
		For POST requests, data may be either an object or a string.Objects will be written to the body as form- encoded key/ value pairs (values must be numbers, strings, or null).Strings will be put directly into the body.If data is not a string or an object, an error will be thrown.
		If data is not specified, no data will be sent.
		 */
		data?: any;
		
		/**
		 * This option may specify either a built-in pagination strategy (as a string), or a function to provide the next URL and/or params to request.
		 * 
		 * At the moment, the only supported built-in is 'link-next', which is equivalent to function(info) { return info('header')('link')('rel="next"').default(null); }.
		 * 
		 * Example: Perform a GitHub search and collect up to 3 pages of results.
		 * js r.http("https://api.github.com/search/code?q=addClass+user:mozilla", { page: 'link-next', pageLimit: 3 } ).run(conn, callback)
		 * 
		 * As a function, page takes one parameter, an object of the format:
		 * js { params: object // the URL parameters used in the last request header: object // the HTTP headers of the last response as key/value pairs body: value // the body of the last response in the format specified by `resultFormat` }
		 * 
		 * The header field will be a parsed version of the header with fields lowercased, like so:
		 * js { 'content-length': '1024', 'content-type': 'application/json', 'date': 'Thu, 1 Jan 1970 00:00:00 GMT', 'link': { 'rel="last"': 'http://example.com/?page=34', 'rel="next"': 'http://example.com/?page=2' } }
		 * 
		 * The page function may return a string corresponding to the next URL to request, null indicating that there is no more to get, or an object of the format:
		 * js { url: string // the next URL to request, or null for no more pages params: object // new URL parameters to use, will be merged with the previous request's params }
		 */
		page?: any
		/**
		 * An integer specifying the maximum number of requests to issue using the page functionality. This is to prevent overuse of API quotas, and must be specified with page.
-1: no limit
0: no requests will be made, an empty stream will be returned
n: n requests will be made
		 */
		pageLimit?: number;

	}

	interface jsOptions {
		timeout: number;
	}

	interface Time {
		/**
 * Return a new time object with a different timezone. While the time stays the same, the results returned by methods such as hours() will change since they take the timezone into account. The timezone argument has to be of the ISO 8601 format.
 */
		inTimezone(timezone: string): Time;
		
		/**
 * Return the timezone of the time object.
 */
		timezone(): string;
		
		/**
 * Return if a time is between two other times (by default, inclusive for the start, exclusive for the end).
 */
		during(startTime: Time, endTime: Time, options?: LeftRightBound): boolean;
		
		/**
 * Return a new time object only based on the day, month and year (ie. the same day at 00:00).
 */
		date(): Time;
		
		/**
 * Return the number of seconds elapsed since the beginning of the day stored in the time object.
 */
		timeOfDay(): number;
		
		/**
 * Return the year of a time object.
 */
		year(): number;
		
		/**
 * Return the month of a time object as a number between 1 and 12. For your convenience, the terms r.january, r.february etc. are defined and map to the appropriate integer.
 */
		month(): number;
		
		/**
 * Return the day of a time object as a number between 1 and 31.
 */
		day(): number;
		
		/**
 * Return the day of week of a time object as a number between 1 and 7 (following ISO 8601 standard). For your convenience, the terms r.monday, r.tuesday etc. are defined and map to the appropriate integer.
 */
		dayOfWeek(): number;
		
		/**
 * Return the day of the year of a time object as a number between 1 and 366 (following ISO 8601 standard).
 */
		dayOfYear(): number;
		
		/**
 * Return the hour in a time object as a number between 0 and 23.
 */
		hours(): number;
		
		/**
 * Return the minute in a time object as a number between 0 and 59.
 */
		minutes: number;
		
		/**
 * Return the seconds in a time object as a number between 0 and 59.999 (double precision).
 */
		seconds(): number;
		
		/**
 * Convert a time object to a string in ISO 8601 format.
 */
		toISO8601(): string;
		
		/**
 * Convert a time object to its epoch time.
 */
		toEpochTime(): number;
	}

	interface ISO8601Options {
		defaultTimezone: string;
	}

	interface RandomOptions {
		float: boolean;
	}

	class Connection {
		/**
 * Close an open connection.
 *
 * Closing a connection normally waits until all outstanding requests have finished and then frees any open resources associated with the connection. By passing false to the noreply_wait optional argument, the connection will be closed immediately, possibly aborting any outstanding noreply writes.
 *
 * A noreply query is executed by passing the noreply option to the run command, indicating that run() should not wait for the query to complete before returning. You may also explicitly wait for a noreply query to complete by using the noreplyWait command.
 */
		close(options: noReplyWaitOptions, callback: (err: Error) => void): void;
		/**
 * Close an open connection.
 *
 * Closing a connection normally waits until all outstanding requests have finished and then frees any open resources associated with the connection. By passing false to the noreply_wait optional argument, the connection will be closed immediately, possibly aborting any outstanding noreply writes.
 *
 * A noreply query is executed by passing the noreply option to the run command, indicating that run() should not wait for the query to complete before returning. You may also explicitly wait for a noreply query to complete by using the noreplyWait command.
 */
		close(callback: (err: Error) => void): void;
		/**
 * Close an open connection.
 *
 * Closing a connection normally waits until all outstanding requests have finished and then frees any open resources associated with the connection. By passing false to the noreply_wait optional argument, the connection will be closed immediately, possibly aborting any outstanding noreply writes.
 *
 * A noreply query is executed by passing the noreply option to the run command, indicating that run() should not wait for the query to complete before returning. You may also explicitly wait for a noreply query to complete by using the noreplyWait command.
 */
		close(options?: noReplyWaitOptions): Promise<void>;

		/**
 * Close and reopen a connection.
 *
 * Closing a connection normally waits until all outstanding requests have finished and then frees any open resources associated with the connection. By passing false to the noreply_wait optional argument, the connection will be closed immediately, possibly aborting any outstanding noreply writes.
 *
 * A noreply query is executed by passing the noreply option to the run command, indicating that run() should not wait for the query to complete before returning. You may also explicitly wait for a noreply query to complete by using the noreplyWait command.
 */
		reconnect(options: noReplyWaitOptions, callback: (err: Error, conn: Connection) => void): Connection;
		/**
 * Close and reopen a connection.
 *
 * Closing a connection normally waits until all outstanding requests have finished and then frees any open resources associated with the connection. By passing false to the noreply_wait optional argument, the connection will be closed immediately, possibly aborting any outstanding noreply writes.
 *
 * A noreply query is executed by passing the noreply option to the run command, indicating that run() should not wait for the query to complete before returning. You may also explicitly wait for a noreply query to complete by using the noreplyWait command.
 */
		reconnect(callback: (err: Error, conn: Connection) => void): Connection;
		/**
 * Close and reopen a connection.
 *
 * Closing a connection normally waits until all outstanding requests have finished and then frees any open resources associated with the connection. By passing false to the noreply_wait optional argument, the connection will be closed immediately, possibly aborting any outstanding noreply writes.
 *
 * A noreply query is executed by passing the noreply option to the run command, indicating that run() should not wait for the query to complete before returning. You may also explicitly wait for a noreply query to complete by using the noreplyWait command.
 */
		reconnect(options?: noReplyWaitOptions): Promise<Connection>;

		/**
 * Change the default database on this connection.
 */
		use(dbName: string): void;

		/**
 * ensures that previous queries with the noreply flag have been processed by the server. Note that this guarantee only applies to queries run on the given connection.
 */
		noreplyWait(callback: (err: Error) => void): void;
		/**
 * ensures that previous queries with the noreply flag have been processed by the server. Note that this guarantee only applies to queries run on the given connection.
 */
		noreplyWait(): Promise<void>;
	}

	interface Db {
		/**
 * Create a table. A RethinkDB table is a collection of JSON documents.
 *
 * If a table with the same name already exists, the command throws RqlRuntimeError.
 *
 * Note: Only alphanumeric characters and underscores are valid for the table name.
 */
		tableCreate(tableName: string, options?: TableCreateOptions): Operation<TableCreateResult>;
		/**
 * Drop a table from a database. The table and all its data will be deleted.
 */
		tableDrop(tableName: string): Operation<TableDropResult>;
		/**
 * List all table names in a database
 */
		tableList(): Operation<string[]>;

		/**
 * Reference a table.
 */
		table(name: string, options?: TableOptions): Table;
	}

	interface Table extends Sequence, Writeable, Selection, Stream {
		/**
 * Create a new secondary index on a table. Secondary indexes improve the speed of many read queries at the slight cost of increased storage space and decreased write performance. For more information about secondary indexes, read the article “Using secondary indexes in RethinkDB.”
 *
 * RethinkDB supports different types of secondary indexes:
 *
 * Simple indexes based on the value of a single field.
 * Compound indexes based on multiple fields.
 * Indexes based on arbitrary expressions.
 *
 * The indexFunction can be an anonymous function or a binary representation obtained from the function field of indexStatus.
 *
 * If successful, createIndex will return an object of the form {"created": 1}. If an index by that name already exists on the table, a RqlRuntimeError will be thrown.
 */
		indexCreate(indexName: string, index: ExpressionFunction<any>): Operation<CreateResult>;

		/**
 * Create a new secondary index on a table. Secondary indexes improve the speed of many read queries at the slight cost of increased storage space and decreased write performance. For more information about secondary indexes, read the article “Using secondary indexes in RethinkDB.”
 *
 * RethinkDB supports different types of secondary indexes:
 *
 * Multi indexes based on arrays of values, created when the multi optional argument is true.
 * Geospatial indexes based on indexes of geometry objects, created when the geo optional argument is true.
 *
 * If successful, createIndex will return an object of the form {"created": 1}. If an index by that name already exists on the table, a RqlRuntimeError will be thrown.
 */
		indexCreate(indexName: string, indexOptions?: IndexCreateOptions): Operation<CreateResult>;

		/**
 * Delete a previously created secondary index of this table.
 */
		indexDrop(name: string): Operation<DropResult>;

		/**
 * List all the secondary indexes of this table.
 */
		indexList(): Operation<string[]>;

		/**
 * Rename an existing secondary index on a table. If the optional argument overwrite is specified as true, a previously existing index with the new name will be deleted and the index will be renamed. If overwrite is false (the default) an error will be raised if the new index name already exists.
 */
		indexRename(oldIndexName: string, newIndexName: string, options?: OverwriteOptions): Operation<RenameResult>;

		/**
 * Get the status of the specified indexes on this table, or the status of all indexes on this table if no indexes are specified.
 */
		indexStatus(...indexes: string[]): Selection;

		/**
			* Wait for the specified indexes on this table to be ready, or for all 	indexes on this table to be ready if no indexes are specified.
		*/
		indexWait(...indexes: string[]): Selection;

		/**
 * Insert documents into a table. Accepts a single document, an array of documents or a stream
 *
 * Example: Insert a document into the table posts:
 * r.table("posts").insert({
 * id: 1,
 * title: "Lorem ipsum",
 * content: "Dolor sit amet"
 * }).run(conn, callback)
 *
 * Example: Insert multiple documents into the table users:
 * r.table("users").insert([
 * {id: "william", email: "william@rethinkdb.com"},
 * {id: "lara", email: "lara@rethinkdb.com"}
 * ]).run(conn, callback)
 *
 * Example: Copy the documents from posts to postsBackup:
 * r.table("postsBackup").insert( r.table("posts") ).run(conn, callback)
 */
		insert(object: any | any[]| Table, options?: InsertOptions): Operation<InsertResult>;

		/**
 * Get a document by primary key.
 *
 * If no document exists with that primary key, get will return null.
 */
		get(key: string | number): SingleRowSelection;

		/**
 * Get all documents where the given value matches the value of the requested index.
 *
 * Example: Without an index argument, we default to the primary index. While get will either return the document or null when no document with such a primary key value exists, this will return either a one or zero length stream.
 * r.table('dc').getAll('superman').run(conn, callback)
 *
 * Example: Secondary index keys are not guaranteed to be unique so we cannot query via get when using a secondary index.
 * r.table('marvel').getAll('man_of_steel', {index:'code_name'}).run(conn, callback)
 *
 * Example: You can get multiple documents in a single call to get_all.
 * r.table('dc').getAll('superman', 'ant man').run(conn, callback)
 */
		getAll(...keys: any[]): Selection;

		/**
 * ensures that writes on a given table are written to permanent storage. Queries that specify soft durability ({durability: 'soft'}) do not give such guarantees, so sync can be used to ensure the state of these queries. A call to sync does not return until all previous writes to the table are persisted.
 */
		sync(): Operation<void>;

		/**
 * Get all documents between two keys.
 *
 * You may also use the special constants r.minval and r.maxval for boundaries, which represent “less than any index key” and “more than any index key” respectively. For instance, if you use r.minval as the lower key, then between will return all documents whose primary keys (or indexes) are less than the specified upper key.
 *
 * Note that compound indexes are sorted using lexicographical order.
 *
 * Note: Between works with secondary indexes on date fields, but will not work with unindexed date fields. To test whether a date value is between two other dates, use the during command, not between.
 *
 * Note: RethinkDB uses byte-wise ordering for between and does not support Unicode collations; non-ASCII characters will be sorted by UTF-8 codepoint.
 *
 * Note: If you chain between after orderBy, the between command must use the index specified in orderBy, and will default to that index. Trying to specify another index will result in a RqlRuntimeError.
 */
		between(lower: any, upper: any, index?: IndexOptions): Selection;

		/**
 * Sort the sequence by document values of the given key(s). To specify the ordering, wrap the attribute with either r.asc or r.desc (defaults to ascending).
	
	Sorting without an index requires the server to hold the sequence in memory, and is limited to 100,000 documents (or the setting of the arrayLimit option for run). Sorting with an index can be done on arbitrarily large tables, or after a between command using the same index.
	*
	*  syntax: table.orderBy([key1...], {index: index_name}) → selection<stream>
 */
		orderBy(...keys: any[]): rSelection<Stream>;

		/**
 * Removes duplicates from elements in a sequence.
 */
		distinct(options?: MinMaxIndexOptions): Stream;
	}

	interface rSelection<T> {

	}

	/**
	 * Cursors and feeds implement the same interface as Node’s EventEmitter.
	 */
	interface Cursor extends rNext, rEach, rToArray, NodeJS.EventEmitter, Selection {
		/**
 * Close a cursor. Closing a cursor cancels the corresponding query and frees the memory associated with the open request.
 */
		close(): void;
	}

	interface ConnectOptions {
		/**
 * the host to connect to (default localhost).
 */
		host?: string;
		/**
 * the port to connect on (default 28015).
 */
		port?: number;
		/**
 * the default database (default test).
 */
		db?: string;
		/**
 * the authentication key (default none).
 */
		authKey?: string;
		/**
 * timeout period in seconds for the connection to be opened (default 20).
 */
		timeout?: number;
	}

	interface RunOptions {
		/**
 * whether or not outdated reads are OK (default: false).
 */
		useOutdated?: boolean;
		/**
 * what format to return times in (default: 'native'). Set this to 'raw' if you want times returned as JSON objects for exporting.
 */
		timeFormat?: string;
		/**
 * whether or not to return a profile of the query’s execution (default: false).
 */
		profile?: boolean;
		/**
 * possible values are 'hard' and 'soft'. In soft durability mode RethinkDB will acknowledge the write immediately after receiving it, but before the write has been committed to disk.
 */
		durability?: string;
		/**
 * what format to return grouped_data and grouped_streams in (default: 'native'). Set this to 'raw' if you want the raw pseudotype.
 */
		groupFormat?: string;
		/**
 * set to true to not receive the result object or cursor and return immediately.
 */
		noreply?: boolean;
		/**
 *  the database to run this query against as a string. The default is the database specified in the db parameter to connect (which defaults to test).
 */
		db?: string;
		/**
 * the maximum numbers of array elements that can be returned by a query (default: 100,000). This affects all ReQL commands that return arrays.
 *
 * Note that it has no effect on the size of arrays being written to the database; those always have an upper limit of 100,000 elements.
 */
		arrayLimit?: number;
		/**
 * what format to return binary data in (default: 'native'). Set this to 'raw' if you want the raw pseudotype.
 */
		binaryFormat?: string;
		/**
 * minimum number of rows to wait for before batching a result set (default: 8). This is an integer.
 */
		minBatchRows?: number;
		/**
 * maximum number of rows to wait for before batching a result set (default: unlimited). This is an integer.
 */
		maxBatchRows?: number;
		/**
 * maximum number of bytes to wait for before batching a result set (default: 1024). This is an integer.
 */
		maxBatchBytes?: number;
		/**
 * maximum number of seconds to wait before batching a result set (default: 0.5). This is a float (not an integer) and may be specified to the microsecond.
 */
		maxBatchSeconds?: number;
		/**
 * factor to scale the other parameters down by on the first batch (default: 4).
 *
 * For example, with this set to 8 and maxBatchRows set to 80, on the first batch maxBatchRows will be adjusted to 10 (80 / 8). This allows the first batch to return faster.
 */
		firstBatchScaledownFactor?: number;
	}

	interface CreateResult {
		created: number;
	}

	interface DropResult {
		dropped: number;
	}

	interface RenameResult {
		/**
 * The return value on success will be an object of the format {renamed: 1}, or {renamed: 0} if the old and new names are the same.
 */
		renamed: number;
	}

	interface IndexStatusResult extends IndexReadyResult {
		blocks_processed?: number;
		blocks_total?: number;
		/**
 * The function field is a binary object containing an opaque representation of the secondary index (including the multi argument if specified).
 */
		function: Function;
	}

	interface IndexReadyResult {
		index: string;
		ready: boolean;
		/**
 * The multi field will be true or false depending on whether this index was created as a multi index
 */
		multi: boolean;
		/**
 * the geo field will be true or false depending on whether this index was created as a geospatial index
 */
		geo: boolean;
		/**
 * The outdated field will be true if the index is outdated in the current version of RethinkDB and needs to be rebuilt.
 */
		outdated: boolean;
	}

	interface ConfigChanges {
		old_val: TableConfig | any;
		new_val: TableConfig | any;
	}

	interface Shard {
		/**
 * the name or UUID of the server acting as the shard’s primary. If primary_replica is null, the table will be unavailable. This may happen if the server acting as the shard’s primary is deleted.
 */
		primary_replica: string;
		/**
 * a list of servers, including the primary, storing replicas of the shard.
 */
		replicas: string[];
	}

	enum ReplicaState {
		missing, backfilling_data, offloading_data, erasing_data, looking_for_primary, ready, transitioning
	}

	interface ServerState {
		server: string;
		state: ReplicaState;
	}

	interface MultipleServerShard {
		primary_replica: string;
		replicas: ServerState[];
	}

	interface TableConfig {
		/**
 * the UUID of the table. Read-only.
 */
		id: string;
		/**
 * the name of the table
 */
		name: string;
		/**
 * the database the table is in, either a name or UUID depending on the value of identifier_format. Read-only
 */
		db: string;
		/**
 * the name of the field used as the primary key of the table, set at table creation. Read-only.
 */
		primary_key: string;
		/**
 * a list of the table’s shards
 */
		shards: Shard[];
		/**
 * the write acknowledgement settings for the table. When set to majority (the default), writes will be acknowledged when a majority of replicas have acknowledged their writes; when set to single writes will be acknowledged when a single replica acknowledges it. This may also be set to a list of requirements; see below.
 */
		write_acks: string;
		/**
 * soft or hard (the default). In hard durability mode, writes are committed to disk before acknowledgements are sent; in soft mode, writes are acknowledged immediately upon receipt. The soft mode is faster but slightly less resilient to failure.
 */
		durability: string;
	}

	interface ServerConfig {
		/**
 * the UUID of the server
 */
		id: string;
		/**
 * the server’s name
 */
		name: string;
		/**
 * a list of unordered tags associated with the server
 */
		tags: string[];
	}

	interface ClusterConfig {
		/**
 * the primary key, always auth
 */
		id: string;
		/**
 * the authentication key, or null if no key is set.
 */
		auth_key: string;
	}

	interface DbConfig {
		/**
 * the UUID of the database
 */
		id: string;
		/**
 * the name of the database
 */
		name: string;
	}

	interface TableShardStatus {
		ready_for_outdated_reads: boolean;
		ready_for_reads: boolean;
		ready_for_writes: boolean;
		all_replicas_ready: boolean;
	}

	interface TableStatus {
		/**
 * the UUID of the table.
 */
		id: string;
		/**
 * the table’s name.
 */
		name: string;
		/**
 * the database the table is in, either a name or UUID depending on the value of identifier_format
 */
		db: string;
		status: TableShardStatus;
		/**
 * one entry for each shard in table_config
 */
		shards: MultipleServerShard[];
	}

	interface ConnectionTimestamp {
		time_connected: Date;
		time_disconnected: Date;
	}

	interface NetworkAddress {
		host: string;
		port: number;
	}

	interface Network {
		hostname: string;
		cluster_port: number;
		http_admin_port: number;
		reql_port: number;
		canonical_addresses: NetworkAddress[];
	}

	interface Process {
		cache_size_mb: number;
		pid: number;
		time_started: Date;
		version: string;
	}

	interface ServerStatus {
		/**
 * the UUID of the server
 */
		id: string;
		/**
 * the name of the server
 */
		name: string;
		/**
 * always available if the server is connected
 */
		status: string;
		connection: ConnectionTimestamp;
		network: Network;
		process: Process;
	}

	interface LogStatus {
		id: string;
		level: string;
		message: string;
		server: string;
		timestamp: Date;
		uptime: number;
	}

	interface TableCreateResult {
		/**
 * always 1.
 */
		tables_created: number;
		/**
 * old_val is always null
 *
 * new_val: the table’s new config value.
 */
		config_changes: ConfigChanges;
	}

	interface TableDropResult {
		/**
 * always 1.
 */
		tables_dropped: number;
		/**
 * old_val: the dropped table’s config value.
 *
 * new_val: always null.
 */
		config_changes: ConfigChanges;
	}

	interface TableCreateOptions {
		/**
 * the name of the primary key. The default primary key is id. The data type of a primary key is usually a string (like a UUID) or a number, but it can also be a time, binary object, boolean or an array. It cannot be an object.
 */
		primaryKey?: string;
		/**
 * if set to soft, writes will be acknowledged by the server immediately and flushed to disk in the background. The default is hard: acknowledgment of writes happens after data has been written to disk.
 */
		durability?: string;
		/**
 * the number of shards, an integer from 1-32. Defaults to 1.
 */
		shards?: number;
		/**
 * either an integer or a mapping object. Defaults to 1.
 *
 * If replicas is an integer, it specifies the number of replicas per shard. Specifying more replicas than there are servers will return an error.
 *
 * If replicas is an object, it specifies key-value pairs of server tags and the number of replicas to assign to those servers: {tag1: 2, tag2: 4, tag3: 2, ...}.
 */
		replicas?: any;
		/**
 * the primary server specified by its server tag. Required if replicas is an object; the tag must be in the object. This must not be specified if replicas is an integer.
 */
		primaryReplicaTag?: string;
	}

	interface TableOptions {
		/**
 * whether or not outdated reads are OK (default: false).
 */
		useOutdated: boolean;
	}

	interface IndexCreateOptions {
		/**
 * Secondary index based on arrays of values.
 */
		multi?: boolean;
		/**
 * Secondary index based on indexes of geometry objects.
 *
 * A geospatial index field should contain only geometry objects. It will work with geometry ReQL terms (getIntersecting and getNearest) as well as index-specific terms (indexStatus, indexWait, indexDrop and indexList). Using terms that rely on non-geometric ordering such as getAll, orderBy and between will result in an error.
 */
		geo?: boolean;
	}

	interface SingleRowSelection extends Writeable, Selection, rChanges, rPluck<rObject>, rWithout<rObject>, rMerge<rObject>, rGetField<rObject>, rKeys, rSingleField<any> {
		/**
 * Convert a ReQL value or object to a JSON string. You may use either toJsonString or toJSON.
 */
		/**
 * Convert a ReQL value or object to a JSON string. You may use either toJsonString or toJSON.
 */
		toJsonString: Expression<string>;
		toJSON(): Expression<string>;
	}

	interface rKeys {
		/**
 * Return an array containing all of the object’s keys.
 */
		keys(): rdbArray;
	}

	interface UpdateOptions {
		/**
 * possible values are hard and soft. This option will override the table or query’s durability setting (set in run). In soft durability mode RethinkDB will acknowledge the write immediately after receiving it, but before the write has been committed to disk.
 */
		durability?: string;
		/**
 * if set to true, return a changes array consisting of old_val/new_val objects describing the changes made.
 */
		returnChanges?: boolean;
		/**
 * if set to true, executes the update and distributes the result to replicas in a non-atomic fashion. This flag is required to perform non-deterministic updates, such as those that require reading data from another table.
 */
		nonAtomic?: boolean;
	}

	interface InsertResult extends ModifyResult {
		/**
 * a list of generated primary keys for inserted documents whose  primary keys were not specified (capped to 100,000).
 */
		generated_keys?: string[];
		/**
 * if the field generated_keys is truncated, you will get the warning “Too many generated keys (<X>), array truncated to 100000.”.
 */
		warnings?: string;
	}

	interface ModifyResult {
		/**
 * the number of documents successfully inserted.
 */
		inserted: number;
		/**
 * the number of documents updated when conflict is set to "replace" or "update".
 */
		replaced: number;
		/**
 * the number of documents whose fields are identical to existing documents with the same primary key when conflict is set to "replace" or "update".
 */
		unchanged: number;
		/**
 * the number of errors encountered while performing the insert.
 */
		errors: number;
		/**
 * If errors were encountered, contains the text of the first error.
 */
		first_error: string;
		/**
 * 0 for an insert / update operation.
 */
		deleted: number;
		/**
 * 0 for an insert / update operation.
 */
		skipped: number;
		/**
 * if returnChanges is set to true, this will be an array of objects, one for each objected affected by the insert operation. Each object will have two keys: {new_val: <new value>, old_val: null}.
 */
		changes?: ChangeResult;
	}

	interface InsertOptions {
		/**
 * possible values are hard and soft. This option will override the table or query’s durability setting (set in run). In soft durability mode RethinkDB will acknowledge the write immediately after receiving and caching it, but before the write has been committed to disk.
 */
		durability?: string;
		/**
 * if set to true, return a changes array consisting of old_val/new_val objects describing the changes made.
 */
		returnChanges?: boolean;
		/**
 * Determine handling of inserting documents with the same primary key as existing entries. Possible values are "error", "replace" or "update".
 *
 * "error": Do not insert the new document and record the conflict as an error. This is the default.
 * "replace": Replace the old document in its entirety with the new one.
 * "update": Update fields of the old document with fields from the new one.
 */
		conflict?: string;
	}

	interface ChangesOptions {
		/**
 * The squash optional argument controls how changes batches change notifications:
 *
 * true: When multiple changes to the same document occur before a batch of notifications is sent, the changes are “squashed” into one change. The client receives a notification that will bring it fully up to date with the server. This is the default.
 *
 * false: All changes will be sent to the client verbatim.
 *
 * n: A numeric value (floating point). Similar to true, but the server will wait n seconds to respond in order to squash as many changes together as possible, reducing network traffic.
 */
		squash?: boolean | number;
		/**
 * If the includeStates optional argument is true, the changefeed stream will include special status documents consisting of the field state and a string indicating a change in the feed’s state.
 *
 * Point changefeeds will always return initial values and have an initializing state; feeds that return changes on unfiltered tables will never return initial values.
 *
 * Feeds that return changes on more complex queries may or may not return return initial values, depending on the kind of aggregation. Read the article on Changefeeds in RethinkDB for a more detailed discussion.
 *
 * If includeStates is true on a changefeed that does not return initial values, the first document on the feed will be {state: 'ready'}.
 *
 * If includeStates is false (the default), the status documents will not be sent on the feed.
 */
		includeStates?: boolean;
	}

	interface ChangeResult {
		/**
 * There are currently two states:
 *
 * {state: 'initializing'} indicates the following documents represent initial values on the feed rather than changes. This will be the first document of a feed that returns initial values.
 *
 * {state: 'ready'} indicates the following documents represent changes. This will be the first document of a feed that does not return initial values; otherwise, it will indicate the initial values have all been sent.
 */
		state?: string;
		/**
 * document before change
 */
		old_val: any;
		/**
 * document after change
 */
		new_val: any;
	}

	interface rChanges {
		/**
 * Return an infinite stream of objects representing changes to a query.
 *
 * Changefeed notifications take the form of a two-field object: ChangeResult
 *
 * The first notification object in the changefeed stream will contain the query’s initial value in new_val and have no old_val field. When a document is deleted, new_val will be null; when a document is inserted, old_val will be null.
 *
 * Certain document transformation commands can be chained before changefeeds. For more information, read the discussion of changefeeds in the “Query language” documentation.
 *
 * The server will buffer up to 100,000 elements. If the buffer limit is hit, early changes will be discarded, and the client will receive an object of the form {error: "Changefeed cache over array size limit, skipped X elements."} where X is the number of elements skipped.
 *
 * Commands that operate on streams (such as filter or map) can usually be chained after changes. However, since the stream produced by changes has no ending, commands that need to consume the entire stream before returning (such as reduce or count) cannot.
 *
 * It’s a good idea to open changefeeds on their own connection. If you don’t, other queries run on the same connection will experience unpredictable latency spikes while the connection blocks on more changes.
 *
 * If the table becomes unavailable, the changefeed will be disconnected, and a runtime exception will be thrown by the driver.
 */
		changes(options?: ChangesOptions): Selection;
	}

	interface Stream extends Sequence, rChanges, rFilter<Stream>, rStreamArray<Stream>, rSlice<Stream>, rUninion<Stream>, rSample<rdbArray> {
	}

	interface rFilter<T> {
		/**
 * Get all the documents for which the given predicate is true.
 *
 * Return all the elements in a sequence for which the given predicate is true. The return value of filter will be the same as the input (sequence, stream, or array). Documents can be filtered in a variety of ways—ranges, nested values, boolean conditions, and the results of anonymous functions.
 *
 * By default, filter will silently skip documents with missing fields: if the predicate tries to access a field that doesn’t exist (for instance, the predicate {age: 30} applied to a document with no age field), that document will not be returned in the result set, and no error will be generated. This behavior can be changed with the default optional argument.
 */
		filter(predicate: ExpressionFunction<boolean>, options?: DefaultOptions): T;
		/**
 * Get all the documents for which the given predicate is true.
 *
 * Return all the elements in a sequence for which the given predicate is true. The return value of filter will be the same as the input (sequence, stream, or array). Documents can be filtered in a variety of ways—ranges, nested values, boolean conditions, and the results of anonymous functions.
 *
 * By default, filter will silently skip documents with missing fields: if the predicate tries to access a field that doesn’t exist (for instance, the predicate {age: 30} applied to a document with no age field), that document will not be returned in the result set, and no error will be generated. This behavior can be changed with the default optional argument.
 */
		filter(predicate: Expression<boolean>, options?: DefaultOptions): T;
		/**
 * Get all the documents for which the given predicate is true.
 *
 * Return all the elements in a sequence for which the given predicate is true. The return value of filter will be the same as the input (sequence, stream, or array). Documents can be filtered in a variety of ways—ranges, nested values, boolean conditions, and the results of anonymous functions.
 *
 * By default, filter will silently skip documents with missing fields: if the predicate tries to access a field that doesn’t exist (for instance, the predicate {age: 30} applied to a document with no age field), that document will not be returned in the result set, and no error will be generated. This behavior can be changed with the default optional argument.
 */
		filter(predicate: { [key: string]: any }): T;
	}

	interface rBinary extends rSlice<rBinary>, rCoerceTo<string> {
		count(): number;
		typeOf(): any;
		info(): any;
	}

	interface rCoerceTo<T> {
		/**
 * Convert a value of one type into another.
 */
		coerceTo(value: T): Expression<T>;
	}

	interface rdbArray extends Sequence, rStreamArray<rdbArray>, rNext, rEach, rToArray, rFilter<rdbArray>, rInnerJoin<rdbArray>, rSlice<rdbArray>, rUninion<rdbArray>, rSample<rdbArray>, rPluck<rdbArray>, rWithout<rdbArray>, rMerge<rdbArray>, rHasFields<rdbArray>, rCoerceTo<rObject> {
		/**
 * Append a value to an array.
 */
		append(prop: string): Expression<rdbArray>;

		/**
 * Prepend a value to an array.
 */
		prepend(prop: string): Expression<rdbArray>;

		/**
 * Remove the elements of one array from another array.
 */
		difference(arr: string[]): Expression<rdbArray>;

		/**
 * Add a value to an array and return it as a set (an array with distinct values).
 */
		setInsert(prop: string): Expression<rdbArray>;

		/**
 * Add a several values to an array and return it as a set (an array with distinct values).
 */
		setUnion(arr: string[]): Expression<rdbArray>;

		/**
 * Intersect two arrays returning values that occur in both of them as a set (an array with distinct values).
 */
		setIntersection(arr: string[]): Expression<rdbArray>;

		/**
 * Remove the elements of one array from another and return them as a set (an array with distinct values).
 */
		setDifference(arr: string[]): Expression<rdbArray>;

		/**
 * Insert a value in to an array at a given index. Returns the modified array.
 */
		insertAt(index: number, value: string): rdbArray;

		/**
 * Insert several values in to an array at a given index. Returns the modified array.
 */
		spliceAt(index: number, value: string): rdbArray;

		/**
 * Remove one or more elements from an array at a given index. Returns the modified array.
 */
		deleteAt(index: number, endIndex?: number): rdbArray;

		/**
 * Remove one or more elements from an array at a given index. Returns the modified array.
 */
		changeAt(index: number, value: string): rdbArray;
		
		/**
 * Get the nth element of a sequence, counting from zero. If the argument is negative, count from the last element.
 */
		(index: number): Expression<any>;
	}

	interface rSingleField<T> {
		/**
 * Get a single field from an object. If called on a sequence, gets that field from every object in the sequence, skipping objects that lack it.
 */
		(prop: string): Expression<T>;
	}

	interface rGetField<T> {
		/**
 * Get a single field from an object. If called on a sequence, gets that field from every object in the sequence, skipping objects that lack it.
 */
		getField(attr: string): T;
	}

	interface rNext {
		/**
 * Get the next element in the cursor.
 *
 * Calling next the first time on a cursor provides the first element of the cursor. If the data set is exhausted (e.g., you have retrieved all the documents in a table), a RqlDriverError error will be passed to the callback when next is called.
 *
 * Note: The canonical way to retrieve all the results is to use each or toArray. The next command should be used only when you may not retrieve all the elements of a cursor or want to delay some operations.
 */
		next(callback: (err: Error, row: any) => void): void;
		/**
 * Get the next element in the cursor.
 *
 * Calling next the first time on a cursor provides the first element of the cursor. If the data set is exhausted (e.g., you have retrieved all the documents in a table), a RqlDriverError error will be passed to the callback when next is called.
 *
 * Note: The canonical way to retrieve all the results is to use each or toArray. The next command should be used only when you may not retrieve all the elements of a cursor or want to delay some operations.
 */
		next(): Promise<any>;
	}

	interface rToArray {
		/**
	* Retrieve all results and pass them as an array to the given callback.
	*
	* Note: Because a feed is a cursor that never terminates, calling toArray on a feed will throw an error. See the changes command for more information on feeds.
	*/
		toArray(callback: (err: Error, rows: any[]) => void): void;
		/**
 * Retrieve all results and pass them as an array to the given callback.
 *
 * Note: Because a feed is a cursor that never terminates, calling toArray on a feed will throw an error. See the changes command for more information on feeds.
 */
		toArray(): Promise<any>;
	}

	interface rFeed extends rEach {

	}

	interface rEach {
		/**
 * Lazily iterate over the result set one element at a time. The second callback is optional and is called when the iteration stops (when there are no more rows or when the callback returns false).
 */
		each(callback: (err: Error, row: any) => void, onFinishedCallback?: (err: Error, results: any) => void): void;
	}

	interface Operation<T> {
		/**
 * Run a query on a connection. The callback will get either an error, a single JSON result, or a cursor, depending on the query.
 */
		run(conn: Connection, options: RunOptions, callback: (err: Error, result: T) => void): void;
		/**
 * Run a query on a connection. The callback will get either an error, a single JSON result, or a cursor, depending on the query.
 */
		run(conn: Connection, callback: (err: Error, result: T) => void): void;
		/**
 * Run a query on a connection. The promise will resolve with either a single JSON result or a cursor, depending on the query.
 */
		run(conn: Connection, options?: RunOptions): Promise<T>;
	}

	interface RqlDriverError extends Error { }

	interface RqlServerError extends Error { }

	interface RqlRuntimeError extends RqlServerError { }

	interface RqlCompileError extends RqlServerError { }

	interface RqlClientError extends RqlServerError { }

	interface RqlDo {
		/**
 * Call an anonymous function using return values from other ReQL commands or queries as arguments.
 * 
 * The last argument to do (or, in some forms, the only argument) is an expression or an anonymous function which receives values from either the previous arguments or from prefixed commands chained before do. The do command is essentially a single-element map, letting you map a function over just one document. This allows you to bind a query result to a local variable within the scope of do, letting you compute the result just once and reuse it in a complex expression or in a series of ReQL commands.
 * 
 * Arguments passed to the do function must be basic data types, and cannot be streams or selections. (Read about ReQL data types.) While the arguments will all be evaluated before the function is executed, they may be evaluated in any order, so their values should not be dependent on one another. The type of do’s result is the type of the value returned from the function or last expression.
 */
		do(expr: ExpressionFunction<any>): Operation<any>;
		
		/**
 * Call an anonymous function using return values from other ReQL commands or queries as arguments.
 * 
 * The last argument to do (or, in some forms, the only argument) is an expression or an anonymous function which receives values from either the previous arguments or from prefixed commands chained before do. The do command is essentially a single-element map, letting you map a function over just one document. This allows you to bind a query result to a local variable within the scope of do, letting you compute the result just once and reuse it in a complex expression or in a series of ReQL commands.
 * 
 * Arguments passed to the do function must be basic data types, and cannot be streams or selections. (Read about ReQL data types.) While the arguments will all be evaluated before the function is executed, they may be evaluated in any order, so their values should not be dependent on one another. The type of do’s result is the type of the value returned from the function or last expression.
 */
		do(args: any[], expr: ExpressionFunction<any>): Operation<any>;
	}

	interface noReplyWaitOptions {
		/**
 * Waiting for noreply writes to finish (default true).
 */
		noreplyWait: boolean;
	}

	interface OverwriteOptions {
		overwrite: boolean;
	}

	interface DefaultOptions {
		/**
 * If default is set to true, documents with missing fields will be returned rather than skipped.
 *
 * If default is set to r.error(), an RqlRuntimeError will be thrown when a document with a missing field is tested.
 *
 * If default is set to false (the default), documents with missing fields will be skipped.
 */
		default: any;
	}



	interface IndexOptions extends LeftRightBound {
		index?: string;
	}

	interface LeftRightBound {
		/**
 * Either "open" or "closed", indicates whether or not to include that endpoint of the range (default is closed).
 */
		leftBound?: string;
		/**
 * Either "open" or "closed", indicates whether or not to include that endpoint of the range (default is open).
 */
		rightBound?: string;
	}

	interface Aggregator { }
	interface Sort { }

	interface Time { }

	interface Writeable {
		/**
 * Update JSON documents in a table. Accepts a JSON document, a ReQL expression, or a combination of the two.
 */
		update(object: Object | Function, options?: UpdateOptions): Operation<ModifyResult>;
		/**
 * Replace documents in a table. Accepts a JSON document or a ReQL expression, and replaces the original document with the new one. The new document must have the same primary key as the original document.
 */
		replace(obj: Object, options?: UpdateOptions): Operation<ModifyResult>;
		/**
 * Replace documents in a table. Accepts a JSON document or a ReQL expression, and replaces the original document with the new one. The new document must have the same primary key as the original document.
 */
		replace(expr: ExpressionFunction<any>, options?: UpdateOptions): Operation<ModifyResult>;

		/**
 * Delete one or more documents from a table.
 */
		delete(options?: DeleteOptions): Operation<ModifyResult>;
	}

	interface DeleteOptions {
		/**
 * possible values are hard and soft. This option will override the table or query’s durability setting (set in run).
	In soft durability mode RethinkDB will acknowledge the write immediately after receiving it, but before the write has been committed to disk.
 */
		durability?: string;
		/**
 * if set to true, return a changes array consisting of old_val/new_val objects describing the changes made.
 */
		returnChanges?: boolean;
	}

	interface IndexNameOptions {
		index: string;
	}

	interface Sequence extends rInnerJoin<Stream>, rSample<Selection>, rPluck<Stream>, rWithout<Stream>, rMerge<Stream>, rGetField<Sequence>, rHasFields<Stream>, rNth<Sequence>, rSingleField<Sequence>, rCoerceTo<rdbArray> {
		/**
 * Join tables using a field on the left-hand sequence matching primary keys or secondary indexes on the right-hand table. eqJoin is more efficient than other ReQL join types, and operates much faster. Documents in the result set consist of pairs of left-hand and right-hand documents, matched when the field on the left-hand side exists and is non-null and an entry with that field’s value exists in the specified index on the right-hand side.
 */
		eqJoin(leftField: string, rightTable: Selection, index?: IndexNameOptions): JoinResult;

		/**
	* Sort the sequence by document values of the given key(s). To specify the ordering, wrap the attribute with either r.asc or r.desc (defaults to ascending).
	
	Sorting without an index requires the server to hold the sequence in memory, and is limited to 100,000 documents (or the setting of the arrayLimit option for run). Sorting with an index can be done on arbitrarily large tables, or after a between command using the same index.
	*
	*  syntax: table.orderBy([key1...], {index: index_name}) → selection<stream>
		*/
		orderBy(...keys: any[]): rdbArray;

		/**
 * Get the nth element of a sequence, counting from zero. If the argument is negative, count from the last element.
 */
		nth(n: number): Expression<any>;

		/**
 * Get the indexes of an element in a sequence. If the argument is a predicate, get the indexes of all elements matching it.
 */
		offsetsOf(expr: string | Function): rdbArray;

		/**
 * Test if a sequence is empty.
 */
		isEmpty(): Expression<boolean>;

		/**
 * Takes a stream and partitions it into multiple groups based on the fields or functions provided.
 *
 * With the multi flag single documents can be assigned to multiple groups, similar to the behavior of multi-indexes. When multi is true and the grouping value is an array, documents will be placed in each group that corresponds to the elements of the array. If the array is empty the row will be ignored.
 *
 * Examples:
 * r.table('games').group('player').run(conn, callback)
 * r.table('games').group('player', 'type').max('points')('points').run(conn, callback)
 */
		group(...fields: any[]): GroupedStream;

		/**
 * Takes a stream and partitions it into multiple groups based on the fields or functions provided.
 *
 * With the multi flag single documents can be assigned to multiple groups, similar to the behavior of multi-indexes. When multi is true and the grouping value is an array, documents will be placed in each group that corresponds to the elements of the array. If the array is empty the row will be ignored.
 *
 * Examples:
 * r.table('games').group(function(game) {
 * return game.pluck('player', 'type')
 * }).max('points')('points').run(conn, callback)
 *
 * r.table('matches').group(
	  [r.row('date').year(), r.row('date').month()]
	).count().run(conn, callback)
 */
		group(expression: Function, options?: GroupOptions): GroupedStream;

		/**
 * Produce a single value from a sequence through repeated application of a reduction function. The reduction function can be called on:
 * * two elements of the sequence
 * * one element of the sequence and one result of a previous reduction
 * * two results of previous reductions
 * The reduction function can be called on the results of two previous reductions because the reduce command is distributed and parallelized across shards and CPU cores. A common mistaken when using the reduce command is to suppose that the reduction is executed from left to right. Read the map-reduce in RethinkDB article to see an example.
 * If the sequence is empty, the server will produce a RqlRuntimeError that can be caught with default.
	If the sequence has only one element, the first element will be returned.
 */
		reduce(r: ReduceFunction<any>): Expression<any>;

		/**
 * Count the number of elements in the sequence. With a single argument, count the number of elements equal to it. If the argument is a function, it is equivalent to calling filter before count.
 */
		count(): Expression<number>;

		/**
 * Sums all the elements of a sequence. If called with a field name, sums all the values of that field in the sequence, skipping elements of the sequence that lack that field. If called with a function, calls that function on every element of the sequence and sums the results, skipping elements of the sequence where that function returns null or a non-existence error.
 */
		sum(arr: number[]): Expression<number>;
		/**
 * Sums all the elements of a sequence. If called with a field name, sums all the values of that field in the sequence, skipping elements of the sequence that lack that field. If called with a function, calls that function on every element of the sequence and sums the results, skipping elements of the sequence where that function returns null or a non-existence error.
 */
		sum(field: string): Expression<number>;
		/**
 * Sums all the elements of a sequence. If called with a field name, sums all the values of that field in the sequence, skipping elements of the sequence that lack that field. If called with a function, calls that function on every element of the sequence and sums the results, skipping elements of the sequence where that function returns null or a non-existence error.
 */
		sum(expr: Function): Expression<number>;

		/**
 * Averages all the elements of a sequence. If called with a field name, averages all the values of that field in the sequence, skipping elements of the sequence that lack that field. If called with a function, calls that function on every element of the sequence and averages the results, skipping elements of the sequence where that function returns null or a non-existence error.
 *
 * Produces a non-existence error when called on an empty sequence. You can handle this case with default.
 */
		avg(arr: number[]): Expression<number>;
		/**
 * Averages all the elements of a sequence. If called with a field name, averages all the values of that field in the sequence, skipping elements of the sequence that lack that field. If called with a function, calls that function on every element of the sequence and averages the results, skipping elements of the sequence where that function returns null or a non-existence error.
 *
 * Produces a non-existence error when called on an empty sequence. You can handle this case with default.
 */
		avg(field: string): Expression<number>;
		/**
 * Averages all the elements of a sequence. If called with a field name, averages all the values of that field in the sequence, skipping elements of the sequence that lack that field. If called with a function, calls that function on every element of the sequence and averages the results, skipping elements of the sequence where that function returns null or a non-existence error.
 *
 * Produces a non-existence error when called on an empty sequence. You can handle this case with default.
 */
		avg(expr: Function): Expression<number>;

		/**
 * Finds the minimum element of a sequence. The min command can be called with:
 * * a field name, to return the element of the sequence with the smallest value in that field;
 * * an index (the primary key or a secondary index), to return the element of the sequence with the smallest value in that index;
 * * a function, to apply the function to every element within the sequence and return the element which returns the smallest value from the function, ignoring any elements where the function produces a non-existence error.
	For more information on RethinkDB’s sorting order, read the section in ReQL data types.
	*
	* Calling min on an empty sequence will throw a non-existence error; this can be handled using the default command.
 */
		min(field?: string): Expression<any>;
		/**
 * Finds the minimum element of a sequence. The min command can be called with:
 * * a field name, to return the element of the sequence with the smallest value in that field;
 * * an index (the primary key or a secondary index), to return the element of the sequence with the smallest value in that index;
 * * a function, to apply the function to every element within the sequence and return the element which returns the smallest value from the function, ignoring any elements where the function produces a non-existence error.
	For more information on RethinkDB’s sorting order, read the section in ReQL data types.
	*
	* Calling min on an empty sequence will throw a non-existence error; this can be handled using the default command.
 */
		min(options: MinMaxIndexOptions): Expression<any>;
		/**
 * Finds the minimum element of a sequence. The min command can be called with:
 * * a field name, to return the element of the sequence with the smallest value in that field;
 * * an index (the primary key or a secondary index), to return the element of the sequence with the smallest value in that index;
 * * a function, to apply the function to every element within the sequence and return the element which returns the smallest value from the function, ignoring any elements where the function produces a non-existence error.
	For more information on RethinkDB’s sorting order, read the section in ReQL data types.
	*
	* Calling min on an empty sequence will throw a non-existence error; this can be handled using the default command.
 */
		min(expr: Function): Expression<any>;

		/**
 * Finds the maximum element of a sequence.
 */
		max(field?: string): Expression<any>;
		/**
 * Finds the maximum element of a sequence.
 */
		max(options: MinMaxIndexOptions): Expression<any>;
		/**
 * Finds the maximum element of a sequence.
 */
		max(expr: Function): Expression<any>;

		/**
 * Removes duplicates from elements in a sequence.
 */
		distinct(): rdbArray;

		/**
 * When called with values, returns true if a sequence contains all the specified values. When called with predicate functions, returns true if for each predicate there exists at least one element of the stream where that predicate returns true.
 *
 * Values and predicates may be mixed freely in the argument list.
 */
		contains(prop: string): Expression<boolean>;

		/**
 * When called with values, returns true if a sequence contains all the specified values. When called with predicate functions, returns true if for each predicate there exists at least one element of the stream where that predicate returns true.
 *
 * Values and predicates may be mixed freely in the argument list.
 */
		contains(expr: Function): Expression<boolean>;
		
		/**
 * Loop over a sequence, evaluating the given write query for each element.
 */
		forEach(write_query: Function): Expression<any>;
	}

	interface MinMaxIndexOptions {
		index: string;
	}

	interface GroupedStream {
		/**
 * Takes a grouped stream or grouped data and turns it into an array of objects representing the groups. Any commands chained after ungroup will operate on this array, rather than operating on each group individually. This is useful if you want to e.g. order the groups by the value of their reduction.
 *
 * The format of the array returned by ungroup is the same as the default native format of grouped data in the javascript driver and data explorer.
 *
 * Examples:
 * r.table('games')
	.group('player').max('points')('points')
	.ungroup().orderBy(r.desc('reduction')).run(conn, callback)
 */
		ungroup(): rdbArray;
	}

	interface GroupOptions {
		index?: string;
		multi?: boolean;
	}

	interface rSample<T> {

		/**
 * Select a given number of elements from a sequence with uniform random distribution. Selection is done without replacement.
 */
		sample(n: number): Selection;
	}

	interface rUninion<T> {
		/**
 * Concatenate two or more sequences.
 */
		union(...sequence: Sequence[]): T;
	}

	interface rStreamArray<T> {
		/**
 * Used to ‘zip’ up the result of a join by merging the ‘right’ fields into ‘left’ fields of each member of the sequence.
 */
		zip(): T;
		/**
 * Concatenate one or more elements into a single sequence using a mapping function.
 */
		concatMap(transform: ExpressionFunction<any>): T;
	}

	interface rInnerJoin<T> {
		/**
 * Returns an inner join of two sequences.
 */
		innerJoin(otherSequence: Sequence, predicate: JoinFunction<boolean>): T;
		/**
 * Returns a left outer join of two sequences.
 */
		outerJoin(otherSequence: Sequence, predicate: JoinFunction<boolean>): T;
		/**
 * Transform each element of one or more sequences by applying a mapping function to them. If map is run with two or more sequences, it will iterate for as many items as there are in the shortest sequence.
 *
 * sequence1.map([sequence2, ...], mappingFunction) → stream
 */
		map(transform: ExpressionFunction<any>): T;
		/**
 * Transform each element of one or more sequences by applying a mapping function to them. If map is run with two or more sequences, it will iterate 		for as many items as there are in the shortest sequence.
 *
 * sequence1.map([sequence2, ...], mappingFunction) → stream
 */
		map(...transform: any[]): T;

		/**
 * Plucks one or more attributes from a sequence of objects, filtering out any objects in the sequence that do not have the specified fields. Functionally, this is identical to hasFields followed by pluck on a sequence.
 */
		withFields(...selectors: any[]): T;

		/**
 * Skip a number of elements from the head of the sequence.
 */
		skip(n: number): T;

		/**
 * End the sequence after the given number of elements
 */
		limit(n: number): Selection;
	}

	interface rObject extends rPluck<rObject>, rWithout<rObject>, rMerge<rObject>, rGetField<any>, rHasFields<Boolean>, rKeys, rSingleField<any>, rCoerceTo<rdbArray> {

	}

	interface rHasFields<T> {
		/**
 * Test if an object has one or more fields. An object has a field if it has that key and the key has a non-null value. For instance, the object {'a': 1,'b': 2,'c': null} has the fields a and b.
 */
		hasFields(...fields: string[]): T;
	}

	interface rPluck<T> {
		/**
 * Plucks out one or more attributes from either an object or a sequence of objects (projection).
 */
		pluck(...props: string[]): T;
		/**
 * Plucks out one or more attributes from either an object or a sequence of objects (projection).
 */
		pluck(selector: rObject): T;
	}

	interface rWithout<T> {
		/**
 * The opposite of pluck; takes an object or a sequence of objects, and returns them with the specified paths removed.
 */
		without(...props: string[]): T;
		/**
 * The opposite of pluck; takes an object or a sequence of objects, and returns them with the specified paths removed.
 */
		without(selector: rObject): T;
	}

	interface rSlice<T> {
		/**
 * Return the elements of a sequence within the specified range.
 */
		slice(start: number, end?: number): T;
		/**
 * Return the elements of a sequence within the specified range.
 */
		slice(start: number, end: number, options?: LeftRightBound): T;
		/**
 * Return the elements of a sequence within the specified range.
 */
		slice(start: number, options?: LeftRightBound): T;
	}

	interface JoinResult {
		left: any;
		right: any;
	}

	interface rOrderBy<T> {
		/**
 * Sort the sequence by document values of the given key(s). To specify the ordering, wrap the attribute with either r.asc or r.desc (defaults to ascending).
	
	Sorting without an index requires the server to hold the sequence in memory, and is limited to 100,000 documents (or the setting of the arrayLimit option for run). Sorting with an index can be done on arbitrarily large tables, or after a between command using the same index.
 */
		orderBy(...keys: string[]): T;
		orderBy(...sorts: Sort[]): T;
	}

	interface rNth<T> {
		/**
 * Get the nth element of a sequence, counting from zero. If the argument is negative, count from the last element.
 */
		nth(n: number): T;
	}

	interface Selection extends Sequence, Operation<Cursor>, Writeable, RqlDo, rChanges, rFilter<Selection>, rSlice<Selection>, rNth<Selection> {
		/**
 * Get a single field from an object. If called on a sequence, gets that field from every object in the sequence, skipping objects that lack it.
 */
		constructor(attr?: string);

		/**
	* Sort the sequence by document values of the given key(s). To specify the ordering, wrap the attribute with either r.asc or r.desc (defaults to ascending).
	
	Sorting without an index requires the server to hold the sequence in memory, and is limited to 100,000 documents (or the setting of the arrayLimit option for run). Sorting with an index can be done on arbitrarily large tables, or after a between command using the same index.
	* s
	*  syntax: table.orderBy([key1...], {index: index_name}) → selection<stream>
	*/
		orderBy(...keys: any[]): rSelection<rdbArray>;


		indexesOf(obj: any): Selection;


		groupedMapReduce(group: ExpressionFunction<any>, map: ExpressionFunction<any>, reduce: ReduceFunction<any>, base?: any): Selection;
		groupBy(...aggregators: Aggregator[]): Expression<rObject>; // TODO: reduction object




	}

	interface ExpressionFunction<U> {
		(doc: Expression<any>): Expression<U>;
	}

	interface JoinFunction<U> {
		(left: Expression<any>, right: Expression<any>): Expression<U>;
	}

	interface ReduceFunction<U> {
		(left: Expression<any>, right: Expression<any>): Expression<U>;
	}

	interface rMerge<T> {
		/**
 * Merge two or more objects together to construct a new object with properties from all. When there is a conflict between field names, preference is given to fields in the rightmost object in the argument list. merge also accepts a subquery function that returns an object, which will be used similarly to a map function.
 */
		merge(query: Expression<rObject>): Expression<rObject>;
	}

	interface MatchResult {
		/**
 * The matched string
 */
		str: string,
		/**
 * The matched string’s start
 */
		start: number;
		/**
 * The matched string’s end
 */
		end: number;
		/**
 * The capture groups defined with parentheses
 */
		groups: MatchResult[];
	}



	interface Expression<T> extends Writeable, Operation<T>, RqlDo, rSingleField<Expression<any>>, rCoerceTo<string> {
		/**
 * Matches against a regular expression. 
 * 
 * If no match is found, returns null.
 * 
 * Accepts RE2 syntax (https://code.google.com/p/re2/wiki/Syntax). You can enable case-insensitive matching by prefixing the regular expression with (?i). See the linked RE2 documentation for more flags.
 */
		match(regexp: string): Expression<MatchResult | any>;
		
		/**
 * Splits a string into substrings. Splits on whitespace when called with no arguments. When called with a separator, splits on that separator. When called with a separator and a maximum number of splits, splits on that separator at most max_splits times. (Can be called with null as the separator if you want to split on whitespace while still specifying max_splits.)
 * 
 * Mimics the behavior of Python’s string.split in edge cases, except for splitting on the empty string, which instead produces an array of single-character strings.
 */
		split(seperator?: string, max_splits?: number): Expression<rdbArray>;
		
		/**
 * Uppercases a string.
 */
		upcase(): Expression<string>;
		
		/**
 * Lowercases a string.
 */
		downcase(): Expression<string>;
		
		/**
 * Sum two numbers, concatenate two strings, or concatenate 2 arrays.
 */
		add(n: any): Expression<any>;
		/**
 * Subtract two numbers.
 */
		sub(n: any): Expression<any>;
		/**
 * Multiply two numbers, or make a periodic array.
 */
		mul(n: number): Expression<any>;
		/**
 * Divide two numbers.
 */
		div(n: number): Expression<number>;
		/**
 * Find the remainder when dividing two numbers.
 */
		mod(n: number): Expression<number>;
		
		/**
 * Compute the logical “and” of two or more values.
 */
		and(b: boolean): Expression<boolean>;
		/**
 * Compute the logical “or” of two or more values.
 */
		or(b: boolean): Expression<boolean>;
		/**
 * Test if two values are equal.
 */
		eq(v: any): Expression<boolean>;
		/**
 * Test if two values are not equal.
 */
		ne(v: any): Expression<boolean>;
		
		/**
 * Test if the first value is greater than other.
 */
		gt(value: T): Expression<boolean>;
		/**
 * Test if the first value is greater than or equal to other.
 */
		ge(value: T): Expression<boolean>;
		/**
 * Test if the first value is less than other.
 */
		lt(value: T): Expression<boolean>;
		
		/**
 * Test if the first value is less than or equal to other.
 */
		le(value: T): Expression<boolean>;
		
		/**
 * Compute the logical inverse (not) of an expression.
	
	not can be called either via method chaining, immediately after an expression that evaluates as a boolean value, or by passing the expression as a parameter to not.
 */
		not(bool?: boolean): Expression<boolean>;


		/**
 * Handle non-existence errors. Tries to evaluate and return its first argument. If an error related to the absence of a value is thrown in the process, or if its first argument returns null, returns its second argument. (Alternatively, the second argument may be a function which will be called with either the text of the non-existence error or null.)
 */
		default(default_value: T): Expression<T>;
		
		/**
 * Gets the type of a value.
 */
		typeOf(): Expression<string>;
		
		/**
 * Get information about a ReQL value.
 */
		info(): Expression<Object>;
	}
}
