const express = require("express");
const app = express();
const mysql = require("mysql2");
const path = require("path");
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');



app.use(methodOverride('_method')); //for patch and delete method

app.use(express.json()) //if sending json file thru post method
app.use(express.urlencoded({extended : true})); //for post method

app.use(express.static(path.join(__dirname, "public/css"))); //for static files

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); //for ejs files




const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Hassam@5024",
    database: "katara"
});






// const getRandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.password(),
//     faker.person.fullName(),
//     faker.number.int(10000),
//     faker.internet.email(),
    

//   ]
// }

// let data = [];
// for(let i=1; i<=50; i++) {
//     data.push(getRandomUser());
// }

// let q = `INSERT INTO employee(emp_id, emp_username, emp_password, emp_fullname, emp_salary, emp_email) VALUES ?`;

// connection.query(q, [data], (err, result) => {
//    if(err) throw err;
//    console.log(result);
// });

// connection.query("SHOW TABLES", (err, result) => {
//     try {
//      if(err) throw err;
//      console.log(result);
//     }catch(err) {
//      console.log("error in connection");
//     }
//  });
 
//  connection.end();

app.get("/home", (req, res) => {

    let q = `SELECT count(*) AS count FROM employee`;
    try {
        connection.query(q, (err, result) => {
            if(err) throw err;
            let count = result[0].count;
            res.render("index.ejs", {count});
       })
    }catch(err) {
        res.send("some error in DB");
    }



});


app.get("/home/show", (req, res) => {
    let q = `SELECT * FROM employee`;
    connection.query(q, (err, result) => {
        try {
            let employees = result;
           
            if(err) throw err;
            res.render("show.ejs", {employees});
        }catch(err) {
            res.send("some error in DB");
        }
    })
})
    
app.get("/home/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/home/show", (req, res) => {
    let emp_id = uuidv4();
    let {emp_username, emp_password, emp_fullname, emp_salary, emp_email} = req.body;
    let q = `INSERT INTO employee (emp_id, emp_username, emp_password, emp_fullname, emp_salary, emp_email)
    VALUES("${emp_id}", "${emp_username}", "${emp_password}", "${emp_fullname}", "${emp_salary}", "${emp_email}")`;
    connection.query(q, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.redirect("/home/show");
    })

});


app.get("/home/:emp_id/edit", (req, res) => {
    let {emp_id} = req.params;
    let q = `SELECT * FROM employee WHERE emp_id = "${emp_id}"`;
    try {
        connection.query(q, (err, result) => {
            let employee = result[0];
            res.render("edit.ejs", {employee});
        });
    }catch(err) {
        res.send("some error in DB");
    }
    
});

app.patch("/home/show/:emp_id", (req, res) => {
    let {emp_id} = req.params;
    let {emp_password, emp_username} = req.body;
    let q = `SELECT * FROM employee WHERE emp_id = "${emp_id}"`;
        try {
            connection.query(q, (err, result) => {
              
                if(err) throw err;
                let employee = result[0];
               
                if(employee.emp_password != emp_password) {
                    res.send("WRONG password entered");
                }else {
        
                    let q2 = `UPDATE employee SET emp_username = "${emp_username}" WHERE emp_id = "${emp_id}"`;
                    connection.query(q2, (err, result) => {
                        if(err) throw err;
                        console.log(result);
                        console.log("updated");
                        res.redirect("/home/show");
        
                    });
                }
        
              
            });
        }catch(err) {
            res.send("some error in DB");
        }  
    
});


app.get("/home/:emp_id/delete", (req, res) => {
    let {emp_id} = req.params;
    let q = `SELECT * FROM employee WHERE emp_id = "${emp_id}"`;
     try {
        connection.query(q, (err, result) => {
            if(err) throw err;
            let employee = result[0];
            res.render("delete.ejs", {employee});
        });
     }catch(err) {
        res.send("some error in DB");
     }
    
});


app.delete("/home/show/:emp_id", (req, res) => {
    let {emp_id} = req.params;
    let {emp_username } = req.body;
    console.log(emp_username);
    let q = `SELECT * FROM employee WHERE emp_id = "${emp_id}"`;
        try {
            connection.query(q, (err, result) => {
                if(err) throw err;
                let employee = result[0];
                if(employee.emp_username != emp_username){
                 
                    res.send("WRONG employee username entered");  
                }else {
                    let q2 = `DELETE FROM employee WHERE emp_id="${emp_id}"`;
                    connection.query(q2, (err, result) => {
                        if(err) throw err;
                        console.log(result);
                        console.log("Deleted");
                        res.redirect("/home/show");
                    });
                }
                
            });
        }catch(err) {
            res.send("some error in DB");
        }
    
})

app.listen(8080, () => {
    console.log("Server is listening on 8080");
});