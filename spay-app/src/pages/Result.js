import React from 'react'
import ProductRow from '../components/ProductRow'

function Result() {
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