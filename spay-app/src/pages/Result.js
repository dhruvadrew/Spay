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
        itemNumber="5517679" 
        imageSrc={require('../images/test.png')} 
        name="Vineego 50-in Modern Gray Chenille Sectional" 
        price="$429.99" 
        rating={4} 
        description="The modern sectional couch features a high-quality wooden frame with sturdy plastic legs. Its elegant chenille fabric surface complements your room's style perfectly. The fixed combination construction enhances stability and durability. This modular sofa includes a spacious double recliner, ideal for living room comfort. Its cushions are crafted from soft, elastic sponge material and filled with premium cotton for added softness and resilience.
"
    />



    </div>
  )
}

export default Result