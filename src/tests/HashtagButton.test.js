import {fireEvent, render, screen} from '@testing-library/react';
import HashtagButton from "../components/HashtagButton";

describe('HashtagButton', () => {
  const setSelectedHashtag = jest.fn();

  beforeEach(() => {
    render(<HashtagButton value='test' setSelectedHashtag={setSelectedHashtag} />);
  })

  afterEach(() => {
    setSelectedHashtag.mockClear();
  })

  it('renders button text and fires event when clicked', () => {
    expect(screen.getByText('#test')).toBeInTheDocument();
    fireEvent.click(screen.getByText('#test'));
    expect(setSelectedHashtag).toBeCalled();
  })
})
