import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import './index.css';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
// import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const style = {
  position: 'absolute' as 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height: '300px',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function getFifthOfEachMonth(monthArray: any) {
  const fifthDates: any = [];
  monthArray.forEach((monthString: any) => {
    const [year, month] = monthString.split('-');
    const utcDate = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, 5)); // Provide radix 10 for decimal numbers
    fifthDates.push(utcDate);
  });
  return fifthDates;
}

function getMonthsBetweenDates(startDate: any, endDate: any) {
  const months = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const year = currentDate.getUTCFullYear();
    const month = currentDate.getUTCMonth() + 1; // Add 1 because months are zero-indexed
    const formattedMonth = `${year}-${month.toString().padStart(2, '0')}`;
    months.push(formattedMonth);
    // Move to the next month
    currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
  }
  console.log(getFifthOfEachMonth(months));
  return getFifthOfEachMonth(months);
}

const Product: React.FC = () => {
  const location = useLocation();

  const [myproduct, setMyproduct] = useState('');
  const [rent, setRent] = useState('');
  const [bannedMonths, setBannedMonths] = useState<Date[] | null>(null);

  const { i, n, b, p, c, s } = location.state;

  function convertUnixTimestampToUTCDate(unixTimestamp: any) {
    return new Date(unixTimestamp * 1000);
  }

  // 8 Aug
  const excludedDate1 = convertUnixTimestampToUTCDate(1691442000);
  console.log(excludedDate1);
  // Nov 01
  const excludedDate2 = convertUnixTimestampToUTCDate(1698789600);
  console.log(excludedDate2);

  const [finalPrice, setFinalPrice] = useState(0);
  const [finalBookedMonths, setFinalBookedMonths] = useState(0);

  const [excludedArray, setExcludedArray] = useState(getMonthsBetweenDates(excludedDate1, excludedDate2));

  function calculateMonthsBetween(date1: any, date2: any) {
    // Ensure date1 is before date2
    if (date1 > date2) {
      [date1, date2] = [date2, date1];
    }

    let years = date2.getFullYear() - date1.getFullYear();
    let months = date2.getMonth() - date1.getMonth();
    const days = date2.getDate() - date1.getDate();

    // Decrease year by 1 if date2's month is less than date1's month
    if (months < 0 || (months === 0 && days < 0)) {
      years -= 1;
      months += 12;
    }

    // If date2's day is less than date1's day, decrease months by 1
    if (days < 0) {
      months -= 1;
    }

    const monthsBetween = years * 12 + months;

    return monthsBetween;
  }

  function getFirstDays(start: any, end: any) {
    const startDate1 = new Date(start);
    const endDate1 = new Date(end);

    const current = startDate1;
    current.setDate(1);

    const firstDays = [];

    while (current <= endDate1) {
      firstDays.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return firstDays;
  }

  function convertUTCDateToUnixTimestamp(utcDate: any) {
    console.log(utcDate);
    return Math.floor(utcDate.getTime() / 1000);
  }

  const handlePayNow = () => {
    const unixTimestampStart: any = convertUTCDateToUnixTimestamp(startDate);
    const unixTimestampEnd: any = convertUTCDateToUnixTimestamp(endDate);

    const data = {
      carId: i,
      dateFrom: unixTimestampStart,
      dateTo: unixTimestampEnd,
    };

    // Get the token from localStorage
    const userInfoString = localStorage.getItem('userInfo');
    if (!userInfoString) {
      console.error('User info not found in localStorage');
      return;
    }
    // Parse the userInfo object
    const userInfo = JSON.parse(userInfoString);
    if (!userInfo || !userInfo.token) {
      console.error('Invalid user info or missing token');
      return;
    }

    // Get the token from the userInfo object
    const token = userInfo.token;

    // Include the token in the headers of the request
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Make the POST request using axios
    axios
      .post('https://localhost:7104/api/rent', data, { headers })
      .then((response) => {
        // Handle the response if needed (e.g., show a success message)
        toast.success(`You have successfully booked ${n} for ${finalBookedMonths} months !`, {
          position: toast.POSITION.TOP_CENTER,
        });
        setFinalBookedMonths(0);
        // concat excluded dates
        const concatenatedArray: any[] = excludedArray.concat(bannedMonths);

        setExcludedArray(concatenatedArray);
        console.log(concatenatedArray);
        console.log('Data saved successfully:', response.data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the POST request
        console.error('Error saving data:', error);
      });
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const [price, setPrice] = useState(400)

  const [startDate, setStartDate] = useState(new Date('2023/08/08'));
  const [endDate, setEndDate] = useState(new Date('2023/08/09'));
  const filterPassedTime = (time: any) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  const handleBookDates: any = () => {
    // console.log("hey")
    const months = calculateMonthsBetween(startDate, endDate);
    console.log(months);

    const firstDays = getFirstDays(startDate, endDate);
    console.log(firstDays);

    let bmonths;
    if (months === 0 || months === 1) {
      console.log(1);
      bmonths = 1;
    } else {
      bmonths = months;
    }

    setFinalBookedMonths(bmonths);

    setBannedMonths(firstDays);
  };

  // Function to fetch data from the endpoint
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
      const token = userInfo.token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const link = `https://localhost:7104/api/car/${i}`;

      const response = await axios.get(link, { headers });
      setMyproduct(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fecthRentData = async () => {
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
      const token = userInfo.token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const link = `https://localhost:7104/api/rent/${i}`;

      const response = await axios.get(link, { headers });
      setRent(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fecthRentData();
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography sx={{ mb: 3 }} id="modal-modal-title" variant="h6" component="h2">
              Choose Start and End Month
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <DatePicker
              selected={startDate}
              onChange={(date: React.SetStateAction<Date>) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              excludeDates={excludedArray}
            />
            <DatePicker
              selected={endDate}
              onChange={(date: React.SetStateAction<Date>) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              excludeDates={excludedArray}
            />
          </Box>
          <Box sx={{ mt: 4, height: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Box sx={{ mt: 2 }}>Price: {p * finalBookedMonths} €</Box>

            {finalBookedMonths !== 0 ? (
              <>
                <Button
                  onClick={() => handlePayNow()}
                  sx={{ width: '100%', height: 50, mt: 2 }}
                  color="success"
                  variant="contained"
                >
                  Pay Now
                </Button>
              </>
            ) : (
              <Button onClick={() => handleBookDates()} sx={{ width: '100%', height: 50, mt: 2 }} variant="contained">
                {' '}
                Choose Months and Calculate Price
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

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
                backgroundImage: `url('${c}')`, // Added this line
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
                <Chip className="mychip" label={s !== '' ? s : 'AVAILABLE'} />
              </Box>
              <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h6">
                  {b} {n}
                </Typography>
              </Box>
              <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h4">{p}€ / Month</Typography>
              </Box>
              <Box>
                {myproduct !== '' ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Typography variant="body1">Seats: {myproduct?.seats}</Typography>
                    </Box>
                  </>
                ) : (
                  <></>
                )}
              </Box>
              <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Button onClick={handleOpen} sx={{ width: '100%', height: 50 }} variant="contained">
                  Book Now
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Product;
