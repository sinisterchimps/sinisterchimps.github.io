document.addEventListener('DOMContentLoaded', () => {
  console.log('emailsettings.js loaded');

  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  const openContactForm = document.getElementById('openContactForm');
  const openContactLink = document.getElementById('openContactLink');
  const closeContactForm = document.getElementById('closeContactForm');
  const cancelContactForm = document.getElementById('cancelContactForm');
  const contactModal = document.getElementById('contactModal');
  const contactForm = document.getElementById('contactForm');
  const attachmentInput = document.getElementById('attachmentInput');
  const attachmentList = document.getElementById('attachmentList');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      siteNav.classList.toggle('active');
    });
  }

  const scriptWarning = document.getElementById('scriptWarning');
  if (scriptWarning) {
    scriptWarning.classList.add('hidden');
  }

  if (!openContactForm) {
    console.warn('openContactForm button was not found');
  }
  if (!contactModal) {
    console.warn('contactModal overlay was not found');
  }
  if (!contactForm) {
    console.warn('contactForm element was not found');
  }

  if (openContactForm && contactModal && contactForm && attachmentInput && attachmentList) {
    const showModal = () => {
      contactModal.classList.add('active');
      contactModal.setAttribute('aria-hidden', 'false');
    };

    const hideModal = () => {
      contactModal.classList.remove('active');
      contactModal.setAttribute('aria-hidden', 'true');
    };

    openContactForm.addEventListener('click', showModal);
    if (openContactLink) {
      openContactLink.addEventListener('click', (event) => {
        event.preventDefault();
        showModal();
      });
    }
    closeContactForm.addEventListener('click', hideModal);
    cancelContactForm.addEventListener('click', hideModal);
    contactModal.addEventListener('click', (event) => {
      if (event.target === contactModal) {
        hideModal();
      }
    });

    attachmentInput.addEventListener('change', () => {
      const files = Array.from(attachmentInput.files || []);
      if (!files.length) {
        attachmentList.textContent = 'No files selected.';
        return;
      }
      attachmentList.textContent = `Selected files: ${files.map((file) => file.name).join(', ')}`;
    });

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('messageSubject').value.trim();
      const body = document.getElementById('messageBody').value.trim();
      const files = Array.from(attachmentInput.files || []);

      let attachmentText = '';

      if (files.length) {
        const imageFile = files.find((file) => file.type.startsWith('image/'));

        if (imageFile && navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ [imageFile.type]: imageFile })
            ]);
            attachmentText = `\n\nImage copied: ${imageFile.name}. Paste it into the Gmail message.`;
          } catch (error) {
            console.warn('Unable to copy the image to the clipboard', error);
            attachmentText = `\n\nImage selected: ${imageFile.name}. Please attach it manually in Gmail.`;
          }
        } else {
          attachmentText = `\n\nFiles selected: ${files.map((file) => file.name).join(', ')}. Please attach them manually in Gmail.`;
        }
      }

      const emailBody = `Name: ${name}\nEmail: ${email}\n\n${body}${attachmentText}`;
      const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        'sinisterchimpsstudios@gmail.com'
      )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

      window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
      hideModal();
    });
  }
});
