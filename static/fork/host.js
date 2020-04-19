const Manager = require('./HostManager')
let manager = new Manager()
process.on('message', function (args) {
  if (args.Server) {
    global.Server = args.Server
  } else {
    manager.exec(args)
  }
})
