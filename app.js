// Lấy dữ liệu sản phẩm từ products.js (editable)
const productsData = window.PRODUCTS_DATA || [];

function getTypeColor(type) {
	// Tùy chỉnh màu tại đây (Tailwind classes)
	switch (type) {
		case 'Bán Tài khoản':
			return 'bg-blue-500/20 text-blue-500';          // màu xanh dương
		case 'Dịch vụ Nâng cấp':
			return 'bg-indigo-500/20 text-indigo-300';      // màu indigo
		case 'Tài khoản Cao cấp':
			return 'bg-amber-400/20 text-amber-400';        // màu amber (vàng/đồng)
		default:
			return 'bg-primary-accent/20 text-primary-accent'; // fallback
	}
}

// Render sản phẩm
function renderProductCards() {
	const catalogContainer = document.getElementById('product-catalog');
	const loadingMessage = document.getElementById('loading-message');
	if (loadingMessage) loadingMessage.remove();

	const cardsHtml = productsData.map(product => {
		// SỬA: dùng hàm getTypeColor để gán màu dựa trên type
		const typeColor = getTypeColor(product.type);
		const detailsButton = `
			<button data-product-id="${product.id}" class="details-btn w-full inline-flex justify-center items-center px-4 py-2 rounded-full shadow-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 mt-4">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
				Thông tin chi tiết
			</button>
		`;
		return `
			<!-- Thẻ Sản phẩm ${product.id} -->
			<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
				<div class="p-6 sm:p-8 flex flex-col h-full">
					<!-- Nhãn Loại -->
					<div class="mb-4">
						<span class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${typeColor}">
							${product.type}
						</span>
					</div>

					<!-- Tiêu đề Sản phẩm -->
					<h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						${product.name}
					</h4>

					<!-- Giá Sản phẩm -->
					<p class="text-4xl font-extrabold text-primary-accent my-4">
						${product.price}
					</p>

					<!-- Mô tả Sản phẩm -->
					<p class="text-gray-600 dark:text-gray-400 mb-6 text-sm">
						${product.description}
					</p>

					<!-- Nút Chi tiết và Mua hàng -->
					<div class="mt-auto">
						${detailsButton}
						<a href="${product.link}" target="_blank" class="w-full inline-flex justify-center items-center px-6 py-3 mt-2 rounded-full text-gray-900 bg-primary-accent hover:bg-emerald-400">
							Mua hàng / Liên hệ ngay
						</a>
					</div>
				</div>
			</div>
		`;
	}).join('');
	catalogContainer.innerHTML = cardsHtml;
}

// Theme toggle (sử dụng getInitialTheme() trong index.html)
function setupThemeToggle() {
	const themeToggleBtn = document.getElementById('theme-toggle');
	if (!themeToggleBtn) return;
	const darkIcon = document.getElementById('theme-toggle-dark-icon');
	const lightIcon = document.getElementById('theme-toggle-light-icon');
	if (!darkIcon || !lightIcon) return;
	function updateIcons(isDark) {
		if (isDark) { darkIcon.classList.add('hidden'); lightIcon.classList.remove('hidden'); }
		else { darkIcon.classList.remove('hidden'); lightIcon.classList.add('hidden'); }
	}
	updateIcons(getInitialTheme() === 'dark');
	themeToggleBtn.addEventListener('click', () => {
		const isDark = document.documentElement.classList.toggle('dark');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
		updateIcons(isDark);
	});
}

function setupProductModals() {
	const modal = document.getElementById('product-modal');
	if (!modal) return;
	const modalTitle = document.getElementById('modal-title');
	const modalPrice = document.getElementById('modal-price');
	const modalDetails = document.getElementById('modal-details');
	const closeBtn = document.getElementById('modal-close-btn');
	const closeBtnFooter = document.getElementById('modal-close-btn-footer');
	const catalogContainer = document.getElementById('product-catalog');

	function openModal(product) {
		modalTitle.textContent = product.name;
		modalPrice.textContent = product.price;
		modalDetails.textContent = product.details;
		modal.classList.remove('hidden');
	}
	function closeModal() { modal.classList.add('hidden'); }
	closeBtn?.addEventListener('click', closeModal);
	closeBtnFooter?.addEventListener('click', closeModal);
	modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

	catalogContainer.addEventListener('click', (e) => {
		const detailsButton = e.target.closest('.details-btn');
		if (detailsButton) {
			const productId = detailsButton.dataset.productId;
			const product = productsData.find(p => p.id == productId);
			if (product) openModal(product);
		}
	});
}

function setupAiChatbot() {
	const toggleBtn = document.getElementById('ai-chat-toggle');
	const modal = document.getElementById('ai-chat-modal');
	const closeBtn = document.getElementById('ai-chat-close-btn');
	const chatForm = document.getElementById('ai-chat-form');
	const chatInput = document.getElementById('ai-chat-input');
	const chatMessages = document.getElementById('ai-chat-messages');
	if (!toggleBtn || !modal || !closeBtn || !chatForm || !chatInput || !chatMessages) return;
	toggleBtn.addEventListener('click', () => modal.classList.toggle('hidden'));
	closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

	function addMessageToChat(sender, message, isTyping = false) {
		const messageEl = document.createElement('div');
		messageEl.classList.add('chat-message', sender);
		if (isTyping) {
			messageEl.classList.add('typing');
			messageEl.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
			messageEl.id = 'typing-indicator';
		} else {
			let formatted = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
			messageEl.innerHTML = formatted;
		}
		chatMessages.appendChild(messageEl);
		chatMessages.scrollTop = chatMessages.scrollHeight;
	}

	chatForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const userMessage = chatInput.value.trim();
		if (userMessage) {
			addMessageToChat('user', userMessage);
			chatInput.value = '';
			// Placeholder: hiện thông báo tạm thời (API gọi ở products môi trường)
			addMessageToChat('ai', 'Hiện tại trợ lý tạm thời sử dụng phản hồi mẫu. Liên hệ trực tiếp để mua hàng.');
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
	setupThemeToggle();
	renderProductCards();
	setupProductModals();
	setupAiChatbot();
	// ẩn preloader
	const preloader = document.getElementById('preloader');
	if (preloader) {
		preloader.style.opacity = '0';
		preloader.style.pointerEvents = 'none';
		setTimeout(() => preloader.style.display = 'none', 500);
	}
});