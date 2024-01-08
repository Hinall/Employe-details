$(document).ready(function () {
  // Load employees on page load
  loadEmployees();

  let updateId;
  $(document).on("click", ".updateBtn", function () {
    updateId = $(this).data("id");

    $.ajax({
      url: "http://localhost:8080/user/" + updateId,
      async: false,
      type: "GET",
      contentType: "application/json",
      success: function (employee) {
        $("#newfname").val(employee.fname);
        $("#newlname").val(employee.lname);
        $("#newemail").val(employee.email);
        $("#newNumber").val(employee.number);
      },
      error: function (error) {
        console.log(error);
      },
    });
  });

  // Submit form to add employee
  $("#submitbutton").click(function (event) {
    event.preventDefault();
    let employee = {
      fname: $("#firstName").val(),
      lname: $("#lastName").val(),
      email: $("#email").val(),
      number: $("#numberInput").val(),
    };


    //form data
    var formData = new FormData();
    inputFile = document.getElementById("imageInput");
    var image = $("#imageInput").prop("files")[0];
    formData.append("image", image);
    formData.append("empData", JSON.stringify(employee));

    // Send the data to the backend
    $.ajax({
      url: "http://localhost:8080/user",
      type: "POST",
      processData: false,
      contentType: false,
      data: formData,
      success: function () {
        alert("Your form has been sent successfully.");
        // Reload the employees after adding a new one
        loadEmployees();
        // Clear the form
        $("#addModal").modal("hide");
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
   // Attach blur event listeners using jQuery
 $("#firstName,#newfname").on('blur', function () {
  validate(this.value, '', '', '');
});

$("#lastName,#newlname").on('blur', function () {
  validate($("#firstName"), this.value, '', '');
});
$("#email,#newemail").on('blur', function () {
  validate( $("#firstName"),("#lastName"), this.value, '');
});

$("#numberInput,#newNumber").on('blur', function () {
  validate( $("#firstName"),("#lastName"), $("#email"), this.value);
});


  function validate(fname,lname,email,number){
        //Javascript reGex for Email Validation.
        var regEmail=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;  
        // Javascript reGex for Phone Number validation.
        var regPhone=/^\d{10}$/;                        
        // Javascript reGex for Name validation
        var regName = /\d+$/g;    
    
        if (fname == "" || regName.test(fname)) {
         
          $(".checkFirstName").html("Please enter a valid fname.");    
          return false;
      }
      if (lname == "" || regName.test(lname)) {
       
        $(".checkLastName").html("Please enter a valid lname.");    
        return false;
    }
    if (number == "" || !regPhone.test(number)) {
      
      $(".checkNumber").html("Please enter a valid phone number.");    
    }
    if (email == "" || !regEmail.test(email)) {
      
          $(".checkEmail").html("Please enter a valid email.");    
          return false;
      }
  }
  // Function to load employees from the backend
  function loadEmployees() {
    $.ajax({
      url: "http://localhost:8080/user",
      async: false,
      type: "GET",
      contentType: "application/json",
      success: function (data) {
       // Sort the data by id before displaying
      data.sort(function (a, b) {
        return a.id - b.id;
      });
      displayEmployees(data);
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
  // get user by Id click event
  $("#getuserbutton").click(function () {
    let employeeId = $("#getId").val();
    // Send AJAX request to get user data by ID
    $.ajax({
      url: "http://localhost:8080/user/" + employeeId,
      async: false,
      type: "GET",
      contentType: "application/json",
      success: function (employee) {
        $("#getByIdModal").modal("hide");
        let tableBody = $("#employeeTable tbody");
        tableBody.empty();
        tableBody.append(`
                          <tr>
                              <td>${employee.id}</td>
                              <td>${employee.fname}</td>
                              <td>${employee.lname}</td>
                              <td>${employee.email}</td>
                              <td>${employee.number}</td>
                              <td><button class="icon" data-img="${employee.filename}" data-bs-toggle="modal" data-bs-target="#viewImageModal"data-id="${employee.id}"><i class="fas fa-eye" ></i></button></td>
                              </tr>`);
      },
      error: function (error) {
        alert("Error getting user data: " + error.responseText);
      },
    });
  });

  function updateEmployee(update_employee, Id) {
    //form data
    var updatedformData = new FormData();
    var image = $("#newImageInput").prop("files")[0];
    updatedformData.append("image", image);
    updatedformData.append("empData", JSON.stringify(update_employee));
    $.ajax({
      url: "http://localhost:8080/userUpdate/" + Id,
      type: "PUT",
      processData: false,
      contentType: false,
      data: updatedformData,
      success: function () {
        // Reload the employees after updating
        loadEmployees();
        // Close the modal
        $("#exampleModal").modal("hide");
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
  //to delete
  function deleteEmployee(Id) {
    $.ajax({
      url: "http://localhost:8080/user/" + Id,
      type: "DELETE",
      contentType: "application/json",
      success: function () {
        // Reload the employees after deletion
        loadEmployees();
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
  // to display employees
  function displayEmployees(employees) {
    let tableBody = $("#employeeTable tbody");
    tableBody.empty();
    employees.forEach(function (employee) {
      tableBody.append(`
            <tr>
                <td>${employee.id}</td>
                <td>${employee.fname}</td>
                <td>${employee.lname}</td>
                <td>${employee.email}</td>
                <td>${employee.number}</td>
                <td><button class="icon" data-img="${employee.filename}" data-bs-toggle="modal" data-bs-target="#viewImageModal"data-id="${employee.id}"><i class="fas fa-eye" ></i></button></td>
                <td><button class="deleteBtn" data-id="${employee.id}">Delete</button></td>
                <td><button class="updateBtn"  data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${employee.id}">Update</button>
                </td>
            </tr>`);
        //     $.get("/images/25", function (rawImageData) {
        //       $(".icon").attr("src","data:image/gif;base64," + rawImageData);
        // });
    });
  }
  //view button click
$("#employeeTable tbody").on("click", ".icon", function () {
  let ImageId = $(this).data("img");
  showImages(ImageId);
});
 
  //to show image
  function showImages(image_name) {
    // $.ajax({
    //     url: 'http://localhost:8080/images/'+image_name,
    //     type: 'get',
    //     async: false,
    //     crossDomain: 'true',
    //     success: function(response) {
    $(".image_id").attr("src", "http://localhost:8080/images/" + image_name);
    // console.log("Status: "+status+"\nData: "+data);
    // result = data;
    // var img = $('#image_id');
    // $("#image_id").attr("src" , "data:image/;base64," + data) //= "data:image/;base64," + data;
    // }

    // file = fileInput.files[0];
    // reader = new FileReader();
    // reader.onload = function (e) {
    //   $("#image").attr("src", e.target.result);
    // };
    // reader.readAsDataURL(file);
  }
  // delete button click event
  $(document).on("click", ".deleteBtn", function () {
    let employeeId = $(this).data("id");
    let employee = {
      fname: $("#firstName").val(),
      lname: $("#lastName").val(),
      email: $("#email").val(),
      number: $("#numberInput").val(),
    };
    deleteEmployee(employeeId);
  });

  $("#saveBtn").click(function () {
   
    // Note: You need to capture the updated values from the modal fields here
    let updatedEmployee = {
      fname: $("#newfname").val(),
      lname: $("#newlname").val(),
      email: $("#newemail").val(),
      number: $("#newNumber").val(),
    };
    validate(updatedEmployee.fname,updatedEmployee.lname,updatedEmployee.email,updatedEmployee.number)
    updateEmployee(updatedEmployee, updateId);
  });
});
