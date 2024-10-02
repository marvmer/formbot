document.addEventListener('DOMContentLoaded', () => {
    const addConfigButton = document.getElementById('add-configuration');
    const sendConfigButton = document.getElementById('send-configuration');
    const configList = document.getElementById('configurations-list');
    const configTemplate = document.getElementById('config-template');
    let configCounter = 1;

    // Функция для добавления новой конфигурации
    addConfigButton.addEventListener('click', () => {
        const newConfig = configTemplate.cloneNode(true);
        newConfig.style.display = 'block';
        newConfig.id = '';
        newConfig.querySelector('.config-number').textContent = `Конфигурация №${configCounter}`;
        configCounter++;

        // Обработчик удаления конфигурации
        newConfig.querySelector('.delete-button').addEventListener('click', () => {
            configList.removeChild(newConfig);
        });

        configList.appendChild(newConfig);
    });

    // Функция для отправки данных конфигурации
    sendConfigButton.addEventListener('click', () => {
        const configurations = document.querySelectorAll('.configuration:not(#config-template)');
        let configData = [];

        configurations.forEach((config, index) => {
            const product = config.querySelector('.product-input').value;
            const url1 = config.querySelector('.url1-input').value;
            const url2 = config.querySelector('.url2-input').value;
            const url3 = config.querySelector('.url3-input').value;
            const minPrice = config.querySelector('.min-price-input').value;
            const discount = config.querySelector('.discount-input').value;
            const action = config.querySelector('.action-button.active')?.dataset.action || null;

            configData.push({
                sku1: product,
                url1: url1,
                url2: url2,
                url3: url3,
                min_price: parseFloat(minPrice),
                value: parseFloat(discount),
                action: action
            });
        });

        if (configData.length > 0) {
            // Отправка данных в Telegram бота
            fetch(`https://api.telegram.org/bot<ТВОЙ_ТГ_ТОКЕН>/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: '<ТВОЙ_CHAT_ID>',
                    text: JSON.stringify(configData, null, 2) // отправка данных как JSON-строку
                })
            }).then(response => response.json())
            .then(data => {
                console.log('Успешная отправка:', data);
            }).catch(error => {
                console.error('Ошибка отправки:', error);
            });
        } else {
            alert('Добавьте хотя бы одну конфигурацию перед отправкой!');
        }
    });

    // Функция для выбора действия (Понижать, Повышать, Повторять)
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('action-button')) {
            const buttons = event.target.parentNode.querySelectorAll('.action-button');
            buttons.forEach(button => button.classList.remove('active'));
            event.target.classList.add('active');
        }
    });
});
