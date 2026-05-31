// ════════════════════════════════════════════════════════════
// FLOW - Professional Software Engineering Architecture
// ════════════════════════════════════════════════════════════

// --- 1. DOMAIN LAYER (Entities & Business Logic) ---
class DiscountCalculator {
  static calculate(subtotal, discount) {
    if (!discount) return 0;
    if (discount.type === 'percent') return Math.round(subtotal * discount.val);
    if (discount.type === 'fixed') return (subtotal >= (discount.min || 0)) ? discount.val : 0;
    return 0;
  }
}

// --- 2. INFRASTRUCTURE LAYER (Data Persistence) ---
class CartRepository {
  static STORAGE_KEY = 'kimiflow_cart';

  static getCart() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load cart:', e);
      return [];
    }
  }

  static saveCart(cart) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
  }
}

// --- 3. APPLICATION LAYER (Use Cases / Service) ---
class CartService {
  constructor() {
    this.cart = CartRepository.getCart();
    this.activeDiscount = null;
    this.COUPONS = {
      'FLOW20': { type: 'percent', val: 0.2, label: 'خصم 20%' },
      'FLOW15': { type: 'percent', val: 0.15, label: 'خصم 15% مميز' },
      'WELCOME': { type: 'fixed', val: 100, min: 500, label: 'خصم 100 ج' }
    };
  }

  addItem(product, size, qty, colorName) {
    const selectedColor = product.colors.find(c => c.name === colorName) || product.colors[0];
    const existing = this.cart.find(i => i.id === product.id && i.size === size && i.color === selectedColor.name);

    if (existing) {
      existing.qty += qty;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        size,
        color: selectedColor.name,
        image: selectedColor.images && selectedColor.images.length ? selectedColor.images[0] : (selectedColor.image || ''),
        qty,
        category: product.category
      });
    }
    this.persist();
  }

  updateItemQty(id, size, color, delta) {
    const item = this.cart.find(i => String(i.id) === String(id) && i.size === size && i.color === color);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) this.removeItem(id, size, color);
      else this.persist();
    }
  }

  removeItem(id, size, color) {
    this.cart = this.cart.filter(i => !(String(i.id) === String(id) && i.size === size && i.color === color));
    this.persist();
  }

  applyCoupon(code) {
    const coupon = this.COUPONS[code.toUpperCase()];
    if (coupon) {
      this.activeDiscount = coupon;
      return { success: true, label: coupon.label };
    }
    return { success: false, message: 'كود غير صحيح' };
  }

  getTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discount = DiscountCalculator.calculate(subtotal, this.activeDiscount);
    return {
      subtotal,
      discount,
      total: Math.max(0, subtotal - discount),
      count: this.cart.reduce((sum, item) => sum + item.qty, 0)
    };
  }

  persist() {
    CartRepository.saveCart(this.cart);
    UIController.updateAll();
  }
}

// --- 4. PRESENTATION LAYER (UI Controller) ---
const cartService = new CartService();

class UIController {
  static updateAll() {
    const totals = cartService.getTotals();

    // Update Badges
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = totals.count;

    // Update Totals in Drawer
    const subTEl = document.getElementById('cart-subtotal');
    const discRow = document.getElementById('cart-discount-row');
    const totalEl = document.getElementById('cart-total');

    if (subTEl) subTEl.textContent = totals.subtotal + ' ج';
    if (totalEl) totalEl.textContent = totals.total + ' ج';

    if (discRow) {
      if (totals.discount > 0) {
        discRow.style.display = 'flex';
        discRow.querySelector('.discount-val').textContent = `- ${totals.discount} ج`;
      } else {
        discRow.style.display = 'none';
      }
    }

    // Toggle Footer & Coupon Area
    const footer = document.getElementById('cart-footer');
    const couponArea = document.getElementById('coupon-area');
    const showDrawerItems = cartService.cart.length > 0;

    if (footer) footer.style.display = showDrawerItems ? 'block' : 'none';
    if (couponArea) couponArea.style.display = showDrawerItems ? 'block' : 'none';

    this.renderItems();
  }

  static renderItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cartService.cart.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:4rem 1rem;color:var(--text-muted)">
          <div style="font-size:3.5rem;margin-bottom:1.5rem;opacity:0.3">🛍️</div>
          <div style="font-weight:600;font-size:1.1rem">سلتك فارغة</div>
          <p style="font-size:0.875rem;margin-top:0.5rem">ابدأ باكتشاف أرقى المجموعات الآن</p>
        </div>
      `;
      return;
    }

    container.innerHTML = cartService.cart.map(i => `
      <div class="cart-item-row anim-fade-up">
        <div class="cart-item-img">
          <img src="${i.image}" alt="${i.name}" onerror="this.src='https://dummyimage.com/100x120/111/eee&text=FLOW'">
        </div>
        <div class="cart-item-info">
          <div>
            <div class="cart-item-name">${i.name}</div>
            <div class="cart-item-meta">${i.color} | ${i.size}</div>
          </div>
          <div class="cart-item-price">${i.price} ج</div>
          <div class="qty-control">
            <button class="qty-btn" onclick="window.updateQty('${i.id}', '${i.size}', '${i.color}', -1)">−</button>
            <span class="qty-num">${i.qty}</span>
            <button class="qty-btn" onclick="window.updateQty('${i.id}', '${i.size}', '${i.color}', 1)">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="window.removeFromCart('${i.id}', '${i.size}', '${i.color}')" title="حذف">
          <i class="fa-solid fa-trash-can" style="font-size:0.8rem"></i>
        </button>
      </div>
    `).join('');
  }
  static showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }
}

// --- 5. GLOBAL ADAPTERS (Exposing Functions to Window) ---
window.updateCardImage = (id, imageUrl, colorName, el, isSection = false, prefix = null) => {
  let containerId = isSection ? `section-product-${id}` : `product-${id}`;
  if (prefix === 'shop') containerId = `shop-product-${id}`;
  
  const container = document.getElementById(containerId);

  if (container) {
    // Update main image
    const img = container.querySelector('.main-card-img');
    if (img) img.src = imageUrl;
    
    // Update swatch visual state
    container.querySelectorAll('.color-opt').forEach(opt => opt.classList.remove('active'));
    el.classList.add('active');
    
    // Optional: Update the Add to Cart button to use the new color
    const cartBtn = container.querySelector('.overlay-btn, .btn-outline-gold');
    if (cartBtn) {
      cartBtn.setAttribute('onclick', `event.stopPropagation(); window.addToCartById(${id}, 'M', 1, '${colorName}')`);
    }
  }
};

window.addToCartById = (id, size = 'M', qty = 1, colorName = null) => {
  const p = (typeof PRODUCTS_DATA !== 'undefined') ? PRODUCTS_DATA.find(x => x.id === Number(id)) : null;
  if (p) {
    cartService.addItem(p, size, qty, colorName);
    UIController.showToast('✅ تمت الإضافة للسلة');
    UIController.updateAll();
    window.openCart();
  }
};

window.updateQty = (id, size, color, delta) => cartService.updateItemQty(id, size, color, delta);
window.removeFromCart = (id, size, color) => cartService.removeItem(id, size, color);

window.applyCoupon = () => {
  const input = document.getElementById('coupon-input');
  const res = cartService.applyCoupon(input.value);
  if (res.success) {
    UIController.showToast(`✅ تم تطبيق ${res.label}`);
    UIController.updateAll();
  } else {
    UIController.showToast(`❌ ${res.message}`, 'error');
  }
};

window.openCart = () => {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeCart = () => {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
};

// --- Mobile Menu Logic ---
window.toggleMobileMenu = () => {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  }
};

window.closeMobileMenu = () => {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// --- 6. AUTHENTICATION LAYER (Supabase Integration) ---

const SUPABASE_URL = 'https://enhsyajammedrdaedrtm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuaHN5YWphbW1lZHJkYWVkcnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNDMzMzYsImV4cCI6MjA5NDcxOTMzNn0.Mu8pWODLxe0FIFxzBXV9gf54cCadZEYF3_acDacyawQ';

let supabaseClient = null;
if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else if (typeof window.supabase !== 'undefined') {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

class AuthService {
  static async register(email, password, fullName) {
    if (!supabaseClient) return { error: 'Supabase client error' };
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    return { data, error };
  }

  static async login(email, password) {
    if (!supabaseClient) return { error: 'Supabase client error' };
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  static async logout() {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
  }

  static async getSession() {
    if (!supabaseClient) return null;
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
  }
}

class StorageService {
  static async uploadImage(dataUrl, path) {
    if (!supabaseClient) return null;
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const { data, error } = await supabaseClient.storage.from('designs').upload(path, blob, {
        cacheControl: '3600', upsert: true, contentType: 'image/webp'
      });
      if (error) throw error;
      const { data: { publicUrl } } = supabaseClient.storage.from('designs').getPublicUrl(path);
      return publicUrl;
    } catch (err) {
      console.error("Storage upload exception:", err);
      return null;
    }
  }
}

window.openAuthModal = () => {
  document.getElementById('auth-drawer')?.classList.add('open');
  document.getElementById('auth-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeAuthModal = () => {
  document.getElementById('auth-drawer')?.classList.remove('open');
  document.getElementById('auth-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
};

window.switchAuth = (mode) => {
  const loginForm = document.getElementById('login-form'), regForm = document.getElementById('register-form'), title = document.getElementById('auth-title');
  if (mode === 'register') {
    loginForm.style.display = 'none'; regForm.style.display = 'block'; title.textContent = 'إنشاء حساب جديد';
  } else {
    loginForm.style.display = 'block'; regForm.style.display = 'none'; title.textContent = 'تسجيل الدخول';
  }
};

window.handleLogin = async () => {
  const email = document.getElementById('login-email').value, pass = document.getElementById('login-password').value;
  if (!email || !pass) return UIController.showToast('أدخل البيانات المطلوبة', 'error');
  UIController.showToast('جاري تسجيل الدخول...', 'info');
  const { data, error } = await AuthService.login(email, pass);
  if (error) UIController.showToast(error.message, 'error'); else {
    UIController.showToast('تم تسجيل الدخول بنجاح 🎉'); updateAuthUI(data.session?.user);
  }
};

window.handleRegister = async () => {
  const name = document.getElementById('reg-name').value, email = document.getElementById('reg-email').value, pass = document.getElementById('reg-password').value;
  if (!name || !email || !pass) return UIController.showToast('أدخل البيانات المطلوبة', 'error');
  UIController.showToast('جاري إنشاء الحساب...', 'info');
  const { data, error } = await AuthService.register(email, pass, name);
  if (error) UIController.showToast(error.message, 'error'); else {
    UIController.showToast('تم التسجيل! تحقق من بريدك الإلكتروني', 'success'); window.switchAuth('login');
  }
};

window.handleLogout = async () => { await AuthService.logout(); UIController.showToast('تم تسجيل الخروج'); updateAuthUI(null); };

function updateAuthUI(user) {
  const loginForm = document.getElementById('login-form'), regForm = document.getElementById('register-form'), profileState = document.getElementById('profile-state'), title = document.getElementById('auth-title');
  if (user) {
    loginForm.style.display = 'none'; regForm.style.display = 'none'; profileState.style.display = 'block'; title.textContent = 'حسابي';
    document.getElementById('user-display-name').textContent = `مرحباً، ${user.user_metadata?.full_name || 'عميلنا'}`;
    document.getElementById('user-display-email').textContent = user.email;
  } else {
    profileState.style.display = 'none'; window.switchAuth('login');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const hub = document.getElementById('hamburger');
  if (hub) hub.onclick = window.toggleMobileMenu;

  UIController.updateAll();
  
  // Initialize Swiper Hero
  if (document.querySelector('.hero-swiper')) {
    new Swiper('.hero-swiper', {
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.hero-swiper-next', prevEl: '.hero-swiper-prev' },
      effect: 'fade',
      fadeEffect: { crossFade: true }
    });
  }

  const session = await AuthService.getSession();

  if (session) updateAuthUI(session.user);
  supabaseClient?.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') updateAuthUI(session.user);
    if (event === 'SIGNED_OUT') updateAuthUI(null);
  });
});
