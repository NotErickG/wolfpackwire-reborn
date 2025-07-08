import React from 'react';
import { render, screen } from '@testing-library/react';
import HelloWorld from '../HelloWorld';

describe('HelloWorld', () => {
  it('renders the Hello World! text with NC State red styling', () => {
    render(<HelloWorld />);
    const helloWorldElement = screen.getByText('Hello World!');
    expect(helloWorldElement).toBeInTheDocument();
    expect(helloWorldElement).toHaveClass('text-[#CC0000]');
    expect(helloWorldElement).toHaveClass('text-2xl');
    expect(helloWorldElement).toHaveClass('font-bold');
  });
});
