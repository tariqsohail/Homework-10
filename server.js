var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Brhin1234",
  database: "employeeTracker_DB",
});

connection.connect(function (err) {
  if (err) throw err;
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee left join role on employee.role_id = role.id left join department on department.id = role.department_id left join employee manager on employee.manager_id = manager.id;",
    function (err, res) {
      if (err) throw err;
  showEmployee = res.map (element=> element.first_name) ;
  showDep = res.map (element=> element.department) ;
  showTitle = res.map (element=> element.title) ;

     }
  );
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "view all employees",
        "view all employees by department",
       
        // view all employees by manager is also extra
        "view all employees by manager",
        "add department",
        "add employee",
        "add role",
        "remove employee",
        "update employee role",
        // update employee manager is extra
        "update employee manager",
        // add department, view departments, remove departments
        // add role, view roles, remove role
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "view all employees":
          employeeSearch();
          break;

        case "view all employees by department":
          departmentSearch();
          break;

        case "view all employees by manager":
          roleSearch();
          break;

          case "add department":
            addDepartment();
            break;

        case "add employee":
          addEmployee();
          break;

          case "add role":
            addRole();
            break;
  

        case "remove employee":
          removeEmployee();
          break;

        case "update employee role":
          updateEmployeeRole();
          break;

        case "update employee manager":
          updateEmployeeManager();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
}

// to view all employee

function employeeSearch() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee left join role on employee.role_id = role.id left join department on department.id = role.department_id left join employee manager on employee.manager_id = manager.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);

      runSearch();
    }
  );
}

function departmentSearch() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What department would you like to see?",
        name: "department",
        choices: showDep,
      },
    ])
    .then(function (answer) {
      connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee left join role on employee.role_id = role.id left join department on department.id = role.department_id left join employee manager on employee.manager_id = manager.id WHERE department.name = ?",
        [answer.department],
        function (err, res) {
          if (err) throw err;
          console.table(res);

          runSearch();
        }
      );
    });
}
function roleSearch() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What title would you like to see?",
        name: "title",
        choices: showTitle,
      },
    ])
    .then(function (answer) {
      connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee left join role on employee.role_id = role.id left join department on department.id = role.department_id left join employee manager on employee.manager_id = manager.id WHERE department.name = ?",
        [answer.title],
        function (err, res) {
          if (err) throw err;
          console.table(res);

          runSearch();
        }
      );
    });
 
}
// to add employee

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "employees first name ?",
      },
      {
        name: "last_name",
        type: "input",
        message: "what is employees last name?",
      },
      {
        name: "role_id",
        type: "input",
        message: "what is the role id ?",
      },
      {
        name: "manager_id",
        type: "input",
        message: "what is managers id  ?",
      },
    ])
    .then(function (answer) {

      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id
        },
        function (err,) {
          if (err) throw err;
          console.log("Your employee was created successfully!");
          runSearch();
        });
    });

}


// removing employee

function removeEmployee() {
  //connection.query(// look into maps)


  inquirer
  
    .prompt
    ([
      {
        name: "first_name",
        type: "rawlist",
        message: "which employee do u want to remove ?",
        choices: showEmployee
      },
    ])
    .then(function (answer) {
      connection.query(
        " DELETE FROM employee WHERE first_name =? ",
        [answer.first_name],
        function (err) {
          if (err) throw err;
          console.log("Your employee was removed successfully!");

          runSearch();
        }
      );
    });
}

function updateEmployeeRole(){
  inquirer
  .prompt([  {
    message: "which employee would you like to update? (use first name only for now)",
    type: "list",
    name: "name",
    choices:showEmployee
}, {
    message: "enter the new role ID:",
    type: "number",
    name: "role_id"
}])
  .then(function(answer){
    console.log('answer', answer)
    var query = connection.query(
      "UPDATE employee SET role_id = ? WHERE ?",
      [
        
        answer.role_id,
        {first_name:answer.name}
      
        
       
      ],
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " role updated!\n");
     runSearch();
      }
    );
  })
  function updateProduct() {
    console.log("Updating all Rocky Road quantities...\n");
    
  
    // logs the actual query being run
    console.log(query.sql);
  }
}

function addDepartment() {
  inquirer.prompt([{
      type: "input",
      name: "department",
      message: "What is the department that you want to add?"
  }, ]).then(function(res) {
      connection.query('INSERT INTO department (name) VALUES (?)', [res.department], function(err, data) {
          if (err) throw err;
          console.table("Successfully Inserted");
         runSearch();
      })
  })
}
function addRole() {
  inquirer.prompt([
      {
          message: "enter title:",
          type: "input",
          name: "title"
      }, {
          message: "enter salary:",
          type: "number",
          name: "salary"
      }, {
          message: "enter department ID:",
          type: "number",
          name: "department_id"
      }
  ]).then(function (response) {
      connection.query("INSERT INTO role (title, salary, department_id) values (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data) {
          console.table(data);
      })
      runSearch();
  })

}