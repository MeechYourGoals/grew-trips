import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ProTripDetail from '../ProTripDetail';
import { proTripMockData } from '../../data/proTripMockData';
import { getTripLabels } from '../../utils/tripLabels';

const renderWithRouter = (id: string) => {
  render(
    <MemoryRouter initialEntries={[`/tour/pro-${id}`]}>
      <Routes>
        <Route path="/tour/pro-:proTripId" element={<ProTripDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProTripDetail', () => {
  Object.keys(proTripMockData).forEach((id) => {
    const data = proTripMockData[id];
    const labels = getTripLabels(data.category);

    it(`renders correct title and labels for trip ${id}`, () => {
      renderWithRouter(id);
      expect(screen.getByRole('heading', { name: data.title })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: labels.schedule })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: labels.team })).toBeInTheDocument();
    });
  });
});
