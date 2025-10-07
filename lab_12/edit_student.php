<?php include 'db.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Edit Student</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-white">
<div class="container mt-5">
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-warning text-dark">
      <h4 class="mb-0">Edit Student Details</h4>
    </div>
    <div class="card-body">
      <?php
      if (isset($_GET['id'])) {
          $id = $_GET['id'];
          $sql = "SELECT * FROM students WHERE id=$id";
          $result = $conn->query($sql);

          if ($result->num_rows > 0) {
              $row = $result->fetch_assoc();
          } else {
              echo "<div class='alert alert-danger'>Student not found!</div>";
              exit;
          }
      }

      if (isset($_POST['update'])) {
          $name = $_POST['name'];
          $email = $_POST['email'];
          $course = $_POST['course'];

          $updateSQL = "UPDATE students SET name='$name', email='$email', course='$course' WHERE id=$id";
          if ($conn->query($updateSQL)) {
              echo "<div class='alert alert-success'>Student updated successfully!</div>";
          } else {
              echo "<div class='alert alert-danger'>Error updating record!</div>";
          }
      }
      ?>

      <form method="POST" class="mt-3">
        <div class="mb-3">
          <label class="form-label">Full Name</label>
          <input type="text" name="name" class="form-control" value="<?= $row['name']; ?>" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" name="email" class="form-control" value="<?= $row['email']; ?>" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Course</label>
          <input type="text" name="course" class="form-control" value="<?= $row['course']; ?>" required>
        </div>
        <button type="submit" name="update" class="btn btn-warning">Update</button>
        <a href="view_students.php" class="btn btn-secondary ms-2">Cancel</a>
      </form>
    </div>
  </div>
</div>
</body>
</html>
