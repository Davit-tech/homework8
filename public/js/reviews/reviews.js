(async () => {
    const reviewsContainer = document.querySelector("#reviews-container");
    const bookTitle = document.querySelector("#book-title");
    const bookAuthor = document.querySelector("#book-author");
    const token = localStorage.getItem("token");

    const responseUser = await fetch("/user/profile/data", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });

    const userData = await responseUser.json();
    const userId = userData.user.id;
    const bookId = window.location.pathname.split('/')[2];
    console.log(bookId);
    const responseReviews = await fetch(`/books/${bookId}/reviews/data`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    const book = await responseReviews.json();

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

    bookAuthor.textContent = `Book Author: ${book.author}`;
    bookTitle.textContent = `Book Name : ${book.title}`;
    reviewsContainer.innerHTML = "";

    if (book.reviews && Array.isArray(book.reviews)) {
        book.reviews.forEach((review) => {
            const reviewElement = document.createElement("div");
            reviewElement.classList.add("review");

            const createdFormatted = formatDate(review.createdAt);
            const updatedFormatted = formatDate(review.updatedAt);
            console.log(createdFormatted);

            let controls = "";
            if (review.user.id === userId) {
                controls = `
                    <button class="btn-delete-review" data-id="${review.id}">Delete Review</button>
                    <a href="/books/${bookId}/reviews/${review.id}/reviews" class="btn-edit-review">Edit Review</a>
                `;
            }

            reviewElement.innerHTML = `
                <p><strong>Rating:</strong> ${review.rating} / 5</p>
                <p><strong>Review:</strong> ${review.reviews}</p>
                <p><strong>Reviewed by:</strong> ${review.user.username} </p>
                ${createdFormatted ? `<p><strong>Created:</strong> ${createdFormatted}</p>` : ''}
                ${(review.updatedAt && review.updatedAt !== review.createdAt) ? `<p><strong>Updated:</strong> ${updatedFormatted}</p>` : ''}
                ${controls}
                <hr>
            `;

            reviewsContainer.appendChild(reviewElement);
        });
    } else {
        reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
    }

    reviewsContainer.addEventListener("click", async (event) => {
        if (event.target.classList.contains("btn-delete-review")) {
            const reviewId = event.target.getAttribute("data-id");
            console.log('Attempting to delete review with ID:', reviewId);

            if (confirm("Are you sure you want to delete this review?")) {
                try {
                    const deleteResponse = await fetch(`/books/${bookId}/reviews/${reviewId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (deleteResponse.ok) {
                        alert("review deleted");
                        location.reload();

                    } else {
                        alert("Error deleting review.");
                    }
                } catch (error) {
                    console.error("Error deleting review:", error);
                    alert("Error deleting review.");
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
