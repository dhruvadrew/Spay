import React, { useEffect } from 'react'
import ProductRow from '../components/ProductRow'

function Result() {

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        console.log(data);
    }

  return (
    <div>
        <ProductRow 
        imageSrc= {require('../images/test.png')}
        name="Vineego 50-in Modern Gray Chenille Sectional" 
        price="$29.99" 
        />



    </div>
  )
}

export default Result