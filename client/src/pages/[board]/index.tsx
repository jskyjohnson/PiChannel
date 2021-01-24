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
  Chip,
  Container,
  Fab,
  TextField,
  MenuItem,
  Select,
  Typography,
  Divider,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import PublishIcon from "@material-ui/icons/Publish";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { useRouter } from "next/dist/client/router";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import NavBar from "components/NavBar";
import Link from "next/link";
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

const CREATE_THREAD = gql`
  mutation($content: ThreadInput!) {
    CreateThread(content: $content) {
      success
      message
      thread {
        id
      }
      initialPost {
        text
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
  const { enqueueSnackbar } = useSnackbar();
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

  const [openEdit, setOpenEdit] = useState(false);
  const onEditMenuToggle = () => setOpenEdit(!openEdit);

  // new ThreadHandling...
  const [threadTitle, setThreadTitle] = useState("");
  const [threadCategories, setThreadCategories] = useState("");
  const [threadText, setThreadText] = useState("");
  const [createThread] = useMutation(CREATE_THREAD);

  const onSubmitNewThread = (event) => {
    event.preventDefault();
    console.log("THREADING!");

    createThread({
      variables: {
        content: {
          boardName: board,
          title: threadText,
          category: threadCategories,
          initialPost: { text: threadText },
        },
      },
    })
      .then((res) => {
        if (res.data.CreateThread.success) {
          enqueueSnackbar(res.data.CreateThread.message), "success";
          router.push("/" + board + "/" + res.data.CreateThread.thread.id);
        } else {
          enqueueSnackbar(res.data.CreateThread.message), "error";
        }
      })
      .catch((err) => console.log(err));
  };

  if (loadingBoard) return null;
  if (errorBoard) return `Error! ${errorBoard}`;

  return (
    <>
      <NavBar />
      <Container>
        <Box padding="5vh" mt="2vh">
          <Typography
            variant="h3"
            align="left"
            color="textPrimary"
            gutterBottom
          >
            Welcome to /{dataBoard.GetBoard.name}!, the{" "}
            {dataBoard.GetBoard.title} board in {dataBoard.GetBoard.collection}{" "}
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

        {openEdit ? (
          <form onSubmit={onSubmitNewThread}>
            <Grid
              container
              justify="space-between"
              alignItems="flex-end"
              direction="column"
              style={{ position: "fixed", bottom: "3rem", right: "3rem" }}
              spacing={3}
            >
              <Grid item>
                <Fab
                  color="secondary"
                  aria-label="close"
                  onClick={() => onEditMenuToggle()}
                  size="small"
                >
                  <CloseIcon />
                </Fab>
              </Grid>{" "}
              <Grid item style={{ width: "30%" }}>
                <Paper elevation={3}>
                  <Box p="1rem">
                    <TextField
                      fullWidth
                      multiline={true}
                      rows={1}
                      label="Thread Title"
                      helperText="Input Thread Title Text"
                      autoFocus
                      value={threadTitle}
                      onInput={(e: any) => setThreadTitle(e.target.value)}
                    />
                  </Box>
                  <Box p="1rem">
                    <Select
                      autoWidth
                      value={threadCategories}
                      onChange={(e: any) => setThreadCategories(e.target.value)}
                    >
                      {dataBoard.GetBoard.categories.map((e: any) => (
                        <MenuItem value={e}>{e}</MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box p="1rem">
                    <TextField
                      fullWidth
                      multiline={true}
                      rows={5}
                      label="PostText"
                      helperText="Input Initial Post Text"
                      value={threadText}
                      onInput={(e: any) => setThreadText(e.target.value)}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item>
                <Fab type="submit" color="primary" aria-label="submit">
                  <PublishIcon />
                </Fab>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Fab
            color="primary"
            aria-label="post"
            style={{ position: "fixed", bottom: "3rem", right: "3rem" }}
            onClick={() => onEditMenuToggle()}
          >
            <AddIcon />
          </Fab>
        )}
      </Container>
    </>
  );
};

export default index;
