(async () => {
    const booksContainer = document.querySelector("#user-posts");
    const token = localStorage.getItem("token");

    const response = await fetch("/user/profile/data", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });

    const user = await response.json();
    const userId = user.user.id;

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
                "Content-Type": "application/json",
            }
        });

        const {booksData, pagination} = await responseBook.json();

        const renderBooks = (booksData, userId) => {
            if (!Array.isArray(booksData)) {
                return '';
            }

            let booksHtml = "";
            for (const book of booksData) {
                const createdFormatted = formatDate(book.createdAt);
                const updatedFormatted = formatDate(book.updatedAt);

                const averageRating = book.reviews?.length
                    ? (book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length).toFixed(1)
                    : "No Rating yet";

                booksHtml += `
                    <div class="userdata">
                        <strong>Book Author:</strong> ${book.author} <br><br>
                        <strong>Description:</strong> ${book.description} <br><br>
                        <strong>Book Name:</strong> ${book.title} <br> <br>
                        <strong>User Name:</strong> ${user.user.userName} <br><br>
                        <div class="rating">Rating: ${averageRating}</div> <br><br>
                        ${createdFormatted ? `<strong>Created:</strong> ${createdFormatted} <br>` : ''}
${(book.updatedAt && book.updatedAt !== book.createdAt) ? `<strong>Updated:</strong> ${updatedFormatted} <br>` : ''}

                        ${book.user_id === userId ? `
                            <input type="submit" value="Delete" class="btn-delete" data-id="${book.id}">
                            <a href="/books/${book.id}/update" class="btn-edit" data-id="${book.id}">Edit Book</a>
                        ` : ""} <br>
                        <a href="/books/${book.id}/createReviews" class="btn-write-review">Write Reviews</a><br>
                        <a href="/books/${book.id}/reviews" class="btn-read-reviews">Read Reviews</a>
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
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
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
    });
})();
const logout = document.querySelector(".logout");
if (logout) {
    logout.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/user/login";
        window.location.reload();
    });
}
