(async () => {
    const reviewsContainer = document.querySelector("#reviews-container");
    const paginationContainer = document.querySelector("#pagination-container");
    const bookTitle = document.querySelector("#book-title");
    const bookAuthor = document.querySelector("#book-author");
    const token = localStorage.getItem("token");

    const responseUser = await fetch("/user/profile/data", {
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`}
    });
    const userId = (await responseUser.json()).user.id;
    const bookId = window.location.pathname.split('/')[2];
    const limit = 2;

    const formatDate = date => date ? new Date(date).toLocaleString("en-GB", {
        day: "2-digit", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    }) : "";

    async function loadReviews(page = 1) {
        const res = await fetch(`/books/${bookId}/reviews/data?page=${page}&limit=${limit}`, {
            headers: {"Authorization": `Bearer ${token}`}
        });
        const book = await res.json();

        bookAuthor.textContent = `Book Author: ${book.book.author}`;
        bookTitle.textContent = `Book Name : ${book.book.title}`;
        reviewsContainer.innerHTML = "";
        paginationContainer.innerHTML = "";

        if (book.reviews?.length) {
            for (const review of book.reviews) {
                const reviewElement = document.createElement("div");
                reviewElement.classList.add("review");

                const created = formatDate(review.createdAt);
                const updated = formatDate(review.updatedAt);
                const controls = review.user.id === userId ? `
                    <button class="btn-delete-review" data-id="${review.id}">Delete</button>
                    <a href="/books/${bookId}/reviews/${review.id}/reviews" class="btn-edit-review">Edit</a>
                ` : "";

                reviewElement.innerHTML = `
                    <p><strong>Rating:</strong> ${review.rating}/5</p>
                    <p><strong>Comment:</strong> ${review.reviews}</p>
                    <p><strong>By:</strong> ${review.user.username}</p>
                    ${created ? `<p><strong>Created:</strong> ${created}</p>` : ""}
                    ${review.updatedAt !== review.createdAt ? `<p><strong>Updated:</strong> ${updated}</p>` : ""}
                    ${controls}
                    <div class="comments-container" data-review-id="${review.id}">
                        <h4>Comments:</h4>
                        <div class="comment-list" id="comment-list-${review.id}"></div>
                        <div id="comment-pagination-${review.id}"></div>
                        <form class="comment-form" data-review-id="${review.id}">
                            <textarea name="comments" placeholder="Write a comment" required></textarea>
                            <button type="submit">Send</button>
                        </form>
                    </div>
                    <hr>
                `;

                reviewsContainer.appendChild(reviewElement);
                await loadComments(review.id);
            }

            for (let i = 1; i <= book.pagination.totalPages; i++) {
                const btn = document.createElement("button");
                btn.textContent = i;
                btn.disabled = i === book.pagination.page;
                btn.classList.add("page-btn");
                btn.addEventListener("click", () => loadReviews(i));
                paginationContainer.appendChild(btn);
            }
        } else {
            reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
        }
    }

    const loadedCommentPages = {};

    async function loadComments(reviewId, page = 1) {
        if (!loadedCommentPages[reviewId]) loadedCommentPages[reviewId] = new Set();
        if (loadedCommentPages[reviewId].has(page)) return;

        const res = await fetch(`/reviews/${reviewId}/comments?page=${page}&limit=${limit}`);
        const data = await res.json();

        const commentList = document.getElementById(`comment-list-${reviewId}`);
        const pagination = document.getElementById(`comment-pagination-${reviewId}`);

        data.comments.forEach(comment => {
            const date = formatDate(comment.createdAt);
            const el = document.createElement("p");
            el.innerHTML = `<strong>${comment.user?.username || "Unknown"}:</strong> ${comment.comments} <em>(${date})</em>`;
            commentList.appendChild(el);
        });

        loadedCommentPages[reviewId].add(page);
        pagination.innerHTML = "";

        if (data.pagination.page < data.pagination.totalPages) {
            const loadMoreBtn = document.createElement("button");
            loadMoreBtn.textContent = "Load more";
            loadMoreBtn.classList.add("load-more-btn");
            loadMoreBtn.addEventListener("click", () => loadComments(reviewId, page + 1));
            pagination.appendChild(loadMoreBtn);
        }
    }

    await loadReviews();

    reviewsContainer.addEventListener("click", async (event) => {
        if (event.target.classList.contains("btn-delete-review")) {
            const reviewId = event.target.dataset.id;
            if (confirm("Are you sure you want to delete this review?")) {
                const res = await fetch(`/books/${bookId}/reviews/${reviewId}`, {
                    method: "DELETE",
                    headers: {"Authorization": `Bearer ${token}`}
                });

                if (res.ok) {
                    alert("Deleted");
                    event.target.closest(".review").remove();
                } else {
                    alert("Failed to delete");
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
    });
}
