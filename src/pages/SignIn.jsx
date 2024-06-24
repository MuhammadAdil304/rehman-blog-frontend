import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice'
import axios from 'axios'
import MAOAuth from '../components/MAOAuth'

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const { loading, error: errMessage } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please Fill Out All Fields'))
    }
    dispatch(signInStart())
    axios.post('http://localhost:3000/api/auth/signIn', formData)
      .then((res) => {
        console.log(res)
        if (res?.data?.isSuccessfull == true) {
          dispatch(signInSuccess(res?.data?.data))
          navigate('/')
        }
        else {
          dispatch(signInFailure(res?.data?.error))
        }
      })
      .catch((err) => {
        dispatch(signInFailure(err.message))
      })
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
          <Link to='/' className=' text-4xl font-bold'>
            <span className='px-2 py-1  text-white  bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500 rounded-lg'>Rehman's</span>
            Blog
          </Link>
          <p className='mt-5 text-sm'>
            Explore our platform with ease. Sign in securely using your email and password, or opt for the convenience of Google authentication.
          </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
            </div>
            <div>
              <Label value='Your Email' />
              <TextInput
                type='email'
                placeholder='name@gmail.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your Password' />
              <TextInput
                type='password'
                placeholder='*******'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='cyanToBlue' type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : 'Sign In'
              }
            </Button>
            <MAOAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Dont Have An Account</span>
            <Link to='/sign-up' className='text-blue-600 underline'>
              Sign Up
            </Link>
          </div>
          {
            errMessage && (
              <Alert className='mt-5' color='failure'>
                {errMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
