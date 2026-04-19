//global inventory
let globalInventory = [];

//personal information section
const personalInfo = document.createElement("div");
personalInfo.innerHTML = `
    <div style="height: 100px; width: 100%; top: 0; display: flex; flex-direction: row; position: absolute; gap: 28px;">
        <img src="personalicon.png" style="height: 45%; width: 8%; margin-top: 25px; margin-left: 15px;">
        <span style="font-size: 28px; font-weight: normal; text-align: left; justify-content: center; align-content: center; margin: 0;">Personal Information</span>
    </div>
    <div style="box-sizing: border-box; margin-top: 50px; height: 100%; width: 100%; position: relative; display: flex; flex-direction: column; padding: 20px 20px;">
        <form action="placeholder.php" id="pInfo" method="post">
            <label for="personname" style="font-size: 15px;">Full Name:</label><span style="color: red; font-weight: bold;">*</span><br>
            <input name="full_name" id="person-name" style="height: 20px; width: 100%; background-color: #ffffff; border: none;" required><br><br>
            <label for="personrole" style="font-size: 15px;">Role in School:</label><span style="color: red; font-weight: bold;">*</span><br>
            <select name="school_role" id="person-role" style="transition: 0.1s ease; height: 30px; min-width: 150px; background-color: transparent; border: none;" required><br><br>
                <option value="" disabled selected>Select a role</option>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="guest">Guest</option>
            </select><br><br>
            <label for="studentnumber" style="font-size: 15px;">Student Number (if applicable):</label><span id="sym-num" style="color: red; font-weight: bold;">/</span><br>
            <input name="student_number" value="N/A" id="student-number" style="height: 20px; width: 100%; background-color: #d1d1d1; border: none;" disabled><br><br>
            <label for="studentprogram" style="font-size: 15px;">Program (if applicable):</label><span id="sym-prog" style="color: red; font-weight: bold;">/</span><br>
            <input name="student_program" value="N/A" id="student-program" style="height: 20px; width: 100%; background-color: #d1d1d1; border: none;" disabled><br><br>
            <label for="persondept" style="font-size: 15px;">Department (if applicable):</label><span id="sym-dept" style="color: red; font-weight: bold;">/</span><br>
            <input name="person_department" value="N/A" id="person-dept" style="height: 20px; width: 100%; background-color: #d1d1d1; border: none;"disabled><br><br>
            <label for="email" style="font-size: 15px;">Email Address:</label><span style="color: red; font-weight: bold;">*</span><br>
            <input name="person_email" id="email" style="height: 20px; width: 100%; background-color: #ffffff; border: none;" required><br><br>
            <label for="identification" style="font-size: 15px;">School ID/COR/Staff ID/Government ID for Verification:</label><span style="color: red; font-weight: bold;">*</span><br>
            <input name="id_image" type="file" accept="image/*" id="identification" style="height: 30px; width: 100%; border: none;" required><br><br>
        </form>
    </div>
`;
Object.assign(personalInfo.style, {
    height: "80%",
    width: "45%",
    left: "0",
    backgroundColor: "#eff0f2",
    margin: "30px",
    gap: "50px",
    border: "3px solid #c1c7d7",
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    boxSizing: "border-box",
    padding: "40px 20px",
});
document.querySelector(".div-container").appendChild(personalInfo);

//constants for personal data functions
const personName = document.getElementById("person-name");
const roleSelect = document.getElementById("person-role");
const studentNum = document.getElementById("student-number");
const studentProg = document.getElementById("student-program");
const deptInput = document.getElementById("person-dept");
const personMail = document.getElementById("email");

//select option logic
roleSelect.addEventListener("change", () => {
    const role = roleSelect.value;
    
    disabledField(studentNum, document.getElementById("sym-num"));
    disabledField(studentProg, document.getElementById("sym-prog"));
    disabledField(deptInput, document.getElementById("sym-dept"));

    if (role === "student") {
        enabledField(studentNum, document.getElementById("sym-num"));
        enabledField(studentProg, document.getElementById("sym-prog"));
    }
    else if (role === "staff") {
        enabledField(deptInput, document.getElementById("sym-dept"));
    }
});

function enabledField(input, symbolSpan) {
    input.value = "";
    input.disabled = false;
    input.required = true;
    input.style.backgroundColor = "#ffffff";
    input.style.color = "#000000";
    if (symbolSpan) symbolSpan.innerText = "*";
}

function disabledField(input, symbolSpan) {
        input.value = "N/A";
        input.disabled = true;
        input.required = false;
        input.style.backgroundColor = "#d1d1d1";
        input.style.color = "#757575";
        if (symbolSpan) symbolSpan.innerText = "/";
}

//personal information form submission
const pForm = personalInfo.querySelector("form");
pForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const personalData = new FormData(pForm);

    if (studentNum.disabled) {
        personalData.append("student_number", "N/A");
    }
    if (studentProg.disabled) {
        personalData.append("student_program", "N/A");
    }
    if (deptInput.disabled) {
        personalData.append("person_department", "N/A");
    }
    
    fetch('placeholder.php/submit', {
            method: 'POST',
            body: personalData
    })

    .then(response => {
        if (!response.ok) throw new Error("Server error");
        return response.json();
    })
    .then(data => console.log("Success from server: ", data))
    .catch(error => console.error("Error: ", error));
});

//item information section
const itemInfo = document.createElement("div");
itemInfo.innerHTML = `
    <div style="height: 100px; width: 100%; top: 0; display: flex; flex-direction: row; position: absolute; gap: 28px;">
        <img src="itemicon.png" style="height: 50%; width: 9%; margin-top: 25px; margin-left: 30px;">
        <span style="font-size: 28px; font-weight: normal; text-align: left; justify-content: center; align-content: center; margin: 0;">Item Information</span>
    </div>
    <div style="box-sizing: border-box; margin-top: 90px; height: 100%; width: 100%; position: relative; display: flex; flex-direction: column; padding: 20px 40px;">
        <form action="placeholder.php" id="iInfo" method="post">
            <label for="itemcode" style="font-size: 15px;">Code:</label><span style="color: red; font-weight: bold;">*</span><br>
            <select name="item_code" id="item-code" style="transition: 0.1s ease; height: 30px; min-width: 150px; background-color: transparent; border: none;" required>
                <option value="" disabled selected>Select a code</option>
            </select><br><br>
            <label for="itemname" style="font-size: 15px;">Item Name:</label><span id="sym-itemname" style="color: red; font-weight: bold;">/</span><br>
            <input name="item_name" value="N/A" id="item-name" style="height: 20px; width: 100%; background-color: #d1d1d1; border: none;" disabled><br><br>
            <label for="itemdesc" style="font-size: 15px;">Item Description:</label><span id="sym-itemdesc" style="color: red; font-weight: bold;">/</span><br>
            <input name="item_desc" value="N/A" id="item-desc" style="height: 20px; width: 100%; background-color: #d1d1d1; border: none;" disabled><br><br>
            <label for="features" style="font-size: 15px;">Distinguishing Features:</label><br>
            <input name="item_features" id="features" style="height: 20px; width: 100%; background-color: #ffffff; border: none;"><br><br>
            <label for="lastknownloc" style="font-size: 15px;">Last Known Location:</label><span style="color: red; font-weight: bold;">*</span><br>
            <input name="last_location" id="last-loc" style="height: 20px; width: 100%; background-color: #ffffff; border: none;" required><br><br>
            <label for="lostdate" style="font-size: 15px;">Date Lost:</label><br>
            <input name="lost_date" type="date" id="lost-date" style="height: 20px; width: 100%; background-color: #ffffff; border: none;"><br><br>
            <label for="itempic" style="font-size: 15px;">Picture of the item (optional):</label><br>
            <input name="item_image" type="file" accept="image/*" id="item-pic" style="height: 30px; width: 100%; border: none;"><br><br>
        </form>
    </div>
`;
Object.assign(itemInfo.style, {
    height: "80%",
    width: "45%",
    right: "0",
    backgroundColor: "#eff0f2",
    margin: "30px",
    border: "3px solid #c1c7d7",
    display: "flex",
    position: "absolute",
    boxSizing: "border-box",
});
document.querySelector(".div-container").appendChild(itemInfo);

//constants for item data functions
const itemCode = document.getElementById("item-code");
const itemName = document.getElementById("item-name");
const itemDesc = document.getElementById("item-desc");
const itemFeatures = document.getElementById("features");
const lastLocation = document.getElementById("last-loc");
const lostDate = document.getElementById("lost-date");

//code select logic
window.itemCodes = () => {
    if(!itemCode) return;

    fetch('placeholder.php/get-inventory')
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    })
    .then(inventory => {
        itemCode.innerHTML = `<option value="" disabled selected>Select a code</option>`;
        globalInventory = inventory;

        inventory.forEach(item => {
            const option = document.createElement("option");
            option.value = item.code;
            option.textContent = item.code;
            itemCode.appendChild(option); 
        });
    })
    .catch(error => {
        console.error("Error fetching inventory: ", error);
        itemCode.innerHTML = `<option value="" disabled selected>Select a code</option>`;
    });
};  

itemCode.addEventListener("change", (e) => {
    const selectedCode = e.target.value;
    const matchedItem = globalInventory.find(item => item.code === selectedCode);

    if (matchedItem) {  
        enabledField(itemName, document.getElementById("sym-itemname"));
        enabledField(itemDesc, document.getElementById("sym-itemdesc"));
        itemName.value = matchedItem.name;
        itemDesc.value = matchedItem.desc;
    }
    else {
        disabledField(itemName, document.getElementById("sym-itemname"));
        disabledField(itemDesc, document.getElementById("sym-itemdesc"));
    }
});

//submit button
const submitAndCancel = document.createElement("div");
submitAndCancel.innerHTML = `
    <div style="align-items: center; display: flex; position: relative; font-size: 15px; right; 0; margin-right: 10px; margin-bottom: 10px;">
        <input type="checkbox" id="policy-check" style="height: 18px; width: 18px; background-color: transparent; position: relative; position: relative;" required>I agree to the <button id="agreement" style="padding: 0; margin: 5px; background-color: transparent; border: none; color: blue; cursor: pointer; font-size: 15px;">Platform Agreement & Privacy Policy</button></input>
    </div>
    <button id="submit-cancel" style="height: 50px; width: 120px; justify-content: center; align-items: center; background-color: #c0c0c0; border: none; cursor: pointer; font-weight: bold; font-size: 15px; color: black; margin-right: 20px;">Cancel</button>
    <button type="submit" id="submit-ticket" style="height: 50px; width: 120px; justify-content: center; align-items: center; background-color: #2e4279; border: none; cursor: pointer; font-weight: bold; font-size: 15px; color: white; margin-right: 45px;">Submit</button>
`;
Object.assign(submitAndCancel.style, {
    bottom: "40px",
    height: "60px",
    width: "100%",
    position: "absolute",
    display: "flex",
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    gap: "10px",
    border: "none",
    padding: "10px 15px",
});
document.querySelector(".div-container").appendChild(submitAndCancel);

//submit button function
const submitTicket = document.getElementById("submit-ticket");
submitTicket.onclick = () => {
    const validatePersonal = validate(pForm);
    const validateItem = validate(iForm);

    if (!terms.checked) {
        terms.reportValidity();
        return;
    }
    if (validatePersonal && validateItem) {
        pForm.requestSubmit();
        iForm.requestSubmit();
        submitTicket.disabled = true;
        submitTicket.textContent = "Submitted!";
    }
};

//cancel button function
const cancelButton = document.getElementById("submit-cancel");
cancelButton.onclick = () => {
    if(confirm("Are you sure? Your progress will be lost.")) {
    pForm.reset();
    iForm.reset();
    window.location.href = "user.html"
    }
};

//terms onclick
const termsPopup = document.createElement("div");
termsPopup.innerHTML = `
    <div style="position: fixed; display: flex; height: 70%; width: 90%; border-radius: 40px; border: 3px solid #11236b; background-color: #ffffff; color: #000000; padding: 20px 30px;">
        <div style="position: relative; top: 0; height: 10%; width: 98.3%; display: flex; justify-content: left; align-items: center; gap: 15px; left: 0;">
            <img src="P-ICON.png" style="height: 100%; width: 5%;">
            <p style="position: relative; font-size: 30px;">Platform Agreement & Data Privacy Policy</p>
        </div>
        <p style="position: absolute; font-size: 21px; margin-top: 100px;">All information submitted through the Lost and Found System shall be collected, recorded, and processed strictly for the purpose of facilitating the documentation, identification, and recovery of lost items within the institution. The data collected includes descriptive details of the item (e.g., last known location, date of loss, and optional photographic evidence), as well as personal information provided by individuals asserting ownership. Such personal information encompass the claimant’s full name, institutional role, student number (if applicable), academic program, department, email address, and relevant supporting identification (e.g., school identification card or Certificate of Registration) for verification purposes.<br><br>
The Office of the Prefect of Discipline affirms its commitment to the protection and confidentiality of all personal data obtained through this platform. All collected information shall be managed and stored securely in accordance with prevailing data protection laws and institutional policies. Furthermore, such data shall not be disclosed, disseminated, or otherwise made accessible to unauthorized parties without the explicit consent of the data subject, except where disclosure is mandated by law or permitted by institutional authority.<br><br>
By submitting any report, claim, or related information through this system, the user acknowledges having read and comprehended the terms stated in this Agreement and thereby consents to the collection, use, and processing of their personal data exclusively for purposes related to the administration of the Lost and Found System and other legitimate institutional functions.
</p>
    </div>
    `;
Object.assign(termsPopup.style, {
    height: "100vh",
    width: "100vw",
    position: "fixed",
    top: "0",
    left: "0",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "none",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "5000",
});
document.querySelector(".div-container").appendChild(termsPopup);


const terms = document.getElementById("agreement");
terms.onclick = () => {
    termsPopup.style.display = "flex";
};

termsPopup.onclick = (e) => {
    if (e.target === termsPopup) {
        termsPopup.style.display = "none";
    }
};

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        termsPopup.style.display = "none";
    }
});

//required
function validate(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach(field => {
        if (!field.value || field.value.trim() === "" ) {
            field.style.border = "2px solid red";
            isValid = false;
        }
        else {
            field.style.border = "none";
        }
    });
    return isValid;
}

//item information submission
const iForm = itemInfo.querySelector("form");
iForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const itemData = new FormData(iForm);

    if (itemName.disabled) {
        itemData.append("item_name", "N/A");
    }
    if (itemDesc.disabled) {
        itemData.append("item_desc", "N/A");
    }
    
    fetch('placeholder.php/submit', {
            method: 'POST',
            body: itemData
    })

    .then(response => {
        if (!response.ok) throw new Error("Server error");
        return response.json();
    })
    .then(data => console.log("Success from server: ", data))
    .catch(error => console.error("Error: ", error));
});
