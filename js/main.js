document.addEventListener('DOMContentLoaded', function () {
  const API_URL = 'https://gorest.co.in/public/v1';
  const USERS_PER_PAGE = 12;
  const PAGINATION_PAGES = 5;
  let totalPages;

  function loadUsers(page = 1) {
    fetch(`${API_URL}/users?per_page=${USERS_PER_PAGE}&page=${page}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        return response.json();
      })
      .then((data) => {
        let userList = document.getElementById('user-list');
        userList.innerHTML = '';

        data.data.forEach((user) => {
          userList.insertAdjacentHTML(
            'beforeend',
            `
                  <div class="col-md-4 col-lg-3 mb-4">
                      <div class="card">
                          <div class="card-body">
                          <a href="user.html?id=${user.id}" <h5 class="card-title">${user.name}</h5></a>
                          </div>
                      </div>
                  </div>
              `
          );
        });

        // Remove existing pagination
        const oldPagination = document.getElementById('pagination');
        if (oldPagination) {
          oldPagination.remove();
        }

        // Add pagination
        let pagination = document.createElement('nav');
        pagination.id = 'pagination';
        pagination.innerHTML = '<ul class="pagination"></ul>';
        totalPages = Math.ceil(data.meta.pagination.total / USERS_PER_PAGE);
        let startPage = Math.max(1, page - Math.floor(PAGINATION_PAGES / 2));
        let endPage = Math.min(totalPages, startPage + PAGINATION_PAGES - 1);
        startPage = Math.max(1, Math.min(endPage - PAGINATION_PAGES + 1, startPage));

        // Add first page button
        pagination
          .querySelector('.pagination')
          .insertAdjacentHTML(
            'beforeend',
            `<li class="page-item${1 === page ? ' disabled' : ''}"><a class="page-link" href="#">First</a></li>`
          );

        for (let i = startPage; i <= endPage; i++) {
          pagination
            .querySelector('.pagination')
            .insertAdjacentHTML(
              'beforeend',
              `<li class="page-item${i === page ? ' active' : ''}"><a class="page-link" href="#">${i}</a></li>`
            );
        }

        // Add last page button
        pagination
          .querySelector('.pagination')
          .insertAdjacentHTML(
            'beforeend',
            `<li class="page-item${totalPages === page ? ' disabled' : ''}"><a class="page-link" href="#">Last</a></li>`
          );

        userList.insertAdjacentElement('afterend', pagination);
      })
      .catch((error) => {
        let userList = document.getElementById('user-list');
        userList.innerHTML = `
          <div class="col-12">
            <p class="text-center">Users not found :(</p>
          </div>
        `;

        // Remove existing pagination
        const oldPagination = document.getElementById('pagination');
        if (oldPagination) {
          oldPagination.remove();
        }
      });
  }

  loadUsers();

  document.addEventListener('click', function (e) {
    if (e.target.closest('.pagination a')) {
      e.preventDefault();
      let clickedPage = e.target.textContent;
      if (clickedPage === 'First') {
        loadUsers(1);
      } else if (clickedPage === 'Last') {
        loadUsers(totalPages);
      } else {
        loadUsers(parseInt(clickedPage));
      }
    }
  });
});
