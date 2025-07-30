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
var request = require('request');

module.exports = {
  events:{
    afterTransformers(html, orgConfig){
      let content = html
      let config = {
        url: 'https://api.docraptor.com/docs',
        encoding: null, //IMPORTANT! This produces a binary body response instead of text
        headers: {
          'Content-Type': 'application/json'
        },
        json: {
          user_credentials: "Ll1tdzCraKVOKHE0GcNh",
          doc: {
            document_content: content,
            type: "pdf",
            test: true,
            prince_options: {
               media:   "screen",          // use screen styles instead of print styles
            //   baseurl: "http://hello.com" // URL to use for generating absolute URLs for assets from relative URLs
            }
          }
        }
      };
      request.post(config, function(err, response, body) {
        fs.writeFile('doc_raptor_sample.pdf', body, "binary", function(writeErr) {
          console.log('Saved!');
        });
      });
      return html
    }
  },
  build: {
    templates: {
      source: 'src/templates/',
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
              let fileExt = imgsrcpath.split('.').pop()
              if (fileExt == 'png'){
                node.attrs.src = `data:image/png;base64,` + base64string
              } else if(fileExt=='jpg' || fileExt =='jpeg'){
                node.attrs.src = `data:image/jpeg;base64,` + base64string
              }
            }

            return node
          }

          return tree.walk(process)
        })()
      ]
    },
  },
}
