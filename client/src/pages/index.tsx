import React from "react";
// Modules
import { NextPage } from "next/types";
import { Box, Button, Paper } from "@material-ui/core";
import { Container, Typography } from "@material-ui/core";
const HomePage: NextPage = () => {
  return (
    <Container>
      <Paper>
        <Box p="2rem" mt="4vh">
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
            stay in touch. Eventually there will be optional login but the point
            of this was to remain an anonmous image macro board popular to
            various sites on the internet.
          </Typography>
          <Typography align="left" paragraph>
            This app was designed to be deployed and hosted from an owner's
            raspberry pi!
          </Typography>
        </Box>
      </Paper>

      {/* Now, show boards under categories! */}

      {/* PULL data and display categories */}

      {/* Popular posts? */}
    </Container>
  );
};

export default HomePage;
