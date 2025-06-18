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
    console.log(tokenJwt)
    try {
        const response = await fetch(`http://localhost:3000/${idUser}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Autorization': `Bearer ${tokenJwt}`
            }
        });

        const data = await response.json();
        const eachTask = data.task

        if (response.ok) {

            eachTask.forEach(taskEach => {
                const tasksDiv = document.querySelector('.div-tasks');

                const task = document.createElement('div');
                task.classList.add('task');

                const inputText = document.createElement('input');
                const inputBox = document.createElement('input');
                inputBox.type = 'checkbox';
                inputBox.id = 'checkbox';
                inputText.value = taskEach;
                inputText.readOnly = true;
                inputText.classList.add('input-text');

                const btnEdit = document.createElement('button');
                const btnDelete = document.createElement('button');
                btnEdit.textContent = 'Editar';
                btnDelete.textContent = 'Excluir';
                btnEdit.classList.add('btn-edit');
                btnDelete.classList.add('btn-delete')

                task.append(inputBox, inputText, btnEdit, btnDelete);
                tasksDiv.appendChild(task);
            });


            function editTask() {
                const btnEdit = document.querySelectorAll('.btn-edit');
                const allInputsText = Array.from(document.querySelectorAll('.input-text'));
                btnEdit.forEach(btn => {
                    btn.addEventListener('click', function () {
                        const divTask = this.closest('.task');
                        let inputText = divTask.querySelector('.input-text');

                        const index = allInputsText.indexOf(inputText);

                        lastIndexEdited = index;

                        const editingTask = prompt(`Editando tarefa ${inputText}: `);

                        if (editingTask !== null && editingTask.trim() !== '') {
                            inputText.value = editingTask;
                            saveInBack(inputText);
                        }
                    });
                });

            }

            let lastIndexEdited = -1

            editTask();

            async function saveInBack(input) {
                const newTaskSend = {
                    newTask: input.value
                }

                try {
                    const response = await fetch(`http://localhost:3000/editTask/${idUser}/${lastIndexEdited}`, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newTaskSend)
                    });

                    if (!response.ok) {
                        throw new Error(`Erro! status: ${response.status}`)
                    }
                } catch (err) {
                    console.error('erro ao salvar no bd', err)
                }
            };

           const btnAdd = document.getElementById('create-task');

           btnAdd.addEventListener('click', () => {
            const tasks = prompt('Digite sua tarefa: ');

             createTask(tasks);
           })

            async function createTask(tasks) {
                
                const tasksSend = {
                    tasks: tasks
                }

                try {   
                    const response = await fetch(`http://localhost:3000/createTasks/${idUser}`, {
                        method: "PATCH",
                        headers: {
                            'Content-Type' : 'application/json',
                            'Autorization': `Bearer ${tokenJwt}`
                        },
                        body: JSON.stringify(tasksSend)
                    })

                    

                    if (!response.ok) {
                        throw new Error('erro ao enviar json')
                    }
                } catch(err) {
                    console.error('erro ao criar task', err)
                }
            }


        } else {
            console.log('erro ao buscar dados!')
        }

    } catch (err) {
        console.error('erro ao listar', err);
    };
};

listar();