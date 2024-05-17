class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskListContainer = document.getElementById('taskList');
        this.form = document.getElementById('taskForm');
        this.taskTitleInput = document.getElementById('taskTitle');
        this.taskDescriptionInput = document.getElementById('taskDescription');
        this.taskPriorityInput = document.getElementById('taskPriority');
        this.taskDeadlineInput = document.getElementById('taskDeadline');
        //this.bouton = document.getElementById("disable");
        // Charger les tâches existantes
        //this.displayTasks();

    }

    addTask() {
        if (this.form.checkValidity()) {
            const taskTitle = this.taskTitleInput.value.trim();
            const taskDescription = this.taskDescriptionInput.value.trim();
            const taskPriority = this.taskPriorityInput.value;
            const taskDeadline = this.taskDeadlineInput.value;

            const newTask = {
                id: Date.now(),
                title: taskTitle,
                description: taskDescription,
                priority: taskPriority,
                deadline: taskDeadline,
                completed: false
            };
        
            this.tasks.push(newTask);
            this.saveTasksToLocalStorage();

            // Réinitialiser le formulaire et fermer la modal
            this.resetForm();
            $('#taskModal').modal('hide');
            alert("La tache à été ajouter avec succès");
            return window.location.href='tasklist.html'
            // Afficher toutes les tâches dans la console
            //this.displayAllTasks();
            
            
        } else {
            // Activer la validation Bootstrap
            this.form.classList.add('was-validated');
          
        }
    }

    resetForm() {
        this.form.reset();
        this.form.classList.remove('was-validated');
    }

    saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    /*
    /afficher les taches dans console.log
    displayAllTasks() {
        console.log('Tâches enregistrées :');
        console.log(this.tasks);
    }*/
    displayTasks() {
        
        this.taskListContainer.innerHTML = '';  // Effacer le contenu actuel de la zone d'affichage
        this.tasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td >${task.priority}</td>
                <td>${task.deadline}</td>
                <td>
                    <button class="btn btn-warning btn-sm rounded-4" onclick="taskManager.editTask(${task.id})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-danger btn-sm rounded-4" onclick="taskManager.deleteTask(${task.id})"><i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                </td>
            `;
            this.taskListContainer.appendChild(row);
        });
        
    }
    editTask(taskId) {
        // Recherche de la tâche avec l'ID spécifié
        const taskToEdit = this.tasks.find(task => task.id === taskId);

        if (taskToEdit) {
            // Pré-remplir les champs du formulaire d'édition avec les détails de la tâche à éditer
            document.getElementById('editTaskTitle').value = taskToEdit.title;
            document.getElementById('editTaskDescription').value = taskToEdit.description;
            document.getElementById('editTaskPriority').value = taskToEdit.priority;
            document.getElementById('editTaskDeadline').value = taskToEdit.deadline;

            // Afficher le modal d'édition de tâche
            $('#editTaskModal').modal('show');

            // Gérer la sauvegarde des modifications
            const saveEditButton = document.getElementById('saveEditButton');
            
            saveEditButton.onclick = () => {
                // Mettre à jour les détails de la tâche
                taskToEdit.title = document.getElementById('editTaskTitle').value.trim();
                taskToEdit.description = document.getElementById('editTaskDescription').value.trim();
                taskToEdit.priority = document.getElementById('editTaskPriority').value;
                taskToEdit.deadline = document.getElementById('editTaskDeadline').value;

                // Enregistrer les modifications dans le stockage local
                this.saveTasksToLocalStorage();

                // Réafficher les tâches dans le tableau après modification
                this.displayTasks();

                // Fermer le modal d'édition
                $('#editTaskModal').modal('hide');
                alert("La tache à été modifier avec succès")
            };
        } else {
            console.error(`Tâche avec l'ID ${taskId} non trouvée.`);
        }
    }
    deleteTask(taskId) {

        // Supprimer la tâche correspondante
        if(confirm("Voulez vous supprimer cette tache ?")){
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasksToLocalStorage();
        this.displayTasks();
        }
    }
    priorityOrder() {
        // Trier les tâches par priorité
        this.tasks.sort((a, b) => {
            const priorityOrder = { Basse: 3, Moyenne: 2, Haute: 1 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        //cibléé la colonne priorité et changer le background
        const Bg=document.getElementById('priority');
        Bg.style.backgroundColor = "lightgreen";

        //desactiver la couleur de Background de Orderdate
        const Bg1=document.getElementById('date');
        Bg1.style.backgroundColor = "";
        
    }
    DateOrder() {
         // Trier les tâches par date d'échéance (du plus proche au plus lointain)
        this.tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        //cibléé la colonne priorité et changer le background
        const Bg=document.getElementById('date');
        Bg.style.backgroundColor = "#FAEDCB";
        
        //desactiver la couleur de Background de priorityOrder
        const Bg1=document.getElementById('priority');
        Bg1.style.backgroundColor = "";
      
        }
    countTasksByPriority() {
    const counts = {
        Basse: 0,
        Moyenne: 0,
        Haute: 0
    };

    this.tasks.forEach(task => {
        if (task.priority === 'Basse') {
            counts.Basse++;
        } else if (task.priority === 'Moyenne') {
            counts.Moyenne++;
        } else if (task.priority === 'Haute') {
            counts.Haute++;
        }
    });

    return counts;
}

// Méthode pour afficher le graphique des tâches par priorité avec Chart.js
barChartPriority() {
    const counts = this.countTasksByPriority();

    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Basse', 'Moyenne', 'Haute'],
            datasets: [{
                label: 'Nombre de Tâches par Priorité',
                data: [counts.Basse, counts.Moyenne, counts.Haute],
                backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

pieChartPriority() {
    const counts = this.countTasksByPriority();

    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Basse', 'Moyenne', 'Haute'],
            datasets: [{
                label: 'Nombre de Tâches par Priorité',
                data: [counts.Basse, counts.Moyenne, counts.Haute],
                backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
    displayTotalTask(){
        const tasksCount = this.tasks.length;
        const tasksCountElement = document.getElementById('taskCount');
        tasksCountElement.textContent = ` ${tasksCount}`;
    }
   
    
}


const taskManager = new TaskManager();
taskManager.barChartPriority();
taskManager.pieChartPriority();
taskManager.displayTotalTask();

//gerer la sidebar en responsive
$(document).ready(function() {
        $('#navbar-toggler').click(function() {
            $('#sidebar').toggleClass('show');
        });
    });


   