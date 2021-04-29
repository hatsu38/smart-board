import React from "react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import DayJs from "../../libs/dayjs-ja";

interface Station {
  name: string,
}

interface TimeTable {
  time: any,
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
  const [lineDestinations, setLineDestination] = useState<LineDestination[]>([]);
  const [lineKinds, setLineKind] = useState<LineKind[]>([]);
  const [timeTables, setTimeTable] = useState<TimeTable[]>([]);
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
    const data = response.data.ResultSet.TimeTable;
    setStation(data.stationName);
    const formattedLine = formatLine(data.Line);
    setLine(formattedLine);

    const formattedLineDestinations = data.LineDestination.map((LineDestination: any) => (
      formatLineDestination(LineDestination)
    ))
    setLineDestination(formattedLineDestinations);


    const formattedLineKinds = data.LineKind.map((LineKind: any) => (
      formatLineKind(LineKind)
    ))
    setLineKind(formattedLineKinds);

    const formattedTimeTables = data.HourTable.flatMap((HourTable: any) => (
      HourTable.MinuteTable.map((MinuteTable: any) => (
        formatTimeTable(HourTable.Hour, MinuteTable)
      ))
    ));
    setTimeTable(formattedTimeTables);
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
      time: DayJs(`${today.format("YYYYMMDD")} ${hour}:${minute.Minute}`),
      kindCode: Number(minute.Stop.kindCode),
      platformNumber: Number(minute.Stop.platformNo),
      lineCode: Number(minute.Stop.lineCode),
      destinationCode: Number(minute.Stop.destinationCode),
    });
  }

  console.log("today.format(YYYYMMDD)", today.format("YYYYMMDD"));
  console.log("station", station);
  console.log("line", line);
  console.log("lineDestination", lineDestinations);
  console.log("lineKind", lineKinds);
  console.log("timeTable", timeTables);

  return (
    <div className="font-light font-robot text-center max-w-sm">
      <h1>{station && station.name}運行情報</h1>
      <div>
        {timeTables.length > 0 && timeTables.slice(5).map(timeTable => (
          <p key={timeTable.time}>{timeTable.time.format("HH:mm")}</p>
        ))}
      </div>
    </div>
  );
};

export default TrainTimeTable;