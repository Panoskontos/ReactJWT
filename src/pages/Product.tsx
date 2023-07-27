import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import './index.css'
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
// import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const style = {
    position: 'absolute' as 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    height:"300px",
    bgcolor: 'background.paper',
    borderRadius:"10px",
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


const Product: React.FC = () => {

    const excludedDate1 = new Date(Date.UTC(2023, 8, 1));
const timestamp = excludedDate1.getTime();
const excludedDate2 = new Date(Date.UTC(2023, 9, 1));
const timestamp2 = excludedDate2.getTime();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [startDate, setStartDate] = useState(new Date("2023/08/08"));
    const [endDate, setEndDate] = useState(new Date("2023/08/09"));
    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
    
        return currentDate.getTime() < selectedDate.getTime();
      };




    return (
        <div>

<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Box sx={{display:"flex", justifyContent:"center"}}>

          <Typography sx={{mb:3}} id="modal-modal-title" variant="h6" component="h2">
            Pick Start and End Month
          </Typography>
            </Box>

        <Box sx={{display:"flex", justifyContent:"center"}}>
          <DatePicker
        selected={startDate}
        onChange={(date: React.SetStateAction<Date>) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        dateFormat="MM/yyyy"
        showMonthYearPicker
        excludeDates={[excludedDate1,excludedDate2
          ]}
     
      />
      <DatePicker
        selected={endDate}
        onChange={(date: React.SetStateAction<Date>) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        dateFormat="MM/yyyy"
        showMonthYearPicker

        excludeDates={[
           excludedDate1, excludedDate2
          ]}
      />


           </Box>
           <Box sx={{mt:4,  height:"100%", display:"flex", alignItems:"center" }}>
           <Button 
    sx={{width:"100%", height:50}} 
     variant="contained" >Book Now</Button>
           </Box>
        </Box>
      </Modal>

            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} >
                 <Grid item xs={6}>
                        <Box
                        className="detailBoxParent"
                        sx={{p:3}}
                            >
                                <Box
                                className="detailBox"
                               sx={{
                                         // width: 300,
                            height: 500,
                            backgroundColor: 'primary.dark',
                            borderRadius:"10px",
                            backgroundImage: `url('/assets/images/products/product_1.jpg')`, // Added this line
                            backgroundSize: 'cover', // Make sure image covers the box
                            backgroundPosition: 'center', // Center the image
                               }} 
                                >
                                 {" "}
                                </Box>
                            </Box>
                 </Grid>
                  <Grid item xs={6}>
               
                  <Box
                        className="detailBoxParent2"
                        sx={{p:3}}
                            >
                    <Box 
                    className="detailBox2"
                    sx={{
                        width:"100%",
                        height:500,
                        borderRadius:"10px",
                        p:3

                    }}
                    >
<Box>
<Chip className='mychip' label="NEW" />
</Box>
<Box sx={{mt:2,mb:2, display:"flex", justifyContent:"center"}}>
   <Typography variant="h6" >BMW M4</Typography>
</Box>
<Box sx={{mt:4,mb:2, display:"flex", justifyContent:"center"}} >
<Typography variant="h4" >400€ / Month</Typography>
</Box>
<Box>
    <Typography variant="body1">
Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat harum unde pariatur aliquid nemo, facilis ipsum molestias libero omnis, odit perferendis commodi aperiam quos ea magnam ipsa vel dolorem assumenda.
    </Typography>
</Box>
<Box sx={{mt:3,mb:2, display:"flex", justifyContent:"center"}} >
    <Button 
    onClick={handleOpen}
    sx={{width:"100%", height:50}} 
     variant="contained" >Book Now</Button>
</Box>

               
                     </Box>        
                     </Box>
                  </Grid>
            </Grid>
      
        
        </div>
    );
}

export default Product;
