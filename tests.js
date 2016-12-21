import chai from 'chai'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

const context = require.context('./src', true, /.+\.test\.js$/)
context.keys().forEach(context)

module.exports = context
