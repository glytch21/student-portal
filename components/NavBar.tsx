import React from 'react';

interface NavbarProps {
  firstButtonClick: () => void;
  secondButtonClick: () => void;
  thirdButtonClick?: () => void;
  fourthButtonClick?: () => void;
  role: string;
}

const Navbar: React.FC<NavbarProps> = ({ firstButtonClick, secondButtonClick, thirdButtonClick, fourthButtonClick, role }) => {

  const handleLogout = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  };

  return (
    <nav style={{ height: '60px', backgroundColor: '#333', color: '#fff' }}>

      {/* nav for students */}

      {role === 'student' && (
        <ul style={{ display: 'flex', listStyleType: 'none', height: '100%', alignItems: 'center' }}>
          <li style={{ marginRight: '50px', marginLeft: '10px' }}>
            <p className='font-bold text-lg'>Student Portal</p>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={firstButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Profile</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={secondButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Grades</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={thirdButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Announcements</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={fourthButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Schedule</button>
          </li>
          <li>
            <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Logout</button>
          </li>
        </ul>
      )}

      {/* nav for teachers */}

      {role === 'teacher' && (
        <ul style={{ display: 'flex', listStyleType: 'none', height: '100%', alignItems: 'center' }}>
          <li style={{ marginRight: '50px', marginLeft: '10px' }}>
            <p className='font-bold text-lg'>Teachers Portal</p>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={firstButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Profile</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={secondButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Classes</button>
          </li>
          <li>
            <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Logout</button>
          </li>
        </ul>
      )}

      {/* nav for parents */}

      {role === 'parent' && (
        <ul style={{ display: 'flex', listStyleType: 'none', height: '100%', alignItems: 'center' }}>
          <li style={{ marginRight: '50px', marginLeft: '10px' }}>
            <p className='font-bold text-lg'>Parent Portal</p>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={firstButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Profile</button>
          </li>
          <li style={{ marginRight: '10px' }}>
            <button onClick={secondButtonClick} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Announcements</button>
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
