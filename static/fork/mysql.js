const Manager = require('./MysqlManager')
let manager = new Manager()
process.on('message', function (args) {
  if (args.Server) {
    global.Server = args.Server
    manager.init()
  } else {
    manager.exec(args)
  }
})
