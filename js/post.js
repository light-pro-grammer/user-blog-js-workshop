document.addEventListener('DOMContentLoaded', function () {
  const API_URL = 'https://gorest.co.in/public/v1';
  const postId = new URLSearchParams(window.location.search).get('id');

  function loadPostDetails() {
    fetch(`${API_URL}/posts/${postId}`)
      .then((response) => response.json())
      .then((post) => {
        document.querySelector('#post-details').innerHTML = `
          <h1>${post.data.title}</h1>
          <p>${post.data.body}</p>
        `;
      });

    fetch(`${API_URL}/posts/${postId}/comments`)
      .then((response) => response.json())
      .then((data) => {
        let commentList = document.querySelector('#comment-list');
        commentList.innerHTML = '';

        commentList.insertAdjacentHTML('beforeend', '<h3>Comments</h3>');

        data.data.forEach((comment) => {
          commentList.insertAdjacentHTML(
            'beforeend',
            `
            <div class="card mb-3">
              <div class="card-body">
                <h5 class="card-title">${comment.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${comment.email}</h6>
                <p class="card-text">${comment.body}</p>
              </div>
            </div>
          `
          );
        });

        if (data.data.length === 0) {
          commentList.insertAdjacentHTML('beforeend', '<p>No comments yet.</p>');
        }

        // "Go Back" button
        let goBackBtn = `
          <div class="mt-4">
            <a href="javascript:history.back()" class="btn btn-primary">Go Back</a>
          </div>
        `;

        document.querySelector('#comment-list').insertAdjacentHTML('beforeend', goBackBtn);
      });
  }

  loadPostDetails();
});
