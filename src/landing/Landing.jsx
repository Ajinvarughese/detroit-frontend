import { Box } from "@mui/material";
import Spline from "@splinetool/react-spline";
import Navbar from "../components/theme/navbar/Navbar";
import { useEffect, useState } from "react";
import Background from "../components/theme/background/background";

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

  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');

  useEffect(()=>{
    localStorage.setItem('current_theme',theme)
  },[theme])

//   return (
//     <div className={theme === 'light' ? 'container' : 'container dark'}>
//     </div> 
//   );
// };

  return (
    <Box sx={{
       position: "relative",
    }}>
       <Navbar theme={theme} setTheme={setTheme} />
      <Background
        sx={{
          overflow: "hidden",
          minHeight: "600px",
          height: "100vh",
          width: "100%",
        }}
      >
        {/* <Spline
          className="w-full h-full"
          scene="https://prod.spline.design/l9uYXrNtML6SbrEf/scene.splinecode"
        /> */}
      </Background>    

      <Box sx={style.header} >
      </Box>
    </Box>
  );
}

export default Landing;