/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const getUser = async () => {
    try {
      const response = await api.get(`${Local.GET_USER}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (err) {
      toast.error("Failed to fetch user data");
    }
  };

  const fetchPatientList = async () => {
    try {
      const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch patient data");
    }
  };

  const fetchDoctorList = async () => {
    try {
      const response = await api.get(`${Local.GET_DOCTOR_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch doctor data");
    }
  };

  const { data: userData, isError: userError, error: userErrorMsg, isLoading: userLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: getUser
  });

  const { data: patientData, isError: patientError, error: patientErrorMsg, isLoading: patientLoading } = useQuery({
    queryKey: ['patientData'],
    queryFn: fetchPatientList
  });

  const { data: doctorData, isError: doctorError, error: doctorErrorMsg, isLoading: doctorLoading } = useQuery({
    queryKey: ['doctorData'],
    queryFn: fetchDoctorList
  });

  if (userLoading || patientLoading || doctorLoading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (userError || patientError || doctorError) {
    return (
      <div className="error-container">
        <div>Error: {userErrorMsg?.message || patientErrorMsg?.message || doctorErrorMsg?.message}</div>
      </div>
    );
  }

  const { user } = userData?.data || {};
  const { patientList } = patientData || {};
  const { doctorList } = doctorData || {};


  const totalRefersReceived = patientList?.length || 0;
  const totalRefersCompleted = patientList?.filter((patient: { referalstatus: boolean }) => patient.referalstatus === true).length || 0;

  const totalDoctors = doctorList?.length || 0;

  return (
    <div className="dashboard-container">

      <h2 className="dashboard-title">Welcome to Your Dashboard</h2>

      <div className="metrics-cards">
        <div className="card" onClick={() => navigate('/patient')}>
          <div className="card-body">
            <div className="card-title">Total Refers</div>
            <div className="card-text">{totalRefersReceived}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="card-title">Total Refers Completed</div>
            <div className="card-text">{totalRefersCompleted}</div>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/doctor')}>
          <div className="card-body">
            <div className="card-title">Total Doctors OD/MD</div>
            <div className="card-text">{totalDoctors}</div>
          </div>
        </div>
      </div>

      <div className='refer d-flex'>
        {user.doctype === 2 ? (<><h2 className="refer-title">Refer a Patient</h2><button className="appointment-btn" onClick={() => navigate("/add-patient")}>+Add Refer</button></>) : <><h2 className="refer-title">Add Appointment</h2><button className="appointment-btn" onClick={() => navigate("/appointments")}>+Add Appointment</button></>}


      </div>
      <div className="patient-list-section">
        <div className="patient-table-container">
          <table className="table">
            <thead>
              <tr >
                <th scope="col">#</th>
                <th scope="col">Patient Name</th>
                <th scope="col">Disease</th>
                <th scope="col">Refer by</th>
                <th scope="col">Refer to</th>
                <th scope="col">Refer back</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {patientList?.map((patient: any, index: number) => (
                <tr key={index}>
                  <td className="fw-bold">{index + 1}</td>
                  <td>{patient.firstname} {patient.lastname}</td>
                  <td>{patient.disease}</td>
                  <td>{patient.referedby.firstname} {patient.referedby.lastname}</td>
                  <td>{patient.referedto.firstname} {patient.referedto.lastname}</td>
                  <td>{patient.referback ? 'Yes' : 'No'}</td>
                  <td>
                    <span className={`badge ${patient.referalstatus ? 'bg-success' : 'bg-warning'}`}>
                      {patient.referalstatus ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
