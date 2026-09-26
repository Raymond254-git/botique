const inventory = [
  { name: 'Silk Statement Set', category: 'Accessories', stock: 12, threshold: 15 },
  { name: 'Velvet Evening Dress', category: 'Dresses', stock: 6, threshold: 10 },
  { name: 'Leather Tote', category: 'Bags', stock: 18, threshold: 12 },
  { name: 'Classic Blazer', category: 'Apparel', stock: 9, threshold: 8 },
  { name: 'Pearl Earrings', category: 'Jewelry', stock: 20, threshold: 15 }
];

function getStatus(stock, threshold) {
  if (stock <= threshold) return { label: 'Low', className: 'low' };
  if (stock <= threshold + 8) return { label: 'Medium', className: 'medium' };
  return { label: 'High', className: 'high' };
}

function renderInventory() {
  const tbody = document.getElementById('inventory-table-body');

  tbody.innerHTML = inventory
    .map((item) => {
      const status = getStatus(item.stock, item.threshold);
      const fillWidth = Math.min((item.stock / 25) * 100, 100);

      return `
        <tr>
          <td class="item-name">${item.name}</td>
          <td>${item.category}</td>
          <td>
            <div class="stock-box">
              <strong>${item.stock} units</strong>
              <div class="stock-bar">
                <div class="stock-fill" style="width: ${fillWidth}%"></div>
              </div>
            </div>
          </td>
          <td>
            <span class="status-badge ${status.className}">${status.label}</span>
          </td>
          <td>
            <button class="action-btn" data-name="${item.name}" data-action="restock">Restock</button>
          </td>
        </tr>
      `;
    })
    .join('');

  attachActionHandlers();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function attachActionHandlers() {
  document.querySelectorAll('[data-action="restock"]').forEach((button) => {
    button.addEventListener('click', () => {
      const itemName = button.dataset.name;
      const item = inventory.find((entry) => entry.name === itemName);

      if (item) {
        item.stock += 6;
        showToast(`${item.name} has been restocked.`);
        renderInventory();
      }
    });
  });

  document.querySelectorAll('.reserve-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const product = button.dataset.product;
      const item = inventory.find((entry) => entry.name === product);

      if (!item) {
        showToast('Product not found.');
        return;
      }

      if (item.stock <= 0) {
        showToast(`${product} is currently out of stock.`);
        return;
      }

      item.stock -= 1;
      showToast(`${product} reserved successfully.`);
      renderInventory();
    });
  });
}

const contactForm = document.getElementById('contact-form');
const successMessage = document.getElementById('form-success');
const stylingButton = document.querySelector('.cta-btn');

stylingButton.addEventListener('click', () => {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  const nameInput = document.querySelector('input[name="name"]');
  if (nameInput) nameInput.focus();
  showToast('Styling booking opened. Tell us what you are looking for.');
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name');

  successMessage.textContent = `Thank you, ${name}! Your boutique enquiry has been received.`;
  showToast('Enquiry sent successfully.');
  contactForm.reset();
});

renderInventory();
