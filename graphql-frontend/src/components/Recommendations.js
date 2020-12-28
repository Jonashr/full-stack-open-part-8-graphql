import React from 'react'
import { useQuery } from '@apollo/client'
import { ME } from '../queries'

const Recommendations = ({ show, books}) => {
  const me = useQuery(ME)

  if(!show) {
    return null
  }

  if(me.loading) {
    return (<div>Loading..</div>)
  }

  const favoriteGenre = me.data.me.favoriteGenre.toLowerCase()
  const recommendedBooks = books.filter(book => book.genres.includes(favoriteGenre))


  if(recommendedBooks.length === 0) {
    return (
      <div>
        <h2>Books</h2>
        <div>No books in recommended genre <strong>{favoriteGenre}</strong> was found.</div>
      </div>
    )
  }

  return (
    <div>
      <h2>Books</h2>
      In genre <strong>{favoriteGenre}</strong>
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

          {recommendedBooks.map(book =>
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
