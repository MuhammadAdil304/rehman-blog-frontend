import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../../firebase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signInFailure, signInSuccess } from '../redux/user/userSlice'

export default function MAOAuth() {
  const auth = getAuth(app)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })

      const resultsFromGoogle = await signInWithPopup(auth, provider)
      const userData = {
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        googlePhotoUrl: resultsFromGoogle.user.photoURL
      }
      const responce = await axios.post('http://localhost:3000/api/auth/google', userData)
      dispatch(signInSuccess(responce.data))
      console.log(responce.data)
      navigate('/')
    }
    catch (error) {
      dispatch(signInFailure(error.message))
    }
  }
  return (
    <Button type='button' gradientDuoTone='cyanToBlue' outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='w-6 h-6 mr-2' />
      Continue With Google
    </Button>
  )
}
