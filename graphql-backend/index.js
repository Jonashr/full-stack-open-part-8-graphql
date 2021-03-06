require('dotenv').config()
const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const User = require('./models/user')
const jwt = require('jsonwebtoken')
const typeDefs = require('./typedefs')
const resolvers = require('./resolvers')

const MONGODB_URI = process.env.MONGODB_URI

const JWT_SECRET = process.env.JWT_SECRET

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('Connected to DB')
  })
  .catch(error => {
    console.log('Error connecting to DB', console.log(error))
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async({ req }) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})