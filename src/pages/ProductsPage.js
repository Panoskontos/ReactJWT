import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import { Container, Stack, MenuItem, Typography, Button, Menu } from '@mui/material';
// components
import axios from 'axios';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
// import PRODUCTS from '../_mock/products';
// import { Menu, Button, MenuItem } from '@mui/material';
// component
import Iconify from '../components/iconify';
// ----------------------------------------------------------------------
const PRODUCT_NAME = [
  'BMW M4',
  'AUDI TTS',
  'Range Rover',
  'Jeep',
  'Tesla Model S',
  'Honda Civic',
  'Nike Air Max Zephyr',
  'Jordan Delta',
  'Air Jordan XXXV PF',
  'Nike Waffle Racer Crater',
  'Kyrie 7 EP Sisterhood',
  'Nike Air Zoom BB NXT',
  'Nike Air Force 1 07 LX',
  'Nike Air Force 1 Shadow SE',
  'Nike Air Zoom Tempo NEXT%',
  'Nike DBreak-Type',
  'Nike Air Max Up',
  'Nike Air Max 270 React ENG',
  'NikeCourt Royale',
  'Nike Air Zoom Pegasus 37 Premium',
  'Nike Air Zoom SuperRep',
  'NikeCourt Royale',
  'Nike React Art3mis',
  'Nike React Infinity Run Flyknit A.I.R. Chaz Bear',
];

const productsDummy = [
  {
    id: faker.datatype.uuid(),
    cover: `/assets/images/products/product_${1}.jpg`,
    name: PRODUCT_NAME[0],
    price: 600,
    priceSale: 430,
    status: sample(['sale', 'new', 'out', '']),
  },
  {
    id: sample(['sale', 'new', 'out', '']),
    cover: `/assets/images/products/product_${2}.jpg`,
    name: PRODUCT_NAME[1],
    price: 400,
    priceSale: 430,
    status: sample(['sale', 'new', 'out', '']),
  },
  {
    id: sample(['sale', 'new', '', 'out']),
    cover: `/assets/images/products/product_${3}.jpg`,
    name: PRODUCT_NAME[2],
    price: 550,
    priceSale: 430,
    status: sample(['sale', 'new', '', '']),
  },
  {
    id: faker.datatype.uuid(),
    cover: `/assets/images/products/product_${4}.jpg`,
    name: PRODUCT_NAME[3],
    price: 300,
    priceSale: 430,
    status: sample(['sale', 'new', '', '']),
  },
  {
    id: faker.datatype.uuid(),
    cover: `/assets/images/products/product_${5}.jpg`,
    name: PRODUCT_NAME[4],
    price: 500,
    priceSale: 430,
    status: sample(['sale', 'new', '', '']),
  },
  {
    id: faker.datatype.uuid(),
    cover: `/assets/images/products/product_${6}.jpg`,
    name: PRODUCT_NAME[5],
    price: 200,
    priceSale: 430,
    status: 'out',
  },
];

const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [products, setProducts] = useState([]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
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
      // const token = userInfo.token;

      const token = userInfo.token;
      const vallet = userInfo.valetKey;

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const headers2 = {
        Authorization: `Bearer ${vallet}`,
      };

      const response = await axios.get('https://localhost:7104/api/car/all', { headers });

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

      setProducts(cars);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [sortingValue, setSortingValue] = useState('newest');
  const [open, setOpen] = useState(null);
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(null);
  };

  function sortBySale(products) {
    return products.sort((a, b) => (a.status === 'sale' ? -1 : 1));
  }

  function sortByNew(products) {
    return products.sort((a, b) => (a.status === 'new' ? -1 : 1));
  }
  function sortByPriceAsc(products) {
    return products.sort((a, b) => a.price - b.price);
  }
  function sortByPriceDesc(products) {
    return products.sort((a, b) => b.price - a.price);
  }

  const handleChoseSort = (e) => {
    console.log(e);
    setSortingValue(e);
    setOpen(null);
    if (e === 'newest') {
      let sortedProducts = [...products];
      sortedProducts = sortByNew(sortedProducts);
      setProducts(sortedProducts);
    }
    if (e === 'featured') {
      let sortedProducts = [...products];
      sortedProducts = sortBySale(sortedProducts);
      setProducts(sortedProducts);
    }
    if (e === 'priceDesc') {
      let sortedProducts = [...products];
      sortedProducts = sortByPriceDesc(sortedProducts);
      setProducts(sortedProducts);
    }
    if (e === 'priceAsc') {
      let sortedProducts = [...products];
      sortedProducts = sortByPriceAsc(sortedProducts);
      setProducts(sortedProducts);
    }
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Products
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              products={products}
              setProducts={setProducts}
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <>
              <Button
                color="inherit"
                disableRipple
                onClick={handleOpen}
                endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
              >
                Sort By:&nbsp;
                <Typography component="span" variant="subtitle1" sx={{ color: 'text.secondary' }}>
                  {sortingValue}
                </Typography>
              </Button>
              <Menu
                keepMounted
                anchorEl={open}
                open={Boolean(open)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                {SORT_BY_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.value}
                    selected={option.value === 'newest'}
                    onClick={() => handleChoseSort(option.value)}
                    sx={{ typography: 'body1' }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          </Stack>
        </Stack>

        <ProductList products={products} />
        {/* <ProductCartWidget /> */}
      </Container>
    </>
  );
}
