import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';
// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { carId, brand, model, image, price, colors, status, priceSale } = product;
  const navigate = useNavigate();
  const GotoProduct = (carId, model, brand, image, price, status) => {
    // console.log(model,price,image)
    navigate(`/dashboard/car`, { state: { i: carId, n: model, b: brand, p: price, c: image, s: status } });
  };

  return (
    <Card>
      <Box
        sx={{ pt: '100%', position: 'relative', cursor: 'pointer' }}
        onClick={() => GotoProduct(carId, model, brand, image, price, status)}
      >
        {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}
        <StyledProductImg alt={model} src={image} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {brand} {model}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <>Some info </>
          {/* <ColorPreview colors={colors} /> */}
          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
              {/* {priceSale&&`${price}€`} */}
            </Typography>
            &nbsp;
            {price}€/month
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
