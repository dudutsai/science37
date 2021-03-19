import {Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Paper} from "@material-ui/core";
import HashtagButton from "./HashtagButton";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const TweetList = (props) => {
  const {tweets, urls, setSelectedHashtag} = props;
  const classes = useStyles();

  const getUrl = (tweet) => {
    if (tweet.full_text.lastIndexOf('https://t') !== -1) {
      return tweet.full_text.substring(tweet.full_text.lastIndexOf('https://t'));
    }
    return urls.filter(u => u.id === tweet.id)[0]?.url
  }

  const getTweetData = () => {
    if (tweets.length !== 0) {
      return tweets.map(t => {
        return {
          id: t.id_str,
          name: t.user?.screen_name,
          avatar: t.user?.profile_image_url,
          text: t.full_text.substring(t.display_text_range[0], t.display_text_range[1]),
          hashtags: t.entities?.hashtags,
          url: getUrl(t),
        }
      });
    }
    return [];
  }

  const tweetData = getTweetData();

  return (
    <Paper>
      <List>
        {tweetData.map(t => {
          return (
            <ListItem button component='a' href={t.url} key={t.id}>
              <ListItemAvatar>
                <Avatar alt={t.name} src={t.avatar} className={classes.large} />
              </ListItemAvatar>
              <ListItemText
                primary={`@${t.name}`}
                secondary={t.text}
              />
              <Divider/>
              {t.hashtags?.map(hashtag =>
                <HashtagButton
                  key={hashtag.text}
                  setSelectedHashtag={setSelectedHashtag}
                  value={hashtag.text}
                />)}
            </ListItem>
          )
        })}
      </List>
    </Paper>
  )
}

export default TweetList;