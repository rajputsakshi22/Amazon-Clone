const express = require("express");
const router =new express.Router();
const USER = require("../models/userSchema");
const Products = require("../models/productsSchema");
const bcrypt = require("bcryptjs"); 
const authenicate = require("../middleware/authenticate")


//get productsdata api
router.get("/getproducts", async(req,res)=>{
    try{
       const productsdata = await Products.find();
       console.log("console  the data"+productsdata);
      res.status(201).json(productsdata);
    }
    catch(error){
   console.log("error" +error.message);
    }
})

// get individual data
router.get("/getproductsone/:id", async (req, res) => {
  try {
    const {id} = req.params;
    // console.log(id);

     const individuadata = await Products.findOne({id:id});

    //  console.log(individuadata +"indualdata");

       res.status(201).json(individuadata);

  } catch (error) {
       
      res.status(400).json(individuadata);
      console.log("error" + error.message);

  }
});


// register the data

router.post("/register", async (req, res) => {
  // console.log(req.body);

  const { fname, email, mobile, password, cpassword } = req.body;

  if (!fname || !email || !mobile || !password || !cpassword) {
      res.status(422).json({ error: "filll the all details" });
      console.log("Not data Available");
  };

  try {

    const preuser = await USER.findOne({ email: email });

    if (preuser) {
        res.status(422).json({ error: "This email is already exist" });
    } else if (password !== cpassword) {
        res.status(422).json({ error: "password are not matching" });;
    } else {

        const finaluser = new USER({
            fname, email, mobile, password, cpassword
        });

        // yaha pe hasing krenge

        const storedata = await finaluser.save();
         console.log(storedata + "user successfully added");
        res.status(201).json(storedata);
    }

} catch (error) {
    console.log("error the bhai catch ma for registratoin time" + error.message);
    res.status(422).send(error);
}


});



// login user api

router.post("/login",async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        res.status(400).json({error:"fill the all data"})
    };

    try{
        const userlogin = await USER.findOne({email:email})
         console.log(userlogin + "userlogin");

         
        if(userlogin){
            const isMatch = await bcrypt.compare(password, userlogin.password);
            // console.log(isMatch);


            // token generate
            const token = await userlogin.generatAuthtoken();
            // console.log(token);

            res.cookie("Amazonweb",token,{
                expires:new Date(Date.now() + 900000),
                httpOnly:true
            })



            if(!isMatch){
                res.status(400).json({error:"invalid details"})
            }
            else{
                res.status(201).json(userlogin);

            }
        }else{
            res.status(400).json({error:"invalid details"})
        }

    }catch(error){
        res.status(400).json({error:"invalid details"})

    }
})

// adding the data into cart

router.post("/addcart/:id",authenicate,async(req,res)=>{
    try{
       const {id} = req.params;
       const cart = await Products.findOne({id:id});
       console.log(cart + "cart value");


       const UserContact = await USER.findOne({_id:req.userID});
       console.log(UserContact);

       if(UserContact){
        const cartData = await UserContact.addcartdata(cart);
        await UserContact.save();
        console.log(cartData);
        res.status(201).json(UserContact);
       }
       else{
        res.status(400).json({error:"Invalid User"});
       }
    }
    catch(error){
        res.status(400).json(error);

    }
});

// get cart details

router.get("/cartdetails", authenicate, async (req, res) => {
    try{
        const buyuser = await USER.findOne({ _id: req.userID });
        // console.log(buyuser + "user hain buy pr");
        res.status(201).json(buyuser);

    }catch(error){
        console.log(error + "error for buy now");

    }
})

// get valid user
router.get("/validuser", authenicate, async (req, res) => {
    try{
        const validuserone = await USER.findOne({ _id: req.userID });
        // console.log(validuserone + "user hain buy pr");
        res.status(201).json(validuserone);

    }catch(error){
        console.log(error + "error for buy now");

    }
});

// remove item from cart

router.delete("/remove/:id",authenicate,async(req,res)=>{
    try{
        const {id} = req.params;

        req.rootUser.carts =req.rootUser.carts.filter((cruval)=>{
            return cruval.id != id;
        })
        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("item remove");

    }
    catch(error){
        console.log("error",error);
     res.status(400).json(req.rootUser);
    }
})


// for userlogout

router.get("/logout", authenicate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("eccomerce", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");

    } catch (error) {
        console.log(error + "jwt provide then logout");
    }
});


module.exports = router;