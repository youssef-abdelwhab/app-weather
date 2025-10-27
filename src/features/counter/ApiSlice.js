import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

 
 export const fetchWeather = createAsyncThunk("weatherapi/fetchWeather", async ({lon , lat , lang ,controller})=>{
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=610641093df9da32c4c682967f0f2311&lang=${lang}`,
            { signal: controller.signal } 
    )
          const  temperature =  Math.round(response.data.main.temp - 273.15) ;
          const name  = response.data.name;
          const HighTemperature  =  Math.round(response.data.main.temp_max - 273.15);
          const MinimumTemperature =  Math.round(response.data.main.temp_min - 273.15);
          const description  =  response.data.weather[0].description;
          const icon  = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png` ;
    return {temperature ,name,HighTemperature , MinimumTemperature, description , icon}
})

const weatherApiSlice = createSlice({
    name:"weatherApi",
    initialState:{
        result:"empty",
        weather:{},
        isLodeing:false
    },
    reducers:{
        changeResuilt:(state,action)=>{
             state.result = "Change"
        }
    },
    extraReducers(builder){
       builder
       .addCase(fetchWeather.pending,(state,action)=>{
           state.isLodeing = true
       }).addCase(fetchWeather.fulfilled , (state , action)=>{
        state.isLodeing = false
        state.weather = action.payload     
      })
    }
})
export const {changeResuilt} = weatherApiSlice.actions
export default weatherApiSlice.reducer