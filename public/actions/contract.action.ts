
import { smcService } from "@/public/api/smcService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListChainSupported = createAsyncThunk(
    'smc/getListChainSupported',
    async (params:any, { dispatch, getState ,rejectWithValue}) => {
        try {
            const res = await smcService.getListChain();
            return {...res.data, walletName : params?.walletName}
        } catch (err) {
            return rejectWithValue(err)
        }
    },
)