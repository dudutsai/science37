import TweetList from "./TweetList";
import HashtagList from "./HashtagList";
import {Button, Container, Divider, Grid, InputAdornment, Paper, TextField} from "@material-ui/core";
import {useCallback, useEffect, useState} from "react";
import {debounce} from "lodash";
import Constants from "../constants";
import SearchIcon from '@material-ui/icons/Search';

const MainPage = () => {
  const [keyword, setKeyword] = useState('');
  const [foundTweets, setFoundTweets] = useState([]);
  const [foundUrls, setFoundUrls] = useState([]);
  const [selectedHashtag, setSelectedHashtag] = useState('');

  const dedupeData = (data) => {
    const ids = new Set();
    let ret = [];
    data.forEach(d => {
      if (!ids.has(d.id)) {
        ret.push(d);
      }
      ids.add(d.id);
    });
    return ret;
  }

  function getQuery(key) {
    let ret = key || keyword;
    if (selectedHashtag !== '') {
      ret += `%20%23${selectedHashtag}`;
    }
    return ret;
  }

  const getTweetData = (key, lowestId, fullText) => {
    // key can be user input, but can also be state. We check both just incase
    if ((!key || key === '') && keyword === '') {
      return;
    }
    const firstFiveResults = lowestId === -1;
    const query = getQuery(key);
    const tweetMode = fullText ? '&tweet_mode=extended' : '';
    let url = `${Constants.proxyUrl}${Constants.twitterSearchUrl}?result_type=popular&q=${query}${tweetMode}`;

    if (firstFiveResults) {
      // first 5 tweets
      url += '&count=5';
    } else {
      // we get 6 because there is 1 tweet overlap, which we dedupe
      url += `&max_id=${lowestId}&count=6`;
    }

    const setTweetData = (data) => {
      if (firstFiveResults) {
        setFoundTweets(data.statuses);
      } else {
        setFoundTweets(dedupeData([...foundTweets, ...data.statuses]));
      }
    }

    const setTweetUrls = (data) => {
      const newUrls = data.statuses
        .map(t => {return {id: t.id, url: t.entities.urls[0]?.url}});
      if (firstFiveResults) {
        setFoundUrls(newUrls);
      } else {
        setFoundUrls(dedupeData([...foundUrls, ...newUrls]));
      }
    }

    fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: new Headers({
        'Authorization': `Bearer ${Constants.bearerToken}`,
        'Content-Type': 'application/json'
      }),
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
      .then(response => response.json())
      .then(data => {
        if (fullText) {
          setTweetData(data);
        } else {
          setTweetUrls(data);
        }
      });
  }

  const getLowestId = () => {
    let ret = -1
    if (tweetsLoaded) {
      ret = foundTweets[0].id;
      foundTweets.forEach(tweet => {
        if (tweet.id < ret) {
          ret = tweet.id;
        }
      });
    }
    return ret;
  }

  const debouncedQuery = useCallback(
    debounce((value) => getTweetData(value, -1, true), 1000),
    []
  );

  const debouncedQuery2 = useCallback(
    debounce((value) => getTweetData(value, -1, false), 1000),
    []
  );

  useEffect(() => {
    setFoundTweets([]);
    setFoundUrls([]);
    getTweetData(keyword, -1, true);
    getTweetData(keyword, -1, false);
  }, [selectedHashtag]);

  const tweetsLoaded = foundTweets.length !== 0;
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item md={tweetsLoaded ? 8 : 12} xl={tweetsLoaded ? 8 : 12} xs={12}>
          <h3 align='left'>Tweet Feed</h3>
          <Divider/>
          <Paper elevation={3}>
            <TextField
              fullWidth
              placeholder='Search by keyword'
              variant='outlined'
              onChange={event => {
                const {value} = event.target;
                setKeyword(value);
                setSelectedHashtag('');
                debouncedQuery(value);
                debouncedQuery2(value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon/>
                  </InputAdornment>)
              }}
            />
          </Paper>
        </Grid>
        {tweetsLoaded ?
          <>
            <Grid item md={4} xl={4} xs={12}>
              <HashtagList
                tweets={foundTweets}
                setTweets={setFoundTweets}
                setSelectedHashtag={setSelectedHashtag}
              />
            </Grid>
            <Grid item md={8} xl={8} xs={12}>
              <TweetList
                tweets={foundTweets}
                urls={foundUrls}
                setSelectedHashtag={setSelectedHashtag}
              />
            </Grid>
            <Grid item md={8} xl={8} xs={12}>
              <Button
                variant='outlined'
                onClick={() => {
                  getTweetData(keyword, getLowestId(), true);
                  getTweetData(keyword, getLowestId(), false);
                }}
              >
                Load more
              </Button>
            </Grid>
          </> : null
        }
      </Grid>
    </Container>
  )
}

export default MainPage;