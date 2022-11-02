import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core"
import axios from "axios"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import React, { useContext, useEffect } from "react"
import { Store } from "../utils/Store"
import useStyles from "../utils/styles"
import Layout from "./components/Layout"
import NextLink from "next/link"
import { Controller, useForm } from "react-hook-form"
import { useSnackbar } from "notistack"
import Cookies from 'js-cookie';



function Profile() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { state } = useContext(Store)
  const { userInfo } = state
  const router = useRouter()
  const classes = useStyles()

  
  useEffect(() => {
    if (!userInfo) {
      router.push("/login")
    }
    setValue("name", userInfo.name)
    setValue("email", userInfo.email)
  }, [])

  const submitHandler = async ({ email, name, password, confirmPassword }) => {
    //  e.preventDefault()
    closeSnackbar()
    if (password !== confirmPassword) {
      enqueueSnackbar("Password dont match", { variant: "error" })
      return
    }
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      )
      Cookies.set("userInfo", data)
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      //   alert('succes login')
    } catch (err) {
      enqueueSnackbar(err.response ? err.response.data.message : err.message, {
        variant: "error",
      })
    }
  }

  return (
    <Layout title='Profile'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href='/profile' passHref>
                <ListItem button component='a'>
                  <ListItemText selected primary='User Profile'></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href='/order-history' passHref>
                <ListItem button component='a'>
                  <ListItemText primary='Order History'></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem component='h1' variant='h1'>
                <Typography>Profile</Typography>
              </ListItem>
              <ListItem>
                <form
                  className={classes.form}
                  onSubmit={handleSubmit(submitHandler)}
                >
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
                          minLength: 2,
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
                          minLength: 2,
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
                      <Button
                        variant='contained'
                        fullWidth
                        color='primary'
                        type='submit'
                      >
                        Update
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false })
