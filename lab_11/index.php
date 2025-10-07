<?php
// index.php
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Lab 11 — Student Management (Create & Read)</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
  <nav class="navbar navbar-expand-lg navbar-white bg-white border-bottom">
    <div class="container">
      <a class="navbar-brand text-primary fw-bold" href="#">Student Management — Lab 11</a>
    </div>
  </nav>

  <main class="container py-5">
    <div class="row g-4">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Add Student</h5>
            <p class="card-text">Create a new student record.</p>
            <a href="add_student.php" class="btn btn-primary">Go to Add Student</a>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">View Students</h5>
            <p class="card-text">See all students stored in the database.</p>
            <a href="view_students.php" class="btn btn-outline-primary">View Students</a>
          </div>
        </div>
      </div>
    </div>

    <footer class="mt-5 text-center text-muted">
      <small>Lab Task 11 — Create & Read • Student Management System</small>
    </footer>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
