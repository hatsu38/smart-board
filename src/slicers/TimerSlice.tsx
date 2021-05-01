import { createSlice } from '@reduxjs/toolkit'
import DayJs from "../libs/dayjs-ja";

export const TimerSlice = createSlice({
  name: 'timer',
  initialState: {
    time: DayJs()
  },
  reducers: {
    tick: (state, action) => {
      state.time = action.payload;
    },
  },
})

export const { tick } = TimerSlice.actions
export default TimerSlice