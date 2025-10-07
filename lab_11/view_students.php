<?php
// view_students.php
require_once 'db.php';

$pdo = getDB();

try {
    $stmt = $pdo->query("SELECT id, name, email, course, created_at FROM students ORDER BY created_at DESC");
    $students = $stmt->fetchAll();
} catch (Exception $e) {
    $students = [];
    $error = "Failed to fetch students: " . $e->getMessage();
}

$added = isset($_GET['added']) && $_GET['added'] == 1;
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>View Students — Lab 11</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    .small-muted { color: #6c757d; }
  </style>
</head>
<body class="bg-light">
  <nav class="navbar navbar-white bg-white border-bottom">
    <div class="container">
      <a class="navbar-brand text-primary" href="index.php">Lab 11</a>
      <div>
        <a class="btn btn-primary btn-sm" href="add_student.php">Add New Student</a>
      </div>
    </div>
  </nav>

  <main class="container py-5">
    <div class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="card-title mb-0">Students</h5>
          <small class="small-muted">Total: <?=count($students)?></small>
        </div>

        <?php if (!empty($error)): ?>
          <div class="alert alert-danger"><?=htmlspecialchars($error)?></div>
        <?php endif; ?>

        <?php if ($added): ?>
          <div class="alert alert-success">Student added successfully.</div>
        <?php endif; ?>

        <?php if (empty($students)): ?>
          <div class="text-center py-5">
            <p class="mb-3">No students yet. Add the first student.</p>
            <a href="add_student.php" class="btn btn-outline-primary">Add Student</a>
          </div>
        <?php else: ?>
          <div class="table-responsive">
            <table class="table table-striped table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                <?php foreach ($students as $s): ?>
                  <tr>
                    <td><?=htmlspecialchars($s['id'])?></td>
                    <td><?=htmlspecialchars($s['name'])?></td>
                    <td><?=htmlspecialchars($s['email'])?></td>
                    <td><?=htmlspecialchars($s['course'])?></td>
                    <td><?=htmlspecialchars($s['created_at'])?></td>
                  </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          </div>
        <?php endif; ?>

      </div>
    </div>

    <footer class="mt-4 text-center text-muted">
      <small>Student Management — Read</small>
    </footer>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
