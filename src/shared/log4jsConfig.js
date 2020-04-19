const log4js = require('log4js')
const { join } = require('path')
let programName = 'log4jstest'

log4js.configure({
  appenders: {
    console: {// 记录器1:输出到控制台
      type: 'console'
    },
    log_file: {// 记录器2：输出到文件
      type: 'file',
      filename: join(process.env.APP_DIR, `/logs/${programName}.log`), // 文件目录，当目录文件或文件夹不存在时，会自动创建
      maxLogSize: 20971520, // 文件最大存储空间（byte），当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
      backups: 3, // default value = 5.当文件内容超过文件存储空间时，备份文件的数量
      // compress : true,//default false.是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
      encoding: 'utf-8'// default "utf-8"，文件的编码
    },
    data_file: {// ：记录器3：输出到日期文件
      type: 'dateFile',
      filename: join(process.env.APP_DIR, `/logs/${programName}`), // 您要写入日志文件的路径
      alwaysIncludePattern: true, // （默认为false） - 将模式包含在当前日志文件的名称以及备份中
      daysToKeep: 10, // 时间文件 保存多少天，距离当前天daysToKeep以前的log将被删除
      // compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
      pattern: '-yyyy-MM-dd-hh.log', // （可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
      encoding: 'utf-8'// default "utf-8"，文件的编码
    },
    error_file: {// ：记录器4：输出到error log
      type: 'dateFile',
      filename: join(process.env.APP_DIR, `/logs/${programName}_error`), // 您要写入日志文件的路径
      alwaysIncludePattern: true, // （默认为false） - 将模式包含在当前日志文件的名称以及备份中
      daysToKeep: 10, // 时间文件 保存多少天，距离当前天daysToKeep以前的log将被删除
      // compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
      pattern: '_yyyy-MM-dd.log', // （可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
      encoding: 'utf-8'// default "utf-8"，文件的编码
      // compress: true, //是否压缩
    }
  },
  categories: {
    default: { appenders: ['data_file', 'console', 'log_file'], level: 'info' }, // 默认log类型，输出到控制台 log文件 log日期文件 且登记大于info即可
    production: { appenders: ['data_file'], level: 'warn' }, // 生产环境 log类型 只输出到按日期命名的文件，且只输出警告以上的log
    console: { appenders: ['console'], level: 'debug' }, // 开发环境  输出到控制台
    debug: { appenders: ['console', 'log_file'], level: 'debug' }, // 调试环境 输出到log文件和控制台
    error_log: { appenders: ['error_file'], level: 'error' }// error 等级log 单独输出到error文件中 任何环境的errorlog 将都以日期文件单独记录
  }
})

module.exports = log4js.getLogger('console')
module.exports.error = log4js.getLogger('error_log')// error单独输出到一个文件中
