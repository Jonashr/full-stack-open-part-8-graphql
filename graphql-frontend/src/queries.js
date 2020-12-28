import { gql } from '@apollo/client'

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    name
    id
    born
    bookCount
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql`
  query findAllBooksByGenre($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
        born
        id
      }
      published
      genres
      id
    }
  }
`

export const ALL_BOOKS_BY_GENRE = gql`
query($genre: String) {
  allBooks {
    title
    author {
      name
      born
      id
    }
    published
    genres
    id
  }
}
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const UPDATE_BIRTH_YEAR = gql`
   mutation updateBirthYear(
     $name: String!
     $born: Int!
   ) {
     editAuthor(
       name: $name
       setBornTo: $born
     ) {
       name
       id
       born
       bookCount
     }
   }
`

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title
    author: $author
    published: $published
    genres: $genres
  ) {
    title
    author {
      name
    }
    published
    genres
    id

  }
}`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username
      password: $password
    ) {
      value
    }
  }
`

