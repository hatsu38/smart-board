import React from "react";
import { useState, useEffect } from 'react';
import DayJs from "../../libs/dayjs-ja";

function Clock() {
  const [now, setNow] = useState(DayJs());

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  const tick = () => {
    setNow(DayJs());
  }

  return (
    <div className="font-light font-robot">
      <p className="text-2xl text-thinGray">{now.format('YYYY/MM/DD')}({now.format('dd')})</p>
      <h2 className="text-8xl tracking-tight">
        {now.format('HH:mm')}<span className="text-4xl align-top text-thinGray">{now.format('ss')}</span>
      </h2>
    </div>
  );
};

export default Clock;