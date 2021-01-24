import { gql, NetworkStatus, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Icon,
  Paper,
  Card,
  CardActionArea,
  CardContent,
  Link,
  Chip,
  Container,
  Typography,
  Fab,
  Divider,
} from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import AddIcon from "@material-ui/icons/Add";
import { useRouter } from "next/dist/client/router";

//Should only return when there's a valid thread... else 404?

const GET_THREAD = gql`
  query($id: Float!) {
    GetThread(id: $id) {
      id
      title
      category
      creation
      initialPostId
      posts {
        id
        text
        creation
      }
    }
  }
`;

const Thread = () => {
  const router = useRouter();
  const { board, thread } = router.query;

  const {
    loading: loadingThread,
    error: errorThread,
    data: dataThread,
  } = useQuery(GET_THREAD, { variables: { id: +thread } });

  return (
    <Container>
      {loadingThread ? (
        <CircularProgress />
      ) : errorThread ? (
        <>
          <Typography align="left" paragraph>
            ERROR <ErrorOutlineIcon />
          </Typography>
        </>
      ) : (
        <Paper>
          <Box p="1rem" mt="5vh">
            <Grid container spacing={2}>
              <Grid item xs={12} sm>
                <Typography align="left" variant="h4">
                  {dataThread.GetThread.title}
                </Typography>
                <Typography
                  align="left"
                  variant="subtitle1"
                  color="textSecondary"
                >
                  <Chip
                    variant="outlined"
                    size="small"
                    label={dataThread.GetThread.category}
                  />
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  align="right"
                  variant="subtitle1"
                  color="textSecondary"
                >
                  ThreadID: {dataThread.GetThread.id}, initID:{" "}
                  {dataThread.GetThread.initialPostId}
                </Typography>
                <Typography
                  align="right"
                  variant="subtitle1"
                  color="textSecondary"
                >
                  {new Date(dataThread.GetThread.creation).toLocaleString()}
                </Typography>
                <Typography
                  align="right"
                  variant="subtitle1"
                  color="textSecondary"
                >
                  {dataThread.GetThread.posts.length} replies
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {[]
            .concat(dataThread.GetThread.posts)
            .sort((a: any, b: any) => a.id - b.id)
            .map((v: any, index: number) =>
              index < 3 ? ( //Limits post preview
                <Box p="1rem" pt=".5rem">
                  <Card>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm>
                          <Typography>{v.text}</Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            align="right"
                            variant="subtitle1"
                            color="textSecondary"
                          >
                            PostId: {v.id}
                          </Typography>
                          <Typography
                            align="right"
                            variant="subtitle1"
                            color="textSecondary"
                          >
                            {new Date(v.creation).toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              ) : null
            )}
        </Paper>
      )}
      <Fab
        color="primary"
        aria-label="post"
        style={{ position: "absolute", bottom: "3rem", right: "3rem" }}
      >
        <AddIcon />
      </Fab>
      {/* Show all the posts? */}
    </Container>
  );
};

export default Thread;
