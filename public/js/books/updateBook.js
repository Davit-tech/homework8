const updateBookForm = document.querySelector("#book-form");
const urlParts = window.location.pathname.split("/");

const bookId = urlParts[2];
if (updateBookForm) {
    updateBookForm.onsubmit = async function (event) {
        event.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(
                `/books/${bookId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                }
            );
            const result = await response.json();
            if (response.ok) {
                window.location.href = `/books/`;
            } else {
                if (result.fields) {
                    for (const [field, message] of Object.entries(result.fields)) {
                        const inputElement = document.querySelector(`[name="${field}"]`);
                        if (inputElement) {
                            const errorSpan = document.createElement("span");
                            errorSpan.classList.add("error-text");
                            errorSpan.textContent = message;
                            inputElement.parentNode.appendChild(errorSpan);
                        }
                    }
                } else {
                    console.error("Failed to update reviews", result);
                }
            }
        } catch (e) {
            console.error("Error during request:", e);
        }
    };
}
let logout = document.querySelector(".logout");
if (logout) {
    logout.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/user/login";
        window.location.reload();
    });
}
