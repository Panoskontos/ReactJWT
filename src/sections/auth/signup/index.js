import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { useSignupMutation } from '../../../slices/userApiSlice';
// components
import Iconify from '../../../components/iconify';
// import { useSignupMutation } from 'src/slices/userApiSlice';
// ----------------------------------------------------------------------

export default function SignUpForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const [signup, { isLoading }] = useSignupMutation();

  const handleClick = async () => {
    console.log(email, password);
    try {
      const res = await signup({ email, password, username }).unwrap();
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <>
      <Stack spacing={2}>
        <TextField value={username} onChange={(e) => setUsername(e.target.value)} name="text" label="Username" />

        <TextField value={email} onChange={(e) => setEmail(e.target.value)} name="email" label="Email address" />

        <TextField
          name="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

      <LoadingButton
        style={{ marginTop: 20 }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={handleClick}
      >
        Sign Up
      </LoadingButton>
    </>
  );
}
