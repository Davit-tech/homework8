document.getElementById("resetForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value;

    const res = await fetch(`/user/reset-password?token=${token}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({newPassword})
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
        window.location.href = "/user/login";
    }
});