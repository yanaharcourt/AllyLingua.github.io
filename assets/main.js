/*--------------------------------------------------------------
# CURSOR 
--------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.js-cursor-init');
  const cursorCircle = cursor.querySelector('.cursor-circle');
  const scrollText = cursor.querySelector('.scroll_cursor_txt .text');
  const viewText = cursor.querySelector('.view_more_cursor .text');

  // Function to determine if background is dark or light
  const isDarkBackground = (element) => {
    // Get the background color of the element
    const bgColor = window.getComputedStyle(element).backgroundColor;

    // If no background color or transparent, check parent
    if (!bgColor || bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') {
      if (element.parentElement) {
        return isDarkBackground(element.parentElement);
      }
      return false; // Default to light if we can't determine
    }

    // Parse the RGB values
    const rgb = bgColor.match(/\d+/g);
    if (!rgb || rgb.length < 3) return false;

    // Calculate brightness - higher value means lighter background
    // Formula: (R * 299 + G * 587 + B * 114) / 1000
    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;

    // Consider dark if brightness is less than 128
    return brightness < 128;
  };

  // Update cursor position and style
  document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    // Get element under cursor
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element) return;

    // Reset cursor styles
    cursor.classList.remove('white_cursor', 'dark_cursor', 'active');
    scrollText.style.display = 'none';
    viewText.style.display = 'none';

    // Handle different sections
    const heroSection = element.closest('.hero-section');
    const whyChooseSection = element.closest('.why-choose-section');
    const navElements = element.closest('.left-nav') || element.closest('.right-nav');

    // If cursor is over hero section
    if (heroSection) {
      cursor.classList.add('active', 'white_cursor');
      scrollText.style.display = 'block';
    }
    // If cursor is over why choose section
    else if (whyChooseSection) {
      cursor.classList.add('active', 'dark_cursor');
      scrollText.style.display = 'block';
    }
    // If cursor is over navigation
    else if (navElements) {
      // Navigation elements use white cursor by default
      cursor.classList.add('white_cursor');
    }
    // For other elements, determine by background
    else {
      if (isDarkBackground(element)) {
        cursor.classList.add('white_cursor');
      } else {
        cursor.classList.add('dark_cursor');
      }
    }

    // Special case for accent-word
    if (element.classList.contains('accent-word') || element.closest('.accent-word')) {
      cursor.classList.add('active');
      scrollText.style.display = 'none';
      viewText.style.display = 'block';
    }
  });

  // Cursor click animation
  document.addEventListener('mousedown', () => {
    cursorCircle.style.transform = 'scale(0.9)';
  });

  document.addEventListener('mouseup', () => {
    cursorCircle.style.transform = 'scale(1)';
  });
});

/*--------------------------------------------------------------
# NAVIGATION MENU
--------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', function () {
  const leftNav = document.querySelector('.left-nav');
  const rightNav = document.querySelector('.right-nav');
  const exploreText = document.querySelector('.explore-text');
  const enrolText = document.querySelector('.enrol-text');
  const burgerLines = document.querySelectorAll('.burger-line');
  const arrow = document.querySelector('.arrow');

  // Сохраняем оригинальные обработчики событий для правого меню
  const originalRightNavMouseenter = rightNav.onmouseenter;
  const originalRightNavMouseleave = rightNav.onmouseleave;

  // Флаг для отслеживания наведения на правое меню
  let isRightNavHovered = false;

  // Добавляем новые обработчики событий для правого меню с сохранением оригинальной функциональности
  rightNav.addEventListener('mouseenter', function () {
    isRightNavHovered = true;
    // Стандартное поведение при наведении - всегда меняем на белый
    enrolText.style.color = 'white';
    arrow.style.color = 'white';

    // Вызываем оригинальный обработчик, если он был
    if (typeof originalRightNavMouseenter === 'function') {
      originalRightNavMouseenter.call(this);
    }
  });

  rightNav.addEventListener('mouseleave', function () {
    isRightNavHovered = false;
    // При уходе курсора обновляем цвета в зависимости от фона
    updateMenuColors();
    leftNav.classList.toggle('is-dark', isLeftDark);

    // Вызываем оригинальный обработчик, если он был
    if (typeof originalRightNavMouseleave === 'function') {
      originalRightNavMouseleave.call(this);
    }
  });

  // Функция для определения, является ли секция тёмной
  function isDarkSection(element) {
    if (!element) return false;

    // Проверяем по классам секций
    if (element.classList.contains('benefits-section')) {
      return true; // Секция Benefits всегда тёмная
    }

    if (element.classList.contains('hero-section')) {
      return true; // Hero секция тоже считаем тёмной из-за изображения
    }

    // Проверяем по цвету фона
    const backgroundColor = window.getComputedStyle(element).backgroundColor;
    if (backgroundColor !== 'transparent' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      const rgb = backgroundColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        // Вычисляем яркость
        const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
        return brightness < 128; // Тёмный если яркость < 128
      }
    }

    // Проверяем фоновое изображение
    const backgroundImage = window.getComputedStyle(element).backgroundImage;
    if (backgroundImage && backgroundImage !== 'none') {
      return true; // Предполагаем, что секции с фоновыми изображениями тёмные
    }

    // Проверяем родительский элемент
    if (element.parentElement && element.parentElement !== document.body) {
      return isDarkSection(element.parentElement);
    }

    return false;
  }

  // Функция для проверки, находится ли меню над тёмной секцией
  function checkMenuOverSection() {
    // Для левого меню (EXPLORE)
    const leftNavRect = exploreText.getBoundingClientRect();
    const leftNavX = leftNavRect.left + leftNavRect.width / 2;
    const leftNavY = leftNavRect.top + leftNavRect.height / 2;

    // Для правого меню (ENROL)
    const rightNavRect = enrolText.getBoundingClientRect();
    const rightNavX = rightNavRect.left + rightNavRect.width / 2;
    const rightNavY = rightNavRect.top + rightNavRect.height / 2;

    // Получаем элементы, которые находятся под координатами меню
    const tempLeft = document.elementFromPoint(leftNavX, leftNavY);
    const tempRight = document.elementFromPoint(rightNavX, rightNavY);

    // Находим ближайшие секции для левого и правого меню
    const leftSection = tempLeft ? tempLeft.closest('section') : null;
    const rightSection = tempRight ? tempRight.closest('section') : null;

    // Проверяем, тёмные ли эти секции
    const isLeftDark = leftSection ? isDarkSection(leftSection) : false;
    const isRightDark = rightSection ? isDarkSection(rightSection) : false;

    return { isLeftDark, isRightDark };
  }

  // Функция для обновления цветов меню
  function updateMenuColors() {
    // Получаем информацию о секциях под меню
    const { isLeftDark, isRightDark } = checkMenuOverSection();

    // Обновляем цвета левого меню (EXPLORE)
    if (isLeftDark) {
      exploreText.style.color = '#FFFFFF';
      burgerLines.forEach(line => {
        line.style.backgroundColor = '#FFFFFF';
      });
    } else {
      exploreText.style.color = 'var(--heading-color)';
      burgerLines.forEach(line => {
        line.style.backgroundColor = 'var(--heading-color)';
      });
    }

    // Обновляем цвета правого меню (ENROL), только если на него не наведён курсор
    if (!isRightNavHovered) {
      if (isRightDark) {
        enrolText.style.color = '#FFFFFF';
        arrow.style.color = '#FFFFFF';
      } else {
        enrolText.style.color = 'var(--heading-color)';
        arrow.style.color = 'var(--heading-color)';
      }
    }
  }

  // Явно указываем, какие секции считать тёмными
  function markDarkSections() {
    // Находим секцию benefits
    const benefitsSection = document.querySelector('.benefits-section');
    if (benefitsSection) {
      benefitsSection.setAttribute('data-is-dark', 'true');
    }

    // Находим hero секцию
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.setAttribute('data-is-dark', 'true');
    }
  }

  // Вызываем маркировку тёмных секций
  markDarkSections();

  // Проверяем цвета при прокрутке страницы (с дебаунсом для производительности)
  let scrollTimeout;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateMenuColors, 100);
  });

  // Проверяем цвета при изменении размера окна
  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateMenuColors, 100);
  });

  // Начальная проверка
  setTimeout(updateMenuColors, 500);

  // Дополнительная проверка после полной загрузки страницы
  window.addEventListener('load', function () {
    updateMenuColors();
    // Повторная проверка через небольшой интервал для большей надежности
    setTimeout(updateMenuColors, 1000);
  });
});

/*--------------------------------------------------------------
# SCROLL EFFECT
--------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', function () {
  // DOM элементы
  const heroSection = document.querySelector('.hero-section');
  const words = document.querySelectorAll('.reveal-word');
  const wordLayers = document.querySelectorAll('.word-layer');
  const achieveWord = document.getElementById('achieve-word');

  // Переменные состояния
  let currentWordIndex = -1;
  let canScroll = true; // Default to true to ensure scrolling always works
  let isScrolling = false;

  // Сохранение начальных и конечных позиций слов
  const initialPositions = [];
  const finalPositions = [];

  // ВАЖНО: Определяем, загружается ли страница с прокруткой или нет
  const isPageScrolled = window.scrollY > 10;

  // Функция для применения золотого цвета к слову "achieve" с плавной анимацией
  function applyGoldColor() {
    if (achieveWord) {
      achieveWord.classList.add('filling');
      achieveWord.classList.add('filled');
      achieveWord.style.color = '#E2AE3C';
      achieveWord.style.webkitTextStroke = '0';
      achieveWord.style.backgroundSize = '100% 100%';
    }
  }

  // Инициализация: сохранение позиций и установка начальных стилей
  wordLayers.forEach((layer, index) => {
    const word = layer.querySelector('.reveal-word');

    // Сохранение конечных позиций слов
    const computedStyle = window.getComputedStyle(layer);
    finalPositions[index] = {
      top: computedStyle.getPropertyValue('--top-position') ||
        computedStyle.top ||
        (25 + index * 15) + '%',
      left: computedStyle.getPropertyValue('--left-position') ||
        computedStyle.left ||
        (10 + index * 15) + '%'
    };

    // Установка начальных позиций (за пределами экрана снизу)
    initialPositions[index] = {
      top: `calc(${finalPositions[index].top} + 100px)`,
      left: finalPositions[index].left
    };

    // Если страница прокручена, сразу показываем все слова
    if (isPageScrolled) {
      // Установка финальных позиций и стилей
      layer.style.top = finalPositions[index].top;
      layer.style.left = finalPositions[index].left;
      layer.style.opacity = '1';

      word.classList.add('filled');

      if (word.id === 'achieve-word') {
        word.style.color = '#E2AE3C';
        word.style.webkitTextStroke = '0';
        word.style.backgroundSize = '100% 100%';
      } else {
        word.style.color = 'white';
        word.style.webkitTextStroke = '0';
        word.style.backgroundSize = '100% 100%';
      }

      // Устанавливаем индекс на последнее слово
      currentWordIndex = words.length - 1;
    } else {
      // Страница не прокручена, применяем начальные скрытые стили
      layer.style.top = initialPositions[index].top;
      layer.style.left = initialPositions[index].left;
      layer.style.opacity = '0';

      word.style.color = 'transparent';
      word.classList.remove('filled');
      word.classList.remove('filling');

      if (word.id === 'achieve-word') {
        word.style.webkitTextStroke = '1px #E2AE3C';
      } else {
        word.style.webkitTextStroke = '1px white';
      }

      // Блокируем скролл только если страница не прокручена
      canScroll = false;
      document.body.style.overflow = 'hidden';
    }
  });

  // Обработчик событий колеса мыши для анимации скролла
  window.addEventListener('wheel', function (e) {
    // Если страница уже прокручена, разрешаем обычный скролл
    if (isPageScrolled || window.scrollY > 10) {
      return;
    }

    // Если прокрутка не разрешена и мы еще не обрабатываем событие скролла
    if (!canScroll) {
      e.preventDefault();
      handleScroll(e);
    } else if (canScroll && window.scrollY === 0 && e.deltaY < 0) {
      // Если мы в начале страницы и скроллим вверх
      e.preventDefault();
      canScroll = false;
      document.body.style.overflow = 'hidden';
      // Скрываем последнее слово
      if (currentWordIndex >= 0) {
        hideWord(currentWordIndex);
        currentWordIndex--;
      }
    }
  }, { passive: false });

  // Основная функция обработки скролла
  function handleScroll(e) {
    // Блокируем обработку параллельных событий скролла
    if (isScrolling) return;
    isScrolling = true;

    if (e.deltaY > 0) { // Скролл вниз
      if (currentWordIndex < words.length - 1) {
        // Показываем следующее слово
        currentWordIndex++;
        showWord(currentWordIndex);
      } else if (currentWordIndex === words.length - 1 && !canScroll) {
        // Все слова показаны, разрешаем стандартную прокрутку
        canScroll = true;
        document.body.style.overflow = 'auto';
      }
    } else { // Скролл вверх
      if (!canScroll && currentWordIndex >= 0) {
        // Скрываем текущее слово и переходим к предыдущему
        hideWord(currentWordIndex);
        currentWordIndex--;
      }
    }

    // Разрешаем следующее событие скролла через задержку
    setTimeout(() => {
      isScrolling = false;
    }, 500);
  }

  // Функция для показа слова
  function showWord(index) {
    if (index >= 0 && index < wordLayers.length) {
      const layer = wordLayers[index];
      const word = layer.querySelector('.reveal-word');

      // Анимация появления слова
      layer.style.opacity = '1';
      layer.style.top = finalPositions[index].top;
      layer.style.transition = 'top 0.7s ease, opacity 0.7s ease';

      // Плавное заполнение цветом с задержкой
      setTimeout(() => {
        word.classList.add('filling');

        setTimeout(() => {
          word.classList.add('filled');

          // Если это слово "achieve", применяем золотой цвет
          if (word.id === 'achieve-word') {
            applyGoldColor();
          }
        }, 200);
      }, 400);
    }

    // Если это последнее слово, разрешаем прокрутку страницы
    if (index === words.length - 1) {
      setTimeout(() => {
        canScroll = true;
        document.body.style.overflow = 'auto';
      }, 1000);
    }
  }

  // Функция для скрытия слова
  function hideWord(index) {
    if (index >= 0 && index < wordLayers.length) {
      const layer = wordLayers[index];
      const word = layer.querySelector('.reveal-word');

      // Удаляем классы анимации
      word.classList.remove('filling');
      word.classList.remove('filled');

      // Возвращаем к контурному состоянию
      if (word.id === 'achieve-word') {
        word.style.color = 'transparent';
        word.style.webkitTextStroke = '1px #E2AE3C';
        word.style.backgroundSize = '0% 100%';
      } else {
        word.style.color = 'transparent';
        word.style.webkitTextStroke = '1px white';
        word.style.backgroundSize = '0% 100%';
      }

      // Анимируем исчезновение
      setTimeout(() => {
        layer.style.opacity = '0';
        layer.style.top = initialPositions[index].top;
        layer.style.transition = 'top 0.7s ease, opacity 0.7s ease';
      }, 200);
    }
  }

  // Функция для показа всех слов сразу без блокировки прокрутки
  function showAllWords() {
    wordLayers.forEach((layer, index) => {
      const word = layer.querySelector('.reveal-word');

      // Показываем слово
      layer.style.opacity = '1';
      layer.style.top = finalPositions[index].top;
      layer.style.transition = 'top 0.7s ease, opacity 0.7s ease';

      // Применяем стиль с задержкой
      word.classList.add('filling');
      word.classList.add('filled');

      if (word.id === 'achieve-word') {
        word.style.color = '#E2AE3C';
        word.style.webkitTextStroke = '0';
        word.style.textShadow = '0 0 2px rgba(226, 174, 60, 0.3)';
        word.style.backgroundSize = '100% 100%';
      } else {
        word.style.color = 'white';
        word.style.webkitTextStroke = '0';
        word.style.backgroundSize = '100% 100%';
      }
    });

    // Устанавливаем состояние
    currentWordIndex = words.length - 1;
    canScroll = true;
    document.body.style.overflow = 'auto';
  }

  // Аварийная функция разблокировки скролла
  function unlockScrolling() {
    canScroll = true;
    document.body.style.overflow = 'auto';
    showAllWords();
  }

  // Добавляем обработчик кнопки Escape для разблокировки скролла в любой ситуации
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      unlockScrolling();
    }
  });

  // Добавляем наблюдатель за видимостью страницы для исправления скролла при возвращении на вкладку
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      // Если страница уже прокручена, разблокируем скролл
      if (window.scrollY > 10) {
        unlockScrolling();
      }
    }
  });

  // Сохраняем функции для отладки
  window.unlockScrolling = unlockScrolling;
  window.showAllWords = showAllWords;

  window.hideAllWords = function () {
    // Только если мы в начале страницы
    if (window.scrollY === 0) {
      wordLayers.forEach((layer, index) => {
        const word = layer.querySelector('.reveal-word');

        // Удаляем классы
        word.classList.remove('filling');
        word.classList.remove('filled');

        // Сбрасываем стили
        if (word.id === 'achieve-word') {
          word.style.color = 'transparent';
          word.style.webkitTextStroke = '1px #E2AE3C';
          word.style.backgroundSize = '0% 100%';
        } else {
          word.style.color = 'transparent';
          word.style.webkitTextStroke = '1px white';
          word.style.backgroundSize = '0% 100%';
        }

        // Анимируем исчезновение
        setTimeout(() => {
          layer.style.opacity = '0';
          layer.style.top = initialPositions[index].top;
          layer.style.transition = 'top 0.7s ease, opacity 0.7s ease';
        }, 200 + index * 100);
      });

      // Сбрасываем состояние
      currentWordIndex = -1;
      canScroll = false;
      document.body.style.overflow = 'hidden';
    }
  };

  // Функция для позиционирования слов
  window.moveWord = function (wordIndex, topPos, leftPos) {
    if (wordIndex >= 0 && wordIndex < wordLayers.length) {
      const layer = wordLayers[wordIndex];

      // Устанавливаем CSS-переменные
      layer.style.setProperty('--top-position', topPos);
      layer.style.setProperty('--left-position', leftPos);

      // Также применяем непосредственно к стилям для мгновенного эффекта
      layer.style.top = topPos;
      layer.style.left = leftPos;

      // Обновляем сохраненные позиции для анимации
      finalPositions[wordIndex] = { top: topPos, left: leftPos };
      initialPositions[wordIndex] = {
        top: `calc(${topPos} + 100px)`,
        left: leftPos
      };

      console.log(`Слово ${wordIndex + 1} перемещено: верх=${topPos}, лево=${leftPos}`);
    } else {
      console.error('Индекс слова вне диапазона. Доступные слова: 0-4');
    }
  };

  // Функция для отображения информации о словах в консоли
  window.wordInfo = function () {
    const wordInfo = [
      { index: 0, word: "Master" },
      { index: 1, word: "English" },
      { index: 2, word: "achieve" },
      { index: 3, word: "your" },
      { index: 4, word: "dreams" }
    ];
    console.table(wordInfo);
    console.log("Для перемещения слов используйте: moveWord(index, 'top%', 'left%')");
    console.log("Чтобы разблокировать скролл в любой момент, используйте: unlockScrolling()");
  };

  // Дополнительный таймер для проверки состояния скролла
  setTimeout(function () {
    // Если скролл всё ещё заблокирован, но страница прокручена - разблокируем
    if (!canScroll && window.scrollY > 10) {
      unlockScrolling();
    }
  }, 1500);

  // Вызовем функцию wordInfo() при загрузке для подсказки в консоли
  setTimeout(wordInfo, 1000);
});

/*--------------------------------------------------------------
# OUR PROGRAMS CLOSED VIEW
--------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', function () {
  // Get all program images
  const programImages = document.querySelectorAll('.programs-images .program-image');

  // Add hover effect
  programImages.forEach(function (image) {
    image.addEventListener('mouseenter', function () {
      gsap.to(this, {
        scale: 1.05, // Slight scale up on hover
        duration: 0.3,
        ease: "power1.out"
      });
    });

    image.addEventListener('mouseleave', function () {
      gsap.to(this, {
        scale: 1, // Return to original scale
        duration: 0.3,
        ease: "power1.out"
      });
    });
  });

  // Implement program switching functionality
  programImages.forEach(function (image) {
    image.addEventListener('click', function () {
      const program = this.getAttribute('data-program');

      // Update tabs and dots to reflect the selected program
      setActiveTab(program);

      // Also update the program details if needed
      updateProgramDetails(program);
    });
  });

  function updateProgramDetails(program) {
    // Get all program details
    const programDetails = document.querySelectorAll('.program-detail');

    // Hide all details first
    programDetails.forEach(function (detail) {
      detail.classList.remove('active');
    });

    // Show the selected program detail
    const selectedDetail = document.getElementById(program + '-detail');
    if (selectedDetail) {
      selectedDetail.classList.add('active');
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // Получаем все изображения в детальном виде
  const detailImages = document.querySelectorAll('.program-details-container .program-image');

  // Добавляем обработчики клика для каждого изображения
  detailImages.forEach(function (image) {
    image.addEventListener('click', function () {
      const program = this.getAttribute('data-program');

      // Обновляем активную вкладку
      setActiveTab(program);

      // Показываем соответствующие детали программы
      updateProgramDetails(program);
    });
  });

  // Функция для обновления деталей программы
  function updateProgramDetails(program) {
    // Скрываем все детали
    document.querySelectorAll('.program-detail').forEach(function (detail) {
      detail.classList.remove('active');
    });

    // Показываем детали выбранной программы
    const selectedDetail = document.getElementById(program + '-detail');
    if (selectedDetail) {
      selectedDetail.classList.add('active');
    }
  }
});
function updateProgramDetails(program) {
  // Скрываем все детали (удаляем класс 'active' у всех)
  document.querySelectorAll('.program-detail').forEach(function (detail) {
    detail.classList.remove('active');
  });

  // Показываем детали выбранной программы (добавляем класс 'active')
  const selectedDetail = document.getElementById(program + '-detail');
  if (selectedDetail) {
    selectedDetail.classList.add('active');
  }
}

/*--------------------------------------------------------------
# metrics
--------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', function () {
  const metrics = document.querySelectorAll('.metric-item');
  let hasAnimated = false;

  // Функция для анимации чисел
  function animateCounter(element, target, suffix = '') {
    const duration = 2000; // 2 секунды
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;

      if (step >= steps) {
        element.textContent = target.toLocaleString() + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString() + suffix;
      }
    }, duration / steps);
  }

  // Наблюдатель для запуска анимации при скролле
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;

        metrics.forEach((metric, index) => {
          const numberElement = metric.querySelector('.metric-number');
          const text = numberElement.textContent;

          // Определяем число и суффикс
          let target, suffix;

          if (text.includes('%')) {
            target = parseInt(text.replace('%', ''));
            suffix = '%';
          } else if (text.includes('+')) {
            target = parseInt(text.replace(/\D/g, ''));
            suffix = '+';
          } else {
            target = parseInt(text.replace(/\D/g, ''));
            suffix = '';
          }

          // Запускаем анимацию с задержкой
          setTimeout(() => {
            numberElement.textContent = '0' + suffix;
            animateCounter(numberElement, target, suffix);
          }, index * 200);

          // Анимация появления через GSAP
          if (typeof gsap !== 'undefined') {
            gsap.from(metric, {
              y: 30,
              opacity: 0,
              duration: 0.6,
              delay: index * 0.2,
              ease: "power2.out"
            });
          }
        });
      }
    });
  }, { threshold: 0.5 });

  // Наблюдаем за секцией метрик
  const metricsSection = document.querySelector('.success-metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
});


/*--------------------------------------------------------------
# FAQ
--------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', function () {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');

    header.addEventListener('click', () => {
      // Close all items
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active');
    });
  });
});

/*--------------------------------------------------------------
# ПРОКРУТКА ПРИ НАЖАТИИ НА МЕНЮ
--------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll для всех якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Игнорируем пустые ссылки
      if (href === '#' || href === '') return;

      e.preventDefault();

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Закрываем меню если оно открыто
        const leftNav = document.querySelector('.left-nav');
        if (leftNav) {
          leftNav.classList.remove('open'); // если у вас есть такой класс
        }

        // Плавная прокрутка
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

/*--------------------------------------------------------------
# Back to Top Button
--------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', function () {
  const backToTopButton = document.getElementById('backToTop');

  // Show/hide button based on scroll position
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });

  // Smooth scroll to top when button is clicked
  backToTopButton.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

/*--------------------------------------------------------------
# MOBILE MENU
--------------------------------------------------------------*/
// Бургер-меню
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

mobileMenuToggle.addEventListener('click', () => {
  mobileMenuToggle.classList.toggle('active');
  mobileMenuOverlay.classList.toggle('active');
  document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
});

// Закрытие меню при клике на ссылку
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-overlay a');
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuToggle.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
});