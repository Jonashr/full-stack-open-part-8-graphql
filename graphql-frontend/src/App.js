
import React, { useState, useEffect } from 'react'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'

const App = () => {
  const [page, setPage] = useState('authors')
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const[token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if(token) {
      setToken(token)
    }

  }, [])

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => set.map(p => p.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) },
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      alert(`Added.....${addedBook.title}`)
      updateCacheWith(addedBook)
    },
  })

  if(authors.loading || books.loading) {
    return <div>Loading...</div>
  }


  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>Authors</button>
        <button onClick={() => setPage('books')}>Books</button>

        { token &&
          <>
            <button onClick={() => setPage('add')}>Add book</button>
            <button onClick={() => setPage('recommendations')}>Recommendations</button>
            <button onClick={logout}>Logout</button>
          </>
        }
        { !token && 
          <button onClick={() => setPage('login')}>Login</button> 
        }
      </div>
      
      
      <Authors
        show={page === 'authors'}
        authors={authors.data.allAuthors}
        token={token}
      />

      <Books
        show={page === 'books'}
        books={books.data.allBooks}
      />

      <Recommendations
        show={page === 'recommendations'}
        books={books.data.allBooks}
      />

      <NewBook
        show={page === 'add'}
        ALL_BOOKS={ALL_BOOKS}
      />

      { !token && page === 'login' &&
        <LoginForm 
          setToken={setToken}
        />
      }
    </div>
  )
}

export default App