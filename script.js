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

    // Вывод результата
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <h3>Результаты анкеты:</h3>
        <p>Минимальная цена: ${minPrice}</p>
        <p>Опция изменения: ${changeOption === "increase" ? "Повышение" : "Понижение"}</p>
        <p>Тип изменения: ${changeType === "absolute" ? "Абсолютное" : "Относительное"}</p>
        <p>ID Артикула: ${skuId}</p>
        <p>Список ID артикулов: ${skuList.join(', ')}</p>
    `;
}
