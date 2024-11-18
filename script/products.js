/*
window.onload = () => {
    const modal = new bootstrap.Modal(document.getElementById("whatsappModal"));
    modal.show();
  };
*/

// Função para verificar se a loja está aberta
function verificarStatusLoja() {
    const agora = new Date();
    const diaSemana = agora.getDay(); // 0 = Domingo, 6 = Sábado
    const hora = agora.getHours();

    const lojaAberta =
        diaSemana >= 1 && diaSemana <= 5 && // Segunda a sexta
        hora >= 8 && hora < 18; // 08h às 18h

    const statusDiv = document.getElementById("StatusLoja");

    if (lojaAberta) {
        statusDiv.style.backgroundColor = "#16A249"; // Verde
        statusDiv.textContent = "Segunda à Sexta - 8h às 18h";
    } else {
        statusDiv.style.backgroundColor = "red"; // Vermelho
        statusDiv.textContent = "Segunda à Sexta - 8h às 18h";
    }
}

async function fetchProductsFromGoogleSheets(sheetUrl) {
    try {
        const response = await fetch(sheetUrl);
        const csvText = await response.text();

        // Converte o CSV em um array de objetos
        const rows = csvText.split('\n').slice(1); // Ignora o cabeçalho
        return rows.map(row => {
            const [id, name, price, image] = row.split(','); // Divide por vírgula
            return {
                id: id.trim(),
                name: name.trim(),
                price: parseFloat(price.trim()),
                image: image.trim(),
            };
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return [];
    }
}

let cart = [];  // Array que guarda os produtos no carrinho

// Função que adiciona produtos ao carrinho
function addToCart(productId, quantity, name, price) {
    // Verifica se o produto já está no carrinho
    const existingProductIndex = cart.findIndex(item => item.id === productId);
    
    if (existingProductIndex !== -1) {
        // Se já estiver, atualiza a quantidade
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Se não estiver, adiciona um novo produto
        cart.push({ id: productId, name: name, price: price, quantity: quantity });
    }

    // Atualiza a visualização do carrinho
    renderCart();
}


// Função que renderiza o carrinho
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = ''; // Limpa os itens do carrinho

    let total = 0; // Inicializa o total

    // Verifica se há itens no carrinho
    if (cart.length === 0) {
        cartItems.innerHTML = "<li>Seu carrinho está vazio.</li>";
    }

    // Renderiza os itens no carrinho e soma os valores
    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)} 
            (Quantidade: ${item.quantity})
            <button data-id="${item.id}" class="remove-from-cart-btn btn btn-danger btn-sm">Remover</button>
        `;
        cartItems.appendChild(listItem);
        total += item.price * item.quantity; // Soma o valor ao total
    });

    // Exibe o total no carrinho
    const totalElement = document.getElementById('cart-total');
    totalElement.textContent = `Total: R$ ${total.toFixed(2)}`; // Atualiza o total no HTML

    // Habilita os botões de limpeza e finalização
    document.getElementById('clear-cart').disabled = cart.length === 0;
    document.getElementById('finalize-cart').disabled = cart.length === 0;
}

// Função para remover item do carrinho
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);  // Remove o item do carrinho
        renderCart();  // Atualiza a exibição do carrinho
    }
}

// Função para finalizar o pedido
function finalizeOrder() {
    alert("Pedido finalizado! Agradecemos a sua compra.");
    checkout(cart);
    cart = [];  // Limpa o carrinho após finalização
    renderCart();  // Atualiza a exibição do carrinho
    
}

// Função para limpar o carrinho
function clearCart() {
    cart = [];  // Limpa o carrinho
    renderCart();  // Atualiza a exibição do carrinho
}

// Inicializa eventos de adicionar ao carrinho
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart-btn')) {
        const productCard = event.target.closest('.product-card');
        const productId = event.target.dataset.id;
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('R$ ', ''));
        const quantity = parseInt(productCard.querySelector('.quantity-input').value);

        if (quantity > 0) {
            addToCart(productId, quantity, productName, productPrice);
        } else {
            alert("A quantidade precisa ser maior que zero.");
        }
    }

    // Remover produto do carrinho
    if (event.target.classList.contains('remove-from-cart-btn')) {
        const productId = event.target.dataset.id;
        removeFromCart(productId);
    }
});


function initializeCarousel(products) {
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentPosition = 0;
    const itemsPerView = 3;

    // Renderiza os produtos
    carousel.innerHTML = ''; // Limpa o carrossel antes de renderizar
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">R$ ${product.price}</p>
            <input type="number" class="quantity-input" min="1" value="1">
            <button data-id="${product.id}" class="add-to-cart-btn">Adicionar ao Carrinho</button>
        `;
        carousel.appendChild(productCard);
    });

    const updateCarouselView = () => {
        const startIndex = currentPosition * itemsPerView;
        const endIndex = startIndex + itemsPerView;
        const cards = Array.from(carousel.children);

        cards.forEach((card, index) => {
            card.style.display = index >= startIndex && index < endIndex ? 'block' : 'none';
        });
    };

    // Atualiza a visualização inicial
    updateCarouselView();

    // Botões de navegação
    prevBtn.addEventListener('click', () => {
        currentPosition = Math.max(currentPosition - 1, 0);
        updateCarouselView();
    });

    nextBtn.addEventListener('click', () => {
        const maxPosition = Math.ceil(products.length / itemsPerView) - 1;
        currentPosition = Math.min(currentPosition + 1, maxPosition);
        updateCarouselView();
    });
}

function perfumariaFeminina(products) {
    const container = document.querySelector('.perfumaria-feminina .container'); // Selecione o container da seção de perfumaria feminina
    
    // Limpa qualquer conteúdo anterior dentro do container
    container.innerHTML = ''; 

    // Adiciona as classes "row", "g-3" (gap entre colunas), e "justify-content-center" para centralizar
    container.classList.add( 'g-3', 'justify-content-center');

    // Filtra os produtos a partir do 5º (índice 4)
    const filteredProducts = products.slice(0);

    // Adiciona cada produto no container
    filteredProducts.forEach(products => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card col-12 col-sm-6 col-md-4 col-lg-3'; // 4 produtos por linha no tamanho grande
        productCard.innerHTML = `
            <img src="${products.image}" alt="${products.name}" class="img-fluid">
            <h3>${products.name}</h3>
            <p class="price">R$ ${products.price}</p>
            <div class="d-flex align-items-center">
                <input type="number" class="quantity-input form-control" min="1" value="1">
                <button data-id="${products.id}" class="add-to-cart-btn btn btn-primary ms-2 ">Adicionar</button>
            </div>
        `;
        container.appendChild(productCard); // Adiciona o card do produto ao container
    });
}

function perfumariaMasculina(products) {
    const container = document.querySelector('.perfumaria-masculina .container'); // Selecione o container da seção de perfumaria feminina
    
    // Limpa qualquer conteúdo anterior dentro do container
    container.innerHTML = ''; 

    // Adiciona as classes "row", "g-3" (gap entre colunas), e "justify-content-center" para centralizar
    container.classList.add( 'g-3', 'justify-content-center');

    // Filtra os produtos a partir do 5º (índice 4)
    const filteredProducts = products.slice(0);

    // Adiciona cada produto no container
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card col-12 col-sm-6 col-md-4 col-lg-3'; // 4 produtos por linha no tamanho grande
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="img-fluid">
            <h3>${product.name}</h3>
            <p class="price">R$ ${product.price}</p>
            <div class="d-flex align-items-center">
                <input type="number" class="quantity-input form-control" min="1" value="1">
                <button data-id="${product.id}" class="add-to-cart-btn btn btn-primary ms-2">Adicionar</button>
            </div>
        `;
        container.appendChild(productCard); // Adiciona o card do produto ao container
    });
}


function  secaoMaquiagem(products) {
    const container = document.querySelector('.secaoMaquiagem .container'); // Selecione o container da seção de perfumaria feminina
    
    // Limpa qualquer conteúdo anterior dentro do container
    container.innerHTML = ''; 

    // Adiciona as classes "row", "g-3" (gap entre colunas), e "justify-content-center" para centralizar
    container.classList.add( 'g-3', 'justify-content-center');

    // Filtra os produtos a partir do 5º (índice 4)
    const filteredProducts = products.slice(0);

    // Adiciona cada produto no container
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card col-12 col-sm-6 col-md-4 col-lg-3'; // 4 produtos por linha no tamanho grande
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="img-fluid">
            <h3>${product.name}</h3>
            <p class="price">R$ ${product.price}</p>
            <div class="d-flex align-items-center">
                <input type="number" class="quantity-input form-control" min="1" value="1">
                <button data-id="${product.id}" class="add-to-cart-btn btn btn-primary ms-2">Adicionar</button>
            </div>
        `;
        container.appendChild(productCard); // Adiciona o card do produto ao container
    });
}



function saveWhatsAppNumber() {
    whatsappNumber = document.getElementById("whatsappNumber").value.trim();
    if (!whatsappNumber) {
      alert("Por favor, insira um número válido.");
      return;
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById("whatsappModal"));
    modal.hide();
  }

function checkout(cart) {
    if (!whatsappNumber) {
      alert("Por favor, configure o número de WhatsApp antes de finalizar o pedido.");
      return;
    }
  
    let message = "Olá, gostaria de fazer um pedido, fiz a seleção pelo site desses itens:%0A";
    cart.forEach((item) => {
      message += `- ${item.name} (x${item.quantity}): R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
    });
  
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `%0ATotal: R$ ${total.toFixed(2)}`;
  
    message += '%0AAguardo seu retorno';

    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(url, "_blank");
  }

document.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchProductsFromGoogleSheets('https://docs.google.com/spreadsheets/d/e/2PACX-1vS2VP2o7HF3OPrFIwMYL3tkT673vZ4gQOUhSn9G8-z0apAhm1r0b07hoF9wZW_U51ct5B-I5LaZ9ySE/pub?gid=0&single=true&output=csv');
    const perfumesFemininos = await fetchProductsFromGoogleSheets('https://docs.google.com/spreadsheets/d/e/2PACX-1vQIaVHo-KqxejaAZxWn7BMol-KKfpLq56Su2tL5UyOFiwjPLMEisWHz--Zgs2O_KVIofJzw0LYuBd3a/pub?output=csv');
    const perfumesMasculinos = await fetchProductsFromGoogleSheets('https://docs.google.com/spreadsheets/d/e/2PACX-1vSSgsdx1GwYzSk_yd_goSGlIdWU3QH1i2JhP4nRpEI-2ivDAu-H-iCiX2RKZ09gEVcQv9SeHa1R01rl/pub?gid=0&single=true&output=csv');
    const maquiagem = await fetchProductsFromGoogleSheets('https://docs.google.com/spreadsheets/d/e/2PACX-1vT3Udb6rBkOYu1EqvXOqyZ4G_vbsNa1mXEsKKlQIu4FLZMhnHKKkOq5Rq8RXa3amh32DBzjNXAC-4v8/pub?output=csv');
    initializeCarousel(products);
    perfumariaFeminina(perfumesFemininos); // Passa os produtos para a função demaisProdutos
    perfumariaMasculina(perfumesMasculinos);
    secaoMaquiagem(maquiagem);
    renderCart();
    verificarStatusLoja();    
    
    const toggleButton = document.getElementById("toggle-cart");
    const cartContainer = document.getElementById("cart-container");
    const cartContent = document.getElementById("cart-content");

    toggleButton.addEventListener("click", () => {
        const isCollapsed = cartContainer.classList.toggle("collapsed");
        toggleButton.innerHTML = isCollapsed
            ? '<i class="bi bi-arrows-collapse"></i>' // Ícone para expandir
            : '<i class="bi bi-arrows-expand"></i>';  // Ícone para colapsar
    });
});




document.getElementById('clear-cart').addEventListener('click', clearCart);
document.getElementById('finalize-cart').addEventListener('click', finalizeOrder);