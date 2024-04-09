import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { RootState } from "@/src/reducers/rootReducer";
import { RootState } from "./rootReducer";

const autoClose = 3000;

interface IAlert {
  type: string | any;
  key?: string | any;
  message: string | any;
  duration?: number | any;
  isLoading?: boolean;
}

interface IState {
  alertData: any
}

const initialState:IState={
  alertData:{
    type: "",
    key: "",
    message:"",
    duration:autoClose
  }
}

const AlertSlice = createSlice({
  name:'alert',
  initialState:initialState,
  reducers:{
      addAlert(state,action:PayloadAction<IAlert>){
        state.alertData = {...action.payload, duration: 5000}
      },
  },
  extraReducers: (builder) => {
      // Add reducers for additional action types here, and handle loading state as needed
      // builder.addCase(fetchListLeaderBoard.fulfilled, (state, action) => {
      //   // Add user to the state array
      //   state.items.push(action.payload.items)
      //     //   state.pagination = {
      //     //     page: action.payload.page,
      //     //     num_of_page: action.payload.num_of_page
      //     //   }
      // })
  },
})

export const { addAlert } = AlertSlice.actions;
export default AlertSlice.reducer;

// create and export the selector
export const selectAlert = (state: RootState) => state.alert.alertData;