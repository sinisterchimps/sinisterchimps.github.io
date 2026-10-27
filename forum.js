document.addEventListener('DOMContentLoaded', () => {
  const fandomForm = document.getElementById('fandomForm');
  const fandomPosts = document.getElementById('fandomPosts');
  const fandomStorageKey = 'sinister-chimps-fandom-posts';
  const moderationWords = [
    "fuck", "bitch", "shit", "asshole", "cunt", "dick", "pussy", "ass", "faggot", "retard", "retarded", "fck", "fuk", "btch", "bastard", "dih", "bit ch" ,"nigger", "nigga"
    // Add blocked words or phrases between the quotes.
  ];

  const findModerationMatch = (values) => {
    const normalizedValues = values.map((value) => value.toLocaleLowerCase());
    return moderationWords
      .map((word) => word.trim())
      .filter(Boolean)
      .find((word) => {
        const normalizedWord = word.toLocaleLowerCase();
        return normalizedValues.some((value) => value.includes(normalizedWord));
      });
  };

  const loadFandomPosts = () => {
    try {
      const stored = localStorage.getItem(fandomStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Unable to load fandom posts', error);
      return [];
    }
  };

  const saveFandomPosts = (posts) => {
    try {
      localStorage.setItem(fandomStorageKey, JSON.stringify(posts));
    } catch (error) {
      console.warn('Unable to save fandom posts', error);
    }
  };

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const renderFandomPosts = (posts) => {
    if (!fandomPosts) {
      return;
    }

    fandomPosts.innerHTML = '';

    if (!posts.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No posts yet. Be the first to share something about our games.';
      fandomPosts.appendChild(empty);
      return;
    }

    posts.forEach((post) => {
      const article = document.createElement('article');
      article.className = 'fandom-post';

      const title = document.createElement('h3');
      title.textContent = post.name || 'Anonymous';

      const time = document.createElement('p');
      time.textContent = new Date(post.createdAt).toLocaleString();

      const message = document.createElement('p');
      message.textContent = post.message;

      article.appendChild(title);
      article.appendChild(time);
      article.appendChild(message);

      if (post.linkUrl) {
        const link = document.createElement('a');
        link.href = post.linkUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Open link';
        article.appendChild(link);
      }

      if (post.imageDataUrl) {
        const image = document.createElement('img');
        image.src = post.imageDataUrl;
        image.alt = `${post.name || 'A fan'} shared an image`;
        image.loading = 'lazy';
        article.appendChild(image);
      }

      fandomPosts.appendChild(article);
    });
  };

  if (fandomForm && fandomPosts) {
    let fandomPostsList = loadFandomPosts();
    renderFandomPosts(fandomPostsList);

    fandomForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = document.getElementById('fandomName').value.trim();
      const linkUrl = document.getElementById('fandomLink').value.trim();
      const imageInput = document.getElementById('fandomImage');
      const message = document.getElementById('fandomMessage').value.trim();

      if (!name || !message) {
        return;
      }

      const moderationMatch = findModerationMatch([name, message]);

      if (moderationMatch) {
        window.alert(`Your post contains a blocked word or phrase: "${moderationMatch}".`);
        return;
      }

      let imageDataUrl = '';
      const imageFile = imageInput.files && imageInput.files[0];

      if (imageFile) {
        try {
          imageDataUrl = await fileToDataUrl(imageFile);
        } catch (error) {
          console.warn('Unable to read uploaded image', error);
        }
      }

      fandomPostsList = [{
        id: Date.now(),
        name,
        linkUrl,
        imageDataUrl,
        message,
        createdAt: new Date().toISOString()
      }, ...fandomPostsList];

      saveFandomPosts(fandomPostsList);
      renderFandomPosts(fandomPostsList);
      fandomForm.reset();
    });
  }
});
