import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = ({ show, allBooks }) => {
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)
  const [books, setBooks] = useState(allBooks)

  const showBooksByGenres = genre => {
    getBooks({ variables: { genre }})
  }

  useEffect(() => {
    if(result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result])

  if (!show ) {
    return null
  }

  if(books.length === 0) {
    return <div>No books has been added yet.</div>
  }

  let allGenres = []
  allBooks.forEach(book => {
    allGenres = allGenres.concat(book.genres)
  })

  allGenres = [ ...new Set(allGenres)]

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(book =>
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      { allGenres.map(genre => (
        <button key={genre} onClick={() => showBooksByGenres(genre)}>{genre}</button>
      ))}
      <button onClick={() => showBooksByGenres(null)}>All genres</button>
    </div>
  )
}

export default Books