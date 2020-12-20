const { ApolloServer, UserInputError, gql, buildSchemaFromTypeDefinitions, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { response } = require('express')

const JWT_SECRET = 'MY_SECRET_KEY'

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author!]!
    me: User
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

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Book.collection.countDocuments(),
    allBooks: async (root, args, context) => {
      const books = await Book.find({}).populate('author')
      return books

    }, 
    allAuthors: async() => await Author.find({}),
    me: ( _, __, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: (root) => {
      return root.books.length
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

      return book
    },
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
    },
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

      console.log('User', user)
      console.log('assword', args.password)

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

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})