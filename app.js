document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive Header Scroll effect (Transparent to Semi-opaque)
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initially on load
  }

  // 2. Smooth Scroll for Navigation Links
  const navLinks = document.querySelectorAll('.nav-links a, .footer-links a, a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Adjust for fixed header
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 3. Intersection Observer for Scroll Animations
  const animatableElements = document.querySelectorAll('.model-card, .shop-card, .sns-card, .contact-form');
  const animationOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, animationOptions);

  animatableElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });

  // 4. Custom Coming Soon Toast for Unactive Talents
  const comingSoonButtons = document.querySelectorAll('.coming-soon');
  
  const createToast = (message) => {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      Object.assign(toastContainer.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: '9999',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      });
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    Object.assign(toast.style, {
      background: 'rgba(18, 18, 20, 0.95)',
      color: '#fff',
      borderLeft: '3px solid #c5a880',
      padding: '16px 24px',
      borderRadius: '2px',
      fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
      fontSize: '0.8rem',
      letterSpacing: '0.5px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(10px)',
      opacity: '0',
      transform: 'translateX(50px)',
      transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    });

    toast.innerHTML = `<i class="fa-regular fa-bell" style="color: #c5a880;"></i> ${message}`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px) scale(0.9)';
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 3500);
  };

  comingSoonButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      createToast('現在、新規モデルの追加およびコンテンツの公開を準備中です。公式発表をお待ちください。');
    });
  });

  // 5. File Upload Input - Dynamic Name Update
  const fileInput = document.getElementById('contact-file');
  const fileNameText = document.getElementById('file-name');
  
  if (fileInput && fileNameText) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        fileNameText.textContent = e.target.files[0].name;
        fileNameText.style.color = '#fff';
      } else {
        fileNameText.textContent = 'ファイルが選択されていません';
        fileNameText.style.color = 'var(--color-text-sub)';
      }
    });
  }

  // 6. Contact Form Submission Logic (Generates mailto prefilled link)
  const contactForm = document.getElementById('inquiry-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const requestType = formData.get('request_type');
      const name = formData.get('name');
      const company = formData.get('company') || '（個人様または無記入）';
      const email = formData.get('email');
      const tel = formData.get('tel');
      const message = formData.get('message') || 'なし';

      const emailAddress = 'namelessgirls.contact@gmail.com';
      const subject = `[出演依頼/問合せ] ${company} ${name}様より`;
      
      const body = `NamelessGirls 担当者様

以下の内容でお問い合わせがありました。

--------------------------------------------------
【ご用件】 ${requestType}
【お名前】 ${name} 様
【会社名】 ${company}
【Eメール】 ${email}
【電話番号】 ${tel}
--------------------------------------------------

【メッセージ内容】
${message}

--------------------------------------------------
※ 添付ファイルを選択された場合は、お使い of メーラー起動後に該当ファイルを添付して送信してください。`;

      // Prefill Mailto Link
      const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Trigger Mailer Client
      window.location.href = mailtoUrl;
      
      createToast('メーラーを起動しました。メールを送信してください。');
      contactForm.reset();
      if (fileNameText) fileNameText.textContent = 'ファイルが選択されていません';
    });
  }
});
