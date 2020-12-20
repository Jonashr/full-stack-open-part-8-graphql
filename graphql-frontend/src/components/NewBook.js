import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'


const NewBook = ({ show }) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [error, setError] = useState('')

  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ {query: ALL_BOOKS }, { query: ALL_AUTHORS} ],
    onError: ({ graphQLErrors, networkError}) => {
      console.log('ERROR', JSON.stringify(graphQLErrors), JSON.stringify(networkError))
      if (graphQLErrors) {
        setError(graphQLErrors[0].message)   
      }

    }
  })
  
  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    if(title === '' || author === '' || isNaN(Number(published))) {
      setError('Input error')
      return 
    }

    const publishedNumber = Number(published)
    
    createBook({ variables: { title, author, publishedNumber, genres}})

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      { error && <p>{ error }</p> }
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook