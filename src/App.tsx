import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import RouteConfig from './routes/RouteConfig';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';
import { CartSidebar } from './components/CartSidebar';

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        {/* <AppRoutes /> */}
        <div className='min-h-screen'>
          <RouteConfig />
        </div>
        <Footer />
        <CartSidebar />
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App
