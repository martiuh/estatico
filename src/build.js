import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerLocation } from '@reach/router'

import { assetsByChunkName as estaticoStats} from '../dist/stats.json'
import manifest from '../dist/estatico-assets-manifest.json'
import DefaultHtml from './DefaultHtml'
import template from './template'
import EstaticoRoutes from './EstaticoRoutes'
// 1. Get Pages
// 2. Make routes according to filename

export default function(locals) {
  const { routes } = locals
  const fileName = routes[locals.path] // The name of the component
  const chunkName = fileName.split('.js')[0]
  const pageLocation = manifest[fileName] // Esto va a pasarse por window. para que lo renderé en el client side
  let chunkFiles = []
  Object.keys(estaticoStats).map(chunk => {
    const chunks = chunk.split('-')
    const fileIndex = chunks.indexOf(chunkName)
    if (fileIndex >= 0) {
      const files = estaticoStats[chunk]
      if (Array.isArray(files)) {
        return files.forEach(F => chunkFiles.push(F))
      }
      return chunkFiles.push(files)
    }

    return false
  })

  const organizeChunks = arr => {
    const js = []
    const css = []

    arr.forEach(A => {
      if (A.match(/\.js$/)) {
        js.push(A)
      }
      else if(A.match(/\.css$/)) {
        css.push(A)
      }
    })
    return { js, css }
  }

  chunkFiles = chunkFiles.filter(files => !!files)
  const { js, css } = organizeChunks(chunkFiles)
<<<<<<< HEAD
  const cssArr = css
  let jsArr = [
    ...js,
    estaticoManifest['vendors-bundle'],
    estaticoManifest['bundle']
  ]

=======
  const addPath = value => `/${value}`
  const bundleChunks = organizeChunks(estaticoStats['bundle'])
  let jsArr = [...js, ...bundleChunks.js]
>>>>>>> e2cf25800d4d920449687b6a6d0686001e026b3c
  jsArr = jsArr.filter(value => !!value)
  jsArr = jsArr.map(addPath)

  let cssArr = [...css, ...bundleChunks.css]
  cssArr = cssArr.filter(value => !!value)
  cssArr = cssArr.map(addPath)

<<<<<<< HEAD
  const Pages = Object.keys(routes).map(P => {
=======
  let pages = {}
  Object.keys(routes).map(P => {
>>>>>>> e2cf25800d4d920449687b6a6d0686001e026b3c
    // BUG: Without this require I'm not able to run the builder
    require(`./pages/${routes[P]}`)
    pages = {
      ...pages,
      [P]: manifest[routes[P]]
    }
  })

  // Instead of sending the page, I'd rather send the location and I avoid all the hassle
  const url = locals.path
  const App = () => (
    <ServerLocation url={url}>
      <EstaticoRoutes />
    </ServerLocation>
  )
  const appString = renderToString(<App />)
<<<<<<< HEAD
  return template(appString, { Pages, js: jsArr, css: cssArr })
=======
  return template(appString, { pages, js: jsArr, css: cssArr })
>>>>>>> e2cf25800d4d920449687b6a6d0686001e026b3c
}
