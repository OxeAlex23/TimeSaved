const formRegister = document.getElementById('form-register');

formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const birthdate = document.getElementById('birthdate').value;

    try {
        const response = await fetch(`http://localhost:3000/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, birthdate })
        })

        const data = await response.json();

        if (response.ok) {
            const userID = data.userId;
            const token = data.token

            sessionStorage.setItem('userID', userID);
            sessionStorage.setItem('token', token);

            if (token) {
                window.location.href = '../profile/perfil.html'
            } else {
                window.location.href = 'home.html'
            }
        } else {
            console.log('Token não autorizado!');
        }
    } catch (err) {
        console.error('erro ao criar conta!', err)
    }
})