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
import CheckoutWizard from '../pages/components/CheckoutWizard'

export default function Shipping() {
 const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const router = useRouter();
  const { state, dispatch } = useContext(Store)
  const {
    userInfo,
    cart:{shippingAddress},
  } = state

  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect/shipping")
    }
       setValue('fullName', shippingAddress.fullName);
       setValue('address', shippingAddress.address );
       setValue('city', shippingAddress.city);
       setValue('postalCode', shippingAddress.postalCode);
       setValue('country', shippingAddress.country);
  }, [])

  const classes = useStyles()
  // const [email,setEmail] = useState('')
  // const [name,setName] = useState('')
  // const [confirmPassword,setConfirmPassword] = useState('')
  // const [password,setPassword] = useState('')

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    })
    Cookies.set('shippingAddress', {
      fullName,
      address,
      city,
      postalCode,
      country,
    })
    router.push("/payment")
  }

  return (
    <Layout title='Shipping Address'>
      <CheckoutWizard activeStep={1} />
      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <Typography component='h1' variant='h1'>
          Shipping Address
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='fullName'
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
                  id='fullName'
                  label='Full Name'
                  inputProps={{ type: "text" }}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === "minLength"
                        ? "full Name is more than 2 characters"
                        : "full Name is required"
                      : ""
                  }
                  error={Boolean(errors.fullName)}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='address'
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
                  id='address'
                  label='Address'
                  inputProps={{ type: "text" }}
                  helperText={
                    errors.address
                      ? errors.address.type === "minLength"
                        ? "Address is more than 2 characters"
                        : "Address is required"
                      : ""
                  }
                  error={Boolean(errors.address)}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='city'
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
                  id='city'
                  label='City'
                  inputProps={{ type: "text" }}
                  helperText={
                    errors.city
                      ? errors.city.type === "minLength"
                        ? "City is more than 2 characters"
                        : "City is required"
                      : ""
                  }
                  error={Boolean(errors.city)}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='postalCode'
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
                  id='postalCode'
                  label='Postal Code'
                  inputProps={{ type: "text" }}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === "minLength"
                        ? "Postal Code is more than 2 characters"
                        : "Postal Code is required"
                      : ""
                  }
                  error={Boolean(errors.postalCode)}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='country'
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
                  id='country'
                  label='Country'
                  inputProps={{ type: "text" }}
                  helperText={
                    errors.country
                      ? errors.country.type === "minLength"
                        ? "Country is more than 2 characters"
                        : "Country is required"
                      : ""
                  }
                  error={Boolean(errors.country)}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Button variant='contained' fullWidth color='primary' type='submit'>
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
