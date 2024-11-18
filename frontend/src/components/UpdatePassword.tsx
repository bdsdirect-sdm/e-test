/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './UpdatePassword.css';

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Local state for old and new passwords
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      setLoading(true);

      // Make API call to change password
      const response = await api.post(
        `${Local.VITE_CHANGE_PASSWORD}`,
        { currentPassword: oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigate('/profile');
    } catch (err) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-password-container">
      <h2 className="update-password-title">Change Your Password</h2>

      <form onSubmit={handleSubmit} className="update-password-form">
        <div className="form-group">
          <label htmlFor="old-password" className='required'>Old Password</label>
          <input
            type="password"
            id="old-password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="form-control"
            placeholder="Enter your old password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="new-password" className='required'>New Password</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="form-control"
            placeholder="Enter a new password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password" className='required'>Confirm New Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-control"
            placeholder="Confirm your new password"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
