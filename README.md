# level-idx

High Level leveldb indexing API using [level-auto-index](https://github.com/hypermodules/level-auto-index).

```bash
npm install level-idx
```

[![level badge][level-badge]](https://github.com/level/awesome)
[![npm][npm-image]][npm-url]
[![Build Status](https://travis-ci.org/hypermodules/level-idx.svg?branch=master)](https://travis-ci.org/hypermodules/level-idx)
[![dependencies Status](https://david-dm.org/hypermodules/level-idx/status.svg)](https://david-dm.org/hypermodules/level-idx)
[![devDependencies Status](https://david-dm.org/hypermodules/level-idx/dev-status.svg)](https://david-dm.org/hypermodules/level-idx?type=dev)

[level-badge]: https://camo.githubusercontent.com/1bd15320a5fad1db168bba8bcedb098735f82464/68747470733a2f2f6c6576656c6a732e6f72672f696d672f62616467652e737667
[npm-image]: https://img.shields.io/npm/v/level-idx.svg
[npm-url]: https://www.npmjs.com/package/level-idx

## Usage

Index posts by title and body length, then query for them:

```js
var Index = require('level-idx')
var level = require('memdb')
var sub = require('subleveldown')

var db = level()
var posts = sub(db, 'posts', {valueEncoding: 'json'})
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
```

## API

### Index(db, idb)

Index `db` into `idb`.

### Index#by(name, props)

Create an index called `name` and index by `props`.

`props` should be a string or an array of strings that each name a property.
Deep object access is enabled via
[deep-access](https://github.com/juliangruber/deep-access). Use multiple
properties if you can't guarantee the uniqueness of the first property's
value.

If a property doesn't exist, e.g. if you want to index by `body.length` but there is no key `body`, it will be ignored.

### Index.db

The underlying `db`.

### Index.db.by{Name}.get(key[, opts], fn)
### Index.db.by{Name}.create{Key,Value,Read}Stream([opts])

See [level-auto-index](https://github.com/hypermodules/level-auto-index).

## Multilevel

Populate `db.methods` with the manifests of each indexed db.`object`:

```js
var index = require('level-idx');
var createManifest = require('level-manifest');

db.methods = {};
db.posts = index(db.sublevel('posts'))
  .by('Slug', ['slug'])
  .db;
db.methods.posts = {
  type: 'object',
  methods: createManifest(db.posts).methods
};
```

## See Also

This module is a port of [juliangruber/level-sec](https://github.com/juliangruber/level-sec) that works/uses [subleveldown](http://ghub.io/subleveldown) and [level-auto-index](http://ghub.io/level-auto-index).
