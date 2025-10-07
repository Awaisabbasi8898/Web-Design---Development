// Get the container element
const container = document.querySelector(".container-fluid");

// Bootstrap button color classes
const buttonColors = [
  "btn-outline-primary",
  "btn-outline-success",
  "btn-outline-info",
  "btn-outline-warning",
  "btn-outline-danger",
  "btn-outline-secondary",
  "btn-outline-dark",
];

// Function to get random button color
function getRandomButtonColor() {
  return buttonColors[Math.floor(Math.random() * buttonColors.length)];
}

// Function to create post card template
function createPostCard(post) {
  return `
    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4" data-post-id="${post.id}">
      <div class="card h-100 border border-1 rounded-4 shadow-sm post-card">
        <div class="card-body p-4 d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h5 class="card-title fw-semibold text-dark lh-sm mb-0">${post.title}</h5>
            <button class="btn ${getRandomButtonColor()} btn-sm rounded-circle" onclick="hidePost(${post.id})">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <p class="card-text text-muted flex-grow-1 mb-4">
            ${post.body.length > 100 ? post.body.substring(0, 100) + "..." : post.body}
          </p>

          <div class="mb-4">
            ${post.tags.map(tag => `
              <span class="badge border border-primary text-primary bg-light me-1 mb-1 rounded-pill px-3 py-1">
                ${tag}
              </span>`).join("")}
          </div>

          <div class="d-flex justify-content-around border-top pt-3 text-center">
            <div>
              <i class="bi bi-heart-fill text-danger"></i>
              <small class="d-block fw-bold">${post.reactions.likes}</small>
            </div>
            <div>
              <i class="bi bi-hand-thumbs-down text-warning"></i>
              <small class="d-block fw-bold">${post.reactions.dislikes}</small>
            </div>
            <div>
              <i class="bi bi-eye text-info"></i>
              <small class="d-block fw-bold">${post.views}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Function to render all posts
function renderPosts() {
  const postsHTML = `
    <div class="row g-4 py-4" id="postsRow">
      ${postsOBJ.posts.map(post => createPostCard(post)).join("")}
    </div>
  `;
  container.innerHTML = postsHTML;
}

// Function to hide post
function hidePost(postId) {
  const postElement = document.querySelector(`[data-post-id="${postId}"]`);
  if (postElement) {
    postElement.classList.add("opacity-50");
    setTimeout(() => {
      postElement.remove();
      showAlert(`Post #${postId} has been hidden!`, "success");
      const remainingPosts = document.querySelectorAll("[data-post-id]");
      if (remainingPosts.length === 0) {
        showEmptyState();
      }
    }, 300);
  }
}

// Function to show Bootstrap alert
function showAlert(message, type = "info") {
  const alertHTML = `
    <div class="alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3"
         style="z-index: 1050; min-width: 300px;" role="alert">
      <i class="bi bi-check-circle-fill me-2"></i>${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", alertHTML);
  setTimeout(() => {
    const alert = document.querySelector(".alert");
    if (alert) alert.remove();
  }, 3000);
}

// Function to show empty state
function showEmptyState() {
  const emptyHTML = `
    <div class="text-center py-5">
      <div class="card border-0 bg-white shadow-sm rounded-4">
        <div class="card-body py-5">
          <i class="bi bi-inbox display-1 text-muted opacity-50 mb-4"></i>
          <h3 class="text-dark mb-2 fw-bold">No More Posts</h3>
          <p class="text-muted mb-4">All posts have been hidden. Refresh to see them again.</p>
          <button class="btn btn-primary btn-lg rounded-pill px-4" onclick="location.reload()">
            <i class="bi bi-arrow-clockwise me-2"></i>Refresh Page
          </button>
        </div>
      </div>
    </div>`;
  document.getElementById("postsRow").innerHTML = emptyHTML;
}

// Add hover animation
const style = document.createElement("style");
style.innerHTML = `
  .post-card {
    transition: all 0.25s ease-in-out;
  }
  .post-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 18px rgba(0,0,0,0.08);
  }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener("DOMContentLoaded", renderPosts);
