document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('clientForm');
    const clientsTable = document.getElementById('clientsTable').getElementsByTagName('tbody')[0];

    loadClients();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const clientId = document.getElementById('clientId').value;
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value
        };

        if (clientId) {
            await updateClient(clientId, client);
        } else {
            await createClient(client);
        }

        form.reset();
        document.getElementById('clientId').value = '';
        loadClients();
    });

    async function createClient(client) {
        try {
            await fetch('http://localhost:3000/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(client),
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function loadClients() {
        try {
            const response = await fetch('http://localhost:3000/clients');
            const clients = await response.json();
            displayClients(clients);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function updateClient(id, client) {
        try {
            await fetch(`http://localhost:3000/clients/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(client),
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function deleteClient(id) {
        try {
            await fetch(`http://localhost:3000/clients/${id}`, {
                method: 'DELETE',
            });
            loadClients();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function displayClients(clients) {
        clientsTable.innerHTML = '';
        clients.forEach(client => {
            const row = clientsTable.insertRow();
            row.innerHTML = `
                <td>${client.nome}</td>
                <td>${client.email}</td>
                <td>${client.telefone}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editClient(${client.id})">Editar</button>
                    <button class="action-btn delete-btn" onclick="deleteClient(${client.id})">Excluir</button>
                </td>
            `;
        });
    }

    window.editClient = function(id) {
        fetch(`http://localhost:3000/clients/${id}`)
            .then(response => response.json())
            .then(client => {
                document.getElementById('clientId').value = client.id;
                document.getElementById('nome').value = client.nome;
                document.getElementById('email').value = client.email;
                document.getElementById('telefone').value = client.telefone;
            });
    };

    window.deleteClient = deleteClient;
});