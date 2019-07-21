var Index = require('./')
var level = require('memdb')
var sub = require('subleveldown')

var db = level()
var posts = sub(db, 'posts', { valueEncoding: 'json' })
var idx = sub(db, 'idx')

Index(posts, idx)
  .by('Title', 'title')
  .by('Length', ['body.length', 'title'])
  .by('Author', ['author', 'title'])

var post = {
  title: 'a title',
  body: 'lorem ipsum',
  author: 'julian'
}

posts.put('1337', post, function (err) {
  if (err) throw err

  posts.byTitle.get('a title', console.log)
  posts.byLength.get('11!a title', console.log)
  posts.byAuthor.get('julian!a title', console.log)
})
