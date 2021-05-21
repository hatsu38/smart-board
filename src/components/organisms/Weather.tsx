import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import DayJs from "~/libs/dayjs-ja";

interface currentWeather {
  temperature: number
  description: string,
  icon: string,
}

interface dailyWeather {
  date: any,
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

const Weather: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<currentWeather>();
  const [dailyWeather, setDailyWeather] = useState<dailyWeather[]>([]);
  const [hourlyWeather, setHourlyWeather] = useState<hourlyWeather[]>([]);
  const { time } = useSelector((state: any) => state.timer);
  const now = DayJs(time);
  const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5/onecall";

  useEffect(() => {
    if (shouldRefetch()) { apiCall(); }
  }, [time]);

  const shouldRefetch = () => {
    return !currentWeather || now.format("mm:ss") === "00:00";
  };

  const apiCall = async () => {
    console.log("FETCH Weather Time", now);
    const response: any = await axios.get(WEATHER_API_BASE_URL,
      {
        params: {
          lat: 35.6506,
          lon: 139.5407,
          lang: "ja",
          units: "metric",
          appid: process.env.OPEN_WEATHER_API_KEY,
        }
      });
    const data = response.data;
    responseToFormatData(data);
  };

  const responseToFormatData = (data: any) => {
    setCurrentWeather({
      temperature: Math.round(data.current.temp),
      description: data.current.weather[0].description,
      icon: data.current.weather[0].icon,
    });
    setDailyWeatherFromResponse(data.daily);
    setHourlyWeatherFromResponse(data.hourly);
  };

  const setDailyWeatherFromResponse = (dailyData: any) => {
    const formattedDailyWeather = dailyData.map((weather: any) => (
      formatDailyWeather(weather)
    ));
    const filteredDailyWeathers = formattedDailyWeather.filter((dailyWeather: dailyWeather ) => {
      return dailyWeather.date.isSameOrAfter(now, "hour");
    });
    setDailyWeather(filteredDailyWeathers);
  };

  const setHourlyWeatherFromResponse = (hourlyData: any) => {
    const formattedHourlyWeather = hourlyData.map((weather: any) => (
      formatHourlyWeather(weather)
    ));
    setHourlyWeather(formattedHourlyWeather);
  };

  const formatDailyWeather = (weather: any) => {
    const date = DayJs.unix(weather.dt);
    return ({
      date: date,
      probabilityOfPrecipitation: Math.round(weather.pop * 100),
      description: weather.weather[0].description,
      icon: weather.weather[0].icon,
      temperature: {
        max: Math.round(weather.temp.max),
        min: Math.round(weather.temp.min),
      },
    });
  };

  const formatHourlyWeather = (weather: any) => {
    const date = DayJs.unix(weather.dt);
    return ({
      date: `${date.format("H")}時`,
      probabilityOfPrecipitation: Math.round(weather.pop * 100),
      description: weather.weather[0].description,
      icon: weather.weather[0].icon,
      temperature: Math.round(weather.temp),
    });
  };

  const weatherIconUrl = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}.png`;
  };

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
        <div className="mt-4 text-2xl whitespace-nowrap overflow-x-auto">
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
        <div className="mt-4 space-y-2 h-96 overflow-y-auto">
          {dailyWeather.map((weather, index) => (
            <div className="text-2xl flex justify-between items-center space-x-2 border-b-2 border-thinGray" key={index}>
              <div>{weather.date.format("DD")}({weather.date.format("dd")})</div>
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