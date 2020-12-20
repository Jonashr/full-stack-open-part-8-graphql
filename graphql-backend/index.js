const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')

const MONGODB_URI='mongodb+srv://mydbuser:KGC2xXxSVZbMioV5@cluster0.jvyj2.mongodb.net/library?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('Connected to DB')
  })
  .catch(error => {
    console.log('Error connecting to DB', console.log(error))
})

const typeDefs = gql`
  type Book {
    title: String!
    author: Author!
    published: String!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    books: [Book]!
    id: ID
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author!]!
  }
  
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate('author')
      return books

    }, 
    allAuthors: async() => await Author.find({})
  },
  Author: {
    bookCount: (root) => {
      return root.books.length
    }
  },
  Mutation: {
    addBook: async(_, args) => {
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

      return book
    },
    editAuthor: async (root, args) => {
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
  }
}



const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})