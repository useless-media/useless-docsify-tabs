(() => {
  window.$docsify.plugins = [].concat((hook) => {
    const includes = (str, value) => str.indexOf(value) > -1;
    const sanitize = str => str.replace(' :useless-tab', '').trim();

    const buildTab = (item, index, containerId, itemId, titleHTML, container, insertBefore) => {
      const input = document.createElement('input');
      input.id = itemId;
      input.type = 'radio';
      input.setAttribute('name', containerId);
      input.classList.add('useless-tab');
      input.innerHTML = titleHTML;
      input.checked = index === 0;

      const label = document.createElement('label');
      label.setAttribute('for', itemId);
      label.innerHTML = titleHTML;

      container.insertBefore(input, insertBefore);
      container.insertBefore(label, insertBefore);

      item.classList.add('useless-tab-content');
      item.removeChild(item.firstChild);
    };

    hook.doneEach(function () {
      let containerIndex = -1;

      document
        .querySelectorAll('.useless-tab-container')
        .forEach(container => {
          const containerId = `useless-tab-container-${++containerIndex}`;
          const items = container.querySelectorAll('li');

          items.forEach((item, index) => {
            const list = item.parentElement;
            const titleHtml = sanitize(item.firstChild.innerHTML);
            const titleText = sanitize(item.firstChild.innerText);
            const itemId = `${containerId}-${titleText}`;

            buildTab(item, index, containerId, itemId, titleHtml, container, list);
          });
        });

      let itemIndex = -1;
      let insertBefore;
      document
        .querySelectorAll('li')
        .forEach((item) => {
          if (
            !item.firstChild ||
            !item.firstChild.innerHTML ||
            !item.firstChild.innerText ||
            item.parentElement.parentElement.classList.contains('useless-tab-container')
          ) return;

          const titleHtml = sanitize(item.firstChild.innerHTML);
          const text = item.firstChild.innerText;
          if (!includes(text, ':useless-tab')) return;

          const list = item.parentElement;
          const block = list;
          block.classList.add('useless-tab-container');
          let containerId = block.dataset.blockId;
          if (!containerId) {
            containerId = block.dataset.blockId = `useless-tab-container-${++containerIndex}`;
            itemIndex = -1;
            insertBefore = item;
          }
          const titleText = sanitize(text);
          const itemId = `${containerId}-${titleText}`;

          buildTab(item, ++itemIndex, containerId, itemId, titleHtml, block, insertBefore);
        });
    });
  }, $docsify.plugins);
})();