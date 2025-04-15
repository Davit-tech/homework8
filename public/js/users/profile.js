(async () => {
    const userInfo = document.querySelector("#user-info");
    const token = localStorage.getItem("token");

    const response = await fetch("/user/profile/data", {
        method: "GET",
        headers: {
            "authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    const userData = await response.json();
    const {userName, email, createdAt, updatedAt} = userData.user;

    const formattedCreated = new Date(createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const formattedUpdated = updatedAt && updatedAt !== createdAt
        ? new Date(updatedAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
        : null;

    if (userInfo && userData) {
        userInfo.innerHTML = `
            <div class="profile-field"><strong>Username:</strong> ${userName}</div>
            <div class="profile-field"><strong>Email:</strong> ${email}</div>
            <div class="profile-field"><strong>Profile Created:</strong> ${formattedCreated}</div>
            ${formattedUpdated ? `<div class="profile-field"><strong>Last Updated:</strong> ${formattedUpdated}</div>` : ''}
        `;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit Profile";
        editButton.classList.add("edit-profile-button");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Profile";
        deleteButton.classList.add("delete-profile-button");

        userInfo.appendChild(editButton);
        userInfo.appendChild(deleteButton);

        editButton.addEventListener("click", () => {
            window.location.href = `/user/profile/update`;
        });

        deleteButton.addEventListener("click", async () => {
            if (confirm("Are you sure you want to delete User?")) {
                const res = await fetch("/user/profile", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    alert("User successfully deleted!");
                    localStorage.removeItem("token");
                    window.location.href = "/user/login";
                } else {
                    alert("Error deleting user");
                }
            }
        });
    } else {
        console.log("No user data");
    }
})();

const logout = document.querySelector(".logout");
if (logout) {
    logout.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/user/login";
        window.location.reload();
    });
}
