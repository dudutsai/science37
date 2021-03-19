import {fireEvent, render, screen} from '@testing-library/react';
import TweetList from "../components/TweetList";
import {tweets} from "../tweets";

describe('TweetList', () => {
  const setSelectedHashtag = jest.fn();

  beforeEach(() => {
    render(<TweetList
      tweets={tweets.statuses}
      urls={[]}
      setSelectedHashtag={setSelectedHashtag}
    />);
  })

  afterEach(() => {
    setSelectedHashtag.mockClear();
  })

  it('renders tweet user, text, and hashtags', () => {
    expect(screen.getByText('Science shows us that it is safe to re-open schools. Why isn’t the Biden Administration listening to the science?')).toBeInTheDocument();
    expect(screen.getByText('@mikepompeo')).toBeInTheDocument();
    expect(screen.queryAllByText('#space')).toBeTruthy();
  })

  it('fires event when a hashtag button is clicked', () => {
    fireEvent.click(screen.getByText('#Space'));
    expect(setSelectedHashtag).toBeCalled();
  })
})
