import { createSlice } from "@reduxjs/toolkit";
// import { checkAccessToken } from "../../apis/auth/authn";
// let initAuthn = {
//     isAuthn: false,
// }
// const accessToken = () => {
//     const token = localStorage.getItem('bookingAdminToken');

//     if (!token) {
//         return
//     }
//     checkAccessToken(token).then((response) => {
//         console.log(token)
//         if (response.status === 403 || response.status === 401) {
//             localStorage.removeItem('bookingAdminToken');
//         }
//         if (response.status !== 200) {
//             throw new Error('Something wrong');
//         }
//         return response.data;
//     }).then((data) => {
//         localStorage.setItem('bookingAdminToken', token)
//         initAuthn = {
//             ...data,
//             isAuthn: true
//         }
//         // dispatch(authnAction.accessToken(data))
//     }).catch((error) => {
//         console.log(error)
//         alert(error.message)
//         return null;
//     })
// }

// let user = localStorage.getItem('booking-user');
// if (!user.username && !user.avatar && !user.email && !user.phoneNumber && !user.fullName) {
//     user = {};
// }

// const initAuthn = localStorage.getItem('booking-user') ? {
//     ...JSON.parse(localStorage.getItem('booking-user')),
//     isAuthn: true,
// } : {
//     isAuthn: false
// }

const initAuthn = {
    isAuthn: false
}

const authnSlice = createSlice({
    name: "Authentication",
    initialState: initAuthn,
    reducers: {
        login(state, payload) {
            const user = payload.payload;
            localStorage.setItem('bookingAdminToken', user.token);
            state.token = user.token;
            state.isAuthn = true;
            state._id = user._id;
            state.email = user.email;
            state.fullName = user.fullName;
            state.isAdmin = user.isAdmin;
            state.phoneNumber = user.phoneNumber;
            state.username = user.username;
            state.avatar = user.avatar;
        },
        logout(state) {
            localStorage.removeItem('bookingAdminToken');
            state.isAuthn = false;
        },
        setUser(state, payload) {
            const user = payload.payload;
            state.token = localStorage.getItem('bookingAdminToken');
            state.isAuthn = true;
            state._id = user._id;
            state.email = user.email;
            state.fullName = user.fullName;
            state.isAdmin = user.isAdmin;
            state.phoneNumber = user.phoneNumber;
            state.username = user.username;
            state.avatar = user.avatar;
        }
    }
})

const authnReducer = authnSlice.reducer;
const authnAction = authnSlice.actions;

export default authnReducer;

export {
    authnAction
}