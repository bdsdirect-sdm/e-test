/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import './Appoinment.css';

const AddAppointment: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const [loading, setLoading] = useState(false);

  const fetchPatients = async () => {
    try {
      const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error fetching patient list');
    }
  };


  const { data: patientList, isLoading, isError, error } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
  });

  console.log("patientlistdfssssssssssss", patientList);


  const addAppointment = async (values: any) => {
    if (!userId) return;

    const appointmentData = {
      patientId: values.patientId,
      date: values.date,
      type: values.type,
    };

    setLoading(true);

    try {
      await api.post(`${Local.BASE_URL}${Local.ADD_APPOINTMENT}`, appointmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Appointment added successfully!');
      navigate('/dashboard');  // Redirect to dashboard after success
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error adding appointment');
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    date: Yup.string().required('Date is required'),
    type: Yup.string().required('Appointment type is required'),
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        Error: {error?.message || 'Failed to load patient data'}
      </div>
    );
  }

  return (
    <div className="add-appointment-container">
      <h2 className="form-title">Add New Appointment</h2>
      <Formik
        initialValues={{
          patientId: '',
          date: '',
          type: '',
        }}
        validationSchema={validationSchema}
        onSubmit={addAppointment}
      >
        {({ values }) => (
          <Form>
            <div className="form-group">
              <label className="required">Patient</label>
              <Field as="select" name="patientId" className="form-select">
                <option value="" disabled>Select Patient</option>
                {patientList.patientList?.map((patient: any) => (
                  <option key={patient.uuid} value={patient.uuid}>
                    {patient.firstname} {patient.lastname}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="patientId" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label className="required">Date</label>
              <Field type="date" name="date" className="form-control" />
              <ErrorMessage name="date" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label className="required">Appointment Type</label>
              <Field as="select" name="type" className="form-select">
                <option value="" disabled>Select Appointment Type</option>
                <option value="Consultation">Consultation</option>
                <option value="Follow-Up">Follow-Up</option>
                <option value="Emergency">Emergency</option>
              </Field>
              <ErrorMessage name="type" component="div" className="text-danger" />
            </div>

            <div className="form-group text-center">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding Appointment...' : 'Add Appointment'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddAppointment;
