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
  TextField,
  Fab,
  Divider,
  FormControl,
} from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import PublishIcon from "@material-ui/icons/Publish";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { useSnackbar } from "notistack";

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

const CREATE_POST = gql`
  mutation($content: PostInput!) {
    CreatePost(content: $content) {
      success
      message
      post {
        id
        text
      }
    }
  }
`;

const Thread = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { board, thread } = router.query;

  const {
    loading: loadingThread,
    error: errorThread,
    data: dataThread,
    refetch: refetchThread,
  } = useQuery(GET_THREAD, { variables: { id: +thread }, pollInterval: 30000 });

  const [openEdit, setOpenEdit] = useState(false);
  const onEditMenuToggle = () => setOpenEdit(!openEdit);

  //Form handling
  const [formText, setFormText] = useState("");
  const [createPost] = useMutation(CREATE_POST);

  const onSubmitPost = (event) => {
    event.preventDefault();

    createPost({
      variables: { content: { threadId: +thread, text: formText } },
    })
      .then((res) => {
        if (res.data.CreatePost.success) {
          enqueueSnackbar(res.data.CreatePost.message), "success";
          setFormText("");
          setOpenEdit(false);
          refetchThread();
        } else {
          enqueueSnackbar(res.data.CreatePost.message), "error";
        }
      })
      .catch((err) => console.error(err));
  };

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
            .map((v: any, index: number) => (
              //Limits post preview
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
            ))}
        </Paper>
      )}

      {openEdit ? (
        <form onSubmit={onSubmitPost}>
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
                    id="post-text-input"
                    fullWidth
                    multiline={true}
                    rows={5}
                    label="PostText"
                    helperText="Input post text"
                    autoFocus
                    value={formText}
                    onInput={(e: any) => setFormText(e.target.value)}
                  />
                </Box>
                {/* SAMPLE TEXT POST IT HERE */}
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

      {/* Show all the posts? */}
    </Container>
  );
};

export default Thread;
