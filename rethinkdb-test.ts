/// <reference path="rethinkdb.d.ts" />

// Test code for the rethinkdb.d.ts typescript metadata file
// Includes all the runtime examples from the rethinkdb javascript documentation

// http://rethinkdb.com/api/javascript/r/
let r: rethinkdb.r = require('rethinkdb');
let conn: rethinkdb.Connection;
let callback: Function;
var p: Promise<any>;
let cursor: rethinkdb.Cursor;

// http://rethinkdb.com/api/javascript/connect/
conn = r.connect({ db: 'marvel' },
	function(err, conn) {
	});

r.connect({ host: 'localhost',
            port: 28015,
            db: 'marvel',
            authKey: 'hunter2' },
	function(err, conn) {  })

p = r.connect({host:'localhost', port:28015, db:'marvel', authKey:'hunter2'});
p.then(function(conn) {
    // ...
}).error(function(error) {
    // ...
	})

// http://rethinkdb.com/api/javascript/close/
conn.close(function(err) { if (err) throw err; })

p = conn.close();
p.then(function() {
    // `conn` is now closed
}).error(function(err) {
    // process the error
	})

// http://rethinkdb.com/api/javascript/reconnect/
conn.reconnect({ noreplyWait: false }, function(error, connection) { })

conn.reconnect({noreplyWait: false}).then(function(conn) {
    // the outstanding queries were canceled and conn is now available again
}).error(function(errror) {
    // process the error
	})

// http://rethinkdb.com/api/javascript/use/
conn.use('marvel')
r.table('heroes').run(conn, callback);

// http://rethinkdb.com/api/javascript/run/
r.table('marvel').run(conn, function(err, cursor) {
    cursor.each(console.log);
})
r.table('marvel').run(conn, function(err, cursor) {
    if (err) {
        // process error
    }
    else {
        cursor.toArray(function(err, results) {
            if (err) {
                // process error
            }
            else {
                // process the results
            }
        })
    }
})
r.table('marvel').run(conn).then(function(cursor) {
    return cursor.toArray()
}).then(function(results) {
    // process the results
}).error(function(err) {
    // process error
	})
r.table('marvel').run(conn, {useOutdated: true}, function (err, cursor) {

});
r.table('marvel').run(conn, {noreply: true}, function (err, cursor) {

});
r.table('marvel')
    .insert({ superhero: 'Iron Man', superpower: 'Arc Reactor' })
    .run(conn, {noreply: true, durability: 'soft'}, function (err, cursor) {

    });


r.now().run(conn, {timeFormat: "raw"}, function (err, result) {

});

r.table('marvel').run(conn, {db: 'heroes'}).then(function(cursor) {
    return cursor.toArray()
}).then(function(results) {
    // process the results
}).error(function(err) {
    // process error
	})

r.db('heroes').table('marvel').run(conn, callback);

r.table('marvel').run(conn, {
    maxBatchRows: 16,
    maxBatchBytes: 2048
}, (err, cursor) => {

});

// http://rethinkdb.com/api/javascript/noreply_wait/
conn.noreplyWait(function(err) {  })

conn.noreplyWait().then(function() {
    // all queries have been processed
}).error(function(err) {
    // process error
	})

// http://rethinkdb.com/api/javascript/next/

var processRow: Function;
var query: rethinkdb.Cursor;
var checkRow: Function;

cursor.next(function(err, row) {
    if (err) throw err;
    processRow(row);
});

query.run( conn, function(err, cursor) {
    if (err) throw err;

    var fetchNext = function(err, result) {
        if (err) {
            if (((err.name === "RqlDriverError") && err.message === "No more rows in the cursor.")) {
                console.log("No more data to process")
                // If you use one connection per query, the connection should be closed here.
                // conn.close()
            }
            else {
                throw err;
            }
        }
        else {
            processRow(result);
            cursor.next(fetchNext);
        }
    }
    cursor.next(fetchNext);
})

query.run( conn, function(err, cursor) {
    if (err) throw err;

    var fetchNext = function(err, result) {
        if (err) {
            if (((err.name === "RqlDriverError") && err.message === "No more rows in the cursor.")) {
                console.log("No more data to process")
                // If you use one connection per query, the connection should be closed here.
                // conn.close()
            }
            else {
                throw err;
            }
        }
        else {
            if (checkRow(result)) {
                cursor.next(fetchNext);
            }
            else {
                cursor.close()
                // If you use one connection per query, the connection should be closed here.
                // conn.close()
            }
        }
    }
    cursor.next(fetchNext);
})

query.run(conn).then(function(cursor) {
    var errorHandler = function(err) {
        if (((err.name === "RqlDriverError") && err.message === "No more rows in the cursor.")) {
            console.log("No more data to process")
            // If you use one connection per query, the connection should be closed here.
            // conn.close()
        }
        else {
            throw err;
        }
    }
    var fetchNext = function(result) {
        processRow(result);
        cursor.next().then(fetchNext).error(errorHandler);
    }

    cursor.next().then(fetchNext).error(errorHandler);
}).error(function(err) {
    throw err;
	});

// http://rethinkdb.com/api/javascript/each/
var doneProcessing: Function;

cursor.each(function(err, row) {
    if (err) throw err;
    processRow(row);
});

cursor.each(function(err, row) {
        if (err) throw err;
        processRow(row);
    }, function() {
        doneProcessing();
    }
	);

cursor.each(function(err, row) {
    if (err) throw err;

    if (row < 0) {
        cursor.close()
        return false;
    }
    else {
        processRow(row)
    }
});

// http://rethinkdb.com/api/javascript/to_array/
var processResults: Function;

cursor.toArray(function(err, results) {
    if (err) throw err;
    processResults(results);
});


var results = []
cursor.each(function(err, row) {
    if (err) throw err;
    results.push(row);
}, function(err, results) {
    if (err) throw err;
    processResults(results);
	});

cursor.toArray().then(function(results) {
    processResults(results);
}).error(console.log);

// http://rethinkdb.com/api/javascript/close-cursor/
cursor.close();

// http://rethinkdb.com/api/javascript/event_emitter-cursor/
var socket: any;

r.table("messages").orderBy({index: "date"}).run(conn, function(err, cursor) {
    if (err) {
        // Handle error
        return
    }

    cursor.on("error", function(error) {
        // Handle error
    })
    cursor.on("data", function(message) {
        socket.broadcast.emit("message", message)
    })
});

r.table("messages").orderBy({index: "date"}).run(conn, function(err, cursor) {
    if (err) {
        // Handle error
        return
    }

    cursor.each(function(error, message) {
        if(error) {
            // Handle error
        }
        socket.broadcast.emit("message", message)
    })
});

r.table("messages").changes().filter({old_val: null}).run(conn, function(err, feed) {
    if (err) {
        // Handle error
        return
    }

    feed.on("error", function(error) {
        // Handle error
    })
    feed.on("data", function(newMessage) {
        socket.broadcast.emit("message", newMessage)
    })
});

// http://rethinkdb.com/api/javascript/db_create/
r.dbCreate('superheroes').run(conn, callback);

// http://rethinkdb.com/api/javascript/db_drop/
r.dbDrop('superheroes').run(conn, callback);

// http://rethinkdb.com/api/javascript/db_list/
r.dbList().run(conn, callback);

// http://rethinkdb.com/api/javascript/table_create/
r.db('test').tableCreate('dc_universe').run(conn, callback);
r.db('test').tableCreate('dc_universe', { primaryKey: 'name' }).run(conn, callback);
r.db('test').tableCreate('dc_universe', { shards: 2, replicas: 3 }).run(conn, callback);

// http://rethinkdb.com/api/javascript/table_drop/
r.db('test').tableDrop('dc_universe').run(conn, callback);

// http://rethinkdb.com/api/javascript/table_list/
r.db('test').tableList().run(conn, callback);

// http://rethinkdb.com/api/javascript/index_create/
r.table('comments').indexCreate('postId').run(conn, callback);
r.table('places').indexCreate('location', { geo: true }).run(conn, callback);
r.table('comments').indexCreate('authorName', r.row("author")("name")).run(conn, callback);
r.table('comments').indexCreate('postAndDate', [r.row("postId"), r.row("date")]).run(conn, callback);
r.table('posts').indexCreate('authors', { multi: true }).run(conn, callback);
r.table('networks').indexCreate('towers', { multi: true, geo: true }).run(conn, callback);
r.table('posts').indexCreate('authors', function(doc) {
    return r.branch(
        doc.hasFields("updatedAt"),
        doc("updatedAt"),
        doc("createdAt")
    )
}).run(conn, callback);
r.table('posts').indexStatus('authors').nth(0)('function').run(conn, function (func) {
    r.table('newPosts').indexCreate('authors', func).run(conn, callback);
});
r.table('posts').indexStatus('oldIndex').nth(0).do(function(oldIndex) {
  return r.table('posts').indexCreate('newIndex', oldIndex("function")).do(function() {
    return r.table('posts').indexWait('newIndex').do(function() {
      return r.table('posts').indexRename('newIndex', 'oldIndex', {overwrite: true})
    })
  })
})

// http://rethinkdb.com/api/javascript/index_drop/
r.table('dc').indexDrop('code_name').run(conn, callback);

// http://rethinkdb.com/api/javascript/index_list/
r.table('marvel').indexList().run(conn, callback);

// http://rethinkdb.com/api/javascript/index_rename/
r.table('comments').indexRename('postId', 'messageId').run(conn, callback);

// http://rethinkdb.com/api/javascript/index_status/
r.table('test').indexStatus().run(conn, callback);
r.table('test').indexStatus('timestamp').run(conn, callback);
var func;
r.table('test').indexStatus('timestamp').run(conn, function (err, res) {
    func = res[0].function;
});

// http://rethinkdb.com/api/javascript/index_wait/
r.table('test').indexWait().run(conn, callback);
r.table('test').indexWait('timestamp').run(conn, callback);

// http://rethinkdb.com/api/javascript/changes/
r.table('games').changes().run(conn, function(err, cursor) {
  cursor.each(console.log);
});
r.table('games').insert({ id: 1 }).run(conn, callback);
r.table('games').get(1).update({ player1: 'Bob' }).run(conn, callback);
r.table('games').get(1).replace({ id: 1, player1: 'Bob', player2: 'Alice' }).run(conn, callback);
r.table('games').get(1).delete().run(conn, callback);
r.tableDrop('games').run(conn, callback);
r.table('test').changes().filter(
  r.row('new_val')('score').gt(r.row('old_val')('score'))
	).run(conn, callback);
r.table('test').changes().filter(r.row('new_val')('name').eq('Bob')).run(conn, callback);
r.table('test').changes().filter(r.row('old_val').eq(null)).run(conn, callback);
r.table('games').get(1).changes({ includeStates: true }).run(conn, callback);
r.table('games').orderBy({ index: r.desc('score') }).limit(10).run(conn, callback);

// http://rethinkdb.com/api/javascript/insert/
r.table("posts").insert({
    id: 1,
    title: "Lorem ipsum",
    content: "Dolor sit amet"
}).run(conn, callback);

r.table("posts").insert({
    title: "Lorem ipsum",
    content: "Dolor sit amet"
}).run(conn, callback);

r.table("posts").get("dd782b64-70a7-43e4-b65e-dd14ae61d947").run(conn, callback);

r.table("users").insert([
    {id: "william", email: "william@rethinkdb.com"},
    {id: "lara", email: "lara@rethinkdb.com"}
]).run(conn, callback);

r.table("users").insert(
    {id: "william", email: "william@rethinkdb.com"},
    {conflict: "replace"}
	).run(conn, callback);

r.table("postsBackup").insert(r.table("posts")).run(conn, callback);

r.table("posts").insert(
    {title: "Lorem ipsum", content: "Dolor sit amet"},
    {returnChanges: true}
	).run(conn, callback);

// http://rethinkdb.com/api/javascript/update/
r.table("posts").get(1).update({ status: "published" }).run(conn, callback);
r.table("posts").update({ status: "published" }).run(conn, callback);
r.table("posts").filter({ author: "William" }).update({ status: "published" }).run(conn, callback);
r.table("posts").get(1).update({
    views: r.row("views").add(1)
}).run(conn, callback);
r.table("posts").update({
    views: r.row("views").add(1).default(0)
}).run(conn, callback);
r.table("posts").get(1).update(function(post) {
    return r.branch(
        post("views").gt(100),
        {type: "hot"},
        {type: "normal"}
    )
}).run(conn, callback);
r.table("posts").get(1).update({
    numComments: r.table("comments").filter({idPost: 1}).count()
}, {
    nonAtomic: true
	}).run(conn, callback);
r.table("posts").get(1).update({
    num_comments: r.js("Math.floor(Math.random()*100)")
}, {
    nonAtomic: true
	}).run(conn, callback);

r.table("posts").get(1).update({ status: "published" }, { durability: "soft" }).run(conn, callback);
r.table("posts").get(1).update({
    views: r.row("views").add(1)
}, {
    returnChanges: true
	}).run(conn, callback);
r.table("users").get(10001).update(
    {contact: {phone: {cell: "408-555-4242"}}}
	).run(conn, callback);
var newNote = {
    date: r.now(),
    from: "Inigo Montoya",
    subject: "You killed my father"
};
r.table("users").get(10001).update(
    {notes: r.row("notes").append(newNote)}
	).run(conn, callback);
var icqNote = {
    date: r.now(),
    from: "Admin",
    subject: "Welcome to the future"
};
r.table("users").filter(
    r.row.hasFields({contact: {im: "icq"}})
).update(
    {notes: r.row("notes").append(icqNote)}
	).run(conn, callback);
r.table('users').get(10001).update(
    {contact: {im: r.literal({aim: "themoosemeister"})}}
).run(conn, callback);

// http://rethinkdb.com/api/javascript/replace/
r.table("posts").get(1).replace({
    id: 1,
    title: "Lorem ipsum",
    content: "Aleas jacta est",
    status: "draft"
}).run(conn, callback);

r.table("posts").replace(function(post) {
    return post.without("status")
}).run(conn, callback);

r.table("posts").replace(function(post) {
    return post.pluck("id", "title", "content")
}).run(conn, callback);

r.table("posts").get(1).replace({
    id: 1,
    title: "Lorem ipsum",
    content: "Aleas jacta est",
    status: "draft"
}, {
    durability: "soft"
	}).run(conn, callback);

r.table("posts").get(1).replace({
    id: 1,
    title: "Lorem ipsum",
    content: "Aleas jacta est",
    status: "published"
}, {
    returnChanges: true
	}).run(conn, callback);

// http://rethinkdb.com/api/javascript/delete/
r.table("comments").get("7eab9e63-73f1-4f33-8ce4-95cbea626f59").delete().run(conn, callback);
r.table("comments").delete().run(conn, callback);
r.table("comments").filter({ idPost: 3 }).delete().run(conn, callback);
r.table("comments").get("7eab9e63-73f1-4f33-8ce4-95cbea626f59").delete({ returnChanges: true }).run(conn, callback);
r.table("comments").delete({ durability: "soft" }).run(conn, callback);

// http://rethinkdb.com/api/javascript/sync/
r.table('marvel').sync().run(conn, callback);

// http://rethinkdb.com/api/javascript/db/
r.db('heroes').table('marvel').run(conn, callback);

// http://rethinkdb.com/api/javascript/table/
r.table('marvel').run(conn, callback);
r.db('heroes').table('marvel').run(conn, callback);
r.db('heroes').table('marvel', { useOutdated: true }).run(conn, callback);

// http://rethinkdb.com/api/javascript/get/
r.table('posts').get('a9849eef-7176-4411-935b-79a6e3c56a74').run(conn, callback);
r.table('heroes').get(3).merge(
    { powers: ['invisibility', 'speed'] }
	).run(conn, callback);
r.table('heroes').get(3).changes().run(conn, callback);

// http://rethinkdb.com/api/javascript/get_all/
r.table('marvel').getAll('man_of_steel', { index: 'code_name' }).run(conn, callback);
r.table('dc').getAll('superman').run(conn, callback);
r.table('dc').getAll('superman', 'ant man').run(conn, callback);
r.do(
    r.table('heroes').getAll('f', {index: 'gender'})('id').coerceTo('array'),
    function(heroines) {
        return r.table('villains').getAll(r.args(heroines));
    }
	).run(conn, callback);

// http://rethinkdb.com/api/javascript/between/
r.table('marvel').between(10, 20).run(conn, callback);
r.table('marvel').between(10, 20, { rightBound: 'closed' }).run(conn, callback);
r.table('marvel').between(r.minval, 20).run(conn, callback);
r.table('marvel').between(10, r.maxval, { leftBound: 'open' }).run(conn, callback);
r.table('dc').between('dark_knight', 'man_of_steel', { index: 'code_name' }).run(conn, callback);
r.table("users").between(["Smith", "John"], ["Welles", "Wade"],
	{ index: "full_name" }).run(conn, callback);
r.table("teams").between(1, 11, { index: "rank" }).changes().run(conn, callback);

// http://rethinkdb.com/api/javascript/filter/
r.table('users').filter({ age: 30 }).run(conn, callback);
r.table('users').filter(r.row("age").eq(30)).run(conn, callback);
r.table('users').filter(function (user) {
    return user("age").eq(30);
}).run(conn, callback);
r.table("users").filter(r.row("age").gt(18)).run(conn, callback);
r.table("users").filter(
    r.row("age").lt(18).and(r.row("age").gt(13))
	).run(conn, callback);
r.table("users").filter(
    r.row("age").ge(18).or(r.row("hasParentalConsent"))
	).run(conn, callback);
r.table("users").filter(function (user) {
    return user("subscriptionDate").during(
        r.time(2012, 1, 1, 'Z'), r.time(2013, 1, 1, 'Z'));
}).run(conn, callback);
r.table("users").filter(function (user) {
    return user("email").match("@gmail.com$");
}).run(conn, callback);
r.table("users").filter(function(user) {
    return user("placesVisited").contains("France")
}).run(conn, callback);
r.table("users").filter({
    name: {
        first: "William",
        last: "Adama"
    }
}).run(conn, callback);
r.table("users").filter(r.literal({
    name: {
        first: "William",
        last: "Adama"
    }
})).run(conn, callback);
r.table("users").filter(function(user) {
    return user("name")("first").eq("William")
        .and(user("name")("last").eq("Adama"));
}).run(conn, callback);

r.table("users").filter(function(user) {
    return user("name").eq({
        first: "William",
        last: "Adama"
    });
}).run(conn, callback);
r.table("users").filter(
    r.row("age").lt(18), {default: true}
	).run(conn, callback);
r.table("users").filter(
    r.row("age").gt(18), {default: r.error()}
	).run(conn, callback);
r.table('users').filter(function (user) {
    return user.hasFields('phoneNumber');
}).run(conn, callback);
r.table('users').filter(function (user) {
    return (user('role').eq('editor').default(false).
        or(user('privilege').eq('admin').default(false)));
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/inner_join/
r.table('marvel').innerJoin(r.table('dc'), function(marvelRow, dcRow) {
    return marvelRow('strength').lt(dcRow('strength'))
}).zip().run(conn, callback);

// http://rethinkdb.com/api/javascript/outer_join/
r.table('marvel').outerJoin(r.table('dc'), function(marvelRow, dcRow) {
    return marvelRow('strength').lt(dcRow('strength'))
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/eq_join/
r.table('players').eqJoin('gameId', r.table('games')).run(conn, callback);
r.table('players').eqJoin('gameId', r.table('games')).without({ right: "id" }).zip().orderBy('gameId').run(conn, callback);
r.table('arenas').eqJoin('cityId', r.table('arenas'), { index: 'cityId' }).run(conn, callback);
r.table('players').eqJoin(r.row('game')('id'), r.table('games')).without({ right: 'id' }).zip();
r.table('players').eqJoin(function(player) {
    return player('favorites').nth(0)
}, r.table('games')).without([{ left: ['favorites', 'gameId', 'id'] }, { right: 'id' }]).zip();

// http://rethinkdb.com/api/javascript/zip/
r.table('marvel').eqJoin('main_dc_collaborator', r.table('dc'))
    .zip().run(conn, callback);

// http://rethinkdb.com/api/javascript/map/
r.expr([1, 2, 3, 4, 5]).map(function (val) {
    return val.mul(val);
}).run(conn, callback);

var sequence1 = [100, 200, 300, 400];
var sequence2 = [10, 20, 30, 40];
var sequence3 = [1, 2, 3, 4];
r.map(sequence1, sequence2, sequence3, function (val1, val2, val3) {
    return val1.add(val2).add(val3);
}).run(conn, callback);

r.table('users').map(function (doc) {
    return doc.merge({userId: doc('id')}).without('id');
}).run(conn, callback);

r.table('users').map(
    r.row.merge({userId: r.row('id')}).without('id');
}).run(conn, callback);

r.table('heroes').map(r.table('villains'), function (hero, villain) {
    return hero.merge({villain: villain});
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/with_fields/
r.table('users').withFields('id', 'user', 'posts').run(conn, callback);
r.table('users').withFields('id', 'user', { contact: { phone: "work" }).run(conn, callback);

// http://rethinkdb.com/api/javascript/concat_map/
r.expr([1, 2, 3]).map(function(x) { return [x, x.mul(2)] }).run(conn, callback);
r.expr([1, 2, 3]).concatMap(function(x) { return [x, x.mul(2)] }).run(conn, callback);

r.table('marvel').concatMap(function(hero) {
    return hero('defeatedMonsters')
}).run(conn, callback);

r.table("posts").concatMap(function(post) {
	r.table("comments").getAll(
		post("id"),
		{ index: "postId" }
		).map(function(comment) {
		return { left: post, right: comment }
	})
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/order_by/
r.table('posts').orderBy({ index: 'date' }).run(conn, callback);
r.table('posts').indexCreate('date').run(conn, callback);
r.table('posts').orderBy({ index: r.desc('date') }).run(conn, callback);
r.table('posts').get(1)('comments').orderBy('date');
r.table('posts').get(1)('comments').orderBy(r.desc('date'));
r.table('small_table').orderBy('date');
r.table('posts').orderBy({ index: 'dateAndTitle' }).run(conn, callback);
r.table('posts').indexCreate('dateAndTitle', [r.row('date'), r.row('title')]).run(conn, callback);
r.table('small_table').orderBy('date', r.desc('title'));
r.table('post').orderBy('title', { index: 'date' }).run(conn, callback);
r.table('user').orderBy(r.row('group')('id')).run(conn, callback);
r.table('posts').orderBy({ index: 'votes' }).run(conn, callback);
r.table('posts').indexCreate('votes', function(post) {
    return post('upvotes').sub(post('downvotes'))
}).run(conn, callback);
r.table('small_table').orderBy(function(doc) {
    return doc('upvotes').sub(doc('downvotes'))
});
r.table('small_table').orderBy(r.desc(function(doc) {
    return doc('upvotes').sub(doc('downvotes'))
}));
r.table('posts').between(r.time(2013, 1, 1, '+00:00'), r.time(2013, 1, 1, '+00:00'), {index: 'date'})
    .orderBy({ index: 'date' }).run(conn, callback);

// http://rethinkdb.com/api/javascript/skip/
r.table('marvel').orderBy('successMetric').skip(10).run(conn, callback);

// http://rethinkdb.com/api/javascript/limit/
r.table('marvel').orderBy('belovedness').limit(10).run(conn, callback);

// http://rethinkdb.com/api/javascript/slice/
r.table('players').orderBy({ index: 'age' }).slice(3, 6).run(conn, callback);
r.table('players').filter({ flag: 'red' }).orderBy(r.desc('score')).slice(3).run(conn, callback);
r.table('users').orderBy('ticket').slice(x, y, { right_bound: 'closed' }).run(conn, callback);
r.expr([0, 1, 2, 3, 4, 5]).slice(2, -2).run(conn, callback);

// http://rethinkdb.com/api/javascript/nth/
r.expr([1, 2, 3]).nth(1).run(conn, callback);
r.expr([1, 2, 3])(1).run(conn, callback);
r.table('players').orderBy({ index: r.desc('score') }).nth(3).run(conn, callback);
r.table('players').orderBy({ index: r.desc('score') }).nth(-1).run(conn, callback);

// http://rethinkdb.com/api/javascript/offsets_of/
r.expr(['a', 'b', 'c']).offsetsOf('c').run(conn, callback);
r.table('marvel').union(r.table('dc')).orderBy('popularity').offsetsOf(
    r.row('superpowers').contains('invisibility')
	).run(conn, callback);

// http://rethinkdb.com/api/javascript/is_empty/
r.table('marvel').isEmpty().run(conn, callback);

// http://rethinkdb.com/api/javascript/union/
r.table('marvel').union(r.table('dc')).run(conn, callback);
r.expr([1, 2]).union([3, 4], [5, 6], [7, 8, 9]).run(conn, callback);
r.expr([1, 2]).union([3, 4], [5, 6], [7, 8, 9]).run(conn, callback);

// http://rethinkdb.com/api/javascript/sample/
r.table('marvel').sample(3).run(conn, callback);

// http://rethinkdb.com/api/javascript/group/
r.table('games').group('player').run(conn, callback);
r.table('games').group('player').max('points').run(conn, callback);
r.table('games').group('player').max('points')('points').run(conn, callback);
r.table('games').group('player', 'type').max('points')('points').run(conn, callback);
r.table('games')
    .group(function(game) {
	return game.pluck('player', 'type')
	}).max('points')('points').run(conn, callback);
r.table('matches').group(
	[r.row('date').year(), r.row('date').month()]
	).count().run(conn, callback);
r.table('games').group({ index: 'type' }).max('points')('points').run(conn, callback);
r.table('games2').group(r.row('matches').keys(), { multi: true }).run(conn, callback);
r.table('games2').group(r.row('matches').keys(), {multi: true}).ungroup().map(
    function (doc) {
        return { match: doc('group'), total: doc('reduction').sum(
            function (set) {
                return set('matches')(doc('group')).sum();
            }
        )};
    }
	).run(conn, callback);
r.table('games').group('player').max('points')('points').ungroup().run(conn, callback);
r.table('games')
	.group('player').max('points')('points')
	.ungroup().orderBy(r.desc('reduction')).run(conn, callback);
r.table('games').group('player').avg('points').run(conn, { groupFormat: 'raw' }, callback);
r.table('games').group('player').min('points').run(conn, callback);
r.table('games').group('player').orderBy('score').nth(0).run(conn, callback);
r.table('games').filter(r.row('type').eq('free'))
    .group('player').max('points')('points')
    .run(conn, callback);
r.table('games')
    .group('name', function(game) {
	return game('points').mod(2)
	}).max('points')('points').run(conn, callback);

// http://rethinkdb.com/api/javascript/ungroup/
r.table('games')
	.group('player').max('points')('points')
	.ungroup().orderBy(r.desc('reduction')).run(conn, callback);
r.table('games').group('player').ungroup().sample(1).run(conn, callback);
r.table('games').group('player').sample(1).run(conn);
r.table('games').group('player').typeOf().run(conn, callback);
r.table('games').group('player').ungroup().typeOf().run(conn, callback);
r.table('games').group('player').avg('points').run(conn, callback);
r.table('games').group('player').avg('points').ungroup().run(conn, callback);

// http://rethinkdb.com/api/javascript/reduce/
r.table("posts").map(function(doc) {
    return 1;
}).reduce(function(left, right) {
    return left.add(right);
	}).default(0).run(conn, callback);

r.table("posts").map(function(doc) {
    return doc("comments").count();
}).reduce(function(left, right) {
    return left.add(right);
	}).default(0).run(conn, callback);

r.table("posts").map(function(doc) {
    return doc("comments").count();
}).reduce(function(left, right) {
    return r.branch(
        left.gt(right),
        left,
        right
    );
	}).default(0).run(conn, callback);

// http://rethinkdb.com/api/javascript/count/
r.table('users').count().run(conn, callback);
r.table('users')('age').count(18).run(conn, callback);
r.table('users')('age').count(function(age) {
    return age.gt(18)
}).run(conn, callback);
r.table('users').count(function(user) {
    return user('age').gt(18)
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/sum/
r.expr([3, 5, 7]).sum().run(conn, callback);
r.table('games').sum('points').run(conn, callback);
r.table('games').sum(function(game) {
    return game('points').add(game('bonus_points'))
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/avg/
r.expr([3, 5, 7]).avg().run(conn, callback);
r.table('games').avg('points').run(conn, callback);
r.table('games').avg(function(game) {
    return game('points').add(game('bonus_points'))
}).run(conn, callback);
r.table('games').avg('points').default(null).run(conn, callback);

// http://rethinkdb.com/api/javascript/min/
r.expr([3, 5, 7]).min().run(conn, callback);
r.table('users').min('points').run(conn, callback);
r.table('users').min({ index: 'points' }).run(conn, callback);
r.table('users').min(function(user) {
    return user('points').add(user('bonusPoints'));
}).run(conn, callback);
r.table('users').min('points')('points').run(conn, callback);
r.table('users').min('points').default(null).run(conn, callback);

// http://rethinkdb.com/api/javascript/max/
r.expr([3, 5, 7]).max().run(conn, callback);
r.table('users').max('points').run(conn, callback);
r.table('users').max({ index: 'points' }).run(conn, callback);
r.table('users').max(function(user) {
    return user('points').add(user('bonusPoints'));
}).run(conn, callback);
r.table('users').max('points')('points').run(conn, callback);
r.table('users').max('points').default(null).run(conn, callback);

// http://rethinkdb.com/api/javascript/distinct/
r.table('marvel').concatMap(function(hero) {
    return hero('villainList')
}).distinct().run(conn, callback);
r.table('messages').distinct({ index: 'topics' }).run(conn, callback);
r.table('messages')('topics').distinct().run(conn, callback);

// http://rethinkdb.com/api/javascript/contains/
r.table('marvel').get('ironman')('opponents').contains('superman').run(conn, callback);
r.table('marvel').get('ironman')('battles').contains(function(battle) {
    return battle('winner').eq('ironman').and(battle('loser').eq('superman'));
}).run(conn, callback);
r.table('marvel').filter(function(hero) {
    return r.expr(['Detroit', 'Chicago', 'Hoboken']).contains(hero('city'))
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/row/
r.table('users').filter(r.row('age').gt(5)).run(conn, callback);
r.table('users').filter(r.row('embedded_doc')('child') > 5).run(conn, callback);
r.expr([1, 2, 3]).map(r.row.add(1)).run(conn, callback);
r.table('users').filter(function(doc) {
    return doc('name').eq(r.table('prizes').get('winner'))
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/pluck/
r.table('marvel').get('IronMan').pluck('reactorState', 'reactorPower').run(conn, callback);
r.table('marvel').pluck('beauty', 'muscleTone', 'charm').run(conn, callback);
r.table('marvel').pluck({ 'abilities': { 'damage': true, 'mana_cost': true }, 'weapons': true }).run(conn, callback);
r.table('marvel').pluck({ 'abilities': ['damage', 'mana_cost'] }, 'weapons').run(conn, callback);

// http://rethinkdb.com/api/javascript/without/
r.table('marvel').get('IronMan').without('personalVictoriesList').run(conn, callback);
r.table('enemies').without('weapons').run(conn, callback);
r.table('marvel').without({ 'weapons': { 'damage': true }, 'abilities': { 'damage': true } }).run(conn, callback);
r.table('marvel').without({ 'weapons': 'damage', 'abilities': 'damage' }).run(conn, callback);

// http://rethinkdb.com/api/javascript/merge/
r.table('marvel').get('IronMan').merge(
    r.table('loadouts').get('alienInvasionKit')
	).run(conn, callback);
r.table('marvel').merge(function (hero) {
    return { weapons: r.table('weapons').get(hero('weaponId')) };
}).run(conn, callback);
r.table('posts').merge(function (post) {
    return {
        comments: r.table('comments').getAll(post('id'),
            {index: 'postId'}).coerceTo('array')
    }
}).run(conn, callback);
r.expr({weapons : {spectacular_graviton_beam : {dmg : 10, cooldown : 20}}}).merge(
    { weapons: { spectacular_graviton_beam: { dmg: 10 } } }).run(conn, callback);
r.expr({weapons : {spectacular_graviton_beam : {dmg : 10, cooldown : 20}}}).merge(
    { weapons: r.literal({ repulsor_rays: { dmg: 3, cooldown: 0 } }) }).run(conn, callback);
r.expr({weapons : {spectacular_graviton_beam : {dmg : 10, cooldown : 20}}}).merge(
    { weapons: { spectacular_graviton_beam: r.literal() } }).run(conn, callback);

// http://rethinkdb.com/api/javascript/append/
r.table('marvel').get('IronMan')('equipment').append('newBoots').run(conn, callback);

// http://rethinkdb.com/api/javascript/prepend/
r.table('marvel').get('IronMan')('equipment').prepend('newBoots').run(conn, callback);

// http://rethinkdb.com/api/javascript/difference/
r.table('marvel').get('IronMan')('equipment')
  .difference(['Boots'])
	.run(conn, callback);
r.table('marvel').get('IronMan')
  .update({
    equipment: r.row('equipment').difference(['Boots'])
  })
	.run(conn, callback);

// http://rethinkdb.com/api/javascript/set_insert/
r.table('marvel').get('IronMan')('equipment').setInsert('newBoots').run(conn, callback);

// http://rethinkdb.com/api/javascript/set_union/
r.table('marvel').get('IronMan')('equipment').setUnion(['newBoots', 'arc_reactor']).run(conn, callback);

// http://rethinkdb.com/api/javascript/set_intersection/
r.table('marvel').get('IronMan')('equipment').setIntersection(['newBoots', 'arc_reactor']).run(conn, callback);

// http://rethinkdb.com/api/javascript/set_difference/
r.table('marvel').get('IronMan')('equipment').setDifference(['newBoots', 'arc_reactor']).run(conn, callback);

// http://rethinkdb.com/api/javascript/get_field/
// http://rethinkdb.com/api/javascript/bracket/
r.table('marvel').get('IronMan').getField('firstAppearance').run(conn, callback);
r.table('marvel').get('IronMan')('firstAppearance').run(conn, callback);
r.expr([10, 20, 30, 40, 50])(3)

// http://rethinkdb.com/api/javascript/has_fields/
r.table('players').hasFields('games_won').run(conn, callback);
r.table('players').filter(
    r.row.hasFields('games_won').not()
	).run(conn, callback);
r.table('players').get('b5ec9714-837e-400c-aa74-dbd35c9a7c4c'
    ).hasFields('games_won').run(conn, callback);
r.table('players').hasFields({ 'games_won': { 'championships': true } }).run(conn, callback);
r.table('players').hasFields({'games_won': 'championships'}
    ).run(conn, callback);

// http://rethinkdb.com/api/javascript/insert_at/
r.expr(["Iron Man", "Spider-Man"]).insertAt(1, "Hulk").run(conn, callback);

// http://rethinkdb.com/api/javascript/splice_at/
r.expr(["Iron Man", "Spider-Man"]).spliceAt(1, ["Hulk", "Thor"]).run(conn, callback);

// http://rethinkdb.com/api/javascript/delete_at/
r(['a', 'b', 'c', 'd', 'e', 'f']).deleteAt(1).run(conn, callback);
r(['a', 'b', 'c', 'd', 'e', 'f']).deleteAt(1, 3).run(conn, callback);
r(['a', 'b', 'c', 'd', 'e', 'f']).deleteAt(-2).run(conn, callback);
r.table('posts').get('4cf47834-b6f9-438f-9dec-74087e84eb63').update({
    comments: r.row('comments').deleteAt(1)
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/change_at/
r.expr(["Iron Man", "Bruce", "Spider-Man"]).changeAt(1, "Hulk").run(conn, callback);

// http://rethinkdb.com/api/javascript/keys/
r.table('marvel').get('ironman').keys().run(conn, callback);

// http://rethinkdb.com/api/javascript/literal/
r.table('users').get(1).update({ data: { age: 19, job: 'Engineer' } }).run(conn, callback);
r.table('users').get(1).update({ data: r.literal({ age: 19, job: 'Engineer' }) }).run(conn, callback);
r.table('users').get(1).merge({ data: r.literal() }).run(conn, callback);

// http://rethinkdb.com/api/javascript/object/
r.object('id', 5, 'data', ['foo', 'bar']).run(conn, callback);

// http://rethinkdb.com/api/javascript/match/
r.table('users').filter(function(doc){
    return doc('name').match("^A")
}).run(conn, callback);
r.table('users').filter(function(doc){
    return doc('name').match("n$")
}).run(conn, callback);

r.table('users').filter(function(doc){
    return doc('name').match("li")
}).run(conn, callback);
r.table('users').filter(function(doc){
    return doc('name').match("(?i)^john$")
}).run(conn, callback);
r.table('users').filter(function(doc){
    return doc('name').match("(?i)^[a-z]+$")
}).run(conn, callback);
r.table('users').filter(function(doc){
    return doc('zipcode').match("\\d{5}")
}).run(conn, callback);
r.expr("name@domain.com").match(".*@(.*)").run(conn, callback);
r.expr("name@domain.com").match(".*@(.*)")("groups").nth(0)("str").run(conn, callback);
r.expr("name[at]domain.com").match(".*@(.*)").run(conn, callback);

// http://rethinkdb.com/api/javascript/split/
r.expr("foo  bar bax").split().run(conn, callback);
r.expr("12,37,,22,").split(",").run(conn, callback);
r.expr("mlucy").split("").run(conn, callback);
r.expr("12,37,,22,").split(",", 3).run(conn, callback);
r.expr("foo  bar bax").split(null, 1).run(conn, callback);

// http://rethinkdb.com/api/javascript/upcase/
r.expr("Sentence about LaTeX.").upcase().run(conn, callback);

// http://rethinkdb.com/api/javascript/downcase/
r.expr("Sentence about LaTeX.").downcase().run(conn, callback);

// http://rethinkdb.com/api/javascript/add/
r.expr(2).add(2).run(conn, callback
r.expr("foo").add("bar").run(conn, callback);
r.expr(["foo", "bar"]).add(["buzz"]).run(conn, callback);
r.now().add(365 * 24 * 60 * 60).run(conn, callback);
r.add(r.args([10, 20, 30])).run(conn, callback);
r.add(r.args(['foo', 'bar', 'buzz'])).run(conn, callback);

// http://rethinkdb.com/api/javascript/sub/
r.expr(2).sub(2).run(conn, callback);
r.now().sub(365 * 24 * 60 * 60)
r.now().sub(date)

// http://rethinkdb.com/api/javascript/mul/
r.expr(2).mul(2).run(conn, callback);
r.expr(["This", "is", "the", "song", "that", "never", "ends."]).mul(100).run(conn, callback);

// http://rethinkdb.com/api/javascript/div/
r.expr(2).div(2).run(conn, callback);

// http://rethinkdb.com/api/javascript/mod/
r.expr(2).mod(2).run(conn, callback);

// http://rethinkdb.com/api/javascript/and/
r.expr(a).and(b).run(conn, callback);
r.and(x, y, z).run(conn, callback);

// http://rethinkdb.com/api/javascript/or/
r.expr(a).or(b).run(conn, callback);
r.or(x, y, z).run(conn, callback);
r.table('posts').filter(
    r.row('category').default('foo').eq('article').
    or(r.row('genre').default('foo').eq('mystery'))
	).run(conn, callback);

// http://rethinkdb.com/api/javascript/eq/
r.expr(2).eq(2).run(conn, callback);

// http://rethinkdb.com/api/javascript/ne/
r.expr(2).ne(2).run(conn, callback);

// http://rethinkdb.com/api/javascript/gt/
r.expr(2).gt(2).run(conn, callback);

// http://rethinkdb.com/api/javascript/ge/
r.expr(2).ge(2).run(conn, callback);

// http://rethinkdb.com/api/javascript/lt/
r.expr(2).lt(2).run(conn, callback);

// http://rethinkdb.com/api/javascript/le/
r.expr(2).le(2).run(conn, callback);

// http://rethinkdb.com/api/javascript/not/
r(true).not().run(conn, callback);
r.not(true).run(conn, callback);
r.table('users').filter(function(user) {
    return user.hasFields('flag').not()
}).run(conn, callback);
r.table('users').filter(function(user) {
    return r.not(user.hasFields('flag'))
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/random/
r.random().run(conn, callback);
r.random(100).run(conn, callback);
r.random(0, 100).run(conn, callback);
r.random(1.59, -2.24, { float: true }).run(conn, callback);

// http://rethinkdb.com/api/javascript/now/
r.table("users").insert({
    name: "John",
    subscription_date: r.now()
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/time/
r.table("user").get("John").update({ birthdate: r.time(1986, 11, 3, 'Z') }).run(conn, callback);

// http://rethinkdb.com/api/javascript/epoch_time/
r.table("user").get("John").update({ birthdate: r.epochTime(531360000) }).run(conn, callback);

// http://rethinkdb.com/api/javascript/iso8601/
r.table("user").get("John").update({ birth: r.ISO8601('1986-11-03T08:30:00-07:00') }).run(conn, callback);

// http://rethinkdb.com/api/javascript/in_timezone/
r.now().inTimezone('-08:00').hours().run(conn, callback);

// http://rethinkdb.com/api/javascript/timezone/
r.table("users").filter( function(user) {
    return user("subscriptionDate").timezone().eq("-07:00")
})

// http://rethinkdb.com/api/javascript/during/
r.table("posts").filter(
    r.row('date').during(r.time(2013, 12, 1, "Z"), r.time(2013, 12, 10, "Z"))
	).run(conn, callback);

r.table("posts").filter(
  r.row('date').during(r.time(2013, 12, 1, "Z"), r.time(2013, 12, 10, "Z"), {leftBound: "open", rightBound: "closed"})
	).run(conn, callback);

// http://rethinkdb.com/api/javascript/date/
r.table("users").filter(function(user) {
    return user("birthdate").date().eq(r.now().date())
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/time_of_day/
r.table("posts").filter(
    r.row("date").timeOfDay().le(12*60*60)
	).run(conn, callback);

// http://rethinkdb.com/api/javascript/year/
r.table("users").filter(function(user) {
    return user("birthdate").year().eq(1986)
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/month/
r.table("users").filter(
    r.row("birthdate").month().eq(11)
	)

r.table("users").filter(
    r.row("birthdate").month().eq(r.november)
	)

// http://rethinkdb.com/api/javascript/day/
r.table("users").filter(
    r.row("birthdate").day().eq(24)
	).run(conn, callback);

// http://rethinkdb.com/api/javascript/day_of_week/
r.now().dayOfWeek().run(conn, callback);
r.table("users").filter(
    r.row("birthdate").dayOfWeek().eq(r.tuesday)
	)

// http://rethinkdb.com/api/javascript/day_of_year/
r.table("users").filter(
    r.row("birthdate").dayOfYear().eq(1)
	)

// http://rethinkdb.com/api/javascript/hours/
r.table("posts").filter(function(post) {
    return post("date").hours().lt(4)
})

// http://rethinkdb.com/api/javascript/minutes/
r.table("posts").filter(function(post) {
    return post("date").minutes().lt(10)
})


// http://rethinkdb.com/api/javascript/seconds/
r.table("posts").filter(function(post) {
    return post("date").seconds().lt(30)
})


// http://rethinkdb.com/api/javascript/to_iso8601/
r.now().toISO8601().run(conn, callback);


// http://rethinkdb.com/api/javascript/to_epoch_time/
r.now().toEpochTime();

// http://rethinkdb.com/api/javascript/args/
r.table('people').getAll('Alice', 'Bob').run(conn, callback);
r.table('people').getAll(r.args(['Alice', 'Bob'])).run(conn, callback);
r.table('people').getAll(r.args(r.table('people').get('Alice')('children'))).run(conn, callback);
r.table('posts').indexCreate(r.args(['tags']), { multi: true });


// http://rethinkdb.com/api/javascript/binary/
var fs = require('fs');
fs.readFile('./defaultAvatar.png', function (err, avatarImage) {
    if (err) {
        // Handle error
    }
    else {
        r.table('users').get(100).update({
            avatar: avatarImage
        })
    }
});

r.table('users').get(100)('avatar').count().run(conn, callback);

// http://rethinkdb.com/api/javascript/do/
r.table('players').get('f19b5f16-ef14-468f-bd48-e194761df255').do(
    function (player) {
        return player('gross_score').sub(player('course_handicap'));
    }
	).run(conn, callback);

r.do(r.table('players').get(id1), r.table('players').get(id2),
    function (player1, player2) {
        return r.branch(player1('gross_score').lt(player2('gross_score')),
            player1, player2);
    }
	).run(conn, callback);
var newData = {
    id: 100,
    name: 'Agatha',
    gross_score: 57,
    course_handicap: 4
};
r.table('players').insert(newData).do(
    function (doc) {
        return r.branch(doc('inserted').ne(0),
            r.table('log').insert({time: r.now(), response: doc, result: 'ok'}),
            r.table('log').insert({time: r.now(), response: doc, result: 'error'}))
    }
	).run(conn, callback);

// http://rethinkdb.com/api/javascript/branch/
r.table('marvel').map(
    r.branch(
        r.row('victories').gt(100),
        r.row('name').add(' is a superhero'),
        r.row('name').add(' is a hero')
    )
	).run(conn, callback);

// http://rethinkdb.com/api/javascript/for_each/
r.table('marvel').forEach(function(hero) {
    return r.table('villains').get(hero('villainDefeated')).delete()
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/error/
r.table('marvel').get('IronMan').do(function(ironman) {
    return r.branch(ironman('victories').lt(ironman('battles')),
        r.error('impossible code path'),
        ironman)
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/default/
r.table("posts").map( function(post) {
    return {
        title: post("title"),
        author: post("author").default("Anonymous")
    }
}).run(conn, callback);

r.table("posts").map( function(post) {
    return r.branch(
        post.hasFields("author"),
        {
            title: post("title"),
            author: post("author")
        },
        {
            title: post("title"),
            author: "Anonymous"
        }
    )
}).run(conn, callback);
r.table("users").filter( function(user) {
    return user("age").lt(18).default(true)
}).run(conn, callback);
r.table("users").filter( function(user) {
    return user("age").default(-1).lt(18)
}).run(conn, callback);
r.table("users").filter( function(user) {
    return user.hasFields("age").not().or(user("age").lt(18))
}).run(conn, callback);
r.table("users").filter( function(user) {
    return user("age").lt(18)
}, { default: true }).run(conn, callback);

// http://rethinkdb.com/api/javascript/expr/
r.expr({ a: 'b' }).merge({ b: [1, 2, 3] }).run(conn, callback);
r({ a: 'b' }).merge({ b: [1, 2, 3] }).run(conn, callback);


// http://rethinkdb.com/api/javascript/js/
r.js("'str1' + 'str2'").run(conn, callback);
r.table('marvel').filter(
    r.js('(function (row) { return row.magazines.length > 5; })')
	).run(conn, callback);
r.js('while(true) {}', { timeout: 1.3 }).run(conn, callback);

// http://rethinkdb.com/api/javascript/coerce_to/
r.table('posts').map(function (post) {
    post.merge({ comments: r.table('comments').getAll(post('id'), {index: 'postId'}).coerceTo('array')});
}).run(conn, callback);
r.expr([['name', 'Ironman'], ['victories', 2000]]).coerceTo('object').run(conn, callback);
r.expr(1).coerceTo('string').run(conn, callback);

// http://rethinkdb.com/api/javascript/type_of/
r.expr("foo").typeOf().run(conn, callback);

// http://rethinkdb.com/api/javascript/info/
r.table('marvel').info().run(conn, callback);

// http://rethinkdb.com/api/javascript/json/
r.json("[1,2,3]").run(conn, callback);

// http://rethinkdb.com/api/javascript/http/
r.table('posts').insert(r.http('http://httpbin.org/get')).run(conn, callback);

r.expr([1, 2, 3]).map(function(i) {
    return r.http('http://httpbin.org/get', { params: { user: i } });
}).run(conn, callback);

r.table('data').map(function(row) {
    return r.http('http://httpbin.org/put', { method: 'PUT', data: row });
}).run(conn, callback);

r.http('http://httpbin.org/post',
       { method: 'POST', data: { player: 'Bob', game: 'tic tac toe' } })
	.run(conn, callback);

r.http('http://httpbin.org/post',
       { method: 'POST',
         data: r.expr(value).coerceTo('string'),
         header: { 'Content-Type': 'application/json' } })
	.run(conn, callback);

r.http('example.com/pages',
       { page: function(info) { return info('body')('meta')('next').default(null); },
         pageLimit: 5 })
	.run(conn, callback);

// http://rethinkdb.com/api/javascript/uuid/
r.uuid().run(conn, callback);

// http://rethinkdb.com/api/javascript/circle/
r.table('geo').insert({
    id: 300,
    name: 'Hayes Valley',
    neighborhood: r.circle([-122.423246,37.779388], 1000)
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/distance/
var point1 = r.point(-122.423246,37.779388);
var point2 = r.point(-117.220406,32.719464);
r.distance(point1, point2, { unit: 'km' }).run(conn, callback);

// http://rethinkdb.com/api/javascript/fill/
r.table('geo').insert({
    id: 201,
    rectangle: r.line(
        [-122.423246,37.779388],
        [-122.423246,37.329898],
        [-121.886420,37.329898],
        [-121.886420,37.779388]
    )
}).run(conn, callback);

r.table('geo').get(201).update({
    rectangle: r.row('rectangle').fill()
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/geojson/
var geoJson = {
    'type': 'Point',
    'coordinates': [ -122.423246, 37.779388 ]
};
r.table('geo').insert({
    id: 'sfo',
    name: 'San Francisco',
    location: r.geojson(geoJson)
}).run(conn, callback);


// http://rethinkdb.com/api/javascript/to_geojson/
r.table(geo).get('sfo')('location').toGeojson().run(conn, callback);

// http://rethinkdb.com/api/javascript/get_intersecting/
var circle1 = r.circle([-117.220406,32.719464], 10, {unit: 'mi'});
r.table('parks').getIntersecting(circle1, { index: 'area' }).run(conn, callback);

// http://rethinkdb.com/api/javascript/get_nearest/
var secretBase = r.point(-122.422876,37.777128);
r.table('hideouts').getNearest(secretBase,
    {index: 'location', maxDist: 5000}
	).run(conn, callback);

// http://rethinkdb.com/api/javascript/includes/
var point1 = r.point(-117.220406,32.719464);
var point2 = r.point(-117.206201,32.725186);
r.circle(point1, 2000).includes(point2).run(conn, callback);


var circle1 = r.circle([-117.220406,32.719464], 10, {unit: 'mi'});
r.table('parks')('area').includes(circle1).run(conn, callback);

// http://rethinkdb.com/api/javascript/intersects/
var point1 = r.point(-117.220406,32.719464);
var point2 = r.point(-117.206201,32.725186);
r.circle(point1, 2000).intersects(point2).run(conn, callback);

var circle1 = r.circle([-117.220406,32.719464], 10, {unit: 'mi'});
r.table('parks')('area').intersects(circle1).run(conn, callback);

// http://rethinkdb.com/api/javascript/line/
r.table('geo').insert({
    id: 101,
    route: r.line([-122.423246,37.779388], [-121.886420,37.329898])
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/point/
r.table('geo').insert({
    id: 1,
    name: 'San Francisco',
    location: r.point(-122.423246,37.779388)
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/polygon/
r.table('geo').insert({
    id: 101,
    rectangle: r.polygon(
        [-122.423246,37.779388],
        [-122.423246,37.329898],
        [-121.886420,37.329898],
        [-121.886420,37.779388]
    )
}).run(conn, callback);

// http://rethinkdb.com/api/javascript/polygon_sub/
var outerPolygon = r.polygon(
    [-122.4,37.7],
    [-122.4,37.3],
    [-121.8,37.3],
    [-121.8,37.7]
);
var innerPolygon = r.polygon(
    [-122.3,37.4],
    [-122.3,37.6],
    [-122.0,37.6],
    [-122.0,37.4]
);
outerPolygon.polygonSub(innerPolygon).run(conn, callback);


