import React, { useState } from 'react'


const Books = ({ show, books }) => {
  const [filter, setFilter] = useState(null)
  if (!show ) {
    return null
  }

  if(books.length === 0) {
    return <div>No books has been added yet.</div>
  }

  let allGenres = []
  books.forEach(book => {
    allGenres = allGenres.concat(book.genres)
  })

  allGenres = [ ...new Set(allGenres)]

  const filteredBooks = filter ? books.filter(book => book.genres.includes(filter)) : books 

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
          {filteredBooks.map(book =>
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      { allGenres.map(genre => (
        <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
      ))}
      <button onClick={() => setFilter(null)}>All genres</button>
    </div>
  )
}

export default Books