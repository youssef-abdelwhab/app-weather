import { configureStore } from "@reduxjs/toolkit";
import weatherApiSliceReducer from "../features/counter/ApiSlice"

export const store = configureStore({
    reducer:{
        WeatherApi : weatherApiSliceReducer
    },
})