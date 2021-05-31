module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
        'es.object.assign',
        'es.array.reduce',
        'es.array.from',
        'es.array.flat-map',
        'es.promise',
        'es.symbol',
        'es.string.starts-with'
      ]
    }]
  ]
}
