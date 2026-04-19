<?php
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = "fingerbuthole";
$db = "ticket";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed."]);
    exit;
}

function uploadFile($fileKey, $targetDir) {
    if (!isset(!_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) return "N/A";
    $filename = time() . "_" . basename($_FILES[$fileKey]["name"]);
    $targetPath = $targetDir . $filename;

    if (move_uploaded_file($_FILES[$fileKey]["tmp_name"], $targetPath)) {
        return $targetPath;
    }

    return "Error Uploading";
}

$fullName = $_POST['full_name'] ?? 'N/A';
$role = $_POST['school_role'] ?? 'N/A';
$studentNum = $_POST['student_number'] ?? 'N/A';
$program = $_POST['student_program'] ?? 'N/A';
$department = $_POST['person_department'] ?? 'N/A';
$email = $_POST['person_email'] ?? 'N/A';
$itemCode = $_POST['item_code'] ?? 'N/A';
$itemName = $_POST['item_name'] ?? 'N/A';
$itemDesc = $_POST['item_desc'] ?? 'N/A';
$features = $_POST['item_features'] ?? 'N/A';
$location = $_POST['last_location'] ?? 'N/A';
$lostDate = $_POST['lost_date'] ?? null;
$idImage = handleUpload('id_image_path');
$itemImage = handleUpload('item_image_path');

$sql = "INSERT INTO tickets (full_name, school_role, student_number, student_program, person_department, person_email, id_image_path, item_code, item_name, item_desc, item_features, last_location, lost_date, item_image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssssssssss", $fullName, $role, $studentNum, $program, $department, $email, $idImage, $itemCode, $itemName, $itemDesc, $features, $location, $lostDate, $itemImage);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Full ticket submitted."]);
}
else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
