const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url, true); //It will breake req.ulr into parts or convert the req.url into an object so that we can access the all properties of the object
  //    console.log("this is parsedUlr:", parsedUrl)

  let AlluserData =  JSON.parse(fs.readFileSync("./userdata.json", { encoding: "utf-8" })) || [];


   

  res.setHeader('Access-Control-Allow-Origin', "*")       // Allow to all origin
  res.setHeader('Access-Control-Allow-Headers', "*")      // Allow to all headers
  res.setHeader('Access-Control-Allow-Methods', "*");       // Allow to all methods
  res.setHeader('Access-Control-Request-Headers', "*")    // Allow to all request headers

  // Handle OPTIONS method
  if(req.method === 'OPTIONS'){
    res.writeHead(204);  
    return res.end();
}


  if(parsedUrl.pathname === "/getalluser" && req.method === "GET"){
   //sending user data to client

    res.writeHead(200, {"content-type" : "application/json"})
    res.end(JSON.stringify({
       result : AlluserData,
       massage : "successfully fetched all user data"
    }))
  } else if  (parsedUrl.pathname === "/adduserdata" && req.method === "POST") {
    //  console.log(AlluserData)

    let id = 1;
    if (AlluserData.length > 0) {
      let lastEleId = AlluserData[AlluserData.length - 1].id; //we are getting the last Element's id of an array
      id = Number(lastEleId + 1); //creating the new id for new userdata
    }

    let data = "";
    req.on("data", (chunk) => {
      //data comming from the front-end in the from of chunk and we are gathering all the data

      data += chunk;
    });

    req.on("end", () => {
      //whenever the all data came from front-end we are stoping the data event by using "end"
      console.log(JSON.parse(data));

      let updateuserData = JSON.parse(data);
      updateuserData["id"] = id;     //we are pushing the new key = "id"  and giving it it's value as id.

      AlluserData.push(updateuserData);

      fs.writeFileSync("./userdata.json", JSON.stringify(AlluserData));

      res.writeHead(200, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          result: updateuserData.id,
          massage: "new user has added successfully..",
        })
      );
    });
  } else if (parsedUrl.pathname === "/getsingleuser" && req.method === "GET") {
    if (!parsedUrl.query.id) {
      res.writeHead(404, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          massage: "please enter id",
        })
      );
    }

    let singleuserData = AlluserData.find(
      (ele) => Number(ele.id) === Number(parsedUrl.query.id)
    );
    if (!singleuserData) {
      res.writeHead(502, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          massage: "please enter a valid user id",
        })
      );
    }

    res.writeHead(201, { "content-type": "application/json" });
    return res.end(
      JSON.stringify({
        result: singleuserData,
        massage: "single user data got successfully",
      })
    );
  }else if (parsedUrl.pathname === "/deleteuser"  && req.method === "DELETE"){
    const deleteUser = parsedUrl.query.id;
   // console.log(deleteUser)
    if(!deleteUser){
      res.writeHead(404, {"content-type" : "application/json"});
   return   res.end(JSON.stringify({
        massage :"please enter correct url"
      }))
    }
      let DeleteSigleUser = AlluserData.findIndex((ele,index)=> Number (ele.id) === Number(deleteUser))
     // console.log(DeleteSigleUser)
    

      if(DeleteSigleUser  === -1 ){

        res.writeHead(404, {"content-type" : "application/json"});
     return   res.end(JSON.stringify({
          massage :"please entet valid user id "
        }))
      }

      AlluserData.splice(DeleteSigleUser,1)

      fs.writeFileSync("./userdata.json", JSON.stringify(AlluserData))

      
      res.writeHead(200, {"content-type" : "application/json"});
      res.end(JSON.stringify({
         id: DeleteSigleUser, 
        massage :"successfully deleted" 
      }))
   
  }else if(parsedUrl.pathname === "/updateuserdata"  && req.method === "PUT"){
    let reqUserid = parsedUrl.query.id;
   // console.log(reqUseridUserid)
    if(!reqUserid){
   res.writeHead(404, {"content-type" : "application/json"});
   return      res.end(JSON.stringify({
        massage :"please enter correct url"
      }))
    }
      let UpdateUserIndex = AlluserData.findIndex((ele,index)=> Number (ele.id) === Number(reqUserid))
    //  console.log(UpdateUserIndex)
     

      if(UpdateUserIndex  === -1 ){

        res.writeHead(404, {"content-type" : "application/json"});
        return     res.end(JSON.stringify({
          massage :"please entet valid user id "
        }))
      }

     let payload  = "";
     req.on("data", (chunk)=>{
      payload += chunk
     })

     req.on("end", ()=>{


      let UpdatedUserData = { ...JSON.parse(payload)}

      UpdatedUserData.id  = AlluserData[UpdateUserIndex].id ;

      AlluserData[UpdateUserIndex] = UpdatedUserData ;

      fs.writeFileSync("./userdata.json", JSON.stringify(AlluserData))

      
      res.writeHead(200, {"content-type" : "application/json"});
     return res.end(JSON.stringify({
        result : UpdatedUserData, 
        massage :"successfully updated user data " 
      }))

     })
   
  }
   else {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(
      JSON.stringify({

        massage: "something went wrong",
      })
    );
  }
});

server.listen(7000, () => {
  console.log("server is running");
});






