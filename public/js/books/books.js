(async () => {
    const booksContainer = document.querySelector("#user-posts");
    const token = localStorage.getItem("token");

    const response = await fetch("/user/profile/data", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    const {user: {id: userId, userName}} = await response.json();
    document.querySelector(".navbar .nav-list").innerHTML += `
            <li><a href="/user/${userId}/favorites">Favorites</a></li>
        `;
    let currentPage = 1;
    const limit = 6;

    const formatDate = (date) => {
        return date
            ? new Date(date).toLocaleString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
            : '';
    };

    const fetchBooks = async (page) => {
        const responseBook = await fetch(`/books/data?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        const {booksData, pagination} = await responseBook.json();

        const renderBooks = (books, userId) => {
            if (!Array.isArray(books)) return '';

            let booksHtml = "";
            for (const book of books) {
                const bookCover = book.bookCover;
                const createdFormatted = formatDate(book.createdAt);
                const updatedFormatted = formatDate(book.updatedAt);
                const avgRating = book.avgRating ? book.avgRating : 'No rating yet';


                booksHtml += `
                    <div class="userdata">
                        <button class="btn-add-favorite" data-id="${book.id}">Add to Favorites</button><br>

                        <img src="/uploads/${bookCover || 'book-covers.jpg'}" alt="book cover" class="book-cover"> <br>
                        <strong>Book Author:</strong> ${book.author} <br><br>
                        <strong>Description:</strong> ${book.description} <br><br>
                        <strong>Book Name:</strong> ${book.title} <br><br>
                        <strong>User Name:</strong> ${userName} <br><br>
                        <div class="rating">Rating: ${avgRating}</div> <br><br>
                        ${createdFormatted ? `<strong>Created:</strong> ${createdFormatted} <br>` : ''}
                        ${(book.updatedAt && book.updatedAt !== book.createdAt) ? `<strong>Updated:</strong> ${updatedFormatted} <br>` : ''}
                        ${book.user_id === userId ? `
                            <button class="btn-delete" data-id="${book.id}">Delete</button>
                            <a href="/books/${book.id}/update" class="btn-edit" data-id="${book.id}">Edit Book</a>
                        ` : ""} <br>
                        <a href="/books/${book.id}/createReviews" class="btn-write-review">Write Reviews</a><br>
                        <a href="/books/${book.id}/reviews" class="btn-read-reviews">Read Reviews</a><br>
                    </div>
                `;
            }

            return booksHtml;
        };

        const renderPagination = (totalPages, currentPage) => {
            let paginationHtml = "";
            for (let i = 1; i <= totalPages; i++) {
                paginationHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            return paginationHtml;
        };

        if (booksData && Array.isArray(booksData)) {
            booksContainer.innerHTML = renderBooks(booksData, userId);
            document.querySelector("#pagination").innerHTML = renderPagination(pagination.totalPages, currentPage);
        } else {
            booksContainer.innerHTML = "No Books available.";
        }
    };

    await fetchBooks(currentPage);

    document.body.addEventListener("click", async (event) => {
        if (event.target.classList.contains("page-btn")) {
            const page = event.target.getAttribute("data-page");
            currentPage = parseInt(page);
            await fetchBooks(currentPage);
        }
    });

    booksContainer.addEventListener("click", async (event) => {
        if (event.target.classList.contains("btn-delete")) {
            const bookId = event.target.getAttribute("data-id");

            if (confirm("Are you sure you want to delete this book?")) {
                try {
                    const response = await fetch(`/books/${bookId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                    });

                    if (response.status === 204) {
                        alert("Book Deleted");
                        window.location.reload();
                    } else {
                        alert("Error deleting book.");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("Error deleting book.");
                }
            }
        }

        if (event.target.classList.contains("btn-add-favorite")) {
            const bookId = event.target.getAttribute("data-id");

            try {
                const response = await fetch(`/books/${bookId}/favorites`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        book_id: bookId
                    })
                });

                if (response.ok) {
                    alert("Book added to favorites!");
                } else if (response.status === 409) {
                    alert("Book is already in favorites.");
                } else {
                    alert("Failed to add to favorites.");
                }
            } catch (err) {
                console.error("Error:", err);
                alert("Error adding to favorites.");
            }
        }
    });
})();

const logout = document.querySelector(".logout");
if (logout) {
    logout.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/user/login";
    });
}
