document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");


    document.body.addEventListener("submit", async (event) => {
        if (event.target.classList.contains("comment-form")) {
            event.preventDefault();

            const form = event.target;
            const reviewId = form.getAttribute("data-review-id");
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`/reviews/${reviewId}/comments`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    alert("Comment added!");
                    window.location.reload();

                } else {
                    alert("Error adding comment.");
                }
            } catch (error) {
                console.error("Error submitting comment:", error);
            }
        }
    });
});
