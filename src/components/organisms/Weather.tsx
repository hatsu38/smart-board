import React from "react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import DayJs from "../../libs/dayjs-ja";

interface currentWeather {
  temperature: number
  description: string,
  icon: string,
}

interface dailyWeather {
  date: Date,
  probabilityOfPrecipitation: number,
  description: string,
  icon: string,
  temperature: {
    max: number,
    min: number
  },
}

interface hourlyWeather {
  date: Date,
  probabilityOfPrecipitation: number,
  description: string,
  icon: string,
  temperature: number,
}

function Weather() {
  const [currentWeather, setCurrentWeather] = useState<currentWeather>();
  const [dailyWeather, setDailyWeather] = useState<dailyWeather[]>([]);
  const [hourlyWeather, setHourlyWeather] = useState<hourlyWeather[]>([]);
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
      description: data.current.weather[0].description,
      icon: data.current.weather[0].icon,
    });

    const formattedDailyWeather = data.daily.map((weather: any) => (
      formatDailyWeather(weather)
    ))
    setDailyWeather(formattedDailyWeather);

    const formattedHourlyWeather = data.hourly.map((weather: any) => (
      formatHourlyWeather(weather)
    ))
    setHourlyWeather(formattedHourlyWeather);
  }

  const formatDailyWeather = (weather: any) => {
    const date = DayJs.unix(weather.dt);
    return ({
      date: `${date.format("DD")}(${date.format("dd")})`,
      probabilityOfPrecipitation: Math.round(weather.pop * 100),
      description: weather.weather[0].description,
      icon: weather.weather[0].icon,
      temperature: {
        max: Math.round(weather.temp.max),
        min: Math.round(weather.temp.min),
      },
    });
  }

  const formatHourlyWeather = (weather: any) => {
    const date = DayJs.unix(weather.dt);
    return ({
      date: `${date.format("h")}時`,
      probabilityOfPrecipitation: Math.round(weather.pop * 100),
      description: weather.weather[0].description,
      icon: weather.weather[0].icon,
      temperature: Math.round(weather.temp),
    });
  }

  const weatherIconUrl = (icon: string) => {
    return `http://openweathermap.org/img/wn/${icon}.png`
  }

  return (
    <div className="font-light font-robot text-center max-w-sm">
      {currentWeather &&
        <>
          <p className="text-thinGray">{currentWeather.description}</p>
          <h2 className="text-8xl">{currentWeather.temperature}<span className="text-2xl text-thinGray">℃</span></h2>
          <img src={weatherIconUrl(currentWeather.icon)} className="mx-auto" />
        </>
      }
      {dailyWeather.length > 0 &&
        <div className="text-2xl flex justify-center space-x-2">
          <div>最高: {dailyWeather[0].temperature.max}<span className="text-sm text-thinGray">℃</span></div>
          <div>最低: {dailyWeather[0].temperature.min}<span className="text-sm text-thinGray">℃</span></div>
        </div>
      }

      {hourlyWeather.length > 0 &&
        <div className="border-b-2 border-thinGray mt-4 py-2 text-2xl whitespace-nowrap overflow-x-auto">
          {hourlyWeather.map((weather, index) => (
            <div key={index} className="inline-block w-2/12">
              <p>{weather.date}</p>
              <img src={weatherIconUrl(weather.icon)} className="mx-auto" />
              <p>{weather.temperature}<span className="text-sm text-thinGray">℃</span></p>
              <p>{weather.probabilityOfPrecipitation}<span className="text-sm text-thinGray">%</span></p>
            </div>
          ))}
        </div>
      }

      {dailyWeather.length > 0 &&
        <div className="mt-4 space-y-2">
        {dailyWeather.map((weather, index) => (
          <div className="text-2xl flex justify-between items-center space-x-2 border-b-2 border-thinGray" key={index}>
            <div>{weather.date}</div>
            <img src={weatherIconUrl(weather.icon)} className="mx-auto" />
            <div>{weather.temperature.max}<span className="text-sm text-thinGray">℃</span></div>
            <div>{weather.temperature.min}<span className="text-sm text-thinGray">℃</span></div>
            <div>{weather.probabilityOfPrecipitation}<span className="text-sm text-thinGray">%</span></div>
          </div>
        ))}
        </div>
      }
    </div>
  );
};

export default Weather;