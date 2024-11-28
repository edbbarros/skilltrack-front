const url = 'http://localhost:8080/employees'

let colaboradores = [];
let indiceEditando = null;

let estaEditandoColaborador = false;

async function listAllEmployees() {
    try {
      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        return data;
      }

      if (response.status === 204) {
        return [];
      }

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Erro ao buscar colaborador:', error);
      return [];
    }
  }

  async function listarColaboradoresPorPesquisa(valor) {
    try {
        const response = await fetch(`${url}/search?query=${valor}`);
  
        if (response.status === 200) {
          const data = await response.json();
          return data;
        }
  
        if (response.status === 204) {
            return "Nenhum colaborador encontrado.";
        }
  
        if (!response.ok) {
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        
      } catch (error) {
        console.error('Erro ao buscar colaborador:', error);
        return [];
      }
  }

async function getUserById(userId) {
    try {
        const response = await fetch(`${url}/${userId}`);
        if (!response.ok) {
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Erro ao buscar colaboradores:', error);
        return [];
      }
}

async function adicionarColaborador(funcionario) {
        const postData = {
                "name": funcionario.name,
                "email": funcionario.email,
                "contact": funcionario.contact,
                "hardSkills": funcionario.hardSkills,
                "certifications": funcionario.certifications,
                "timeOfExperience": funcionario.timeOfExperience,
                "userLinkedin": funcionario.userLinkedin
        };
      
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
          });
      
          if (response.status === 201) {
            showToast(await response.text(), "show success");
          }

          if (response.status === 500) {
            showToast(await response.text(), "show danger");
          }
    
        } catch (error) {
          console.error('Erro ao criar o post:', error);
        }
  
}

async function editarColaborador(colaborador) {
    const postData = {
            "idEmployee": colaborador.id,
            "name": colaborador.name,
            "email": colaborador.email,
            "contact": colaborador.contact,
            "hardSkills": colaborador.hardSkills,
            "certifications": colaborador.certifications,
            "timeOfExperience": colaborador.timeOfExperience,
            "userLinkedin": colaborador.userLinkedin
    };
  
    try {
      const response = await fetch(`${url}/${colaborador.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      if (response.status === 204) {
        showToast("Colaborador já está atualizado!", "show primary");
        }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (response.status === 200) {
        showToast(await response.text(), "show success");
      }
    } catch (error) {
      console.error('Erro ao criar o post:', error);
    }

}

// Função para renderizar a tabela
async function renderizarTabela() {
    const tbody = document.getElementById('tabelaCorpo');
    tbody.innerHTML = '';
    
    colaboradores = await listAllEmployees()

    if (colaboradores.length === 0) {
        const conteudo = document.getElementById('sem-conteudo');
        conteudo.innerHTML = '';

        console.log("nenhum colaborador cadastrado!")

        const tr = document.createElement('section');
        tr.innerHTML = `
            <h3 style="width: 100%;text-align: center; color: #ccc; padding: 6rem;">Nenhum colaborador cadastrado.</h3>
        `;
        conteudo.appendChild(tr);
    } else {
        const conteudo = document.getElementById('sem-conteudo');
        conteudo.innerHTML = '';
    }

    colaboradores.forEach((colaborador, indice) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${colaborador.name}</td>
            <td>${colaborador.contact}</td>
            <td>${colaborador.email}</td>
            <td>${colaborador.hardSkills}</td>
            <td>${colaborador.certifications}</td>
            <td>${colaborador.timeOfExperience}</td>
            <td><a href="https://linkedin.com/in/${colaborador.userLinkedin}" target="_blank">${colaborador.userLinkedin}</a></td>
            <td class="acoes">
                <button class="botao-editar" onclick="editandoColaborador(${colaborador.idEmployee})">✏️</button>
                <button class="botao-excluir" onclick="excluirColaborador(${colaborador.idEmployee})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Funções do Modal
async function abrirModal(indice = null) {
    const modal = document.getElementById('modal');
    const modalTitulo = document.getElementById('modalTitulo');
    const form = document.getElementById('formularioColaborador');
    
    indiceEditando = indice;
    
    if (indice !== null) {
        modalTitulo.textContent = 'Editar Colaborador';
        const colaborador =  await getUserById(indice);
        console.log(indice)
        form.nome.value = colaborador.name;
        form.contato.value = colaborador.contact;
        form.email.value = colaborador.email;
        form.habilidades.value = colaborador.hardSkills;
        form.certificacao.value = colaborador.certifications
        form.experiencia.value = colaborador.timeOfExperience;
        form.linkedin.value = colaborador.userLinkedin;
    } else {
        modalTitulo.textContent = 'Adicionar Colaborador';
        form.reset();
    }
    
    modal.style.display = 'block';
}

function fecharModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    indiceEditando = null;
    estaEditandoColaborador = false;
}

async function excluirColaborador(indice) {
    if (confirm('Tem certeza que deseja excluir este colaborador?')) {
        colaboradores.splice(indice, 1);    
  
        try {
        const response = await fetch(`${url}/${indice}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        if (response.status === 200) {
            showToast(await response.text(), "show success");
        }

        if (response.status === 404) {
            const data = await response.text();
            console.log(data);
        }
        } catch (error) {
        console.error('Erro ao criar o post:', error);
        }

        renderizarTabela();
    }
}

function editandoColaborador(indice) {
    estaEditandoColaborador = true;
    abrirModal(indice);
}

document.getElementById('formularioColaborador').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const colaborador = {
        id: indiceEditando,
        name: this.nome.value,
        contact: this.contato.value,
        email: this.email.value,
        hardSkills: this.habilidades.value,
        certifications: this.certificacao.value,
        timeOfExperience: this.experiencia.value,
        userLinkedin: this.linkedin.value
    };

    if (estaEditandoColaborador) {
        await editarColaborador(colaborador)
    } else {
        await adicionarColaborador(colaborador)
    }
    
    if (indiceEditando !== null) {
        colaboradores[indiceEditando] = colaborador;
    } else {
        //colaboradores.push(colaborador);
    }
    
    renderizarTabela();
    fecharModal();
});

// Função filtrar colaboradores na barra de busca
async function filtrarColaboradores() {
    const termoBusca = document.querySelector('.search-bar__input').value.toLowerCase();
    const tbody = document.getElementById('tabelaCorpo');

    tbody.innerHTML = ''; // Limpar a tabela

    colaboradores = await listarColaboradoresPorPesquisa(termoBusca);

    if (!Array.isArray(colaboradores)) {
        const conteudo = document.getElementById('sem-conteudo');
        conteudo.innerHTML = '';

        const tr = document.createElement('section');
        tr.innerHTML = `
            <h3 style="width: 100%;text-align: center; color: #ccc; padding: 6rem;">${colaboradores}</h3>
        `;
        conteudo.appendChild(tr);
    } else {
        const conteudo = document.getElementById('sem-conteudo');
        conteudo.innerHTML = '';

        colaboradores
        .forEach((colaborador, indice) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${colaborador.name}</td>
                <td>${colaborador.contact}</td>
                <td>${colaborador.email}</td>
                <td>${colaborador.hardSkills}</td>
                <td>${colaborador.certifications}</td>
                <td>${colaborador.timeOfExperience}</td>
                <td><a href="https://linkedin.com/in/${colaborador.userLinkedin}" target="_blank">${colaborador.userLinkedin}</a></td>
                <td class="acoes">
                <button class="botao-editar" onclick="editandoColaborador(${colaborador.idEmployee})">✏️</button>
                <button class="botao-excluir" onclick="excluirColaborador(${colaborador.idEmployee})">🗑️</button>
            </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function showToast(message, className) {
    const toast = document.getElementById('toast');
    toast.innerHTML = message;
    toast.className = className;

    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }

document.querySelector('.search-bar__input').addEventListener('input', filtrarColaboradores);

renderizarTabela();