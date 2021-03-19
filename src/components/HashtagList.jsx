import {Divider, Paper} from "@material-ui/core";
import HashtagButton from "./HashtagButton";

const HashtagList = (props) => {
  const {tweets, setSelectedHashtag} = props;

  const reduceTweetsToUniqueHashtags = () => {
    const set = new Set();

    if (tweets.length !== 0) {
      tweets
        .filter(tweet => tweet.entities.hashtags && tweet.entities.hashtags.length !== 0)
        .map(tweet => tweet.entities?.hashtags)
        .reduce((acc, hashtag) => acc.concat(hashtag), [])
        .map(hashtag => hashtag.text.toLowerCase())
        .forEach(hashtag => set.add(hashtag));
    }
    return set;
  }

  const hashtags = reduceTweetsToUniqueHashtags();

  return (
    <Paper style={{'width': '100%', 'display': 'inline-block'}} elevation={3}>
      {hashtags.size !== 0 ?
        <>
          <h3 style={{'margin': '20px'}} align='left'>Filter by hashtag</h3>
          <Divider/>
          {Array.from(hashtags).map(hashtag => {
            return (
              <HashtagButton
                key={hashtag}
                setSelectedHashtag={setSelectedHashtag}
                value={hashtag}
              />
            )
          })}
        </> : null
      }
    </Paper>
  )
}

export default HashtagList;