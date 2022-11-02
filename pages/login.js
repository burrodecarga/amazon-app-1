import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import useStyles from "../utils/styles"
import Layout from "./components/Layout"
import NextLink from "next/link"
import axios from "axios"
import { Store } from "../utils/Store"
import { useRouter } from "next/router"
import Cookies from "js-cookie"
import { Controller, useForm } from "react-hook-form"
import { useSnackbar } from 'notistack'

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const router = useRouter()
  const { redirect } = router.query
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state

  useEffect(() => {
    if (userInfo) {
      router.push("/")
    }
  }, [])

  const classes = useStyles()
  // const [email,setEmail] = useState('')
  // const [password,setPassword] = useState('')

  const submitHandler = async ({email, password}) => {
    closeSnackbar();
    //e.preventDefault()
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      })
      dispatch({ type: "USER_LOGIN", payload: data })
      Cookies.set("userInfo", data)
      router.push(redirect || "/")
      //   alert('succes login')
    } catch (err) {
      enqueueSnackbar(err.response? err.response.data.message:err.message,{variant:'error'})
  }}


  return (
    <Layout title='Login'>
      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <Typography component='h1' variant='h1'>
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='email'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='email'
                  label='Email'
                  inputProps={{ type: "email" }}
                  helperText={
                    errors.email
                      ? errors.email.type === "pattern"
                        ? "Email is not Valid"
                        : "Email is required"
                      : ""
                  }
                  error={Boolean(errors.email)}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
          <Controller
              name='password'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength:3
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='password'
                  label='Password'
                  inputProps={{ type: "password" }}
                  helperText={
                    errors.password
                      ? errors.password.type === "minLength"
                        ? "password length is more than 6 characters"
                        : "password is required"
                      : ""
                  }
                  error={Boolean(errors.password)}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>


          <ListItem>
            <Button variant='contained' fullWidth color='primary' type='submit'>
              login
            </Button>
          </ListItem>
          <ListItem>
            Dont Have an account? {"  "} &nbsp;
            <NextLink href={`/register?redirect=${redirect} || '/'`} passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
