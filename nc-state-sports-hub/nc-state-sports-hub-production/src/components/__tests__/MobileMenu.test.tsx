import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileMenu from '../MobileMenu';

describe('MobileMenu', () => {
  it('renders the mobile menu button', () => {
    render(<MobileMenu />);
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('opens the menu when the button is clicked', () => {
    render(<MobileMenu />);
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);
    const closeButton = screen.getByRole('button', { name: /close menu/i });
    expect(closeButton).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument(); // Assuming "Home" is a menu item
  });

  it('closes the menu when the close button is clicked', () => {
    render(<MobileMenu />);
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);
    const closeButton = screen.getByRole('button', { name: /close menu/i });
    fireEvent.click(closeButton);
    expect(menuButton).toBeInTheDocument(); // Menu button should be visible again
    expect(closeButton).not.toBeInTheDocument(); // Close button should be gone
  });

  it('applies NC State branding color to menu items', () => {
    render(<MobileMenu />);
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);
    // This is a simplified check. In a real scenario, you'd check computed styles or specific Tailwind classes.
    // For demonstration, we'll assume a class like 'text-ncstate-red' would be present.
    const homeMenuItem = screen.getByText(/Home/i);
    expect(homeMenuItem).toHaveClass('text-[#CC0000]'); // Check for the specific color class
  });
});
