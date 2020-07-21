import is from 'electron-is'

export default {
  index: {
    attrs: {
      title: 'BuildPhp',
      width: 1280,
      height: 768,
      minWidth: 400,
      minHeight: 420,
      // backgroundColor: '#FFFFFF',
      transparent: !is.windows()
    },
    bindCloseToHide: true,
    url: is.dev() ? `http://localhost:9080` : `file://${__dirname}/index.html`
  }
}
