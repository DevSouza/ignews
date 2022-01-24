import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getSession, useSession } from 'next-auth/react';
import { getPrismicClient } from '../../services/prismic';
import { useRouter } from 'next/router';

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post except</p>',
  updatedAt: '10 de Outubro'
};

jest.mock('../../services/prismic')
jest.mock('next-auth/react');
jest.mock('next/router');

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValue({data: null, status: 'unauthenticated'});

    render(<PostPreview post={post} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument();
    expect(screen.getByText('Post except')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('redirects user if to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);

    const pushMock = jest.fn();

    useSessionMocked.mockReturnValue({
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

    render(<PostPreview post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new post' }
          ],
          content: [
            { type: 'paragraph', text: 'Post content' }
          ], 
        },
        last_publication_date: '10-10-2021'
      })
    } as any);

    const response = await getStaticProps({ 
      params: {slug: 'my-new-post'}
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: '10 de outubro de 2021'
          }
        }
      })
    )

  });
});