/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Form, Button } from 'react-bootstrap';
import AddAddress from './AddAddress';
import { Local } from '../environment/env';
import './Profile.css';

interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

interface User {
  uuid: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  doctype: number;
  Addresses?: Array<Address>;
}

interface ProfileData {
  user: User;
  message: string;
  patientCount?: number;
  referredPatients?: Array<any>;
  referredDoctors?: Array<any>;
  additionalData?: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);

  const handleOpenEditModal = () => {
    if (profile) {
      setFormData({ ...profile.user });
    }
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleOpenAddAddressModal = () => setShowAddAddressModal(true);
  const handleCloseAddAddressModal = () => setShowAddAddressModal(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    axios
      .get(`${Local.BASE_URL}${Local.GET_USER}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching profile');
        setLoading(false);
      });
  }, []);

  const handleProfileSubmit = () => {
    const token = localStorage.getItem('token');
    if (!token || !formData) return;

    axios
      .post(
        `${Local.BASE_URL}${Local.UPDATE_USER}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setProfile((prev) => ({
          ...prev!,
          user: formData,
        }));
        setShowEditModal(false);
        alert('Profile updated successfully');
      })
      .catch((err) => {
        console.error(err);
        alert('Error updating profile');
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return null;

  const { user, referredPatients, referredDoctors, patientCount, additionalData } = profile;

  console.log(user.Addresses)

  return (
    <div className="profile-container">
      {/* <h2 className="profile-title">Profile</h2> */}

      <h3>
        {user.firstname} {user.lastname}
      </h3>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p> {/* Display Phone Number */}

      <p>
        Address:
        {
          user.Addresses?.map((add, index) => (
            <div key={index}>
              {`${index + 1}. ${add.street}, ${add.city}, ${add.state}, ${add.pincode}`}
            </div>
          ))
        }
      </p>

      <p>Type: {user.doctype === 2 ? 'OD' : 'MD'}</p>

      {user.doctype === 1 && referredPatients && (
        <div>
          <h4>Referred Patients:</h4>
          <ul>
            {referredPatients.map((patient) => (
              <li key={patient.uuid}>
                {patient.firstname} {patient.lastname}
              </li>
            ))}
          </ul>
        </div>
      )}

      {user.doctype === 2 && referredDoctors && (
        <div>
          <h4>Referred Doctors:</h4>
          <ul>
            {referredDoctors.map((doctor) => (
              <li key={doctor.uuid}>
                {doctor.firstname} {doctor.lastname}
              </li>
            ))}
          </ul>
        </div>
      )}

      {user.doctype === 1 && patientCount !== undefined && (
        <div>
          <h4>Total Patients Referred: {patientCount}</h4>
        </div>
      )}

      {user.doctype === 3 && additionalData && (
        <div>
          <h4>Admin Data:</h4>
          <p>{additionalData}</p>
        </div>
      )}

      {/* Edit Profile Button */}
      <button onClick={handleOpenEditModal} className="btn btn-primary mb-4">
        Edit Profile
      </button>

      {/* Add Address Button */}
      <button onClick={handleOpenAddAddressModal} className="btn btn-secondary mb-4">
        Add Address
      </button>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData && (
            <Form>
              <Form.Group controlId="firstname">
                <Form.Label className='required'>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="lastname">
                <Form.Label className='required'>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label className='required'>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="phone">
                <Form.Label className='required'>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleProfileSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Address Modal */}
      <Modal show={showAddAddressModal} onHide={handleCloseAddAddressModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddAddress close={handleCloseAddAddressModal} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
