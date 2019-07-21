var MemDB = require('memdb')
var Index = require('..')
var sub = require('subleveldown')
var test = require('tape')
var multilevel = require('multilevel')

test('multilevel', function (t) {
  t.plan(7)

  var db = MemDB()
  var posts = sub(db, 'posts', { valueEncoding: 'json' })
  var idb = sub(db, 'index')

  Index(posts, idb)
    .by('Title', 'title')
    .by('Length', ['body.length'])
    .by('Author', ['author', 'title'])

  var server = multilevel.server(posts)
  var client = multilevel.client(posts)

  server.pipe(client.createRpcStream()).pipe(server)

  var post = {
    title: 'a title',
    body: 'lorem ipsum',
    author: 'julian'
  }

  client.put('1337', post, function (err) {
    t.error(err)
    client.byTitle.get('a title', onPost)
    client.byLength.get('11', onPost)
    client.byAuthor.get('julian!a title', onPost)

    function onPost (err, _post) {
      t.error(err)
      t.deepEqual(_post, post)
    }
  })
})
