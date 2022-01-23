import { render, screen } from '@testing-library/react';

import { Header } from '.';

jest.mock('next/router', () => {
  return {
    useRouter: () => {
      return {
        asPath: '/',
      };
    },
  };
});

jest.mock('next-auth/react', () => {
  return {
    useSession: () => {
      return {
        user: {
            name: 'Andre Souza',
            email: 'devsouza01@gmail.com',
            image: 'https://github.com/devsouza.png',
        }
      };
    },
  };
});

describe('Header component', () => {
  it('renders correctly', () => {
    render(<Header />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
  });
});