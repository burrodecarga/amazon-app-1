import Head from "next/head"
import NextLink from "next/link"
import { createTheme, ThemeProvider } from "@material-ui/core/styles"
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  CssBaseline,
  Switch,
  Badge,
  Button,
  Menu,
  MenuItem,
} from "@material-ui/core"
import useStyles from "../../utils/styles"
import { Store } from "../../utils/Store"
import Cookies from "js-cookie"
import { useContext, useState } from "react"
import {useRouter} from "next/router"

export default function Layout({ children, title, description }) {
  const { state, dispatch } = useContext(Store)
  const { darkMode, cart, userInfo } = state
  const router = useRouter()

  const theme = createTheme({
    typography: {
      h1: { fontSize: "1.6rem", fontWeight: 400, margin: "1rem 0" },

      h2: { fontSize: "1.4rem", fontWeight: 400, margin: "1rem 0" },
      h3: { fontSize: "1.2rem", fontWeight: 400, margin: "1rem 0" },
      h4: { fontSize: "1.0rem", fontWeight: 400, margin: "1rem 0" },
      h5: { fontSize: "0.8rem", fontWeight: 400, margin: "1rem 0" },

      body1: { fontWeight: "normal" },
    },
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: "#f0c000",
      },
      secondary: { main: "#208080" },
    },
  })
  const classes = useStyles()

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" })
    const newDarkMode = !darkMode
    console.log(darkMode, newDarkMode)
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF")
  }

  const [anchorEl, setAnchorEl] = useState(null)

  const loginClickHandler = (e)=>{
    setAnchorEl(e.currentTarget)
  }

  const loginMenuCloseHandler = (e,redirect)=>{
     if(redirect){
      router.push(redirect)
    }setAnchorEl(null)
  }

  const logoutClickHandler = (e)=>{
   
    setAnchorEl(null)
    dispatch({ type: "USER_LOGOUT"})
    Cookies.remove("userInfo")
    Cookies.remove("cartItems")
    router.push('/')
  }

  return (
    <div>
      <Head>
        <title>{title ? `${title}-next amazon` : "next-amazon"}</title>
        {description && <meta name='description' content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position='static' className={classes.navBar}>
          <Toolbar>
            <NextLink href='/' passHref>
              <Link>
                <Typography className={classes.brand}>Amazon</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>

            <div>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
              <NextLink href='/cart' passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color='secondary'
                      badgeContent={cart.cartItems.length}
                      overlap='rectangular'
                    >
                      Cart
                    </Badge>
                  ) : (
                    "Cart"
                  )}
                </Link>
              </NextLink>
              {userInfo ? (
                <>

                <Button 
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={loginClickHandler}
                className={classes.navbarButton}
                >
                  {userInfo.name}
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/order-history')
                      }
                    >
                      Order Hisotry
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/admin/dashboard')
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href='/login' passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>all rigth reserved </Typography>
        </footer>
      </ThemeProvider>
    </div>
  )
}
