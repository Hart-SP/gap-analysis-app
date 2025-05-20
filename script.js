document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const form = document.getElementById('gapForm');
    const fileInput = document.getElementById('fileUpload');
    const fileNameDisplay = document.getElementById('fileName');
    const loadingContainer = document.getElementById('loading');
    const resultContainer = document.getElementById('result');
    const successMessage = document.getElementById('success');
    const errorMessage = document.getElementById('error');
    const errorMessageText = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    // Menu lateral
    const menuItems = document.querySelectorAll('.menu li:not(.disabled)');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Implementação futura: mostrar conteúdo correspondente
            // Por enquanto, apenas a Análise de GAP está ativa
        });
    });
    
    // Exibir nome do arquivo selecionado
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            fileNameDisplay.textContent = this.files[0].name;
        } else {
            fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
        }
    });
    
    // Manipulação do envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulário
        if (!validateForm()) {
            return;
        }
        
        // Mostrar loading
        form.classList.add('hidden');
        loadingContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
        
        // Preparar dados para envio
        const formData = new FormData(form);
        
        // Enviar dados para o webhook
        fetch('https://n8n.srv830044.hstgr.cloud/webhook/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            loadingContainer.classList.add('hidden');
            resultContainer.classList.remove('hidden');
            
            if (response.ok) {
                successMessage.classList.remove('hidden');
                // Limpar formulário após sucesso
                form.reset();
                fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
                
                // Mostrar formulário novamente após 5 segundos
                setTimeout(() => {
                    resultContainer.classList.add('hidden');
                    form.classList.remove('hidden');
                }, 5000);
            } else {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
        })
        .catch(error => {
            loadingContainer.classList.add('hidden');
            resultContainer.classList.remove('hidden');
            errorMessage.classList.remove('hidden');
            errorMessageText.textContent = `Ocorreu um erro durante o envio: ${error.message}`;
            
            // Mostrar formulário novamente após erro
            setTimeout(() => {
                resultContainer.classList.add('hidden');
                form.classList.remove('hidden');
            }, 5000);
        });
    });
    
    // Função para validar o formulário
    function validateForm() {
        let isValid = true;
        
        // Validar arquivo
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('Por favor, selecione um arquivo PDF para análise.');
            isValid = false;
        } else {
            const file = fileInput.files[0];
            if (file.type !== 'application/pdf') {
                alert('Por favor, selecione apenas arquivos PDF.');
                isValid = false;
            }
        }
        
        // Validar campos de texto
        const requiredFields = ['nome', 'unidade', 'categoria', 'setor', 'email'];
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                alert(`Por favor, preencha o campo ${field.charAt(0).toUpperCase() + field.slice(1)}.`);
                isValid = false;
            }
        });
        
        // Validar formato de email
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value && !emailRegex.test(emailInput.value)) {
            alert('Por favor, insira um endereço de email válido.');
            isValid = false;
        }
        
        return isValid;
    }
});
