var AutoIndex = require('level-auto-index')
var access = require('deep-access')
var sub = require('subleveldown')

module.exports = Idx

function Idx (db, idb, opts) {
  if (!(this instanceof Idx)) return new Idx(db, idb, opts)
  if (!opts) opts = {}
  this.db = db
  this.db.methods = this.db.methods || {}
  this.idb = idb
  this.keyEncoding = opts.keyEncoding || 'utf8'
  this.keyFn = opts.keyEncoding && opts.keyEncoding.type === 'bytewise-core'
    ? keyFns.bytewise
    : keyFns.utf8
}

var keyFns = {
  utf8: function (segs) { return segs.join('!') },
  bytewise: function (segs) { return segs }
}

Idx.prototype.by = function (name, props) {
  if (!Array.isArray(props)) props = [props]

  var self = this

  var autoIdx = AutoIndex(
    this.db,
    sub(this.idb, name, {
      valueEncoding: this.db.options.keyEncoding,
      keyEncoding: this.keyEncoding
    }),
    reducer
  )

  function reducer (value) {
    var segs = []
    props.forEach(function (prop) {
      try {
        var seg = access(value, prop)
      } catch (e) {
        return
      }
      segs.push(seg)
    })
    return self.keyFn(segs)
  }

  this.db['by' + name] = autoIdx
  this.db.methods['by' + name] = {
    type: 'object',
    methods: autoIdx.manifest.methods
  }
  return this
}
