const Book = require('../models/book');
const Author = require('../models/author')
const { PubSub, UserInputError, AuthenticationError } = require('apollo-server')

const pubsub = new PubSub()

const booksResolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    allBooks: async (root, args, context) => {
      const books = await Book.find({}).populate('author')
      return books
    }
  },
  Mutation: {
    addBook: async(_, args, context) => {
      if(!context.currentUser) {
        throw new AuthenticationError('User not authenticated.')
      }

      let author = await Author.findOne({ name: args.author })

      if(!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          });
        }
      } 

      let book = new Book({ 
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres}
      )

      try {
        await book.save()

        author.books = author.books.concat(book._id)
    
        await author.save()
    
        await book.populate("author").execPopulate()

      } catch(error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }

      await pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = booksResolvers