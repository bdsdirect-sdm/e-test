/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal, Form, Button } from 'react-bootstrap';
import './StaffList.css';

const StaffList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    email: '',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(false);

  const handleOpenAddStaffModal = () => {
    setShowAddStaffModal(true);
  };

  const handleCloseAddStaffModal = () => {
    setShowAddStaffModal(false);
    setNewStaffData({
      firstname: '',
      lastname: '',
      gender: '',
      email: '',
      phoneNumber: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaffData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddStaffSubmit = async () => {
    if (!token || !newStaffData) return;

    setLoading(true);

    try {
      await api.post(
        `${Local.BASE_URL}${Local.ADD_STAFF}`,
        newStaffData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await queryClient.invalidateQueries();

      toast.success('Staff added successfully!');
      setShowAddStaffModal(false);
    } catch (err: any) {
      toast.error(`Error adding staff: ${err.message || 'Something went wrong'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetch staff data
  const fetchStaff = async () => {
    try {
      const response = await api.get(`${Local.GET_STAFF}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      toast.error(`${err.message || 'Error fetching staff data'}`);
    }
  };

  const { data: staffData, error, isLoading, isError } = useQuery({
    queryKey: ['staff'],
    queryFn: fetchStaff,
  });

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
      <div className="text-danger">
        Error: {error.message || 'Failed to load staff data'}
      </div>
    );
  }

  console.log('Staff Data:', staffData);

  return (
    <div className="staff-list-container">
      <button
        onClick={handleOpenAddStaffModal}
        className="add-staff-btn mb-4"
        disabled={loading}
      >
        {loading ? 'Adding Staff...' : 'Add Staff'}
      </button>
      <h2 className="staff-list-title">Staff List</h2>


      {/* Staff List Table */}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Gender</th>
            <th scope="col">Email</th>
            <th scope="col">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {staffData?.map((staff: any, index: number) => (
            <tr key={staff.uuid}>
              <td className="fw-bold">{index + 1}</td>
              <td>{staff.firstname}</td>
              <td>{staff.lastname}</td>
              <td>{staff.gender}</td>
              <td>{staff.email}</td>
              <td>{staff.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Staff Modal */}
      <Modal show={showAddStaffModal} onHide={handleCloseAddStaffModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="firstname">
              <Form.Label className='required'>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstname"
                value={newStaffData.firstname}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="lastname">
              <Form.Label className='required'>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                value={newStaffData.lastname}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="gender">
              <Form.Label className='required'>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={newStaffData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label className='required'>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newStaffData.email}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="phoneNumber">
              <Form.Label className='required'>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={newStaffData.phoneNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddStaffModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddStaffSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Staff'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StaffList;
