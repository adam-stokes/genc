hb = require('handlebars')
fs = require('fs-extra-promise')

for partial in ['footer.hbs', 'header.hbs', 'sidebar.hbs']
  hb.registerPartial partial, fs.readFileSync("templates/partials/#{partial}").toString()

config =
  templates:
    single: "templates/single.hbs"
    feed: "templates/feed.hbs"
    sitemap: "templates/sitemap.hbs"
    home: "templates/home.hbs"

module.exports = config
