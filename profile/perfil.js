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
    const tokenJwt = sessionStorage.getItem('token');

    if (!tokenJwt) {
        window.location.href = '../forms/login.html';
        alert('Você deve estar logado para acessar essa página! Realize o login ou crie sua conta!');
    }

    try {
        const response = await fetch(`http://localhost:3000/${idUser}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenJwt}` 
            }
        });

        const data = await response.json();

        if (response.ok) {
            const eachTask = data.task; 

            const tasksDiv = document.querySelector('.div-tasks');

            eachTask.forEach(taskEach => {
                const task = document.createElement('div');
                task.classList.add('task');
                task.dataset.id = taskEach._id;

                const inputText = document.createElement('input');
                const inputBox = document.createElement('input');
                inputBox.type = 'checkbox';
                inputBox.checked = taskEach.checked;
                inputBox.id = 'checkbox';
                inputBox.classList.add('checkbox');

                inputText.value = taskEach.description;
                inputText.readOnly = true;
                inputText.classList.add('input-text');

                const btnEdit = document.createElement('button');
                const btnDelete = document.createElement('button');
                btnEdit.textContent = 'Editar';
                btnDelete.textContent = 'Excluir';
                btnEdit.classList.add('btn-edit');
                btnDelete.classList.add('btn-delete');

                inputText.style.width = (inputText.value.length + 1) + 'ch';

                task.append(inputBox, inputText, btnEdit, btnDelete);
                tasksDiv.appendChild(task);

                inputBox.addEventListener('change', () => {
                    toggleTask(idUser, taskEach._id);
                });
            });


            async function toggleTask(userId, taskId) {
                const token = sessionStorage.getItem('token');

                try {
                    const response = await fetch(`http://localhost:3000/toggleTask/${userId}/${taskId}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Erro na atualização: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log('Tarefa atualizada');
                } catch (err) {
                    console.error('Erro ao atualizar tarefa:', err);
                }
            }


            function editTask() {
                const btnEdit = document.querySelectorAll('.btn-edit');
                btnEdit.forEach(btn => {
                    btn.addEventListener('click', function () {
                        const divTask = this.closest('.task');
                        const inputText = divTask.querySelector('.input-text');
                        const taskId = divTask.dataset.id;

                        const editingTask = prompt(`Editando tarefa: ${inputText.value}`, inputText.value);

                        if (editingTask !== null && editingTask.trim() !== '') {
                            inputText.value = editingTask.trim();

                            saveInBack(taskId, inputText.value);
                        }
                    });
                });
            }

            editTask();

            async function saveInBack(taskId, newDescription) {
                const idUser = sessionStorage.getItem('userID');
                const token = sessionStorage.getItem('token');

                const newTaskSend = {
                    description: newDescription
                };

                try {
                    const response = await fetch(`http://localhost:3000/editTask/${idUser}/${taskId}`, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(newTaskSend)
                    });

                    if (!response.ok) {
                        throw new Error(`Erro! status: ${response.status}`);
                    }

                    alert(`Tarefa atualizada com sucesso!`);
                } catch (err) {
                    console.error('Erro ao salvar no bd', err);
                    alert('Erro ao atualizar tarefa.');
                }
            }

            const btnAdd = document.getElementById('create-task');

            btnAdd.addEventListener('click', () => {
                const taskDescription = prompt('Digite sua tarefa: ');
                if (taskDescription && taskDescription.trim() !== '') {
                    createTask(taskDescription.trim());
                } else {
                    alert('Tarefa não pode ser vazia!');
                }
            });

            async function createTask(taskDescription) {
                const idUser = sessionStorage.getItem('userID');
                const tokenJwt = sessionStorage.getItem('token');

                const tasksSend = [
                    {
                        description: taskDescription,
                        checked: false
                    }
                ];

                try {
                    const response = await fetch(`http://localhost:3000/createTasks/${idUser}`, {
                        method: "PATCH",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${tokenJwt}` 
                        },
                        body: JSON.stringify({ tasks: tasksSend }) 
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao enviar JSON');
                    } else {
                        alert('Tarefa adicionada com sucesso!');
                        window.location.reload();
                    }
                } catch (err) {
                    console.error('Erro ao criar task', err);
                }
            }

            const btnDelete = document.querySelectorAll('.btn-delete');

            btnDelete.forEach(btn => {
                btn.addEventListener('click', function () {
                    const divTask = this.closest('.task');
                    const taskId = divTask.dataset.id;

                    deleteTask(taskId);
                });
            });

            async function deleteTask(taskId) {
                const idUser = sessionStorage.getItem('userID');
                const tokenJwt = sessionStorage.getItem('token');

                try {
                    const response = await fetch(`http://localhost:3000/deleteTask/${idUser}/${taskId}`, {
                        method: "DELETE",
                        headers: {
                            'Authorization': `Bearer ${tokenJwt}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Erro na resposta');
                    } else {
                        alert('Tarefa excluída com sucesso!');
                        window.location.reload();
                    }
                } catch (err) {
                    console.error('Erro ao excluir', err);
                }
            }



        } else {
            console.log('erro ao buscar dados!');
        };

    } catch (err) {
        console.error('erro ao listar', err);
    };
};

listar();

//////////////////////////////// logout
document.getElementById('btn-logout').addEventListener('click', logout);

function logout() {
  sessionStorage.clear();
  
  window.location.href = '../home.html';
}