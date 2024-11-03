import React from 'react'

function UserInfo() {

    var json1 = JSON.parse({
        "first_name": "string",
        "last_name": "string",
        "address": {
          "street_number": "string",
          "street_name": "string",
          "city": "string",
          "state": "NC",
          "zip": "27705"
        }
      })
      console.log(json1);
  return (
    <div>
        <h1></h1>
    </div>
  )
}

export default UserInfo