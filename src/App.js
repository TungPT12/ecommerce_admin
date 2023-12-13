import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useSelector } from "react-redux";
import './index.css'
import Dashboard from "./pages/Dashboard/Dashboard";
import Header from "./components/Header/Header";
import MainPage from "./pages/MainPage/MainPage";
import Category from "./pages/Category/Category";
import AddCategory from "./pages/Category/AddCategory/AddCategory";
import SigninPage from "./pages/SigninPage/SigninPage";
import UpdateCategory from "./pages/Category/UpdateCategory/UpdateCategory";
import Product from "./pages/Product/Product";
import AddProduct from "./pages/Product/AddProduct/AddProduct";
import UpdateProduct from "./pages/Product/UpdateProduct/UpdateProduct";
import Users from "./pages/User/Users";
import Order from "./pages/Order/Order";
import Chat from "./pages/Chat/Chat";
const adminRouters = [
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
  {
    name: "Category",
    path: '/admin/category/edit/:id',
    element: <UpdateCategory />
  },
  {
    name: "Product",
    path: '/admin/products',
    element: <Product />
  },
  {
    name: "Product",
    path: '/admin/product/add',
    element: <AddProduct />
  },
  {
    name: "Product",
    path: '/admin/product/edit/:id',
    element: <UpdateProduct />
  },
  {
    name: "User",
    path: '/admin/users',
    element: <Users />
  },
  {
    name: "Order",
    path: '/admin/orders',
    element: <Order />
  },
  {
    name: "Chat",
    path: '/admin/chat',
    element: <Chat />
  },
]

function App() {
  const { isAuthn, username, email, avatar, isCounselor, isAdmin } = useSelector(state => state.authn);
  const renderRouter = (listRouter) => {
    return listRouter.map((router) => {
      return <Route key={router.path} path={router.path} element={<MainPage>
        {router.element}
      </MainPage>
      } />
    })
  }

  console.log(isAdmin)
  console.log(isAuthn)
  return (
    <BrowserRouter>
      {isAuthn && isAdmin ? <Header
        username={username}
        email={email}
        avatar={avatar}
      /> : <></>}
      <Routes>
        {renderRouter(adminRouters, isAuthn)}
        <Route path='/admin/signin' element=<SigninPage /> />
        <Route path='/' element={isAuthn ? (
          isAdmin ? <MainPage>
            <Dashboard />
          </MainPage> : <Chat />
        ) : <SigninPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

