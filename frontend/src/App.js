import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';

import PrivateRoute from './components/PrivateRoute';
import DoctorPage from './components/DoctorPage';
import PatientPage from './components/PatientPage';
import PublicRoute from './components/PublicRoute';
import { AIResponseProvider } from './context/AIResponseContext';
import { TaskProgressProvider } from './context/TaskProgressContext';
import BookAppointments from './components/BookAppointments';
import CommuntiySupport from './components/CommuntiySupport';
import RoleProtectedRoute from './components/RoleProtectedRoute';

function App() {
  return (
    <AIResponseProvider>
    <TaskProgressProvider>
    <div className="bg-green-200 h-screen w-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route path="/patient" element={
          <RoleProtectedRoute allowedRole="patient">
            <PatientPage />
          </RoleProtectedRoute>
        } />
        <Route path="/doctor" element={
            <RoleProtectedRoute allowedRole="doctor">
               <DoctorPage />
            </RoleProtectedRoute>
           
        } />
        <Route path="/book-appointment" element={
          <PrivateRoute>
            <BookAppointments/>
          </PrivateRoute>
        } />
        <Route path="/community-support" element={
          <PrivateRoute>
            <CommuntiySupport/>
          </PrivateRoute>
        } />
      </Routes>
    </div>
    </TaskProgressProvider>
    </AIResponseProvider>
  );
}

export default App;
