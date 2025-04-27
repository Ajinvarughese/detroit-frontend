import { Box, Button, Typography } from "@mui/material";
import Spline from "@splinetool/react-spline";
import Header from "../Home/Header";

const style = {
  header: {
    position: "absolute",
    top: '50%',
    left: '0',
    transform: 'translateY(-50%)',
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: "0 5%",
    flexWrap: "wrap",
    textAlign: {
      xs: "center",
      md: "left"
    },
    pointerEvents: "none",
  },
  title: {
    flex: 1
  },
  element: {
    flex: 1,
    textAlign: "right"
  },
}


function Landing() {

  
  return (
    <Box sx={{
       position: "relative",
    }}>
      <Header 
        key="header" 
        style={{position: "fixed"}} 
         />
      <Box
        sx={{
          overflow: "hidden",
          minHeight: "600px",
          height: "100vh",
          width: "100%",
        }}
      >
        <Spline
          className="w-full h-full"
          scene="https://prod.spline.design/l9uYXrNtML6SbrEf/scene.splinecode"
        />
      </Box>    

      <Box sx={style.header} >
      </Box>
    </Box>
  );
}

export default Landing;
