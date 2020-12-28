const Author = require('../models/author')

const authorResolvers = {
  Query: {
    authorCount: () => Author.collection.countDocuments(),
    allAuthors: async() => await Author.find({}),
  },
  Mutation: {
    editAuthor: async (root, args, context) => {
      if(!context.currentUser) {
        throw new AuthenticationError('User not authenticated.')
      }

      let author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo

      try {
        await author.save()
      } catch(error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }

      return author
    }
  },
  Author: {
    bookCount: (root) => {
      return root.books.length
    }
  },
}

module.exports = authorResolvers