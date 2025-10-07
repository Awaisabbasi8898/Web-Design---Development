<?php
// add_student.php
require_once 'db.php';

$errors = [];
$name = '';
$email = '';
$course = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Basic sanitization
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $course = trim($_POST['course'] ?? '');

    // Validation
    if ($name === '') $errors[] = "Name is required.";
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "A valid email is required.";
    if ($course === '') $errors[] = "Course is required.";

    if (empty($errors)) {
        try {
            $pdo = getDB();
            $stmt = $pdo->prepare("INSERT INTO students (name, email, course) VALUES (:name, :email, :course)");
            $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':course' => $course
            ]);

            // Redirect to view_students.php with success flag
            header("Location: view_students.php?added=1");
            exit;
        } catch (Exception $e) {
            $errors[] = "Failed to add student: " . $e->getMessage();
        }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Add Student — Lab 11</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
  <nav class="navbar navbar-white bg-white border-bottom">
    <div class="container">
      <a class="navbar-brand text-primary" href="index.php">Lab 11</a>
      <div>
        <a class="btn btn-outline-secondary btn-sm" href="view_students.php">View Students</a>
      </div>
    </div>
  </nav>

  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-7">
        <div class="card shadow-sm">
          <div class="card-body">
            <h4 class="card-title mb-3">Add Student</h4>

            <?php if (!empty($errors)): ?>
              <div class="alert alert-danger">
                <ul class="mb-0">
                  <?php foreach ($errors as $err): ?>
                    <li><?=htmlspecialchars($err)?></li>
                  <?php endforeach; ?>
                </ul>
              </div>
            <?php endif; ?>

            <form method="post" novalidate>
              <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input type="text" name="name" value="<?=htmlspecialchars($name)?>" class="form-control" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" name="email" value="<?=htmlspecialchars($email)?>" class="form-control" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Course</label>
                <input type="text" name="course" value="<?=htmlspecialchars($course)?>" class="form-control" required>
              </div>

              <div class="d-flex justify-content-between">
                <a href="index.php" class="btn btn-link">Back</a>
                <button type="submit" class="btn btn-primary">Add Student</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>

    <footer class="mt-5 text-center text-muted">
      <small>Student Management — Create</small>
    </footer>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
