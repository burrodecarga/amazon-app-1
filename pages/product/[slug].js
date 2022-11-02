import NextLink from "next/link"
import {
  Grid,
  Link,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  TextField,
  CircularProgress,
} from '@material-ui/core'
import { useRouter } from "next/router"
import React, { useContext } from "react"
import data from "../../utils/data"
import Layout from "../components/layout"
import useStyles from "../../utils/styles"
import Image from "next/image"
import db from '../../utils/db'
import Product from '../../models/Product'
import axios from 'axios'
import { Store } from '../../utils/Store'

export default function ProductScreen(props) {
  const routes = useRouter()
  const {state, dispatch } = useContext(Store)
  const {product} = props
  const classes = useStyles()
  const router = useRouter()
  //const { slug } = router.query
  //const product = products.find((a) => a.slug == slug)
  if (!product) {
    return <div>Product not found</div>
  }

  const addToCartHandler = async ()=>{
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    
    const {data} = await axios.get(`/api/products/${product._id}`)    
    if(data.countInStock<=quantity){
      window.alert('sorry product out of stock')
      return
    }
    dispatch({type:'CART_ADD_ITEM',payload:{...product,quantity}})
    router.push('/cart')
  }
  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href='/' passHref>
          <Link>
            <Typography>back to products</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout='responsive'
            priority={product._id}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography variant='h2' component='h1'>
                Product: {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating: {product.rating} start ({product.numReviews})
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock ? "In Stock" : "Unavailable"}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  type='button'
                  fullWidth
                  variant='contained'
                  color='primary'
                  onClick={addToCartHandler}
                >
                  add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps(context){

  const {params} = context
  const {slug} = params

  await db.connect()
  const product = await Product.findOne({slug: slug}).lean()
  await db.disconnect()
  console.log(product)
  return {
    props: {
     product:db.convertDocToObject(product)
    } // will be passed to the page component as props
  }
}
