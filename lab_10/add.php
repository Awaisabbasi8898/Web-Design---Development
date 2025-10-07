<?php include 'connect.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Student</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-white">
    <div class="container mt-5">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">Add New Student</h4>
            </div>
            <div class="card-body">
                <?php
                if (isset($_POST['submit'])) {
                    $name = trim($_POST['name']);
                    $email = trim($_POST['email']);
                    $course = trim($_POST['course']);

                    if ($name != "" && $email != "" && $course != "") {
                        $stmt = $conn->prepare("INSERT INTO students (name, email, course, created_at) VALUES (?, ?, ?, NOW())");
                        $stmt->bind_param("sss", $name, $email, $course);
                        $stmt->execute();
                        echo "<div class='alert alert-success'>Student added successfully!</div>";
                    } else {
                        echo "<div class='alert alert-danger'>Please fill all fields!</div>";
                    }
                }
                ?>
                <form method="POST" class="mt-3">
                    <div class="mb-3">
                        <label class="form-label">Full Name</label>
                        <input type="text" name="name" class="form-control" placeholder="Enter student's name">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email Address</label>
                        <input type="email" name="email" class="form-control" placeholder="Enter student's email">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Course</label>
                        <input type="text" name="course" class="form-control" placeholder="Enter enrolled course">
                    </div>
                    <button type="submit" name="submit" class="btn btn-primary px-4">Add Student</button>
                    <a href="main.php" class="btn btn-secondary ms-2">Back</a>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
