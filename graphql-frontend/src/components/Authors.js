  
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_BIRTH_YEAR } from '../queries'
import Select from 'react-select'

const Authors = ({ show, authors}) => {
  const [ born, setBornTo] = useState('')
  const [ name, setName] = useState('')

  const [ updateBirthYear ] = useMutation(UPDATE_BIRTH_YEAR) 

  
  if (!show || authors.length === 0) {
    return null
  }

  console.log('Authors..', authors)


  const authorValues = authors.map(author => {
    return ({
      value: author.name,
      label: author.name
    })
  })


  const handleNameChange = async (event) => {
    event.preventDefault()

    updateBirthYear({ variables: { name: name.value, born }})

    setBornTo('')
    setName('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <form onSubmit={handleNameChange}>
        <div>
          <Select 
            defaultValue={authorValues[0].value}
            isMulti={false}
            options={authorValues}
            value={name}
            onChange={(name => setName(name))}
          />
        </div>
        <div>
          <label>Birth year</label>
          <input type='number' value={born} onChange={({ target}) => setBornTo(Number(target.value))} />
        </div>
        <button type='submit'>Change birth year</button>
      </form>      
    </div>
  )
}

export default Authors
