import PropTypes from 'prop-types';
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import { useEffect } from 'react';
// @mui
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
// components
import axios from 'axios';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { ColorMultiPicker } from '../../../components/color-utils';
// ----------------------------------------------------------------------

export const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];
// export const FILTER_GENDER_OPTIONS = ['Men', 'Women', 'Kids'];
export const FILTER_CATEGORY_OPTIONS = ['BMW', 'Audi', 'Tesla', 'Jeep', 'Honda', 'Range'];
export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below 200€' },
  { value: 'between', label: 'Between 200€ - 500€' },
  { value: 'above', label: 'Above 500€' },
];
export const FILTER_COLOR_OPTIONS = ['red', 'black', 'white', 'blue', 'green', '#1890FF', '#94D82D', '#FFC107'];

// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};

export default function ShopFilterSidebar({ openFilter, onOpenFilter, onCloseFilter, products, setProducts }) {
  const handleChangeFilterBrand = (item) => {
    // console.log(item)

    const filteredProducts = products.filter((product) => product.brand.toLowerCase().includes(item.toLowerCase()));
    setProducts(filteredProducts);
  };

  const handleFilterColor = (item) => {
    // console.log(item.target.value)
    const color = item.target.value;
    const filteredProducts = products.filter((product) => product?.color?.toLowerCase().includes(color.toLowerCase()));
    setProducts(filteredProducts);
  };

  const handleFilterPrice = (item) => {
    console.log(item.value);
    let filteredProducts;
    if (item.value === 'below') {
      filteredProducts = products.filter((product) => product.price <= 200);
    }
    if (item.value === 'between') {
      filteredProducts = products.filter((product) => product.price > 200 && product.price <= 500);
    }
    if (item.value === 'above') {
      filteredProducts = products.filter((product) => product.price > 500);
    }
    setProducts(filteredProducts);

    // const  color = item.target.value
  };

  const handleClearAll = () => {
    fetchData();
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

      const response = await axios.get('https://localhost:7104/api/car/all', { headers });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
        Filters&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <div>
              {/* <Typography variant="subtitle1" gutterBottom>
                Gender
              </Typography>
              <FormGroup>
                {FILTER_GENDER_OPTIONS.map((item) => (
                  <FormControlLabel key={item} control={<Checkbox />} label={item} />
                ))}
              </FormGroup> */}
            </div>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Brand
              </Typography>
              <RadioGroup>
                {FILTER_CATEGORY_OPTIONS.map((item) => (
                  <FormControlLabel
                    key={item}
                    value={item}
                    control={<Radio />}
                    onClick={() => handleChangeFilterBrand(item)}
                    label={item}
                  />
                ))}
              </RadioGroup>
            </div>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Colors
              </Typography>
              <ColorMultiPicker
                name="colors"
                selected={[]}
                colors={FILTER_COLOR_OPTIONS}
                onClick={(color) => handleFilterColor(color)}
                onChangeColor={(color) => [].includes(color)}
                sx={{ maxWidth: 38 * 4 }}
              />
            </div>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                Price
              </Typography>
              <RadioGroup>
                {FILTER_PRICE_OPTIONS.map((item) => (
                  <FormControlLabel
                    key={item.value}
                    value={item.value}
                    onClick={() => handleFilterPrice(item)}
                    control={<Radio />}
                    label={item.label}
                  />
                ))}
              </RadioGroup>
            </div>

            <div>
              {/* <Typography variant="subtitle1" gutterBottom>
                Rating
              </Typography>
              <RadioGroup>
                {FILTER_RATING_OPTIONS.map((item, index) => (
                  <FormControlLabel
                    key={item}
                    value={item}
                    control={
                      <Radio
                        disableRipple
                        color="default"
                        icon={<Rating readOnly value={4 - index} />}
                        checkedIcon={<Rating readOnly value={4 - index} />}
                        sx={{
                          '&:hover': { bgcolor: 'transparent' },
                        }}
                      />
                    }
                    label="& Up"
                    sx={{
                      my: 0.5,
                      borderRadius: 1,
                      '&:hover': { opacity: 0.48 },
                    }}
                  />
                ))}
              </RadioGroup> */}
            </div>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={() => handleClearAll()}
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
