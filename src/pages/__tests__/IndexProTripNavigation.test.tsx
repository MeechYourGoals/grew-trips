import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Index from '../Index';
import ProTripDetail from '../ProTripDetail';
import { proTripMockData } from '../../data/proTripMockData';

const renderWithRouter = () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/tour/pro-:proTripId" element={<ProTripDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Index ProTrip navigation', () => {
  const ids = Object.keys(proTripMockData);

  ids.forEach((id, index) => {
    it(`navigates to detail page for pro trip ${id}`, () => {
      renderWithRouter();

      fireEvent.click(screen.getByRole('button', { name: /trips pro/i }));

      const viewButtons = screen.getAllByRole('button', { name: /view trip/i });
      fireEvent.click(viewButtons[index]);

      expect(
        screen.getByRole('heading', { name: proTripMockData[id].title })
      ).toBeInTheDocument();
    });
  });
});
