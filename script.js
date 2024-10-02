window.onload = function() {
    // Получаем параметры URL, чтобы загрузить initData
    const urlParams = new URLSearchParams(window.location.search);
    const initData = urlParams.get('initData');

    // Если initData присутствует, заполняем формы данными из последнего сообщения
    if (initData) {
        const configurations = JSON.parse(initData);
        configurations.forEach((config, index) => {
            const newConfig = document.getElementById('config-template').cloneNode(true);
            newConfig.style.display = 'block';
            newConfig.querySelector('.product-input').value = config.sku1;
            newConfig.querySelector('.min-price-input').value = config.min_price;
            newConfig.querySelector('.discount-input').value = config.value;
            newConfig.querySelector('.url1-input').value = config.url1;
            newConfig.querySelector('.url2-input').value = config.url2;
            newConfig.querySelector('.url3-input').value = config.url3;

            // Устанавливаем выбранное действие
            if (config.action) {
                const actionButton = newConfig.querySelector(`[data-action="${config.action}"]`);
                if (actionButton) {
                    actionButton.style.backgroundColor = 'red';
                }
            }

            document.getElementById('configurations-list').appendChild(newConfig);
        });
    }
};

// Функция для завершения режима редактирования при нажатии галочки
function finishEditMode(button) {
    const config = button.closest('.configuration');
    config.classList.remove('editing');

    // Прячем кнопки действия
    config.querySelector('.edit-button').style.display = 'block';
    button.style.display = 'none';
}

// Обработчик отправки всех конфигураций
document.getElementById('send-configurations').addEventListener('click', function() {
    // Запрашиваем подтверждение перед отправкой
    const confirmSend = confirm('Вы уверены, что хотите отправить все конфигурации?');
    if (!confirmSend) return;

    const configurations = Array.from(document.querySelectorAll('.configuration')).map(config => {
        const sku1 = config.querySelector('.product-input').value;
        const min_price = config.querySelector('.min-price-input').value.replace(',', '.');
        const value = config.querySelector('.discount-input').value;
        const url1 = config.querySelector('.url1-input').value;
        const url2 = config.querySelector('.url2-input').value;
        const url3 = config.querySelector('.url3-input').value;

        const selectedActions = Array.from(config.querySelectorAll('.action-button')).filter(button => button.style.backgroundColor === 'red');
        const politic = selectedActions.length > 0 ? selectedActions[0].getAttribute('data-action') : null;

        return {
            sku1: sku1,
            min_price: min_price,
            value: value,
            url1: url1,
            url2: url2,
            url3: url3,
            action: politic
        };
    });

    // Преобразуем конфигурации в JSON
    const formData = JSON.stringify(configurations);

    // Отправляем данные в бота через Telegram Web App
    if (window.Telegram.WebApp) {
        Telegram.WebApp.sendData(formData);  // Отправляем данные боту
        Telegram.WebApp.close();             // Закрываем веб-апп после отправки
    }
});

// Обработчик выбора кнопки действия (down, up, repeat)
document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', function() {
        // Убираем выделение с других кнопок
        const config = button.closest('.configuration');
        config.querySelectorAll('.action-button').forEach(btn => btn.style.backgroundColor = 'white');

        // Выделяем выбранную кнопку
        button.style.backgroundColor = 'red';
    });
});
