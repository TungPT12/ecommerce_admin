import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import './index.css'
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Header from "./components/Header/Header";
import MainPage from "./pages/MainPage/MainPage";
import Hotel from "./pages/Hotel/Hotel";
import Transactions from "./pages/Transactions/Transactions";
import Rooms from "./pages/Rooms/Rooms";
import Users from "./pages/User/Users";
import AddHotel from "./pages/Hotel/AddHotel/AddHotel";
import AddRoom from "./pages/Rooms/AddRoom/AddRoom";
import Area from "./pages/Area/Area";
import { useEffect } from "react";
import { checkAccessToken } from "./apis/authn";
import AddUser from "./pages/User/AddUser/AddUser";
import AddArea from "./pages/Area/AddArea/AddArea";
import Type from "./pages/Type/Type";
import AddType from "./pages/Type/AddType/AddType";
import { authnAction } from "./stores/slice/authn";
import UpdateArea from "./pages/Area/UpdateArea/UpdateArea";
import UpdateHotel from "./pages/Hotel/UpdateHotel/UpdateHotel";
import UpdateRoom from "./pages/Rooms/UpdateRoom/UpdateRoom";
import UpdateType from "./pages/Type/UpdateType/UpdateType";
import Category from "./pages/Category/Category";
import AddCategory from "./pages/Category/AddCategory/AddCategory";
import SigninPage from "./pages/SigninPage/SigninPage";
const adminRouters = [
  {
    name: "Admin",
    path: '/',
    element: <Category />
  },
  {
    name: "Admin",
    path: '/admin',
    element: <Dashboard />
  },
  {
    name: "Dashboard",
    path: '/admin/dashboard',
    element: <Dashboard />
  },
  {
    name: "Category",
    path: '/admin/category',
    element: <Category />
  },
  {
    name: "Category",
    path: '/admin/category/add',
    element: <AddCategory />
  },
  // {
  //   name: "Hotel",
  //   path: '/admin/hotels',
  //   element: <Hotel />
  // },
  // {
  //   name: "Hotel",
  //   path: '/admin/hotel/add',
  //   element: <AddHotel />
  // },
  // {
  //   name: "Hotel",
  //   path: '/admin/hotel/edit/:id',
  //   element: <UpdateHotel />
  // },
  // {
  //   name: "Rooms",
  //   path: '/admin/rooms',
  //   element: <Rooms />
  // },
  // {
  //   name: "Rooms",
  //   path: '/admin/room/add',
  //   element: <AddRoom />
  // },
  // {
  //   name: "Rooms",
  //   path: '/admin/room/edit/:id',
  //   element: <UpdateRoom />
  // },
  // {
  //   name: "Transactions",
  //   path: '/admin/transactions',
  //   element: <Transactions />

  // },
  // {
  //   name: "Area",
  //   path: '/admin/areas',
  //   element: <Area />

  // },
  // {
  //   name: "Area",
  //   path: '/admin/area/edit/:id',
  //   element: <UpdateArea />

  // },
  // {
  //   name: "Area",
  //   path: '/admin/area/add',
  //   element: <AddArea />
  // },
  // {
  //   name: "Users",
  //   path: '/admin/users',
  //   element: <Users />
  // },
  // {
  //   name: "Users",
  //   path: '/admin/user/add',
  //   element: <AddUser />

  // },
  // {
  //   name: "Types",
  //   path: '/admin/types',
  //   element: <Type />

  // },
  // {
  //   name: "Types",
  //   path: '/admin/type/add',
  //   element: <AddType />
  // },
  // {
  //   name: "Types",
  //   path: '/admin/type/edit/:id',
  //   element: <UpdateType />
  // },
]

function App() {
  const { isAuthn, username, email, avatar } = useSelector(state => state.authn);
  const dispatch = useDispatch();
  const renderRouter = (listRouter) => {
    return listRouter.map((router) => {
      // return <Route key={router.path} path={router.path} element=<MainPage>{router.element}</MainPage> />
      return <Route key={router.path} path={router.path} element={
        isAuthn ? <MainPage>
          {router.element}
        </MainPage> : <SigninPage />
      } />
    })
  }
  useEffect(() => {
    const token = localStorage.getItem('bookingAdminToken');
    if (!token) {
      return;
    }
    checkAccessToken(token).then((response) => {
      if (response.status === 403 || response.status === 401) {
        localStorage.removeItem('bookingAdminToken');
        window.location.href = '/admin/login'
      }
      if (response.status !== 200) {
        throw new Error('Something wrong');
      }
      dispatch(authnAction.setUser(response.data));
    }).catch((error) => {
      console.log(error)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <BrowserRouter>
      {isAuthn ? <Header
        username={username}
        email={email}
        avatar={avatar}
      /> : <></>}
      <Routes>
        {renderRouter(adminRouters, isAuthn)}
        <Route path='/admin/signin' element=<SigninPage /> />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

