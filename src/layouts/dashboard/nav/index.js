import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
// mock
import { UseSelector, useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { setAvatar } from '../../../slices/authSlice';
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import SvgColor from '../../../components/svg-color';

// import navConfig from './config';
// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius:5,
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state)=>state.auth)

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [avatarName,setAvatarName] = useState(userInfo.user_avatar)

  const handleAvatarChange = (newAvatar) => {
    dispatch(setAvatar(newAvatar));
    handleClose()
  };

  // navbar------------------------------------------
const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
  const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },

  {
    title: 'Cars',
    path: '/dashboard/cars',
    icon: icon('ic_cart'),
  },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

if(userInfo?.role==="admin"){
  navConfig.push(
    {
      title: 'Admin',
      path: '/dashboard/user',
      icon: icon('ic_user'),
    },
  )
}

if (!userInfo?.token) {
    navConfig.push(
      {
        title: 'login',
        path: '/login',
        icon: icon('ic_lock'),
      },
      {
        title: 'signup',
        path: '/signup',
        icon: icon('ic_blog'),
      }
    )
  }
  // ----------------------------------------------

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (


    
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{display:"flex", justifyContent:"center"}}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            You can change your avatar here using random words
          </Typography>
          </Box>
        <Box sx={{mt:3,display:"flex", justifyContent:"center", alignItems:"center"}}>
        <Avatar 
       
        sx={{cursor:"pointer",
        width: 56, height: 56
        }}  src={`https://api.multiavatar.com/${avatarName}.png`} alt="photoURL" />
        </Box>

        <Box sx={{mt:4,display:"flex", justifyContent:"center"}}>
        <TextField  
        id="standard-basic" 
        label="Type to Change" 
        
        onChange={(e)=>setAvatarName(e.target.value)}
        variant="standard" />
        </Box>

        <Box sx={{mt:4,display:"flex", justifyContent:"center"}}>
          <Button onClick={()=>handleAvatarChange(avatarName)}  variant="contained" color="info" >Save Avatar</Button>
        </Box>
        </Box>
      </Modal>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar onClick={handleOpen} sx={{cursor:"pointer"}}  src={userInfo.user_avatar?`https://api.multiavatar.com/${userInfo.user_avatar}.png` :account.photoURL} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                { userInfo ? (
                  userInfo.email
                  ) : ("none") }
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  { userInfo ? (
                  userInfo.role
                  ) : ("none") } 
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

    
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
