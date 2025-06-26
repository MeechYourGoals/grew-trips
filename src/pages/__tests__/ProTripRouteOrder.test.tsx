
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProTripDetail from '../ProTripDetail';
import TourDetail from '../TourDetail';

const renderWithRoutes = (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/tour/pro-:proTripId" element={<ProTripDetail />} />
        <Route path="/tour/:tourId" element={<TourDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Route order for pro trips', () => {
  it('renders ProTripDetail when visiting /tour/pro-1', () => {
    renderWithRoutes('/tour/pro-1');
    // title from proTripMockData for id '1'
    expect(screen.getByRole('heading', { name: 'Eli Lilly C-Suite Retreat 2026' })).toBeInTheDocument();
  });
});
