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
import { useSnackbar } from "notistack"

export default function Register() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
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
  // const [name,setName] = useState('')
  // const [confirmPassword,setConfirmPassword] = useState('')
  // const [password,setPassword] = useState('')

  const submitHandler = async ({ email, name, password, confirmPassword }) => {
    //  e.preventDefault()
    closeSnackbar()
    if (password !== confirmPassword) {
      enqueueSnackbar("Password dont match", { variant: "error" })
      return
    }
    try {
      const { data } = await axios.post("/api/users/register", {
        name,
        email,
        password,
        confirmPassword,
      })

      dispatch({ type: "USER_LOGIN", payload: data })
      Cookies.set("userInfo", data)
      router.push(redirect || "/")
      //   alert('succes login')
    } catch (err) {
      enqueueSnackbar(err.response ? err.response.data.message : err.message, {
        variant: "error",
      })
    }
  }
  return (
    <Layout title='Register'>
      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <Typography component='h1' variant='h1'>
          Register
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='name'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='name'
                  label='Name'
                  inputProps={{ type: "name" }}
                  helperText={
                    errors.name
                      ? errors.name.type === "minLength"
                        ? "Name is more than 2 characters"
                        : "name is required"
                      : ""
                  }
                  error={Boolean(errors.name)}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

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
                minLength: 6,
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
            <Controller
              name='confirmPassword'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='confirmPassword'
                  label='Confirm Password'
                  inputProps={{ type: "password" }}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === "minLength"
                        ? "Confirm Password length is more than 6 characters"
                        : "Confirm Password is required"
                      : ""
                  }
                  error={Boolean(errors.confirmPassword)}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Button variant='contained' fullWidth color='primary' type='submit'>
              Register
            </Button>
          </ListItem>
          <ListItem>
            allready Have an account? {"  "} &nbsp;
            <NextLink href={`/login?redirect=${redirect} || '/'`} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
