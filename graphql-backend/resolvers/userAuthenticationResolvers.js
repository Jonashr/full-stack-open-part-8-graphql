const User = require('../models/user')
const { UserInputError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const userAuthenticationResolvers = {
  Query: {
    me: ( _, __, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })

      try {
        return await user.save()
      } catch(error) {
        throw new UserInputError(error.message, { 
          invalidArgs: args
        })
      }
    },
    login: async(root, args) => {
      const user = await User.findOne({ username: args.username })

      if(!user || args.password !== 'secred') {
        throw new UserInputError("wrong credentials")
      }

      const userToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userToken, JWT_SECRET) }
    }
  }
}

module.exports = userAuthenticationResolvers