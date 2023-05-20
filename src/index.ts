import logger from './logger'
import main from './main'

await main.start()

logger.log('运行完成!')
process.exit()
