import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Grid,
  Box,
} from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";

import HomeIcon from "@material-ui/icons/Home";

const NavBar = () => {
  const router = useRouter();
  const { board, thread } = router.query;
  return (
    <AppBar>
      <Toolbar>
        <Grid container direction="row" alignItems="center" spacing={3}>
          <Grid container alignItems="center" xs={6}>
            <Box>
              <Avatar src="favicon-96x96.png" />
            </Box>
            <Box>
              <Typography variant="h6">Welcome!</Typography>
            </Box>
          </Grid>
          <Grid container xs={6} alignItems="center" justify="flex-end">
            <Box style={{ marginRight: "1rem" }}>
              {board ? (
                <Link href="/">
                  <a>
                    <HomeIcon fontSize="large" />
                  </a>
                </Link>
              ) : null}
            </Box>

            <Box>
              {thread ? (
                <Link href={"/" + board}>
                  <a>
                    <Typography
                      align="right"
                      variant="h4"
                      style={{ marginRight: "1rem" }}
                    >
                      /{board}
                    </Typography>
                  </a>
                </Link>
              ) : null}
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
