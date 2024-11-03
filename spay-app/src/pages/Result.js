import React from 'react'
import ProductRow from '../components/ProductRow'

function Result() {
  return (
    <div>
        <ProductRow 
        imageSrc='../images/test.png'
        name="Sample Product" 
        price="$29.99" 
        />

    </div>
  )
}

export default Result