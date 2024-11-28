function listAllEmployees() {
    fetch('http://localhost:8080/employees')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }
    return response.json(); // Converte o corpo da resposta em JSON
  })
  .then(data => {
    console.log('Funcionários:', data); // Exibe os dados dos funcionários
  })
  .catch(error => {
    console.error('Erro ao buscar funcionários:', error);
  });

}