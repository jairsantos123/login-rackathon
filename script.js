// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Credenciais válidas (em produção, isso seria validado no servidor)
const VALID_CREDENTIALS = {
    email: 'admin@education.com',
    password: 'admin123'
};

// Estado da aplicação
let isLoading = false;
let showPassword = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupFormValidation();
});

// Event Listeners
function initializeEventListeners() {
    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    
    // Form submission
    loginForm.addEventListener('submit', handleFormSubmit);
    
    // Input validation em tempo real
    emailInput.addEventListener('input', clearErrorMessage);
    passwordInput.addEventListener('input', clearErrorMessage);
    
    // Enter key handling
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !isLoading) {
            handleFormSubmit(e);
        }
    });
}

// Toggle password visibility
function togglePasswordVisibility() {
    showPassword = !showPassword;
    const icon = togglePasswordBtn.querySelector('i');
    
    if (showPassword) {
        passwordInput.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isLoading) return;
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validação básica
    if (!validateForm(email, password)) {
        return;
    }
    
    // Iniciar loading
    setLoadingState(true);
    
    try {
        // Simular chamada de API
        await simulateLogin(email, password);
        
        // Verificar credenciais
        if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
            handleLoginSuccess();
        } else {
            handleLoginError('Credenciais inválidas. Apenas administradores podem acessar.');
        }
    } catch (error) {
        handleLoginError('Erro interno do servidor. Tente novamente.');
    } finally {
        setLoadingState(false);
    }
}

// Validação do formulário
function validateForm(email, password) {
    if (!email) {
        showErrorMessage('Por favor, insira seu email.');
        emailInput.focus();
        return false;
    }
    
    if (!isValidEmail(email)) {
        showErrorMessage('Por favor, insira um email válido.');
        emailInput.focus();
        return false;
    }
    
    if (!password) {
        showErrorMessage('Por favor, insira sua senha.');
        passwordInput.focus();
        return false;
    }
    
    if (password.length < 6) {
        showErrorMessage('A senha deve ter pelo menos 6 caracteres.');
        passwordInput.focus();
        return false;
    }
    
    return true;
}

// Validação de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simular login (substituir por chamada real de API)
function simulateLogin(email, password) {
    return new Promise((resolve) => {
        setTimeout(resolve, 1500); // Simular delay de rede
    });
}

// Gerenciar estado de loading
function setLoadingState(loading) {
    isLoading = loading;
    submitBtn.disabled = loading;
    
    if (loading) {
        submitText.style.display = 'none';
        loadingSpinner.style.display = 'flex';
    } else {
        submitText.style.display = 'block';
        loadingSpinner.style.display = 'none';
    }
}

// Sucesso no login
function handleLoginSuccess() {
    // Mostrar feedback de sucesso
    showSuccessMessage('Login realizado com sucesso!');
    
    // Redirecionar após um breve delay
    setTimeout(() => {
        // Em produção, redirecionar para o dashboard
        window.location.href = 'dashboard.html'; // ou a página principal
        // Para demonstração, apenas mostrar alert
        alert('🎉 Login realizado com sucesso! Redirecionando para o dashboard...');
    }, 1000);
}

// Erro no login
function handleLoginError(message) {
    showErrorMessage(message);
    
    // Limpar campos sensíveis
    passwordInput.value = '';
    passwordInput.focus();
}

// Mostrar mensagem de erro
function showErrorMessage(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    
    // Auto-hide após 5 segundos
    setTimeout(clearErrorMessage, 5000);
}

// Mostrar mensagem de sucesso
function showSuccessMessage(message) {
    // Criar elemento de sucesso temporário
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Adicionar estilos inline
    successDiv.style.cssText = `
        background-color: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: #86efac;
        padding: 0.75rem;
        border-radius: 0.375rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        margin-bottom: 1rem;
    `;
    
    // Inserir antes do botão de submit
    loginForm.insertBefore(successDiv, submitBtn);
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

// Limpar mensagem de erro
function clearErrorMessage() {
    errorMessage.style.display = 'none';
    errorText.textContent = '';
}

// Setup form validation
function setupFormValidation() {
    // Adicionar validação HTML5
    emailInput.setAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
    passwordInput.setAttribute('minlength', '6');
    
    // Feedback visual para campos válidos/inválidos
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && this.checkValidity()) {
                this.style.borderColor = '#22c55e';
            } else if (this.value) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#52525b';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = '#6366f1';
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Adicionar animações suaves aos elementos
function addSmoothAnimations() {
    const cards = document.querySelectorAll('.feature-card, .login-card, .demo-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Inicializar animações quando a página carregar
document.addEventListener('DOMContentLoaded', addSmoothAnimations);