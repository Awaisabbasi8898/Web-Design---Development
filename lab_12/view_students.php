<?php include 'db.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>View Students</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container mt-5">
  <div class="card shadow border-0">
    <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
      <h4 class="mb-0">Registered Students</h4>
      <a href="add_student.php" class="btn btn-light btn-sm">+ Add Student</a>
    </div>
    <div class="card-body">
      <?php
      $sql = "SELECT * FROM students ORDER BY id DESC";
      $result = $conn->query($sql);

      if ($result->num_rows > 0) {
          echo "<table class='table table-hover text-center align-middle'>";
          echo "<thead class='table-primary'>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Added On</th>
                    <th>Actions</th>
                  </tr>
                </thead><tbody>";
          $i = 1;
          while ($row = $result->fetch_assoc()) {
              echo "<tr>
                      <td>{$i}</td>
                      <td>{$row['name']}</td>
                      <td>{$row['email']}</td>
                      <td>{$row['course']}</td>
                      <td>{$row['created_at']}</td>
                      <td>
                        <a href='edit_student.php?id={$row['id']}' class='btn btn-sm btn-warning me-2'>Edit</a>
                        <a href='delete_student.php?id={$row['id']}' class='btn btn-sm btn-danger' 
                           onclick='return confirm(\"Are you sure you want to delete this record?\")'>Delete</a>
                      </td>
                    </tr>";
              $i++;
          }
          echo "</tbody></table>";
      } else {
          echo "<div class='alert alert-info text-center'>No students found.</div>";
      }
      ?>
      <div class="text-end mt-3">
        <a href="index.php" class="btn btn-secondary">Back</a>
      </div>
    </div>
  </div>
</div>
</body>
</html>
