import { configureStore } from '@reduxjs/toolkit'
import TimerSlice from './slicers/TimerSlice'

export default configureStore({
  reducer: {
    timer: TimerSlice.reducer,
  },
})