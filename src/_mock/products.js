import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

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
const PRODUCT_COLOR = ['#00AB55', '#000000', '#FFFFFF', '#FFC0CB', '#FF4842', '#1890FF', '#94D82D', '#FFC107'];

// ----------------------------------------------------------------------

const products = [
  {
    id: sample(['sale', 'new', '', '']),
    cover:  `/assets/images/products/product_${1}.jpg`, 
    name: PRODUCT_NAME[0],
    price: 500,
    priceSale: 430,
    status: sample(['sale', 'new', 'out', '']),
  },
    {
    id: sample(['sale', 'new', 'out', '']),
    cover:  `/assets/images/products/product_${2}.jpg`, 
    name: PRODUCT_NAME[1],
    price: 500,
    priceSale: 430,
    status: sample(['sale', 'new', 'out', '']),
  },
    {
    id: sample(['sale', 'new', '', 'out']),
    cover:  `/assets/images/products/product_${3}.jpg`, 
    name: PRODUCT_NAME[2],
    price: 500,
    priceSale: 430,
    status: sample(['sale', 'new', '', '']),
  },
    {
    id: sample(['sale', 'new', '', '']),
    cover:  `/assets/images/products/product_${4}.jpg`, 
    name: PRODUCT_NAME[3],
    price: 500,
    priceSale: 430,
    status: sample(['sale', 'new', '', '']),
  },
    {
    id: sample(['sale', 'new', '', '']),
    cover:  `/assets/images/products/product_${5}.jpg`, 
    name: PRODUCT_NAME[4],
    price: 500,
    priceSale: 430,
    status: sample(['sale', 'new', '', '']),
  },
    {
    id: sample(['sale', 'new', '', '']),
    cover:  `/assets/images/products/product_${6}.jpg`, 
    name: PRODUCT_NAME[5],
    price: 500,
    priceSale: 430,
    status: "out",
  }
] 


// const products = [...Array(6)].map((_, index) => {
//   const setIndex = index + 1;

//   return {
//     id: faker.datatype.uuid(),
//     cover: `/assets/images/products/product_${setIndex}.jpg`,
//     name: PRODUCT_NAME[index],
//     price: faker.datatype.number({ min: 4, max: 99, precision: 0.01 }),
//     priceSale: setIndex % 3 ? null : faker.datatype.number({ min: 19, max: 29, precision: 0.01 }),
//     colors:
//       (setIndex === 1 && PRODUCT_COLOR.slice(0, 2)) ||
//       (setIndex === 2 && PRODUCT_COLOR.slice(1, 3)) ||
//       (setIndex === 3 && PRODUCT_COLOR.slice(2, 4)) ||
//       (setIndex === 4 && PRODUCT_COLOR.slice(3, 6)) ||
//       (setIndex === 23 && PRODUCT_COLOR.slice(4, 6)) ||
//       (setIndex === 24 && PRODUCT_COLOR.slice(5, 6)) ||
//       PRODUCT_COLOR,
//     status: sample(['sale', 'new', '', '']),
//   };
// });

export default products;
