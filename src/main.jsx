import React, { Children } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { appStore } from './app//store'; // Ensure the correct path to your store file
import "./index.css"
import { useLoadUserQuery } from './features/api/authApi';
import LoadingSpinner from './components/LoadingSpinner';
import { Toaster } from "./components/ui/sonner";


const Custom =({children})=>{

  const {isLoading} = useLoadUserQuery()

  return(
    <>
    {/* {isLoading ? <h1>Loading...</h1> : <>{children}</>} */}
    {/* or */}
    {isLoading ? <LoadingSpinner/> : <>{children}</>}
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={appStore}>
      <Custom>
        <App />
        <Toaster />
      </Custom>
    </Provider>
  </React.StrictMode>
);
