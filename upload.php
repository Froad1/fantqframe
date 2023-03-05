chmod('/img', 0755);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $file = $_FILES['file'];
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileSize = $file['size'];
    $fileError = $file['error'];
    $fileType = $file['type'];

    if ($fileError === UPLOAD_ERR_OK) {
        $uploadDir = '/img';
        $uploadPath = $uploadDir . $fileName;
        move_uploaded_file($fileTmpName, $uploadPath);
        echo "File uploaded successfully.";
    } else {
        echo "Error uploading file.";
    }
}