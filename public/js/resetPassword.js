document.getElementById("resetForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value;
    const newPassword1 = document.getElementById("newPassword1").value;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log(token)
    const res = await fetch(`/user/reset-password?token=${token}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({newPassword, newPassword1, token})
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
        window.location.href = "/user/login";
    } else {
        console.log("error")
    }
});