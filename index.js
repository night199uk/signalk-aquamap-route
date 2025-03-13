/*
 * Copyright 2018 Teppo Kurki <teppo.kurki@iki.fi>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const tj = require('@mapbox/togeojson')
const fs = require('fs')
const path = require('path')
const xmldom = new (require('xmldom').DOMParser)()
const get = require('lodash.get')
const uuidv3 = require('uuid/v3')
const url = require('url');

module.exports = function (app) {
  const error =
    app.error ||
    (msg => {
      console.error(msg)
    })
  const debug =
    app.debug ||
    (msg => {
      console.log(msg)
    })

  const plugin = {}

  plugin.start = function (props) {}

  plugin.stop = function () {}

  plugin.statusMessage = function () {}

  plugin.id = 'signalk-aquamap-route'
  plugin.name = 'SignalK Aqua Map Routes'
  plugin.description =
    'Plugin to expose routes from Aqua Map via the SignalK routes API'

  plugin.schema = {
    type: 'object',
    properties: {}
  }

  plugin.signalKApiRoutes = router => {
    router.get('/resources/routes', (req, res) => {
      const features = readGpxDirectory(
        path.join(__dirname, 'samples/routes'),
        app.selfId
      )
      for (var id in features) {
        const feature = features[id]
        feature.properties.type = 'route'
      }
      res.json(features)
    })

    return router
  }

  return plugin

  function readGpxDirectory (dir, uuidNamespace) {
// params = {
//     'username': 'night199uk',
//     'cmd': 'open',
//     'target': 'l1_Lw',
//     'init': '1',
//     'tree': '1',
// }
// 
// response = requests.get(
//     'https://www.globalterramaps.com/lib/elFinder-2.1.40/php/connector.minimal.php',
//     params=params,
// )
// files = response.json()['files']
// for file in files:
//     if file['mime'] == 'application/gpx+xml':
//         data = {
//             'user': 'night199uk',
//             'link': 'userareas/night199uk/night199uk-root/{}'.format(file['name']),
//         }
//         response = requests.post('https://www.globalterramaps.com/GetTrackFile.php', data=data)
//         print(response.text)
    var url = new url.URL('https://www.globalterramaps.com/lib/elFinder-2.1.40/php/connector.minimal.php')
    var params = {
      username: 'night199uk',
      cmd: 'open',
      target: 'l1_Lw',
      init: 1,
      tree: 1,
    }
    url.search = new url.URLSearchParams(params).toString()
    result = fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      data['files'].forEach(function(obj) { console.log(obj.id); });
    })
    console.log(result)
  }
//    return fs.readdirSync(dir).reduce((acc, filename) => {
//      try {
//        const geojson = tj.gpx(
//          xmldom.parseFromString(
//            fs.readFileSync(path.join(dir, filename), 'utf8')
//          )
//        )
//        if (
//          geojson.type === 'FeatureCollection' &&
//          Array.isArray(geojson.features)
//        ) {
//          geojson.features.forEach((feature, i) => {
//            acc[uuidv3(filename + i, uuidNamespace)] = feature
//          })
//        }
//      } catch (e) {
//        console.error(e)
//      }
//      return acc
//    }, {})
}
