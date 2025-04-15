const messageContainer = document.querySelector("#message-container");

const loginForm = document.querySelector("#book-form");
if (loginForm) {
  const token = localStorage.getItem("token");
  loginForm.onsubmit = async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/books/data", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = "/books/";
      } else {
        if (messageContainer) {
          messageContainer.classList.add("error-message");
          messageContainer.innerHTML = result.message;
        }
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
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
}

const logout = document.querySelector(".logout");
if (logout) {
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/user/login";
    window.location.reload();
  });
}
