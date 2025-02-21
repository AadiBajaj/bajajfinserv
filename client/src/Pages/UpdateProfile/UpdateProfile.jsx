import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaUser, FaEye, FaEyeSlash, FaCamera, FaCheck, FaTimes, FaPaw } from 'react-icons/fa';
import { getProfile, updateProfile, updatePassword } from '../../services/profileService';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [tempValue, setTempValue] = useState('');

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await getProfile();
      if (response.success && response.user) {
        const user = response.user;
        setFormData(prevState => ({
          ...prevState,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          state: user.state || '',
          pincode: user.zipCode || '',
          country: user.country || 'India',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        setProfilePic(user.profilePicture);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error(error.message || 'Failed to load user data');
      if (error.message.includes('Authentication')) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [navigate]);

  const handleEditField = (field) => {
    setEditingField(field);
    setTempValue(formData[field]);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleSaveField = async (field) => {
    const trimmedValue = tempValue.trim();
    if (!trimmedValue) {
      toast.error('Field cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const updateData = { [field]: trimmedValue };
      
      // Handle zipCode field name difference
      if (field === 'pincode') {
        updateData.zipCode = trimmedValue;
        delete updateData.pincode;
      }

      const response = await updateProfile(updateData);
      if (response.success) {
        setFormData(prev => ({
          ...prev,
          [field]: trimmedValue,
        }));
        toast.success('Profile updated successfully');
        setEditingField(null);
        setTempValue('');
      } else {
        toast.error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update field error:', error);
      toast.error(error.message || 'Failed to update field');
      if (error.message.includes('Authentication')) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
};

const handlePasswordChange = async (e) => {
  e.preventDefault();
  const currentPwd = formData.currentPassword.trim();
  const newPwd = formData.newPassword.trim();
  const confirmPwd = formData.confirmPassword.trim();
  
  if (!currentPwd || !newPwd || !confirmPwd) {
    toast.error('All password fields are required');
    return;
  }
  if (currentPwd === newPwd){
    toast.error('New password cannot be the same as current password');
    return;
  }

  // Password validation
  if (newPwd !== confirmPwd) {
    toast.error('New passwords do not match');
    return;
  }

  setIsLoading(true);
  try {
    const response = await updatePassword({
      currentPassword: currentPwd,
      newPassword: newPwd,
    });

    if (response.success) {
      toast.success(response.message || 'Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setShowPasswordSection(false);
    } else {
      toast.error(response.message || 'Failed to update password');
    }
  } catch (error) {
    console.error('Password update error:', error);
    toast.error(error.message || 'Failed to update password');
    if (error.message.includes('Authentication')) {
      navigate('/login');
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsLoading(true);
      const response = await updateProfile({}, file);
      
      if (response.success && response.user) {
        setProfilePic(response.user.profilePicture);
        toast.success('Profile picture updated successfully');
      } else {
        toast.error('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Profile picture update error:', error);
      toast.error(error.message || 'Failed to update profile picture');
      if (error.message.includes('Authentication')) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleEditStateAndPincode = () => {
    setEditingField('stateAndPincode');
    setTempValue({ state: formData.state, pincode: formData.pincode });
  };
  
  const handleSaveStateAndPincode = async () => {
    const state = tempValue.state.trim();
    const pincode = tempValue.pincode.trim();
    
    if (!state || !pincode) {
      toast.error('State and Pincode cannot be empty');
      return;
    }
  
    setIsLoading(true);
    try {
      const updateData = { state, zipCode: pincode };
      const response = await updateProfile(updateData);
      if (response.success) {
        setFormData(prev => ({ ...prev, state, pincode }));
        toast.success('Profile updated successfully');
        setEditingField(null);
        setTempValue('');
      } else {
        toast.error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update field error:', error);
      toast.error(error.message || 'Failed to update field');
      if (error.message.includes('Authentication')) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
};
  
const renderField = (field, label, disabled = false) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="flex items-center gap-2">
      {editingField === field ? (
        <React.Fragment>
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            disabled={isLoading}
            className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <button
            onClick={() => handleSaveField(field)}
            disabled={isLoading}
            className="p-2 text-purple-600 hover:text-purple-700"
          >
            <FaCheck style={{ color: '#ffffff', cursor: 'pointer' }} />
          </button>
          <button
            onClick={handleCancelEdit}
            disabled={isLoading}
            className="p-2 text-red-600 hover:text-red-700"
          >
            <FaTimes style={{ color: '#ffffff', cursor: 'pointer' }} />
          </button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <input
            type="text"
            value={formData[field]}
            disabled
            className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 bg-gray-50"
          />
          {!disabled && (
            <button
              onClick={() => handleEditField(field)}
              disabled={isLoading}
              className="p-2 text-purple-600 hover:text-purple-700"
            >
              <FaEdit style={{ color: '#ffffff', cursor: 'pointer' }} />
            </button>
          )}
        </React.Fragment>
      )}
    </div>
  </div>
);

const renderStateAndPincodeFields = () => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      State and Pincode
    </label>
    <div className="flex items-center gap-2">
      {editingField === 'stateAndPincode' ? (
        <React.Fragment>
          <input
            type="text"
            value={tempValue.state}
            onChange={(e) => setTempValue(prev => ({ ...prev, state: e.target.value }))}              disabled={isLoading}
            className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <input
            type="text"
            value={tempValue.pincode}
            onChange={(e) => setTempValue(prev => ({ ...prev, pincode: e.target.value }))}              disabled={isLoading}
            className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <button
            onClick={handleSaveStateAndPincode}
            disabled={isLoading}
            className="p-2 text-green-600 hover:text-green-700"
          >
            <FaCheck style={{ color: '#ffffff', cursor: 'pointer' }} />
          </button>
          <button
            onClick={handleCancelEdit}
            disabled={isLoading}
            className="p-2 text-red-600 hover:text-red-700"
          >
            <FaTimes style={{ color: '#ffffff', cursor: 'pointer' }} />
          </button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <input
            type="text"
            value={formData.state}
            disabled
            className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 bg-gray-50"
          />
          <input
            type="text"
            value={formData.pincode}
            disabled
            className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 bg-gray-50"
          />
          <button
            onClick={handleEditStateAndPincode}
            disabled={isLoading}
            className="p-2 text-purple-600 hover:text-purple-700"
          >
            <FaEdit style={{ color: '#ffffff', cursor: 'pointer' }} />
          </button>
        </React.Fragment>
      )}
    </div>
  </div>
);

return (
  <div className="min-h-screen flex flex-col">
    {/* Main content with background image */}
    <div 
      className="flex-grow py-8 px-4 relative"
      style={{
        backgroundImage: 'url("/assets/pethumanhandshake.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(147, 51, 234, 0.02)'
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-100/40 to-white/50" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-purple-600 p-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
               Profile Settings
            </h1>
          </div>

          <div className="p-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-6 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{formData.name}</h2>
                <p className="text-gray-500">{formData.email}</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-4 border-t border-gray-200 pt-6 pb-6">
              {renderField('name', 'Name')}
              {renderField('email', 'Email', true)}
              {renderField('phone', 'Phone')}
              {renderStateAndPincodeFields()}
              {renderField('country', 'Country', true)}
            </div>

            {/* Password Change Section */}
            {!showPasswordSection ? (
              <button
                onClick={() => setShowPasswordSection(true)}
                className="w-full py-2 px-4 border border-purple-500 text-white rounded-lg hover:bg-purple-50 transition-colors duration-200"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                
                {/* Current Password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      disabled={isLoading}
                      className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <FaEyeSlash style={{ color: '#ffffff', cursor: 'pointer' }} />
                      ) : (
                        <FaEye style={{ color: '#ffffff', cursor: 'pointer' }} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                      disabled={isLoading}
                      className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <FaEyeSlash style={{ color: '#ffffff', cursor: 'pointer' }} />
                      ) : (
                        <FaEye style={{ color: '#ffffff', cursor: 'pointer' }} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      disabled={isLoading}
                      className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash style={{ color: '#ffffff', cursor: 'pointer' }} />
                      ) : (
                        <FaEye style={{ color: '#ffffff', cursor: 'pointer' }} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordSection(false);
                      setFormData(prev => ({
                        ...prev,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      }));
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);
};

export default UpdateProfile;
