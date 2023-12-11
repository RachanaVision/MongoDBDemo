﻿function ButtonClick() {
    window.location.href = "/Home/InsertUpdate";
}

function CancelButtonClick() {
    window.location.href = "/Home/Index";
}

function InsertUpdateRecord() {
    var FirstName = document.getElementById('firstname').value;
    var lastname = document.getElementById('lastname').value;
    var age = document.getElementById('age').value;
    var id = document.getElementById('id').value;

    var hobby = document.querySelectorAll('input[type=checkbox]:checked');
    var selectedHobbies = [];
    hobby.forEach(function (checkbox) {
        selectedHobbies.push(checkbox.value);
    });
    var hobbies = selectedHobbies.join(",");
    
    var gender = document.querySelectorAll('input[type="radio"]:checked');
    var selectedGender = gender[0].value;

    var city = document.getElementById('city').value;

    var xhr = new XMLHttpRequest();
    
    if (id == "") {

        var requestedData = {
            FirstName: FirstName,
            LastName: lastname,
            Age: age,
            Hobby: selectedHobbies,
            City: city,
            Gender: selectedGender
        }

        xhr.open("POST", "/Home/InsertRecord", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    alert("Record Inserted successfully..!!");
                    window.location.href = "/Home/Index";
                } else {
                    alert("Fail to Insert Record..!!");
                    window.location.href = "/Home/Index";
                }
            }
        };
        xhr.send(JSON.stringify(requestedData));
    } else {

        var requestedData = {
            FirstName: FirstName,
            LastName: lastname,
            Age: age,
            Hobby: selectedHobbies,
            City: city,
            Gender: selectedGender,
            Id: id
        }

        xhr.open("PUT", "/Home/UpdateRecord", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    alert("Record Updated successfully..!!");
                    window.location.href = "/Home/Index";
                } else {
                    alert("Fail to Update Record..!!");
                    window.location.href = "/Home/Index";
                }
            }
        };
        xhr.send(JSON.stringify(requestedData));
    }
}

function GetAllRecords() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/Home/GetAllRecord", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                var employeeList = JSON.parse(xhr.responseText);                
                var setEmployeeList = document.getElementById('employeeList');

                for (var i = 0; i < employeeList.length; i++) {

                    var data = "<tr>" +
                       // "<td>" + employeeList[i].id + "</td>" +
                        "<td>" + employeeList[i].firstName + "</td>" +
                        "<td>" + employeeList[i].lastName + "</td>" +
                        "<td>" + employeeList[i].age + "</td>" +
                        "<td>" + employeeList[i].gender + "</td>" +
                        "<td>" + employeeList[i].city + "</td>" +
                        "<td>" + employeeList[i].hobby + "</td>" +
                        "<td>" + "<input type='button' class='btn btn-default btn-info' value='EDIT' onclick=\"GetRecordById('" + employeeList[i].id + "')\">" + "</td>" +
                        "<td>" + "<input type='button' value='DELETE' class='btn btn-default btn-danger' onclick=\"DeleteRecord('" + employeeList[i].id + "')\">" + "</td>" +
                        "</tr>";

                    setEmployeeList.insertAdjacentHTML('beforeend', data);
                }

            } else {
                alert("Fail to Load Records..!!");
            }
        }
    };
    xhr.send();
}

function SetEmployeeDetails() {
    var employeeInformation = sessionStorage.getItem('EmployeeInformation');
    var employee = JSON.parse(employeeInformation);
    console.log(employee);
    document.getElementById('firstname').value = employee.firstName;
    document.getElementById('lastname').value = employee.lastName;
    document.getElementById('age').value = employee.age;
    document.getElementById('id').value = employee.id;
    document.getElementById('city').value = employee.city;

    if (employee.gender == "Male") {
       
        document.getElementById('male').checked = true;
    }
    else {
        document.getElementById('female').checked = true;
    }

    var selectedHobbies = employee.hobby;//.split(",");
    var hobbies = document.querySelectorAll('input[type="checkbox"]');
    hobbies.forEach(function (checkbox) {
        if (selectedHobbies.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });

    console.log(hobbies);
    sessionStorage.clear();
}

function GetRecordById(id) {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/Home/GetRecordById?id=" + id, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                var employee = JSON.parse(xhr.responseText);

                sessionStorage.setItem('EmployeeInformation', JSON.stringify(employee));
                window.location.href = "/Home/InsertUpdate";
            }
        }
    }
    xhr.send(); 
}

function DeleteRecord(id) {
    if (confirm('Are you Sure you want to Delete Record..??')) {
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "/Home/DeleteRecord?id=" + id, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    var employee = xhr.responseText;
                    console.log(employee);
                    alert('Record Deleted Successfully..!!');
                    document.getElementById('employeeList').innerHTML = '';
                    GetAllRecords();
                }
            }
        }
        xhr.send(); 
    }
}
