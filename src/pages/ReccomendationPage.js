import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import { Container, Stack, MenuItem, Typography, Button, Menu, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import './index.css';
import Chip from '@mui/material/Chip';

import Modal from '@mui/material/Modal';
// components
import axios from 'axios';

import RingLoader from 'react-spinners/RingLoader';

const override = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red',
};

export default function ReccomendationPage() {
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState('#36d7b7');

  const [myproduct, setMyProduct] = useState([]);

  const fetchData = async () => {
    try {
      // Get the token from localStorage

      const userInfoString = localStorage.getItem('userInfo');
      if (!userInfoString) {
        console.error('User info not found in localStorage');
        return;
      }
      const userInfo = JSON.parse(userInfoString);
      if (!userInfo || !userInfo.token) {
        console.error('Invalid user info or missing token');
        return;
      }
      // const token = userInfo.token;

      const token = userInfo.token;
      const vallet = userInfo.valetKey;

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const headers2 = {
        Authorization: `Bearer ${vallet}`,
      };

      const response = await axios.get('https://localhost:7104/api/recomentations/cars', { headers });

      const car = response.data[0];
      try {
        const imageResponse = await axios.get(`https://localhost:5401/api/file/${car.carId}`, {
          headers: headers2,
          responseType: 'blob',
        });
        const imageUrl = URL.createObjectURL(imageResponse.data);
        car.image = imageUrl;
      } catch (error) {
        console.error(`Error fetching image data for car with ID ${car.carId}:`, error);
      }

      console.log(car);
      setMyProduct(car);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    setTimeout(fetchData, 5000);
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Reccomendations
        </Typography>

        {loading ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
              <Box>
                <Typography variant="h5">Calculating based on your preferences . . .</Typography>
              </Box>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
              <Box>
                <Typography variant="h5">Your Next Car Should Be</Typography>
              </Box>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
          {loading ? (
            <>
              <RingLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={250}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </>
          ) : (
            <>
              <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={6}>
                  <Box className="detailBoxParent" sx={{ p: 3 }}>
                    <Box
                      className="detailBox"
                      sx={{
                        // width: 300,
                        height: 500,
                        backgroundColor: 'primary.dark',
                        borderRadius: '10px',
                        backgroundImage: `url('${myproduct.image}')`, // Added this line
                        backgroundSize: 'cover', // Make sure image covers the box
                        backgroundPosition: 'center', // Center the image
                      }}
                    >
                      {' '}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box className="detailBoxParent2" sx={{ p: 3 }}>
                    <Box
                      className="detailBox2"
                      sx={{
                        width: '100%',
                        height: 500,
                        borderRadius: '10px',
                        p: 3,
                      }}
                    >
                      <Box>
                        <Chip className="mychip" label={myproduct.status} />
                      </Box>
                      <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="h6">
                          {myproduct.brand} {myproduct.model}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="h4">{myproduct.price}€ / Month</Typography>
                      </Box>
                      <Box>
                        {myproduct !== '' ? (
                          <>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <Typography variant="body1">Seats: {myproduct.seats}</Typography>
                            </Box>
                          </>
                        ) : (
                          <></>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </div>

        {/* <ProductCartWidget /> */}
      </Container>
    </>
  );
}
