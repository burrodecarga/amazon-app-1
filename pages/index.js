import { Button, Card, CardActionArea, CardActions, CardMedia, Grid, Link, Typography } from '@material-ui/core';

import Layout from "./components/Layout"
import data from "../utils/data"
import NextLink from "next/link"
import db from '../utils/db'
import Product from '../models/Product'
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Store } from '../utils/Store';

export default function Home(props) {
  const routes = useRouter()
  const { dispatch } = useContext(Store)
  const {products} =props
  const router = useRouter()

  const addToCartHandler = async (product)=>{
    const {data} = await axios.get(`/api/products/${product._id}`)    
    if(data.countInStock<=0){
      window.alert('sorry product out of stock')
      return
    }
    dispatch({type:'CART_ADD_ITEM',payload:{...product,quantity:1}})
    router.push('/cart')
  }
  return (
    <Layout>
      <h1>Products</h1>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item md={4} key={product.name}>
            <Card>
              <NextLink href={`/product/${product.slug}`} passHref>
                <CardActionArea>
                  <CardMedia
                    component='img'
                    image={product.image}
                    title={product.name}
                  ></CardMedia>
                  <Typography>{product.name}</Typography>
                </CardActionArea>
              </NextLink>
              <CardActions>
                <Typography>${product.price}</Typography>
                <Button size='small' color='primary' onClick={() =>addToCartHandler(product)}>
                  add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps(){
  await db.connect()
  const products = await Product.find({}).lean()
  await db.disconnect()
  //console.log(products)
  return {
    props: {
     products:products.map(db.convertDocToObject)
    } // will be passed to the page component as props
  }
}
