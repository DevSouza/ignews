import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/react';
import Home from '../../pages';

jest.mock('next-auth/react');
jest.mock('next/router');

describe('Home page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValue({data: null, status: 'unauthenticated'});

    render(<Home product={{priceId: 'fake-price-id', amount: 'R$ 10,00'}}/>)

    expect(screen.getByText(/R\$ 10,00/i)).toBeInTheDocument();
  });
});