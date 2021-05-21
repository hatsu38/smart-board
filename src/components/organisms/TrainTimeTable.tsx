import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import DayJs from "~/libs/dayjs-ja";

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
  mark: string,
  display: boolean,
}

const TrainTimeTable: React.FC = () => {
  const [stationName, setStationName] = useState<string>();
  const [line, setLine] = useState<Line>();
  const [lineDestinations, setLineDestination] = useState<LineDestination[]>([]);
  const [lineKinds, setLineKind] = useState<LineKind[]>([]);
  const [timeTables, setTimeTable] = useState<TimeTable[]>([]);
  const [filteredTimeTables, setFilteredTimeTables] = useState<TimeTable[]>([]);
  const EKISPART_API_BASE_URL = "https://api.ekispert.jp/v1/json/operationLine/timetable";
  const { time } = useSelector((state: any) => state.timer);
  const now = DayJs(time);

  useEffect(() => { apiCall(); }, []);
  useEffect(() => {
    if (shouldRefetch()) {
      resetFilteredRecentTimeTable();
    }
  }, [time]);

  const shouldRefetch = () => {
    return filteredTimeTables.length < 1 || now.format("ss") === "00";
  };

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
      });
    const data = response.data.ResultSet.TimeTable;
    responseToFormatData(data);
  };

  const responseToFormatData = (data: any) => {
    setStationName(data.Station.Name);

    const formattedLine = formatLine(data.Line);
    setLine(formattedLine);

    setLineDestinationFromData(data.LineDestination);
    setLineKindFromData(data.LineKind);
    setTimeTableFromData(data.HourTable);
  };

  const setLineDestinationFromData = (LineDestinations: any) => {
    const formattedLineDestinations = LineDestinations.map((LineDestination: any) => (
      formatLineDestination(LineDestination)
    ));
    setLineDestination(formattedLineDestinations);
  };

  const setLineKindFromData = (LineKinds: any) => {
    const formattedLineKinds = LineKinds.map((LineKind: any) => (
      formatLineKind(LineKind)
    ));
    setLineKind(formattedLineKinds);
  };

  const setTimeTableFromData = (HourTables: any) => {
    const formattedTimeTables = HourTables.flatMap((HourTable: any) => (
      HourTable.MinuteTable.length > 0 ? (
        HourTable.MinuteTable.flatMap((MinuteTable: any) => (
          formatTimeTable(HourTable.Hour, MinuteTable)
        ))
      ) : (
        formatTimeTable(HourTable.Hour, HourTable.MinuteTable)
      )
    ));
    setTimeTable(formattedTimeTables);
  };

  const formatLine = (line: any) => {
    return ({
      name: line.Name,
      toName: line.Direction,
      fromName: line.Source,
    });
  };

  const formatLineDestination = (LineDestination: any) => {
    return ({
      name: LineDestination.text,
      code: Number(LineDestination.code),
    });
  };

  const formatLineKind = (LineKind: any) => {
    return ({
      name: LineKind.text,
      code: Number(LineKind.code),
      mark: LineKind.text.slice(0, 1),
      display: true,
    });
  };

  const formatTimeTable = (hour: number, minute: any) => {
    return ({
      time: DayJs(`${now.format("YYYYMMDD")} ${hour}:${minute.Minute}`),
      kindCode: Number(minute.Stop.kindCode),
      platformNumber: Number(minute.Stop.platformNo),
      lineCode: Number(minute.Stop.lineCode),
      destinationCode: Number(minute.Stop.destinationCode),
    });
  };

  const findLineKindMarkByCode = (code: number) => {
    const lineKind: LineKind | undefined = lineKinds.find(lineKind => lineKind.code === code);

    return lineKind ? lineKind.mark : null;
  };

  const findLineDestinationNameByCode = (code: number) => {
    const lineDestination: LineDestination | undefined = lineDestinations.find(lineDestination => lineDestination.code === code);

    return lineDestination ? lineDestination.name : null;
  };

  const toggleLineKindDisplay = (code: number) => {
    const toggledLineKinds: LineKind[] = lineKinds.map(lineKind => {
      if (lineKind.code === code) {
        lineKind.display = !lineKind.display;
      }
      return lineKind;
    });
    setLineKind(toggledLineKinds);
    resetFilteredRecentTimeTable();
  };

  const resetFilteredRecentTimeTable = () => {
    const displayLineKindsCode = lineKinds.map(lineKind => {
      if (lineKind.display) { return lineKind.code; }
    });
    const recentFilteredTimeTable = timeTables.filter(timeTable => {
      // NOTE: ミリ秒単位の比較ではなく、分単位で比較する
      return timeTable.time.isSameOrAfter(now, "minute") && displayLineKindsCode.includes(timeTable.kindCode);
    });
    setFilteredTimeTables(recentFilteredTimeTable);
  };

  return (
    <div className="font-light font-robot max-w-sm mt-44">
      <h1 className="text-xl">{line && line.name} {stationName}駅の運行情報</h1>
      <div className="mt-6 text-sm space-x-3">
        {lineKinds.map(lineKind =>
          <div
            key={`lineKind-${lineKind.code}`}
            className="inline"
          >
            <span
              className={`rounded-full border p-2 ${lineKind.display ? "border-white" : "border-thinGray"}`}
              onClick={() => toggleLineKindDisplay(lineKind.code)}
            >
              {lineKind.mark}
            </span>
          </div>
        )}
      </div>
      <div className="mt-6 pt-1 text-xl space-y-3 h-96 overflow-y-auto">
        {filteredTimeTables.length > 0 && filteredTimeTables.map(timeTable => (
          <div key={timeTable.time} className="border-b-2 border-thinGray flex items-center pb-2 justify-between">
            <div className="flex items-center">
              <div>{findLineKindMarkByCode(timeTable.kindCode)}:</div>
              <div className="ml-1 text-2xl"><time>{timeTable.time.format("HH:mm")}</time></div>
            </div>
            <div className="ml-16">{findLineDestinationNameByCode(timeTable.destinationCode)}<span className="text-base"> 行</span></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainTimeTable;