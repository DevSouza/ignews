import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'jest-mock'
import { useSession, signIn } from 'next-auth/react';
import { SubscriberButton } from '.';

jest.mock('next-auth/react', () => {
  return {
    useSession: () => {
      return {data: null, status: 'unauthenticated'};
    },
    signIn: jest.fn()
  }
});

describe('SubscriberButton components', () => {
  it('renders correctly', () => {
    
    render(<SubscriberButton />);
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticated', () => {
    // Mock Method SignIn
    const signInMocked = mocked(signIn);

    render(<SubscriberButton />);

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });
})