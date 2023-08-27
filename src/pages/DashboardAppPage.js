import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import axios from 'axios';
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

function transformArray(inputArray) {
  const transformedArray = inputArray.map((rental, index) => ({
    id: `order${index + 1}`,
    car: rental.car.brand,
    months: `${Math.ceil((rental.dateTo - rental.dateFrom) / (30 * 24 * 60 * 60))} months`,
    image: `${rental.car.image}`,
    postedAt: new Date(rental.dateFrom * 1000).toLocaleDateString('en-US'),
  }));

  return transformedArray;
}

export default function DashboardAppPage() {
  const theme = useTheme();

  const [historyData, setHistoryData] = useState([]);
  const [totalSpending, setTotalSpending] = useState([]);
  const [totalStatistics, setTotalStatistics] = useState([]);

  const [pieData, setPieData] = useState([
    { label: 'Audi', value: 8 },
    { label: 'Tesla', value: 4 },
    { label: 'Jeep', value: 4 },
    { label: 'BMW', value: 1 },
  ]);

  const [barChart, setBarChart] = useState([
    { label: 'AUDI', value: 1400 },
    { label: 'BMW', value: 430 },
    { label: 'Tesla', value: 448 },
    { label: 'Jeep', value: 470 },
  ]);

  const [historyChart, setHistoryChart] = useState([
    {
      id: 'order1',
      car: 'AUDI',
      months: '3 months',
      image: '/assets/images/products/product_1.jpg',
      postedAt: '11/21/2023',
    },
    {
      id: 'order2',
      car: 'Jeep',
      months: '2 months',
      image: '/assets/images/products/product_3.jpg',
      postedAt: '11/21/2022',
    },
  ]);

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
      const vallet = userInfo.valetKey;

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const headers2 = {
        Authorization: `Bearer ${vallet}`,
      };

      const link = `https://localhost:7104/api/statistics/history`;

      const response = await axios.get(link, { headers });

      const cars = await Promise.all(
        response.data.map(async (car) => {
          try {
            const imageResponse = await axios.get(`https://localhost:5401/api/file/${car.carId}`, {
              headers: headers2,
              responseType: 'blob',
            });

            const imageUrl = URL.createObjectURL(imageResponse.data);
            car.image = imageUrl;

            return car;
          } catch (error) {
            console.error(`Error fetching image data for car with ID ${car.carId}:`, error);
            return null;
          }
        })
      );
      console.log(cars);

      const transformedArray = transformArray(cars);

      setHistoryChart(transformedArray);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSpending = async () => {
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

      const link = `https://localhost:7104/api/statistics/total_spendings`;

      const response = await axios.get(link, { headers });
      setTotalSpending(response.data);

      const convertedArray = response?.data.map((item) => {
        return {
          label: item.brand,
          value: item.value,
        };
      });

      const convertedArray2 = response?.data.map((item) => {
        return {
          label: item.brand,
          value: item.months,
        };
      });

      setBarChart(convertedArray);
      setPieData(convertedArray2);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchStatistics = async () => {
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

      const link = `https://localhost:7104/api/statistics/total_statistics`;

      const response = await axios.get(link, { headers });
      setTotalStatistics(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSpending();
    fetchStatistics();
    // fecthRentData();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Spent" total={`${totalStatistics.totalPriceRents} €`} icon={'mdi:cash'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Cars Rented"
              total={`${totalStatistics.totalRent}`}
              color="info"
              icon={'mdi:car'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Months"
              total={`${totalStatistics.totalMonths}`}
              color="warning"
              icon={'iwwa:month'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Favorite Brand"
              total={`${totalStatistics.favourite}`}
              color="success"
              icon={'game-icons:self-love'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Brands Rented (months)"
              chartData={pieData}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>
          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid> */}

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Total Spending on Brands"
              subheader="(+43%) than last year"
              chartData={barChart}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}

          <Grid item xs={12} md={12} lg={12}>
            <AppNewsUpdate
              title="User History"
              list={historyChart.map((i) => ({
                id: i.id,
                car: i.car,
                months: i.months,
                image: i.image,
                postedAt: i.postedAt,
              }))}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
