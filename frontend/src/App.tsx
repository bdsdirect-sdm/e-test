import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import AddPatient from './components/AddPatient';
import DoctorList from './components/DoctorList';
import StaffList from './components/StaffList';
// import AddStaff from './components/AddStaff';
import Signup from './components/Signup';
import Header from './components/Header';
import Verify from './components/Verify';
import Login from './components/Login';
import Profile from './components/Profile';
import AddAddress from './components/AddAddress';
import Chat from './components/chat';
import Appointments from './components/Appoinments';

// import AppointmentManagement from './components/AppointmentManagement';

import './App.css';
import UpdatePassword from './components/UpdatePassword';

const App: React.FC = () => {
  const router = createBrowserRouter([
    { path: '/', element: <Signup /> },
    { path: '/Verify', element: <Verify /> },
    { path: '/login', element: <Login /> },
    {
      path: '/',
      element: <Header />,
      children: [
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/patient', element: <PatientList /> },
        { path: '/add-patient', element: <AddPatient /> },
        { path: '/doctor', element: <DoctorList /> },
        { path: '/staff', element: <StaffList /> },
        // {
        //   path: '/add-staff', element: <AddStaff close={function (): void {
        //     throw new Error('Function not implemented.');
        //   }} />
        // },
        {
          path: '/add-address', element: <AddAddress close={function (): void {
            throw new Error('Function not implemented.');
          }} />
        },
        { path: '/profile', element: <Profile /> },
        { path: '/chat', element: <Chat /> },
        { path: '/appointments', element: <Appointments /> },
        // { path: '/add-appointment', element: <AddAppoinment /> },
        { path: '/update-password', element: <UpdatePassword /> },
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer newestOnTop={false} closeOnClick />
    </>
  );
};

export default App;
