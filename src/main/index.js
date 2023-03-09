import Launcher from './Launcher'
import path from 'path'
import logger from './core/Logger.js'

const argv = process.argv
logger.info('APP args', argv)
global.__app_dir = path.dirname(argv[0])
global.__static = path.resolve(__dirname, 'static/').replace(/\\/g, '\\\\')
global.launcher = new Launcher()
