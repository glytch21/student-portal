// components/Navbar.tsx
import Link from 'next/link';

// Define a type for the handleLogout function
type LogoutFunction = () => void;

// Define the prop interface for the Navbar component
interface NavbarProps {
  handleLogout: LogoutFunction;
}

const Navbar: React.FC<NavbarProps> = ({ handleLogout }) => {
  return (
    <nav style={{ height: '60px', backgroundColor: '#333', color: '#fff' }}>
      <ul style={{ display: 'flex', listStyleType: 'none', height: '100%', alignItems: 'center' }}>
        <li style={{ marginRight: '10px' }}>
          <Link href="/">Profile</Link>
        </li>
        <li style={{ marginRight: '10px' }}>
          <Link href="/about">Grades</Link>
        </li>
        <li style={{ marginRight: '10px' }}>
          <Link href="/about">Schedule</Link>
        </li>
        <li style={{ marginRight: '10px' }}>
          <Link href="/about">Classes</Link>
        </li>
        <li>
          <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer'}}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
