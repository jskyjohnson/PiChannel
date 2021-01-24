import React from "react";
// Modules
import { NextPage } from "next/types";
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
  Container,
  Typography,
} from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { gql, NetworkStatus, useMutation, useQuery } from "@apollo/client";
import NavBar from "components/NavBar";
import Link from "next/link";

const GET_BOARDS = gql`
  query {
    GetBoards {
      id
      name
      title
      description
      collection
    }
  }
`;

const GET_COLLECTIONS = gql`
  query {
    GetCollections {
      collection
    }
  }
`;

const HomePage: NextPage = () => {
  const { loading, error, data } = useQuery(GET_BOARDS);
  const {
    loading: collectionsLoading,
    error: collectionsError,
    data: collectionsData,
  } = useQuery(GET_COLLECTIONS);

  return (
    <>
      <NavBar />
      <Container>
        <Box style={{ paddingTop: "5rem" }}>
          <Box p="2vh" m="4vh">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Hello! Welcome to my PiChannel!
            </Typography>
            <Typography align="left" paragraph>
              This is an experimental image macro board for small communities to
              stay in touch. Eventually there will be optional login but the
              point of this was to remain an anonmous image macro board popular
              to various sites on the internet.
            </Typography>
            <Typography align="left" paragraph>
              This app was designed to be deployed and hosted from an owner's
              raspberry pi!
            </Typography>
          </Box>
        </Box>

        {/* Now, show boards under categories! */}

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <>
            <Typography align="left" paragraph>
              ERROR <ErrorOutlineIcon />
            </Typography>
          </>
        ) : (
          <Paper>
            {/* Box Categories...??? TODO, implement something else besides just paper box...*/}
            {/* {JSON.stringify(data)} */}
            {data.GetBoards.map((e: any) => (
              <Box p="1rem" mt="1rem">
                <Link href={e.name}>
                  <CardActionArea component="a">
                    <Card>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item>
                            <Typography component="h2" variant="h5">
                              /{e.name}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography component="h2" variant="h5">
                              {e.title}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              color="textSecondary"
                            >
                              {e.collection}
                            </Typography>
                            <Typography variant="subtitle1" paragraph>
                              {e.description}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </CardActionArea>
                </Link>
              </Box>
            ))}
          </Paper>
        )}

        {/* PULL data and display categories */}

        {/* Popular posts? */}
      </Container>
    </>
  );
};

export default HomePage;
