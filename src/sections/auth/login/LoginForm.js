import { useState, useEffect } from 'react';
// import { useEffect } from 'react';

import {useDispatch, useSelector} from 'react-redux'

import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { toast } from 'react-toastify'
import Iconify from '../../../components/iconify';
import { useLoginMutation } from '../../../slices/userApiSlice';
import { setCredentials } from '../../../slices/authSlice';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()


  const [login, {isLoading}] = useLoginMutation();

// useEffect(()=>{
//   if(userInfo){
//     navigate('/')
//   }
// }, [navigate, userInfo])

  const { userInfo } = useSelector((state)=>state.auth)

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async () => {
    console.log(email, password)
    try{
      const res = await login({email, password}).unwrap();
      dispatch(setCredentials({...res}))
      navigate("/")

    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
    // navigate('/dashboard', { replace: true });
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField 
        name="email" 
        value={email} 
        onChange={(e)=>setEmail(e.target.value)}
        label="Email address" />

        <TextField
          name="password"
          label="Password"
          value={password}
        onChange={(e)=>setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <Checkbox name="remember" label="Remember me" />
        <Link   variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
