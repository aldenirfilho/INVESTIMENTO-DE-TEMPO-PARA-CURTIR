/* Compartilhamento iniciado pelo visitante; somente URLs públicas do projeto. */
(function () {
  'use strict';

  document.querySelectorAll('[data-social-share]').forEach((section) => {
    const url = section.dataset.shareUrl;
    const title = section.dataset.shareTitle;
    const status = section.querySelector('[data-share-status]');
    const fallback = section.querySelector('[data-share-fallback]');
    const field = section.querySelector('[data-share-link]');
    const copy = section.querySelector('[data-share-copy]');
    const nativeShare = section.querySelector('[data-share-native]');
    if (!url || !status || !fallback || !field || !copy || !nativeShare) return;

    const showLink = (message) => {
      fallback.hidden = false;
      status.textContent = message;
      field.focus();
      field.select();
    };

    copy.hidden = false;
    copy.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
          showLink('Copie o endereço abaixo e abra o Instagram para compartilhar.');
          return;
        }
        await navigator.clipboard.writeText(url);
        fallback.hidden = true;
        status.textContent = 'Link copiado. Abra o Instagram para compartilhar.';
      } catch (_) {
        showLink('A cópia automática não está disponível. Selecione e copie o link abaixo.');
      }
    });

    if (typeof navigator.share === 'function') {
      nativeShare.hidden = false;
      nativeShare.addEventListener('click', async () => {
        try {
          await navigator.share({ title, text: 'Emoção com consciência. Amor com respeito.', url });
          status.textContent = 'Menu de compartilhamento concluído.';
        } catch (error) {
          if (error && error.name === 'AbortError') return;
          showLink('Escolha uma rede acima ou copie o link para compartilhar.');
        }
      });
    }
  });
}());
