import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [errMessage, setErrMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.userName || !formData.email || !formData.password) {
      return setErrMessage('Please Fill Out All Fields')
    }
    setLoading(true)
    setErrMessage(null)
    axios.post('https://rehman-blog-backend.vercel.app/api/auth/signup', formData)
      .then((res) => {
        if (res?.data?.isSuccessfull == true) {
          navigate('/sign-in')
          setLoading(false)   
        }
        else{
          setErrMessage(res.data.error)
          setLoading(false)
        }
      })
      .catch((err) => {
        setErrMessage(err.message)
        setLoading(false)
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
            Explore our platform with ease. Sign Up securely using your email and password, or opt for the convenience of Google authentication.
          </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your Username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='userName'
                onChange={handleChange}
              />
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
                placeholder='Password'
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
                ) : 'Sign Up'
              }
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-600 underline'>
              Sign In
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
