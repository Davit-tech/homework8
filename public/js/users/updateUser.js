const editProfileForm = document.getElementById("editProfileForm");
if (editProfileForm) {
    editProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const formData = new FormData(editProfileForm);
        const data = Object.fromEntries(formData.entries());

        const res = await fetch("/user/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            for (const [field, message] of Object.entries(result.fields)) {
                const inputElement = document.querySelector(`[name="${field}"]`);
                if (inputElement) {
                    const errorSpan = document.createElement("span");
                    errorSpan.classList.add("error-text");
                    errorSpan.textContent = message;
                    inputElement.parentNode.appendChild(errorSpan);
                }
            }
            alert("Error");
        } else {
            alert("User updated successfully.");
            window.location.href = "/user/profile";

        }
    });
}
const logout = document.querySelector(".logout");
if (logout) {
    logout.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/user/login";
        window.location.reload();
    });
}
