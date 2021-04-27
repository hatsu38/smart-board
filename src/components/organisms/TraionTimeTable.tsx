import React from "react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import DayJs from "../../libs/dayjs-ja";

interface Station {
  name: string,
}

interface TimeTable {
  time: Date,
  kindCode: number,
  platformNumber: number,
  lineCode: number,
  destinationCode: number,
}

interface Line {
  name: string,
  toName: string,
  fromName: string
}

interface LineDestination {
  code: number,
  name: string,
}

interface LineKind {
  code: number,
  name: string,
}


function TrainTimeTable() {
  const [station, setStation] = useState<Station>();
  const [line, setLine] = useState<Line>();
  const [lineDestination, setLineDestination] = useState<LineDestination[]>([]);
  const [lineKind, setLineKind] = useState<LineKind[]>([]);
  const [timeTable, setTimeTable] = useState<TimeTable[]>([]);
  const EKISPART_API_BASE_URL = "https://api.ekispert.jp/v1/json/operationLine/timetable"
  const today = DayJs();

  useEffect(() => {
    apiCall();
  }, []);

  const apiCall = async () => {
    const response: any = await axios.get(EKISPART_API_BASE_URL,
      {
        params: {
          key: process.env.EKISPART_API_KEY,
          stationCode: 22816,
          code: 3020,
          date: today.format("YYYYMMDD"),
        }
      })
    const data = response.ResultSet.TimeTable;
    setStation(data.stationName);

    const formattedLine = formatLine(data.Line);
    setLine(formattedLine);

    const formattedLineDestination = data.LineDestination.map((LineDestination: any) => (
      formatLineDestination(LineDestination)
    ))
    setLineDestination(formattedLineDestination);


    const formattedLineKind = data.LineKind.map((LineKind: any) => (
      formatLineKind(LineKind)
    ))
    setLineKind(formattedLineKind);

    const formattedTimeTable = data.HourTable.map((HourTable: any) => (
      HourTable.MinuteTable.map((MinuteTable: any) => (
        // if(DayJs(`${today.format("YYYY-MM-DD")} ${HourTable.hour}:${MinuteTable.Minute}`) >= today) {
        formatTimeTable(HourTable.Hour, MinuteTable.Minute)
        // }
      ))
    ));
    setTimeTable(formattedTimeTable);
  }

  const formatLine = (line: any) => {
    return ({
      name: line.Name,
      toName: line.Direction,
      fromName: line.Source,
    });
  }

  const formatLineDestination = (LineDestination: any) => {
    return ({
      name: LineDestination.text,
      code: Number(LineDestination.cod),
    });
  }

  const formatLineKind = (LineKind: any) => {
    return ({
      name: LineKind.text,
      code: Number(LineKind.code),
    });
  }

  const formatTimeTable = (hour: number, minute: any) => {
    return ({
      time: DayJs(`${today} ${hour}:${minute.Minute}`),
      kindCode: Number(minute.Stop.kindCode),
      platformNumber: Number(minute.Stop.platformNo),
      lineCode: Number(minute.Stop.lineCode),
      destinationCode: Number(minute.Stop.destinationCode),
    });
  }

  const weatherIconUrl = (icon: string) => {
    return `http://openweathermap.org/img/wn/${icon}.png`
  }

  console.log("station", station);
  console.log("line", line);
  console.log("lineDestination", lineDestination);
  console.log("lineKind", lineKind);
  console.log("timeTable", timeTable);

  return (
    <div className="font-light font-robot text-center max-w-sm">
      <h1>運行情報</h1>
    </div>
  );
};

export default TrainTimeTable;