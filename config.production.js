/*
|-------------------------------------------------------------------------------
| Production config                       https://maizzle.com/docs/environments
|-------------------------------------------------------------------------------
|
| This is where you define settings that optimize your emails for production.
| These will be merged on top of the base config.js, so you only need to
| specify the options that are changing.
|
*/
const fs = require('node:fs');

module.exports = {
  build: {
    templates: {
      destination: {
        path: 'build_production',
      },
      assets: {
        source: 'src/images/',
        destination: 'images',
      },
    },
    layouts: {
      root: "src/layouts/"
    },
    components: {
      root: "src/components/"
    },
    posthtml: {
      plugins: [
        (() => tree => {
          const process = node => {
            if (node.tag === 'img' && node.attrs?.src) {
              const imgsrcpath = node.attrs.src.replace('../','src/')
              const img = fs.readFileSync(imgsrcpath);

              let base64string = Buffer.from(img).toString('base64')
              node.attrs.src = `data:image/png;base64,` + base64string
            }

            return node
          }

          return tree.walk(process)
        })()
      ]
    }
  },
  inlineCSS: true
}
