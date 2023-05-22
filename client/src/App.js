import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Student from './components/Student';
import Admin from './components/Admin';
import Professor from './components/Professor';
import NotFoundPage from './components/404/404';
import 'chart.js/auto';

const App = () => {
  const role = localStorage.getItem('role');
  const token = window.localStorage.getItem('token');
  console.log('token', token);
  let notfoundurl = window.location.pathname;
  console.log("notfoundurl", notfoundurl);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pagenotfound" element={<NotFoundPage />} />
        {
          notfoundurl !== "/" &&
            notfoundurl !== "/forgetpassword" &&
            notfoundurl !== "/pagenotfound" &&
            notfoundurl !== "/student" &&
            notfoundurl !== "/professor" &&
            notfoundurl !== "/admin" &&
            notfoundurl !== "/forgetpassword" ?
            window.location.assign('/pagenotfound') : ""
        }
        {token != null ?
          <>
            {role === 'student' &&
              <Route path="/student" element={<Student />} />
            }
            {role === 'professor' &&
              <Route path="/professor" element={<Professor />} />
            }
            {role === 'admin' &&
              <Route path="/admin" element={<Admin />} />
            }
          </>
          : "window.location.assign('/')"
        }

      </Routes>
    </BrowserRouter>
  );
};

export default App;
