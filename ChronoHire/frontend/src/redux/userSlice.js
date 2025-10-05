import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authorization: '',
    coins:0
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        add: (state, action) => {
            state.authorization = action.payload
        },
        remove: (state, action) => {
            state.authorization = ''
        },
        setCoins: (state, action) => {
            state.coins = action.payload
        }
    }
})

export const { add, remove,setCoins } = userSlice.actions

export default userSlice.reducer