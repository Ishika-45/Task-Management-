import React from 'react'
import { SignIn } from '@clerk/clerk-react'

const SignInPage = () => {
  return (
    <div className='flex items-center justify-center min-h-screen '>
      <SignIn routing='path' path='/sign-in' />
    </div>
  )
}

export default SignInPage
