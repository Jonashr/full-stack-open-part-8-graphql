import { useMutation } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import { LOGIN } from '../queries'

const LoginForm = ( {  setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [ login, result] = useMutation(LOGIN, {
    onError: (error) => [
      setError(error.graphQLErrors[0].message)
    ]
  })

  useEffect(() => {
    if(result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  const submit = async event => {
    event.preventDefault()
    setError('')
    login({ variables: { username, password }})
  }

  return (
    <div>
      { error && <p>{ error }</p> }
      <form onSubmit={submit}>
        <div>
          <label>Username</label>
          <input onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type='password' onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginForm
