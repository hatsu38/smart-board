import React from "react";
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Weather {
  description: string,
  icon: string,
}
interface currentWeather {
  temperature: number
  weather: Weather,
}

interface dailyWeather {
  date: Date,
  temperature: {
    max: number,
    min: number
  },
  probabilityOfPrecipitation: number,
  weather: Weather,
}

function Weather() {
  const [currentWeather, setCurrentWeather] = useState<currentWeather>();
  const [dailyWeather, setDailyWeather] = useState<dailyWeather[]>([]);
  const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5/onecall"

  useEffect(() => {
    apiCall();
  }, []);

  const apiCall = async () => {
    const response: any = await axios.get(WEATHER_API_BASE_URL,
      {
        params: {
          lat: 35.6506,
          lon: 139.5407,
          lang: "ja",
          units: "metric",
          appid: process.env.OPEN_WEATHER_API_KEY,
        }
      })
    const data = response.data;
    setCurrentWeather({
      temperature: Math.round(data.current.temp),
      weather: {
        description: data.current.weather[0].description,
        icon: data.current.weather[0].icon,
      }
    });
    const formattedDailyWeather = data.daily.map((weather: any) => (
      formatDailyWeather(weather)
    ))
    setDailyWeather(formattedDailyWeather);
  }

  const formatDailyWeather = (weather: any) => {
    return ({
      date: weather.dt,
      temperature: {
        max: Math.round(weather.temp.max),
        min: Math.round(weather.temp.min),
      },
      probabilityOfPrecipitation: weather.pop * 100,
      weather: {
        description: weather.weather[0].description,
        icon: weather.weather[0].icon,
      },
    })
  }

  const weatherIconUrl = (icon: string) => {
    console.log("icon", icon);
    return `http://openweathermap.org/img/wn/${icon}@2x.png`
  }

  return (
    <div className="font-light font-robot text-center">
      {currentWeather &&
        <>
          <p className="text-thinGray">{currentWeather.weather.description}</p>
          <h2 className="text-8xl">{currentWeather.temperature}<span className="text-2xl text-thinGray">℃</span></h2>
          <img src={weatherIconUrl(currentWeather.weather.icon)} className="mx-auto" />
        </>
      }
      {dailyWeather.length > 0 &&
        <div className="text-2xl flex justify-between space-x-2">
          <div>最高: {dailyWeather[0].temperature.max}<span className="text-sm text-thinGray">℃</span></div>
          <div>最低: {dailyWeather[0].temperature.min}<span className="text-sm text-thinGray">℃</span></div>
        </div>
      }
    </div>
  );
};

export default Weather;