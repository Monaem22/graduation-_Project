const categoeyroute=require("./categoryroutes")
const projectwarehouseroute=require("./project_Warehouseroutes")
const authroute=require('./authroutes.js')





const mountRoutes=(server)=>{
    //amount routes
    server.use("/api/v1/categories", categoeyroute);
    server.use("/projectwarehouse", projectwarehouseroute);
    server.use("/auths", authroute);
    }
    
module.exports= mountRoutes;