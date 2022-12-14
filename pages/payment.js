import React, { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Store } from "../utils/Store"
import Layout from "./components/Layout"
import CheckoutWizard from "./components/CheckoutWizard"
import useStyles from "../utils/styles"
import Cookies from "js-cookie"
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core"
import { useSnackbar } from "notistack"

export default function Payment() {
  const classes = useStyles()
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { shippingAddress },
  } = state
  const [paymentMethod, setPaymentMethod] = useState("")
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push("/shipping")
    } else {
      setPaymentMethod(Cookies.get("paymentMethod") || "")
    }
  }, [])

  const submitHandler = (e) => {
    closeSnackbar()
    e.preventDefault()
    if (!paymentMethod) {
      enqueueSnackbar("Payment Method is required", { variant: "error" })
    }else{
      dispatch({ type: "SAVE_PAYMENT_METHOD", payload:paymentMethod})
      Cookies.set('paymentMethod',paymentMethod)
      router.push("/placeorder")
    }
  }

  return (
    <Layout title='Payment Method'>
      <CheckoutWizard activeStep={2} />
      <from className={classes.form} onSubmit={submitHandler}>
        <Typography component='h1' variant='h1'>
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component='fieldset'>
              <RadioGroup
                aria-label='Payment Method'
                name='paymentMethod'
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label='PayPal'
                  value='PayPal'
                  control={<Radio />}
                ></FormControlLabel>

                <FormControlLabel
                  label='Stripe'
                  value='Stripe'
                  control={<Radio />}
                ></FormControlLabel>

                <FormControlLabel
                  label='Cash'
                  value='Cash'
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth variant='contained' color='primary' onClick={submitHandler}>
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant='contained'
              color='secondary'
              onClick={() => router.push("/shipping")}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </from>
    </Layout>
  )
}
