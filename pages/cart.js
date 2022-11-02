import React, { useContext } from "react"
import dynamic from "next/dynamic"
import { Store } from "../utils/Store"
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core"
import Image from "next/image"
import Layout from "./components/Layout"
import NextLink from "next/link"
import axios from "axios"
import {useRouter} from "next/router"

function CartScreen() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state
  if (cartItems) {
    //console.log(cartItems)
  }

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`)
    if (data.countInStock < quantity) {
      window.alert("sorry product out of stock")
      return
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } })
  }

  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item })
  }

  const checkOutHandler = ()=>{
    router.push('/shipping')
  }
  return (
    <Layout title='Shopping Cart'>
      <Typography component='h1' variant='h1'>
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <div>
          Shopping Cart is empty
          <NextLink href='/' passHref>
            <Link> Go Shoping</Link>
          </NextLink>
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Quantity</TableCell>
                    <TableCell align='right'>Price</TableCell>
                    <TableCell align='right'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`}>
                          <Link>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            />{" "}
                            ;
                          </Link>
                        </NextLink>
                      </TableCell>

                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Typography>{item.name}</Typography>
                          </Link>
                        </NextLink>
                      </TableCell>

                      <TableCell align='right'>
                        <NextLink href={`/product/${item.slug}`}>
                          <Link>
                            <Select
                              value={item.quantity}
                              onChange={(e) =>
                                updateCartHandler(item, e.target.value)
                              }
                            >
                              {[...Array(item.countInStock).keys()].map((x) => (
                                <MenuItem key={x + 1} value={x + 1}>
                                  {x + 1}
                                </MenuItem>
                              ))}
                            </Select>
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell align='right'>${item.price}</TableCell>
                      <TableCell align='right'>
                        <Button
                          variant='contained'
                          color='secondary'
                          onClick={() => removeItemHandler(item)}
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={3}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant='h4'>
                    subtotal({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                    items) : ${" "}
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button variant='contained' color='primary' fullWidth onClick={() => checkOutHandler()}>
                    check out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false })
