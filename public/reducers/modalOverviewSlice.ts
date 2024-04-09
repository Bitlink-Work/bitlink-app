import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isOpenModal:false,
}

const modalOverviewSlice = createSlice({
    name:"modalOverview",
    initialState:initialState,
    reducers:{
        setOpenModalOverview:(state,action)=>{
            state.isOpenModal = true;
        },
        setCloseModalOverview:(state,action)=>{
            state.isOpenModal = false;
        },
    }
})
export const {setOpenModalOverview,setCloseModalOverview} = modalOverviewSlice.actions;
export default modalOverviewSlice.reducer;
export const selectIsOpenModalOverview = (state:any)=>state.modalOverview.isOpenModal;