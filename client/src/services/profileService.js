import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

// Function to get user profile
const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(`${API_URL}/profile`, config);
    console.log("Aditya's data ",response.data);
    return {
      success: true,
      user: response.data
    };
  } catch (error) {
    console.error('Get profile error:', error);
    throw new Error(error.response?.data?.message || 'Failed to get profile');
  }
};

// Function to update user profile with image support
const updateProfile = async (userData, profilePicture = null) => {
  try {       
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Don't send password updates through this function
    if (userData.password || userData.currentPassword || userData.newPassword) {
      throw new Error('Please use updatePassword function for password changes');
    }

    const formData = new FormData();
    
    // Append user data
    Object.keys(userData).forEach(key => {
      if (key !== 'profilePicture') {
        formData.append(key, userData[key]);
      }
    });

    // Append profile picture if provided
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axios.put(`${API_URL}/profile`, formData, config);
    return {
      success: true,
      user: response.data
    };
  } catch (error) {
    console.error('Update profile error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Function to update password
const updatePassword = async (passwordData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.put(
      `${API_URL}/change-password`,
      passwordData,
      config
    );

    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Update password error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update password');
  }
};

export { getProfile, updateProfile, updatePassword };
