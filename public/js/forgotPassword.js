document.getElementById("forgot-password-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const messageElement = document.getElementById("message");

    try {
        const res = await fetch("/user/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email}),
        });

        const data = await res.json();

        if (res.ok) {z
            messageElement.textContent = data.message || "Check your email for reset link.";
            messageElement.style.color = "green";
        } else {
            messageElement.textContent = data.message || "Something went wrong.";
            messageElement.style.color = "red";
        }

    } catch (err) {
        console.error(err);
        messageElement.textContent = "Error sending request.";
        messageElement.style.color = "red";
    }
});
