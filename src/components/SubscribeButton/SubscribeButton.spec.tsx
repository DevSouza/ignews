import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'jest-mock'
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SubscriberButton } from '.';

jest.mock('next-auth/react');
jest.mock('next/router');

describe('SubscriberButton components', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValue({data: null, status: 'unauthenticated'});

    render(<SubscriberButton />);
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticated', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValue({data: null, status: 'unauthenticated'});

    // Mock Method SignIn
    const signInMocked = mocked(signIn);

    render(<SubscriberButton />);

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it('redirects to posts when user already subscription', () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);

    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: { 
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires'
      }, 
      status: 'authenticated'
    });
    
    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any);

    render(<SubscriberButton />)

    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith('/posts');
  });
})