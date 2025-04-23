document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    const avatarForm = document.querySelector("#avatar-form");
    const avatarInput = document.querySelector("#avatar-input");
    const avatarImg = document.querySelector("#avatar-img");

    if (avatarForm && avatarInput && avatarImg) {
        avatarImg.addEventListener("click", () => {
            avatarInput.click();
        });

        avatarInput.addEventListener("change", async () => {
            const formData = new FormData(avatarForm);

            const res = await fetch('/user/upload-avatar', {
                method: "POST",
                headers: {
                    "authorization": `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                avatarImg.src = `/uploads/${data.avatar}?t=${Date.now()}`;
            } else {
                alert(data.message || "Failed to upload avatar");
            }
        });
    }
});
