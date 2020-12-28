const booksResolvers = require('./booksResolvers');
const authorResolvers = require('./authorsResolvers')
const userAuthenticationResolvers = require('./userAuthenticationResolvers')


const resolvers = [booksResolvers, authorResolvers, userAuthenticationResolvers];

module.exports = resolvers