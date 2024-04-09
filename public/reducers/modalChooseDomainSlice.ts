import { createSlice } from "@reduxjs/toolkit";


const initialState= {
    isOpen: false,
}

const ModalChooseDomainSlice = createSlice({
    name:"modalChooseDomain",
    initialState: initialState,
    reducers:{
        setOpenModalChooseDomain:(state)=>{
            state.isOpen = true;
        },
        setCLoseModalChooseDomain:(state)=>{
            state.isOpen = false;
        }
    }
})

export const {setOpenModalChooseDomain,setCLoseModalChooseDomain} = ModalChooseDomainSlice.actions;
export default ModalChooseDomainSlice.reducer;

export const selectOpenModalChooseDomain = (state: any)=>{return state.modalChooseDomain.isOpen}