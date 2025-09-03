import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authorization: ''
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
        }
    }
})

export const { add, remove } = userSlice.actions

export default userSlice.reducer