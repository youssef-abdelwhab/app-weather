
import './App.css';

// matruil ul 
import { Box, createTheme,ThemeProvider } from '@mui/material';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import CircularProgress from "@mui/material/CircularProgress";


// hock 
import { useEffect ,useState } from 'react';


import axios from 'axios';
import moment from 'moment/moment';
import "moment/min/locales"
import { useTranslation } from "react-i18next";






let cancelAxios = null
function App() {


  const { t, i18n } = useTranslation();

  const [lang ,setlang]=useState(i18n.language || "en")
  const [darkMode, setDarkMode] = useState(false);

  const [loading , setloading]=useState(false)

  const[dataTime ,setDatatime]=useState(null)

  const [city , setcity]=useState({"lat":24.7136,"lon":46.6753})


  const handleChange = (event) => {
    setlang(event.target.value);
    i18n.changeLanguage(event.target.value)
    moment.locale(event.target.value)
  };
  const handleChangeContry =(event) =>{
    setcity(JSON.parse(event.target.value));
  }





  const [FormData , setFormData] = useState({
    temperature: null,
    name:"",
    HighTemperature:null,
    MinimumTemperature:null,
    description:"",
    icon:"",
  
  })

  const Theme = createTheme({
       palette: {
          mode: darkMode ? "dark" : "light",
          ...(darkMode
            ? {
               
                background: {
                  default: "#121212",
                  paper: "#1e1e1e",
                },
                text: {
                  primary: "#ffffff",
                  secondary: "#aaaaaa",
                },
              }
            : {

                background: {
                  default: "#a496f6ff", 
                  paper: "#0a4beeff",  
                },
                text: {
                  primary: "#fffdfdff",
                  secondary: "#555555", 
                },
                primary: {
                  main: "#112438ff", 
                },
              }),
        },
      typography:{
        fontFamily:["NotoK"]
      }
  })



  useEffect(()=>{
    if (!city.lat || !city.lon) return;
    setDatatime(moment().format("Do MMMM  YYYY"))
     setloading(true); 
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=610641093df9da32c4c682967f0f2311&lang=${lang}`,{
        cancelToken:new axios.CancelToken((c)=>{
            cancelAxios = c
        })
      })
      .then(function(response){
        setFormData({
            temperature : Math.round(response.data.main.temp - 273.15) ,
            name : response.data.name,
            HighTemperature : Math.round(response.data.main.temp_max - 273.15),
            MinimumTemperature : Math.round(response.data.main.temp_min - 273.15),
            description : response.data.weather[0].description,
            icon :`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png` 
        })
      })
      .catch(function(error){
        console.log(error)
      })
    .finally(()=>{
      setloading(false); 
    })

      return ()=>{
        if (cancelAxios) cancelAxios();
      }

  },[lang,city])

  return (
    <div  >
      <ThemeProvider theme={Theme}>
        <Container 
         dir={lang === "ar" ? "rtl" : "ltr"}      
        sx={{
        minHeight: "100vh",
        minWidth: "100%",
        bgcolor: "background.default",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}> 
          <Card sx={{ minWidth: 475, marginTop: "50px", backgroundColor: (theme) => theme.palette.background.paper, color: (theme) => theme.palette.text.primary }}>
            <CardContent >
              <div style={{display:"flex" , alignItems:"flex-end"}}>

                  <Typography variant="h3" sx={{marginLeft:"15px" , marginRight:"15px", marginBottom:"5px"}} gutterBottom>
                     {FormData.name}
                  </Typography>

                  <Typography variant="h6" sx={{marginBottom:"15px"}} gutterBottom>
                            {dataTime}
                  </Typography>

              </div>

              <hr style={{color:"white"}}></hr>

              <div style={{display:"flex" , justifyContent:"space-around"}}>

                  <div style={{display:"flex" ,justifyContent:"center",flexDirection:"column", width:"50%"}}>
                    {loading ? (<CircularProgress  size={60} />): (
                    <>
                        <div style={{display:"flex" ,alignItems:"center"}} >

                          <Typography variant="h1" sx={{marginLeft:"15px" ,textAlign:"end" ,marginBottom:"3px"}} gutterBottom>
                            {FormData.temperature}   
                          </Typography>

                        </div>

                        <Typography variant="h5" sx={{marginLeft:"15px" }} gutterBottom>
                          {FormData.description}       
                        </Typography>

                        <div>
                          <h5 style={{ fontFamily:"NotoK" ,fontWeight:"600", fontSize:"20"}}>
                            {t("max")}: {FormData.HighTemperature} || {t("min")} : {FormData.MinimumTemperature}  
                          </h5>
                        </div>
                      </> 

                    )}

                  </div>

                  {loading ? (<CircularProgress  size={60} />): (
                  <div style={{width:"50%"}}>
                    <img style={{width:"100%"}} src={FormData.icon}/> 
                  </div>
                  )}

 
              </div>
              <Box sx={{display:"flex" ,justifyContent:"space-between"}} size="small">
                  <FormControl sx={{ m: 1, minWidth: 120 , marginTop:2 }}  size="small" >
                      <InputLabel id="demo-simple-select-label" >{t("lang")} </InputLabel>
                      <Select
                        dir={lang === "ar" ? "rtl" : "ltr"}   
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={lang}
                        label="language"
                        onChange={handleChange}
                      >
                        <MenuItem value={"ar"}>Arabic</MenuItem>
                        <MenuItem value={"en"}>English</MenuItem>
                      </Select>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 120 , marginTop:2 }}  size="small" >
                      <InputLabel id="demo-simple-select-label" >{t("city")} </InputLabel>
                      <Select
                        dir={lang === "ar" ? "rtl" : "ltr"}   
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={JSON.stringify(city)}
                        label="city"
                        onChange={handleChangeContry}
                      >
                        <MenuItem value='{"lat":24.7136,"lon":46.6753}'>Saudi Arabia</MenuItem>
                        <MenuItem value='{"lat":36.7538,"lon":3.0588}'>Algeria</MenuItem>
                        <MenuItem value='{"lat":30.0444,"lon":31.2357}'>Egypt</MenuItem>
                        <MenuItem value='{"lat":34.0209,"lon":-6.8416}'>Morocco</MenuItem>
                        <MenuItem value='{"lat":32.8872,"lon":13.1913}'>Libya</MenuItem>
                      </Select>
                  </FormControl>

                  <Button 
                  variant="contained"
                        onClick={() => setDarkMode(!darkMode)} 
                        sx={{ height:40,  width:40, marginTop: "10px", padding: "5px 5px", cursor: "pointer" }}
                      >
                        {darkMode ? "☀️" : "🌙"}
                  </Button>

              </Box>


            </CardContent>


          </Card>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
