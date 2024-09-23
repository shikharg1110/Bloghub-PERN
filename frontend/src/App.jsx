import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import Navbar from './component/Navbar';
import SignUp from './component/SignUp';
import Footer from './component/Footer';
import AboutUs from './component/AboutUs';
import ContactUs from './component/ContactUs';
import CreateBlog from './component/CreateBlog';
import ViewBlog from './component/ViewBlog';
import EditBlog from './component/EditBlog';
import ViewAllBlog from './component/ViewAllBlog';
import UserContextProvider from './context/UserContextProvider';
import AdminPanel from './component/AdminPanel';
import ManageUser from './component/ManageUser';
import UserProfile from './component/UserProfile';
import CreateRole from './component/CreateRole';
import EditRole from './component/EditRole';

const App = () => {
  return (
    <div className='min-vh-100 d-flex flex-column gap-2'>

    <UserContextProvider>
      <Navbar></Navbar>
      <Routes>

        <Route path='/' element={<ViewAllBlog/>}></Route>
        <Route path='/adminPanel' element={<AdminPanel/>}></Route>
        <Route path='/manageUser' element={<ManageUser/>}></Route>
        <Route path='/createRole' element={<CreateRole/>}></Route>
        <Route path='/editRole' element={<EditRole/>}></Route>
        <Route path='/user/:id' element={<UserProfile/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<SignUp/>}></Route>
        <Route path='/aboutUs' element={<AboutUs />}></Route>
        <Route path='/contactUs' element={<ContactUs />}></Route>
        <Route path='/createBlog' element={<CreateBlog />}></Route>
        <Route path='/viewBlog/:id' element={<ViewBlog />}></Route>
        <Route path='/editBlog/:id' element={<EditBlog />}></Route>
      </Routes>
      <Footer></Footer>
    </UserContextProvider>
    </div>
  );
}

export default App;