function submitForm() {
    const minPrice = document.getElementById("min-price").value;
    const changeOption = document.getElementById("change-option").value;
    const changeType = document.getElementById("change-type").value;
    const skuId = document.getElementById("sku-id").value;
    const skuList = document.getElementById("sku-list").value.split(',').map(id => id.trim());

    // Валидация данных
    if (!minPrice || !skuId || !skuList.length) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    // Данные анкеты в JSON формате
    const formData = {
        min_price: minPrice,
        change_option: changeOption,
        change_type: changeType,
        sku_id: skuId,
        sku_list: skuList
    };

    // Передача данных через Telegram WebApp
    if (window.Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify(formData)); // Отправляем данные в виде JSON
        Telegram.WebApp.close(); // Закрываем WebApp после отправки
    } else {
        alert("Telegram WebApp не инициализирован!");
    }

    // Вывод результата в браузере (необязательно)
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <h3>Результаты анкеты:</h3>
        <pre>${JSON.stringify(formData, null, 2)}</pre>
    `;
}
