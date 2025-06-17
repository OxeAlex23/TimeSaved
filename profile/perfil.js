const btnProfile = document.getElementById('btn-profile');
const profile = document.querySelector('.profile');

btnProfile.addEventListener('click', () => {
    btnProfile.style.display = 'none';
    profile.style.display = 'flex';
})

const btnCloseProfile = document.getElementById('btn-close-profile');

btnCloseProfile.addEventListener('click', () => {
    profile.style.display = 'none';
    btnProfile.style.display = 'block';
});
////////////////////////////////////////////////// profile ^



async function listar() {

    const idUser = sessionStorage.getItem('userID');
    const tokenJwt = sessionStorage.getItem('token')
    try {
        const response = await fetch(`http://localhost:3000/${idUser}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Autorization': `Bearer ${tokenJwt}`
            }
        });

        const data = await response.json()
        console.log(data)

        if (response.ok) {
            const tasksDiv = document.querySelector('.div-tasks');

            const task = document.createElement('div');
            task.classList.add('task');

            const inputText = document.createElement('input');
            const inputBox = document.createElement('input');
            inputBox.type = 'checkbox';
            inputBox.id = 'checkbox'
            inputText.value = data.task;
            inputText.readOnly = true;

            const btnEdit = document.createElement('button');
            const btnDelete = document.createElement('button');
            btnEdit.textContent = 'Editar';
            btnDelete.textContent = 'Excluir';



            task.append(inputBox, inputText, btnEdit, btnDelete)
            tasksDiv.appendChild(task)
        }
    } catch (err) {
        console.error('erro ao listar', err)
    };
};

listar()

