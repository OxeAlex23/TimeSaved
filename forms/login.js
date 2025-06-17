const formLogin = document.getElementById('login-form')

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({email, password})

        } );

        const data = await response.json();

        if (response.ok) {
            const userID = data.userId;
            const token = data.token

            localStorage.setItem("logged", "true");
            sessionStorage.setItem('userID', userID);
            localStorage.setItem('token', token);
            
            window.location.href = '../profile/perfil.html'
        } else {
             console.log('Login não autorizado!');
             console.error(data.msg)
        }

    } catch (err) {
        console.error('erro na requisição', err)
       
    }
})