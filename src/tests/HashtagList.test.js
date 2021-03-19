import {render, screen} from '@testing-library/react';
import HashtagList from '../components/HashtagList';
import {tweets} from "../tweets";

describe('HashtagList', () => {
  beforeEach(() => {
    render(<HashtagList tweets={tweets.statuses}/>);
  })

  it('renders hashtags contained in the tweets', () => {
    expect(screen.getByText('#space')).toBeInTheDocument();
    expect(screen.getByText('#milkyway')).toBeInTheDocument();
  })
})
