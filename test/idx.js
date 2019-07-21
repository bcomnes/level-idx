var MemDB = require('memdb')
var Index = require('..')
var sub = require('subleveldown')
var test = require('tape')
var bytewise = require('bytewise')

test('idx', function (t) {
  t.plan(7)

  var db = MemDB()
  var posts = sub(db, 'posts', { valueEncoding: 'json' })
  var idb = sub(db, 'index')

  Index(posts, idb)
    .by('Title', 'title')
    .by('Length', ['body.length'])
    .by('Author', ['author', 'title'])

  var post = {
    title: 'a title',
    body: 'lorem ipsum',
    author: 'julian'
  }

  posts.put('1337', post, function (err) {
    t.error(err)

    posts.byTitle.get('a title', onPost)
    posts.byLength.get('11', onPost)
    posts.byAuthor.get('julian!a title', onPost)

    function onPost (err, _post) {
      t.error(err)
      t.deepEqual(_post, post)
    }
  })
})

test('idx-bytewise', function (t) {
  t.plan(7)

  var db = MemDB('./db')
  var posts = sub(db, 'posts', { keyEncoding: bytewise, valueEncoding: 'json' })
  var idb = sub(db, 'index')

  Index(posts, idb, { keyEncoding: bytewise })
    .by('Title', 'title')
    .by('Length', ['body.length'])
    .by('Author', ['author', 'title'])

  var post = {
    title: 'a title',
    body: 'lorem ipsum',
    author: 'julian'
  }

  posts.put('1337', post, function (err) {
    t.error(err)

    posts.byTitle.get(['a title'], onPost)
    posts.byLength.get([11], onPost)
    posts.byAuthor.get(['julian', 'a title'], onPost)

    function onPost (err, _post) {
      t.error(err)
      t.deepEqual(_post, post)
    }
  })
})
