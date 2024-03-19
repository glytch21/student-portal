import React from 'react';

interface NavbarProps {
  onProfileClick: () => void;
  onGradesClick: () => void;
  role: string;
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick, onGradesClick, role }) => {

  const handleLogout = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  };

  return (
    <nav style={{ height: '60px', backgroundColor: '#333', color: '#fff' }}>
      {role === 'student' && (
        <ul style={{ display: 'flex', listStyleType: 'none', height: '100%', alignItems: 'center' }}>
          <li style={{ marginRight: '50px', marginLeft: '10px' }}>
            <p className='font-bold text-lg'>Student Portal</p>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={onProfileClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Profile</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={onGradesClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Grades</button>
          </li>
          
          <li>
            <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Logout</button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
