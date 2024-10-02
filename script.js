let configurationCounter = 1;

document.getElementById('close-button').addEventListener('click', function() {
    document.querySelector('.main-container').style.display = 'none';
});

// Функция для загрузки данных из последнего сообщения
function loadLastConfiguration() {
    fetch(`https://api.telegram.org/bot<ТВОЙ_ТГ_ТОКЕН>/getUpdates`)
        .then(response => response.json())
        .then(data => {
            const messages = data.result;
            if (messages.length > 0) {
                const lastMessage = messages[messages.length - 1].message.text;
                const configurations = JSON.parse(lastMessage);

                configurations.forEach(config => {
                    const newConfig = document.getElementById('config-template').cloneNode(true);
                    newConfig.style.display = 'block';
                    newConfig.querySelector('.config-number').textContent = config.sku1; // Используем sku1 как заголовок
                    newConfig.setAttribute('data-configuration-id', configurationCounter++);

                    // Заполняем поля данными из конфигурации
                    newConfig.querySelector('.product-input').value = config.sku1;
                    newConfig.querySelector('.min-price-input').value = config.min_price;
                    newConfig.querySelector('.discount-input').value = config.value;
                    newConfig.querySelector('.url1-input').value = config.url1;
                    newConfig.querySelector('.url2-input').value = config.url2;
                    newConfig.querySelector('.url3-input').value = config.url3;

                    document.getElementById('configurations-list').appendChild(newConfig);
                });
            }
        })
        .catch(error => console.error('Ошибка загрузки конфигураций:', error));
}

document.getElementById('add-configuration').addEventListener('click', function() {
    const configName = prompt('Введите артикул товара:');
    if (!configName) {
        alert('Имя конфигурации не может быть пустым.');
        return;
    }

    const newConfig = document.getElementById('config-template').cloneNode(true);
    newConfig.style.display = 'block';
    newConfig.querySelector('.config-number').textContent = configName;
    newConfig.setAttribute('data-configuration-id', configurationCounter++);

    // Добавляем обработчик для заголовка конфигурации
    const configTitle = newConfig.querySelector('.config-title');
    configTitle.addEventListener('click', function() {
        const configDetails = newConfig.querySelector('.config-details');
        configDetails.style.display = configDetails.style.display === 'block' ? 'none' : 'block';
    });

    // Показываем поля ввода
    const inputs = newConfig.querySelectorAll('.input-row input');
    inputs.forEach(input => {
        input.style.display = 'block'; // Убедитесь, что поля ввода отображаются
        input.addEventListener('focus', function() {
            this.setAttribute('placeholder', ''); // Убираем текст заполнителя при фокусе
        });
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.setAttribute('placeholder', 'Введите значение'); // Возвращаем текст заполнителя, если поле пустое
            }
        });
    });

    // Устанавливаем фокус на первое поле ввода для удобства
    inputs[0].focus();

    document.getElementById('configurations-list').appendChild(newConfig);
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('save-button')) {
        const config = e.target.closest('.configuration');
        const inputs = config.querySelectorAll('.input-row input');

        // Скрываем поля ввода и показываем значения
        inputs.forEach(input => {
            input.style.display = 'none'; // Скрыть поле ввода
            const readonlyInput = document.createElement('span'); // Изменяем на span для отображения
            readonlyInput.textContent = input.value; // Текстовое содержимое
            readonlyInput.className = 'readonly';
            input.parentElement.appendChild(readonlyInput);
        });

        // Скрываем кнопки сохранить и удалить
        e.target.style.display = 'none';
        config.querySelector('.delete-button').style.display = 'none';

        // Показать кнопку "Редактировать"
        const editButton = document.createElement('button');
        editButton.textContent = 'Редактировать';
        editButton.className = 'edit-button';
        config.querySelector('.buttons').appendChild(editButton);

        // Отключаем кнопки действия
        const actionButtons = config.querySelectorAll('.action-button');
        actionButtons.forEach(button => {
            button.disabled = true; // Делаем кнопки недоступными
        });

        // Обработчик для кнопки "Редактировать"
        editButton.addEventListener('click', function() {
            // Удаляем не редактируемые поля
            const readonlyInputs = config.querySelectorAll('.readonly');
            readonlyInputs.forEach(readonlyInput => {
                readonlyInput.remove(); // Удаляем текстовое поле
            });
            inputs.forEach(input => {
                input.style.display = 'block'; // Показываем поля ввода
            });
            e.target.style.display = 'inline-block'; // Показываем кнопку сохранить
            config.querySelector('.delete-button').style.display = 'inline-block'; // Показываем кнопку удалить
            editButton.remove(); // Удаляем кнопку редактирования
            actionButtons.forEach(button => {
                button.disabled = false; // Включаем кнопки действия снова
            });
        });
    }

    if (e.target.classList.contains('delete-button')) {
        const config = e.target.closest('.configuration');
        config.remove();
    }

    if (e.target.classList.contains('action-button')) {
        const buttons = e.target.parentElement.querySelectorAll('.action-button');
        buttons.forEach(button => {
            button.style.backgroundColor = 'white'; // Сброс цвета всех кнопок
        });
        e.target.style.backgroundColor = 'red'; // Подсветка выбранной кнопки
    }
});

document.getElementById('send-configuration').addEventListener('click', function() {
    const confirmation = confirm("Вы уверены, что хотите отправить все конфигурации?");
    if (!confirmation) return; // Если пользователь отменил, ничего не делать

    const configurations = document.querySelectorAll('.configuration');
    const allConfigurationsData = [];

    configurations.forEach(config => {
        const configurationId = config.getAttribute('data-configuration-id');
        const sku1 = config.querySelector('.product-input').value;
        const min_price = config.querySelector('.min-price-input').value.replace(',', '.');
        const value = config.querySelector('.discount-input').value;

        // Изменяем эту часть для правильного получения data-action
        const actionButton = Array.from(config.querySelectorAll('.action-button'))
            .find(button => button.style.backgroundColor === 'red'); // Найти выделенную кнопку

        const dataAction = actionButton ? actionButton.getAttribute('data-action') : '';

        const configurationData = {
            configuration_id: configurationId,
            sku1,
            min_price,
            data_action: dataAction, // Добавляем data-action
            value,
            url1: config.querySelector('.url1-input').value,
            url2: config.querySelector('.url2-input').value,
            url3: config.querySelector('.url3-input').value
        };

        allConfigurationsData.push(configurationData);
    });

    if (allConfigurationsData.length > 0) {
        // Отправка данных в Telegram бота
        fetch(`https://api.telegram.org/bot<ТВОЙ_ТГ_ТОКЕН>/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: '<ТВОЙ_CHAT_ID>',
                text: JSON.stringify(allConfigurationsData, null, 2) // отправка данных как JSON-строку
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Успешная отправка:', data);
        })
        .catch(error => {
            console.error('Ошибка отправки:', error);
        });
    } else {
        alert('Добавьте хотя бы одну конфигурацию перед отправкой!');
    }
});

// Загрузка конфигураций из последнего сообщения
loadLastConfiguration();
