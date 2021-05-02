import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import DayJs from "../../libs/dayjs-ja";
import { tick } from '../../slicers/TimerSlice'

function Clock() {
  const { time } = useSelector((state: any) => state.timer);
  const dispatch = useDispatch();

  useEffect(() => {
    const timerId = setInterval(() => dispatch(tick(DayJs().format('YYYY/MM/DD HH:mm:ss'))), 1000);

    return () => clearInterval(timerId);
  }, []);
  const now = DayJs(time);

  return (
    <div className="font-light font-robot text-center sm:text-left">
      <p className="text-2xl text-thinGray">{now.format('YYYY/MM/DD')}({now.format('dd')})</p>
      <h2 className="text-8xl tracking-tight">
        {now.format('HH:mm')}<span className="text-4xl align-top text-thinGray">{now.format('ss')}</span>
      </h2>
    </div>
  );
};

export default Clock;