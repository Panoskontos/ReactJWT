import PropTypes from 'prop-types';
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
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
export const FILTER_CATEGORY_OPTIONS = ['BMW','Audi','Tesla','Jeep','Honda', 'Range'];
export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below 200€' },
  { value: 'between', label: 'Between 200€ - 500€' },
  { value: 'above', label: 'Above 500€' },
];
export const FILTER_COLOR_OPTIONS = [
  'red',
  'black',
  'white',
  'blue',
  'green',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

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
    cover:  `/assets/images/products/product_${1}.jpg`, 
    name: PRODUCT_NAME[0],
    price: 600,
    color:"blue",
    priceSale: 430,
    status: sample(['sale', 'new', 'out', '']),
  },
    {
    id: sample(['sale', 'new', 'out', '']),
    cover:  `/assets/images/products/product_${2}.jpg`, 
    name: PRODUCT_NAME[1],
    price: 400,
    color:"red",
    priceSale: 430,
    status: sample(['sale', 'new', 'out', '']),
  },
    {
    id: sample(['sale', 'new', '', 'out']),
    cover:  `/assets/images/products/product_${3}.jpg`, 
    name: PRODUCT_NAME[2],
    price: 550,
    color:"black",
    priceSale: 430,
    status: sample(['sale', 'new', '', '']),
  },
    {
    id: faker.datatype.uuid(),
    cover:  `/assets/images/products/product_${4}.jpg`, 
    name: PRODUCT_NAME[3],
    color:"black",
    price: 300,
    priceSale: 430,
    status: sample(['sale', 'new', '', '']),
  },
    {
    id: faker.datatype.uuid(),
    cover:  `/assets/images/products/product_${5}.jpg`, 
    name: PRODUCT_NAME[4],
    price: 500,
    color:"white",
    priceSale: 430,
    status: sample(['sale', 'new', '', '']),
  },
    {
    id: faker.datatype.uuid(),
    cover:  `/assets/images/products/product_${6}.jpg`, 
    name: PRODUCT_NAME[5],
    price: 200,
    color:"white",
    priceSale: 430,
    status: "out",
  }
] 

// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};

export default function ShopFilterSidebar({ openFilter, onOpenFilter, onCloseFilter, products, setProducts }) {

const handleChangeFilterBrand = (item) =>{
  // console.log(item)
  const filteredProducts = productsDummy.filter(product => product.name.toLowerCase().includes(item.toLowerCase()));
  setProducts(filteredProducts)

}

const handleFilterColor = (item) =>{
  // console.log(item.target.value)
  const  color = item.target.value
  const filteredProducts = productsDummy.filter(product => product.color.toLowerCase().includes(color.toLowerCase()));
  setProducts(filteredProducts)
}

const handleFilterPrice = (item) =>{
  console.log(item.value)
  let filteredProducts
  if(item.value==="below"){
    filteredProducts = productsDummy.filter(product => product.price<=200);
  }
    if(item.value==="between"){
    filteredProducts = productsDummy.filter(product => product.price>200&&product.price<=500);
  }
    if(item.value==="above"){
    filteredProducts = productsDummy.filter(product => product.price>500);
  }
  setProducts(filteredProducts)

  // const  color = item.target.value
}

const handleClearAll = ()=>{
  setProducts(productsDummy)
}


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
                  <FormControlLabel key={item} value={item} control={<Radio />} onClick={()=>handleChangeFilterBrand(item)}  label={item} />
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
                onClick={(color)=>handleFilterColor(color)}
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
                  <FormControlLabel key={item.value} value={item.value} onClick={()=>handleFilterPrice(item)}  control={<Radio />} label={item.label} />
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
            onClick={()=>handleClearAll()}
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
