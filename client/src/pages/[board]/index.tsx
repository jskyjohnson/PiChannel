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
  Divider,
} from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { useRouter } from "next/dist/client/router";
//Should only return boards that are actually available from the server... else 404?

//Thread

const GET_THREADS = gql`
  query($boardName: String!) {
    GetThreads(boardName: $boardName) {
      id
      title
      initialPostId
      creation
      category
      posts {
        id
        threadId
        text
        creation
      }
    }
  }
`;

//Board
const GET_BOARD = gql`
  query($name: String!) {
    GetBoard(name: $name) {
      name
      title
      categories
      collection
      description
    }
  }
`;

const index = () => {
  const router = useRouter();
  const { board } = router.query;

  const {
    loading: loadingBoard,
    error: errorBoard,
    data: dataBoard,
  } = useQuery(GET_BOARD, { variables: { name: board } });

  const {
    loading: loadingThreads,
    error: errorThreads,
    data: dataThreads,
  } = useQuery(GET_THREADS, { variables: { boardName: board } });

  if (loadingBoard) return null;
  if (errorBoard) return `Error! ${errorBoard}`;

  return (
    <Container>
      <Box padding="5vh" mt="2vh">
        <Typography variant="h3" align="left" color="textPrimary" gutterBottom>
          Welcome to /{dataBoard.GetBoard.name}!, the {dataBoard.GetBoard.title}{" "}
          board in {dataBoard.GetBoard.collection}{" "}
        </Typography>

        <Typography variant="h5" align="left" paragraph>
          {dataBoard.GetBoard.description}
        </Typography>

        <Grid container spacing={2}>
          {dataBoard.GetBoard.categories.map((e: any) => (
            <Grid item>
              <Chip variant="outlined" size="small" label={e} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Divider />
      {/* Show thread previews here! */}

      {loadingThreads ? (
        <CircularProgress />
      ) : errorThreads ? (
        <>
          <Typography align="left" paragraph>
            ERROR <ErrorOutlineIcon />
          </Typography>
        </>
      ) : (
        <Paper>
          <Box p="1rem">
            <Typography variant="h4" align="left">
              {" "}
              Threads:{" "}
            </Typography>
          </Box>

          {dataThreads.GetThreads.map((e: any) => (
            <Box p="1rem">
              <Paper>
                <Link href={board + "/" + e.id}>
                  <CardActionArea component="a">
                    <Card>
                      <CardContent>
                        <Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm>
                              <Typography align="left" variant="h4">
                                {e.title}
                              </Typography>
                              <Typography
                                align="left"
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                <Chip
                                  variant="outlined"
                                  size="small"
                                  label={e.category}
                                />
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                align="right"
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                ThreadID: {e.id}, initID: {e.initialPostId}
                              </Typography>
                              <Typography
                                align="right"
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                {new Date(e.creation).toLocaleString()}
                              </Typography>
                              <Typography
                                align="right"
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                {e.posts.length} replies
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>

                        {[]
                          .concat(e.posts)
                          .sort((a: any, b: any) => a.id - b.id)
                          .map((v: any, index: number) =>
                            index < 3 ? ( //Limits post preview
                              <Box mt="1rem">
                                <Card>
                                  <CardContent>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} sm>
                                        <Typography>
                                          {v.text.length < 500
                                            ? v.text
                                            : v.text.substr(0, 500) + "..."}
                                        </Typography>
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
                                          {new Date(
                                            v.creation
                                          ).toLocaleString()}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </CardContent>
                                </Card>
                              </Box>
                            ) : null
                          )}
                      </CardContent>
                    </Card>
                  </CardActionArea>
                </Link>
              </Paper>
            </Box>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default index;
