document.addEventListener('DOMContentLoaded', function () {
  const API_URL = 'https://gorest.co.in/public/v1';
  const POSTS_PER_PAGE = 12;
  const userId = new URLSearchParams(window.location.search).get('id');

  function loadUserPosts(page = 1) {
    fetch(`${API_URL}/users/${userId}`)
      .then((response) => response.json())
      .then((user) => {
        document.getElementById('user-name').textContent = `${user.data.name}'s Posts`;
      });

    fetch(`${API_URL}/users/${userId}/posts?per_page=${POSTS_PER_PAGE}&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        let postList = document.getElementById('post-list');
        postList.innerHTML = '';

        if (data.data.length === 0) {
          postList.innerHTML = "<p>The user doesn't have any posts yet.</p>";
        } else {
          data.data.forEach((post) => {
            postList.insertAdjacentHTML(
              'beforeend',
              `
                      <div class="col-md-6 col-lg-4 mb-4">
                          <div class="card">
                              <div class="card-body">
                              <a href="post.html?id=${post.id}"<h5 class="card-title">${post.title}</h5></a>
                                  <p class="card-text">${post.body.substring(0, 100)}...</p>
                              </div>
                          </div>
                      </div>
                  `
            );
          });
        }

        // "Go Back" button
        let goBackBtn = `
          <div class="mt-4">
            <a href="javascript:history.back()" class="btn btn-primary">Go Back</a>
          </div>
        `;

        document.querySelector('#post-list').insertAdjacentHTML('beforeend', goBackBtn);
      });
  }

  loadUserPosts();

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('page-link')) {
      e.preventDefault();
      loadUserPosts(parseInt(e.target.textContent));
    }
  });
});
