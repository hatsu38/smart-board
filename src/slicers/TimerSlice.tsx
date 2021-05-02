import { createSlice } from '@reduxjs/toolkit'
import DayJs from "../libs/dayjs-ja";

export const TimerSlice = createSlice({
  name: 'timer',
  initialState: {
    now: DayJs()
  },
  reducers: {
    tick: (state, action) => {
      state.now = action.payload;
    },
  },
})

export const { tick } = TimerSlice.actions
export default TimerSlice