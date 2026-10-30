import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../src/App';

describe('CleanHome App Core Rendering', () => {
  it('renders landing page brand and headline correctly in Indonesian', async () => {
    await React.act(async () => {
      render(<App />);
    });
    const brandElements = screen.getAllByText('CleanHome');
    expect(brandElements.length).toBeGreaterThan(0);

    const cta = screen.getByText('Pilih Layanan & Reservasi');
    expect(cta).toBeDefined();
  });
});
