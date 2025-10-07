<?php
include 'db.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $sql = "DELETE FROM students WHERE id=$id";

    if ($conn->query($sql)) {
        echo "<script>
                alert('Student record deleted successfully!');
                window.location='view_students.php';
              </script>";
    } else {
        echo "<script>
                alert('Error deleting record!');
                window.location='view_students.php';
              </script>";
    }
} else {
    header("Location: view_students.php");
    exit();
}
?>
