import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import axios from 'axios';
import DayJs from "../../libs/dayjs-ja";

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
  const [stationName, setStationName] = useState<string>();
  const [line, setLine] = useState<Line>();
  const [lineDestinations, setLineDestination] = useState<LineDestination[]>([]);
  const [lineKinds, setLineKind] = useState<LineKind[]>([]);
  const [timeTables, setTimeTable] = useState<TimeTable[]>([]);
  const EKISPART_API_BASE_URL = "https://api.ekispert.jp/v1/json/operationLine/timetable"
  const { time } = useSelector((state: any) => state.timer);
  const now = DayJs(time);
  let recentTimeTables = [];

  useEffect(() => { apiCall() }, []);
  useEffect(() => {
    if (shouldRefetch()) {
      const recentTimeTable = timeTables.filter(timeTable => {
        return timeTable.time.isSameOrAfter(now);
      });
      console.log("recentTimeTable", recentTimeTable);
      recentTimeTables = recentTimeTable.slice(0, 5);
    }
  }, [now]);

  const shouldRefetch = () => {
    return !stationName || now.format("ss") === "00"
  }

  const apiCall = async () => {
    console.log("FETCH Train Time", now);
    const response: any = await axios.get(EKISPART_API_BASE_URL,
      {
        params: {
          key: process.env.EKISPART_API_KEY,
          stationCode: 22816,
          code: 3020,
          date: now.format("YYYYMMDD"),
        }
      })
    const data = response.data.ResultSet.TimeTable;
    responseToFormatData(data);
  }

  const responseToFormatData = (data: any) => {
    setStationName(data.Station.Name);

    const formattedLine = formatLine(data.Line);
    setLine(formattedLine);

    setLineDestinationFromData(data.LineDestination);
    setLineKindFromData(data.LineKind);
    setTimeTableFromData(data.HourTable);
  }

  const setLineDestinationFromData = (LineDestinations: any) => {
    const formattedLineDestinations = LineDestinations.map((LineDestination: any) => (
      formatLineDestination(LineDestination)
    ))
    setLineDestination(formattedLineDestinations);
  }

  const setLineKindFromData = (LineKinds: any) => {
    const formattedLineKinds = LineKinds.map((LineKind: any) => (
      formatLineKind(LineKind)
    ))
    setLineKind(formattedLineKinds);
  }

  const setTimeTableFromData = (HourTables: any) => {
    const formattedTimeTables = HourTables.flatMap((HourTable: any) => (
      HourTable.MinuteTable.flatMap((MinuteTable: any) => (
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
      code: Number(LineDestination.code),
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
      time: DayJs(`${now.format("YYYYMMDD")} ${hour}:${minute.Minute}`),
      kindCode: Number(minute.Stop.kindCode),
      platformNumber: Number(minute.Stop.platformNo),
      lineCode: Number(minute.Stop.lineCode),
      destinationCode: Number(minute.Stop.destinationCode),
    });
  }

  const findLineKindNameByCode = (code: number) => {
    const lineKind: LineKind | undefined = lineKinds.find(lineKind => lineKind.code === code);

    return lineKind ? lineKind.name.slice(0, 1) : null;
  }

  const findLineDestinationNameByCode = (code: number) => {
    const lineDestination: LineDestination | undefined = lineDestinations.find(lineDestination => lineDestination.code === code);

    return lineDestination ? lineDestination.name : null;
  }

  const recentTimeTable = timeTables.filter(timeTable => {
    return timeTable.time.isSameOrAfter(now);
  });

  recentTimeTables = recentTimeTable.slice(0, 5)

  return (
    <div className="font-light font-robot max-w-sm mt-11">
      <h1 className="text-xl">{line && line.name} {stationName}駅の運行情報</h1>
      <div className="mt-6 text-2xl space-y-3">
        {recentTimeTables.length > 0 && recentTimeTables.map(timeTable => (
          <div key={timeTable.time} className="border-b-2 border-thinGray flex items-center space-x-4 pb-2">
            <div><time>{timeTable.time.format("HH:mm")}</time></div>
            <div><span className="rounded-full border border-thinGray p-2 text-lg">{findLineKindNameByCode(timeTable.kindCode)}</span></div>
            <div><span>{findLineDestinationNameByCode(timeTable.destinationCode)}行</span></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainTimeTable;