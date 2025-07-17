import React from 'react'
import { SignUp } from '@clerk/clerk-react'

const SignUpPage = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <SignUp routing='path' path='/sign-up' />
    </div>
  )
}

export default SignUpPage
