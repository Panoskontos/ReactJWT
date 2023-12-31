import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import axios from 'axios';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  Box,
  TablePagination,
  Modal,
  TextField,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'seats', label: 'Seats', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'brand', label: 'Brand', alignRight: false },
  { id: 'role', label: 'Actions', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.model.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

export default function UserPage() {
  const [USERLIST, setUSERLIST] = useState([]);

  const [file, setFile] = useState();
  const [realFile, setRealFile] = useState();

  const [imageDataList, setImageDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  function handleChange(e) {
    console.log(e.target.files);

    setFile(URL.createObjectURL(e.target.files[0]));
    setRealFile(e.target.files[0]);
  }

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);
  const [EditMode, setEditMode] = useState(false);

  const [selectedForAction, setSelectedForAction] = useState('');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(15);

  const [openAdd, setOpenAdd] = useState(false);

  const handleOpen = () => setOpenAdd(true);
  const handleClose = () => setOpenAdd(false);

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState(0);
  const [seats, setSeats] = useState(4);
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('');
  const [color, setColor] = useState('');

  const handleAddOpen = () => {
    setEditMode(false);
    handleOpen();
    setBrand('');
    setModel('');
    setPrice(0);
    setSeats(4);
    setImage('');
    setStatus('');
    setColor('');
  };

  const handleEditOpen = () => {
    setEditMode(true);
    handleOpen();
  };

  const handleOpenMenu = (event, carId, model, brand, status, seats, image, price, color) => {
    setOpen(event.currentTarget);
    setSelectedForAction(carId);
    setBrand(brand);
    setModel(model);
    setPrice(price);
    setSeats(seats);
    setImage(image);
    setStatus(status);
    setColor(color);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.model);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const numericPrice = parseFloat(price);
  const numericSeat = parseInt(seats, 10);

  // Function to fetch data from the endpoint
  const fetchData = async () => {
    try {
      // Get the token from localStorage
      const userInfoString = localStorage.getItem('userInfo');
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

      const idtoImage = {};

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

      setUSERLIST(cars);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = () => {
    // Prepare the data object to be sent in the POST request
    // const data = {
    //   brand,
    //   model,
    //   price: numericPrice,
    //   image: file,
    //   status,
    //   color,
    //   seats: numericSeat,
    // };

    const formData = new FormData();

    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('price', numericPrice);
    formData.append('image', realFile); // Append the image file here
    formData.append('status', status);
    formData.append('color', color);
    formData.append('seats', numericSeat);

    const formData2 = new FormData();
    formData2.append('Image', realFile);

    // Get the token from localStorage
    const userInfoString = localStorage.getItem('userInfo');
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
      .post('https://localhost:7104/api/car', formData, { headers })
      .then((response) => {
        const valletUpload = response.data.valetKey;

        const headers2 = {
          Authorization: `Bearer ${valletUpload}`,
        };

        axios
          .post('https://localhost:5401/api/file', formData2, { headers: headers2 }) // Use headers instead of headers2
          .then((response) => {
            console.log('Data saved successfully:', response.data);
            fetchData();
          })
          .catch((error) => {
            console.error('Error saving data:', error);
          });
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  };

  const handleEdit = () => {
    // Prepare the data object to be sent in the POST request
    // const data = {
    //   brand,
    //   model,
    //   price: numericPrice,
    //   image: file,
    //   status,
    //   color,
    //   seats: numericSeat,
    // };

    const formData = new FormData();

    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('price', numericPrice);
    formData.append('image', realFile); // Append the image file here
    formData.append('status', status);
    formData.append('color', color);
    formData.append('seats', numericSeat);

    // Get the token from localStorage
    const userInfoString = localStorage.getItem('userInfo');
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
      .patch(`https://localhost:7104/api/car/${selectedForAction}`, formData, { headers })
      .then((response) => {
        // Handle the response if needed (e.g., show a success message)
        console.log('Data saved successfully:', response.data);
        fetchData();
        handleClose();
      })
      .catch((error) => {
        // Handle any errors that occurred during the POST request
        console.error('Error saving data:', error);
      });
  };

  const handleDelete = () => {
    console.log(selectedForAction);
    const userInfoString = localStorage.getItem('userInfo');

    const userInfo = JSON.parse(userInfoString);
    if (!userInfo || !userInfo.token) {
      console.error('Invalid user info or missing token');
      return;
    }
    const token = userInfo.token;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Show a confirm dialog to get user confirmation
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');

    if (confirmDelete) {
      // Make the DELETE request using axios
      axios
        .delete(`https://localhost:7104/api/car/${selectedForAction}`, { headers })
        .then((response) => {
          // Handle the response if needed (e.g., show a success message)
          console.log('Data deleted successfully:', response.data);
          fetchData(); // Assuming you want to fetch data after deletion
        })
        .catch((error) => {
          // Handle any errors that occurred during the DELETE request
          console.error('Error deleting data:', error);
        });
    } else {
      console.log('Deletion cancelled by the user.');
    }
  };

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Cars Collection
          </Typography>
          <Button onClick={handleAddOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Car
          </Button>
        </Stack>

        <Modal
          open={openAdd}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add new Car
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', mt: 3 }}>
              <TextField
                style={{ marginTop: '10px' }}
                id="outlined-basic"
                label="Brand"
                variant="outlined"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
              <TextField
                style={{ marginTop: '10px' }}
                id="outlined-basic"
                label="Model"
                variant="outlined"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
              <TextField
                style={{ marginTop: '10px' }}
                id="outlined-basic"
                label="Price"
                variant="outlined"
                value={price}
                type="number"
                onChange={(e) => setPrice(e.target.value)}
              />
              <TextField
                style={{ marginTop: '10px' }}
                id="outlined-basic"
                label="Seats"
                variant="outlined"
                value={seats}
                type="number"
                onChange={(e) => setSeats(e.target.value)}
              />
              <Box style={{ marginTop: '10px' }}>
                <input type="file" onChange={handleChange} />
                {file && <img src={file} alt="Uploaded Content" />}
              </Box>

              <TextField
                style={{ marginTop: '10px' }}
                id="outlined-basic"
                label="Color"
                variant="outlined"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <TextField
                style={{ marginTop: '10px' }}
                id="outlined-basic"
                label="Status"
                variant="outlined"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              {EditMode ? (
                <Button
                  onClick={() => {
                    handleEdit();
                  }}
                  variant="contained"
                  color="info"
                >
                  Update
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handleSave();
                  }}
                  variant="contained"
                  color="info"
                >
                  Save
                </Button>
              )}
            </Box>
          </Box>
        </Modal>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { carId, model, brand, status, seats, image, price, color } = row;
                    const selectedUser = selected.indexOf(model) !== -1;

                    return (
                      <TableRow hover key={carId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, model)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={model} src={image} />
                            <Typography variant="subtitle2" noWrap>
                              {model}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{seats}</TableCell>

                        <TableCell align="left">{price}</TableCell>

                        <TableCell align="left">{status}</TableCell>
                        <TableCell align="left">{brand}</TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(e) => handleOpenMenu(e, carId, model, brand, status, seats, image, price, color)}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleEditOpen();
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
