import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./rootReducer";

const initialState = {
    isOpenModal:false,
}

const modalSelectChainSlice = createSlice({
    name:"modalSelectChain",
    initialState:initialState,
    reducers:{
        openSelectChainModal:(state)=>{
            state.isOpenModal = true;
        },
        closeSelectChainModal:(state)=>{
            state.isOpenModal = false;
        },
    }
})

export const {openSelectChainModal,closeSelectChainModal} = modalSelectChainSlice.actions;
export default modalSelectChainSlice.reducer;
export const selectIsOpenModalSelectChain = (state: RootState) => state.modalSelectChain.isOpenModal;