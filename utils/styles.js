import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
  navBar: {
    backgroundColor: "#203040",
    '& a': {
      color: "#ffffff",
      marginLeft: 10,
    },
  },
  brand: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  grow: {
    flexGrow: 1,
  },

  main: {
    minHeight: "80vh",
  },
  footer: {
    marginTop: "10px",
    textAlign: "center",
  },
  section: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  form: {
    width: "100%",
    maxWidth: 600,
    margin: "0 auto",
  },

  navbarButton:{ 
    color: '#ffffff',
    textTransform: 'initial',
  },
  transparentBackgroud:{
    backgroundColor: 'transparent',
  },
  error: {
    color:'#f04040'
  },
  fullWidth: { 
    width: "100%"
  }
  
})

export default useStyles
