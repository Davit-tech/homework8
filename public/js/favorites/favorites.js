(async () => {
    const booksContainer = document.querySelector("#user-posts");
    const paginationContainer = document.querySelector("#pagination");
    const token = localStorage.getItem("token");

    const responseUser = await fetch("/user/profile/data", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    const {user: {id: userId, userName}} = await responseUser.json();
    const limit = 3;

    const fetchFavorites = async (page) => {
        const response = await fetch(`/user/${userId}/favorites/data?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        const {favorites, pagination} = await response.json();
        booksContainer.innerHTML = renderFavoriteBooks(favorites);
        renderPagination(pagination, page);
    };

    const formatDate = (favorites) => {
        return favorites
            ? new Date(favorites).toLocaleString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
            : '';
    };

    const renderFavoriteBooks = (favorites) => {
        if (!Array.isArray(favorites)) return "No favorites found.";

        let html = "";
        for (const favorite of favorites) {
            const book = favorite.book;
            const bookCover = favorite.bookCover;

            const createdFormatted = formatDate(book.createdAt);
            const updatedFormatted = formatDate(book.updatedAt);
            const avgRating = book.avgRating ? book.avgRating : 'No rating yet';

            html += `
                <div class="userdata">
                    <button class="btn-delete-favorite" data-id="${book.id}">Delete From Favorites</button><br>
                    <img src="/uploads/${bookCover || 'book-covers.jpg'}" alt="book cover" class="book-cover"> <br>
                    <strong>Book Author:</strong> ${book.author} <br><br>
                    <strong>Description:</strong> ${book.description} <br><br>
                    <strong>Book Name:</strong> ${book.title} <br><br>
                    <strong>User Name:</strong> ${userName} <br><br>
                    <div class="rating">Rating: ${avgRating}</div> <br><br>

                    ${createdFormatted ? `<strong>Created:</strong> ${createdFormatted} <br>` : ''}
                    ${(book.updatedAt && book.updatedAt !== book.createdAt) ? `<strong>Updated:</strong> ${updatedFormatted} <br>` : ''}
                    <a href="/books/${book.id}/reviews" class="btn-read-reviews">Read Reviews</a><br>
                    <a href="/books/${book.id}/createReviews" class="btn-read-reviews">Write Reviews</a><br>
                </div>
            `;
        }

        return html || "No favorite books available.";
    };

    const renderPagination = (pagination, currentPage) => {
        if (!pagination || pagination.totalPages <= 1) {
            paginationContainer.innerHTML = "";
            return;
        }

        let paginationHtml = "";

        for (let i = 1; i <= pagination.totalPages; i++) {
            paginationHtml += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        paginationContainer.innerHTML = paginationHtml;

        const pageButtons = document.querySelectorAll(".page-btn");
        pageButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const page = parseInt(e.target.getAttribute("data-page"));
                fetchFavorites(page);
            });
        });
    };

    fetchFavorites();


    booksContainer.addEventListener("click", async (e) => {
        if (e.target.classList.contains("btn-delete-favorite")) {
            const bookId = e.target.getAttribute("data-id");
            try {
                const response = await fetch(`/books/${bookId}/favorites`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({userId, bookId}),
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(data.message);
                    fetchFavorites();
                } else {
                    const errorData = await response.json();
                    alert(errorData.error);
                }
            } catch (error) {
                console.error("Error deleting favorite:", error);
                alert("An error occurred while trying to delete from favorites.");
            }
        }
    });
})();
