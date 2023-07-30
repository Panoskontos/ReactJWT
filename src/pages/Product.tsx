import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import './index.css'
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
// import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

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
    const location = useLocation();

    const { n, p, c, s } = location.state;

    const excludedDate1 = new Date(Date.UTC(2023, 8, 1));
    const timestamp = excludedDate1.getTime();
    const excludedDate2 = new Date(Date.UTC(2023, 9, 1));
    const timestamp2 = excludedDate2.getTime();


    const [excludedArray, setExcludedArray] = useState(
        [
            excludedDate1, excludedDate2
           ]
    )


    function calculateMonthsBetween(date1:any, date2:any) {
        // Ensure date1 is before date2
        if (date1 > date2) {
            [date1, date2] = [date2, date1];
        }
    
        let years = date2.getFullYear() - date1.getFullYear();
        let months = date2.getMonth() - date1.getMonth();
        const days = date2.getDate() - date1.getDate();
    
        // Decrease year by 1 if date2's month is less than date1's month
        if (months < 0 || (months === 0 && days < 0)) {
            years-=1;
            months += 12;
        }
    
        // If date2's day is less than date1's day, decrease months by 1
        if (days < 0) {
            months-=1;
        }
    
        const monthsBetween = years * 12 + months;
    
        return monthsBetween;
    }

    function getFirstDays(start:any, end:any) {
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


    

 

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // const [price, setPrice] = useState(400)

    const [startDate, setStartDate] = useState(new Date("2023/08/08"));
    const [endDate, setEndDate] = useState(new Date("2023/08/09"));
    const filterPassedTime = (time:any) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
        return currentDate.getTime() < selectedDate.getTime();
    };
    

        const handleBookDates:any = ()=>{
            // console.log("hey")
            const months = calculateMonthsBetween(startDate, endDate)
            console.log(months)
           
            const firstDays = getFirstDays(startDate, endDate)
            console.log(firstDays)

            

            if(months===0){
                console.log(1)
            }else{
                console.log(months+1-excludedArray.length)
            }


            setExcludedArray(firstDays)
        }





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

          <Typography 
       
          sx={{mb:3}} id="modal-modal-title" variant="h6" component="h2">
            Choose Start and End Month
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
           <Box sx={{mt:4,  height:"100%", display:"flex", alignItems:"center" }}>
           <Button 
              onClick={()=>handleBookDates()}
    sx={{width:"100%", height:50}} 
     variant="contained" >Book Months</Button>
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
                            backgroundImage: `url('${c}')`, // Added this line
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
<Chip className='mychip' label={s!==""?s:"Available"} />
</Box>
<Box sx={{mt:2,mb:2, display:"flex", justifyContent:"center"}}>
   <Typography variant="h6" >{n}</Typography>
</Box>
<Box sx={{mt:4,mb:2, display:"flex", justifyContent:"center"}} >
<Typography variant="h4" >{p}€ / Month</Typography>
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
