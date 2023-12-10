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
    path: '/',
    element: <Dashboard />
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
]

function App() {
  const { isAuthn, username, email, avatar } = useSelector(state => state.authn);
  const renderRouter = (listRouter) => {
    return listRouter.map((router) => {
      return <Route key={router.path} path={router.path} element={<MainPage>
        {router.element}
      </MainPage>
      } />
    })
  }

  return (
    <BrowserRouter>
      {/* {isAuthn ? <Header
        username={username}
        email={email}
        avatar={avatar}
      /> : <></>} */}
      <Routes>
        {renderRouter(adminRouters, isAuthn)}
        <Route path='/admin/signin' element=<SigninPage /> />
        <Route path='/admin/chat' element=<Chat /> />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

